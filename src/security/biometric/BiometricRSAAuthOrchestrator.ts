import axios from 'axios';
import {GetPublicKeyUseCase} from '../../domain/usecases/GetPublicKeyUseCase';
import {SecureStorageService} from '../../domain/services/SecureStorageService';
import {SecureStorageKeys} from '../../data/datasources/storage/SecureStorageKeys';
import {BiometricRemoteDataSource} from '../../data/datasources/biometric/BiometricRemoteDataSource';
import {CryptoService} from './CryptoService';
import {BiometricKeyStorageService} from './BiometricKeyStorageService';
import {encryptUserIdentifierForBiometricApi} from './userEncryptHelper';
import {BiometricRSAError} from './errors';

export interface BiometricLoginResult {
  accessToken: string;
  email: string;
}

export class BiometricRSAAuthOrchestrator {
  constructor(
    private readonly biometricRemote: BiometricRemoteDataSource,
    private readonly cryptoService: CryptoService,
    private readonly keyStorage: BiometricKeyStorageService,
    private readonly secureStorage: SecureStorageService,
    private readonly getPublicKeyUseCase: GetPublicKeyUseCase,
    private readonly serverPublicKeyStorageKey: string,
  ) {}

  private async resolveServerPublicKeyPemBase64(): Promise<string> {
    const stored = await this.secureStorage.get(this.serverPublicKeyStorageKey);
    if (stored?.trim()) {
      return stored.trim();
    }
    const pk = await this.getPublicKeyUseCase.execute();
    return pk.value.trim();
  }

  private mapUnknownError(e: unknown): BiometricRSAError {
    if (e instanceof BiometricRSAError) {
      return e;
    }
    if (axios.isAxiosError(e)) {
      return new BiometricRSAError(
        e.response?.data?.message != null
          ? String(e.response.data.message)
          : 'Error de red',
        'network_error',
        e,
      );
    }
    if (e instanceof Error) {
      return new BiometricRSAError(e.message, 'unknown', e);
    }
    return new BiometricRSAError('Error inesperado', 'unknown', e);
  }

  /**
   * Tras login con contraseña exitoso: obtiene challenge, genera RSA, registra en servidor y guarda clave privada con biometría.
   */
  async registerBiometricForUser(email: string): Promise<void> {
    const trimmed = email.trim();
    if (!trimmed) {
      throw new BiometricRSAError('El usuario es requerido', 'unknown');
    }

    try {
      const serverPem = await this.resolveServerPublicKeyPemBase64();
      const userEncryptBase64 = encryptUserIdentifierForBiometricApi(
        serverPem,
        trimmed,
      );

      const {challenge} = await this.biometricRemote.postBiometricChallenge({
        userEncryptBase64,
      });

      const keys = await this.cryptoService.generateKeyPair();
      const challengeSignBase64 = await this.cryptoService.signChallenge(
        challenge,
        keys.privateKeyPem,
      );
      const mobilePublicKeyBase64 = this.cryptoService.getPublicKeyBase64FromPem(
        keys.publicKeyPem,
      );

      await this.biometricRemote.postBiometricRegistration({
        challenge,
        challengeSignBase64,
        mobilePublicKeyBase64,
      });

      await this.keyStorage.savePrivateKey(keys.privateKeyPem);
      await this.secureStorage.save(
        SecureStorageKeys.BIOMETRIC_USERNAME,
        trimmed,
      );
      this.cryptoService.clearMemoryKeys();
    } catch (e) {
      this.cryptoService.clearMemoryKeys();
      throw this.mapUnknownError(e);
    }
  }

  /**
   * Login solo con biometría: challenge, firma, token de sesión.
   */
  async loginWithBiometric(): Promise<BiometricLoginResult> {
    try {
      const emailStored = await this.secureStorage.get(
        SecureStorageKeys.BIOMETRIC_USERNAME,
      );
      if (!emailStored?.trim()) {
        throw new BiometricRSAError(
          'No hay usuario para acceso biométrico. Inicia sesión con contraseña y activa biometría.',
          'no_stored_username',
        );
      }

      const hasKey = await this.keyStorage.hasPrivateKey();
      if (!hasKey) {
        throw new BiometricRSAError(
          'No hay clave biométrica en este dispositivo. Activa biometría tras iniciar sesión.',
          'no_private_key',
        );
      }

      const serverPem = await this.resolveServerPublicKeyPemBase64();
      const usernameEncryptBase64 = encryptUserIdentifierForBiometricApi(
        serverPem,
        emailStored,
      );

      const {challenge} = await this.biometricRemote.postBiometricChallenge({
        userEncryptBase64: usernameEncryptBase64,
      });

      const privateKeyPem = await this.keyStorage.getPrivateKey();
      const challengeSignBase64 = await this.cryptoService.signChallenge(
        challenge,
        privateKeyPem,
      );

      const content = await this.biometricRemote.postBiometricLogin({
        usernameEncryptBase64,
        challenge,
        challengeSignBase64,
      });

      await this.secureStorage.save(
        SecureStorageKeys.USER_LOGIN_DATA,
        JSON.stringify({accessToken: content.accessToken}),
      );

      return {
        accessToken: content.accessToken,
        email: emailStored.trim(),
      };
    } catch (e) {
      throw this.mapUnknownError(e);
    }
  }

  async hasBiometricRegistration(): Promise<boolean> {
    const user = await this.secureStorage.get(
      SecureStorageKeys.BIOMETRIC_USERNAME,
    );
    if (!user?.trim()) {
      return false;
    }
    return this.keyStorage.hasPrivateKey();
  }
}
