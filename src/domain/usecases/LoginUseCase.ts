import {User} from '../entities/User';
import {AuthRepository} from '../repositories/AuthRepository';

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

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
      throw new Error('El formato del email no es válido');
    }

    if (trimmedPassword.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    return this.authRepository.login(trimmedEmail, trimmedPassword);
  }
}
