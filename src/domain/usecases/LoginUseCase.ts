import {rsaOaepEncryptUtf8MaterialPemBase64ToDoubleBase64} from '../../security/certificate/rsaUtils';
import {User} from '../entities/User';
import {AuthRepository} from '../repositories/AuthRepository';
import {SecureStorageService} from '../services/SecureStorageService';
import {GetPublicKeyUseCase} from './GetPublicKeyUseCase';

export class LoginUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly secureStorageService: SecureStorageService,
    private readonly storageKey: string,
    private readonly getPublicKeyUseCase: GetPublicKeyUseCase,
    /** Misma clave que usa el interceptor HTTP para `Authorization` (debe persistirse antes de llamadas posteriores al login, p. ej. biometric-registration). */
    private readonly authTokenStorageKey: string,
  ) {}

  async execute(email: string, password: string): Promise<User> {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      throw new Error('El email es requerido');
    }

    if (!trimmedPassword) {
      throw new Error('La contraseña es requerida');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
     // throw new Error('El formato del email no es válido');
    }

    if (trimmedPassword.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    const {value: serverPublicKeyPemBase64} =
      await this.getPublicKeyUseCase.execute();
    const encryptedUsername = rsaOaepEncryptUtf8MaterialPemBase64ToDoubleBase64(
      serverPublicKeyPemBase64,
      trimmedEmail,
    );
    const encryptedPassword = rsaOaepEncryptUtf8MaterialPemBase64ToDoubleBase64(
      serverPublicKeyPemBase64,
      trimmedPassword,
    );

    const userLoginData = await this.authRepository.login(
      trimmedEmail,
      encryptedUsername,
      encryptedPassword,
    );

    await this.secureStorageService.save(
      this.storageKey,
      JSON.stringify(userLoginData),
    );
    await this.secureStorageService.save(
      this.authTokenStorageKey,
      userLoginData.token,
    );

    return userLoginData;
  }
}
