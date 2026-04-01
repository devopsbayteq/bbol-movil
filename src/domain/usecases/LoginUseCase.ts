import {User} from '../entities/User';
import {AuthRepository} from '../repositories/AuthRepository';
import {validateLoginEmail, validateLoginPassword} from '../validation';

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

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

    return this.authRepository.login(trimmedEmail, trimmedPassword);
  }
}
