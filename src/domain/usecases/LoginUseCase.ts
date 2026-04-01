import {User} from '../entities/User';
import {AuthRepository} from '../repositories/AuthRepository';
import {validateLoginEmail, validateLoginPassword} from '../validation';
import { SecureStorageService } from '../services/SecureStorageService';

export class LoginUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly secureStorageService: SecureStorageService,
    private readonly storageKey: string,
  ) {}

  async execute(email: string, password: string): Promise<User> {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const emailError = validateLoginEmail(trimmedEmail);
    const passwordError = validateLoginPassword(trimmedPassword);

    if (emailError) {
      throw new Error(emailError);
    }

    if (passwordError) {
      throw new Error(passwordError);
    }
    const userLoginData = await this.authRepository.login(trimmedEmail, trimmedPassword);
    
    await this.secureStorageService.save(this.storageKey, JSON.stringify(userLoginData));

    return userLoginData;
  }
}
