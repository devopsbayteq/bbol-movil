import {
  hasDisallowedLoginPasswordCharacters,
  hasDisallowedLoginUsernameCharacters,
  LOGIN_USERNAME_MAX_LENGTH,
  loginValidationMessages,
  sanitizeLoginPasswordInput,
  sanitizeLoginUsernameInput,
  validateLoginPassword,
  validateLoginUsername,
} from '../../../src/domain/validation';

describe('loginCredentials validation', () => {
  test('sanitizes unsafe characters from login username input', () => {
    const raw = ' test\u200Busuario\u0000id ';

    expect(sanitizeLoginUsernameInput(raw)).toBe(' testusuarioid ');
    expect(hasDisallowedLoginUsernameCharacters(raw)).toBe(true);
  });

  test('accepts plain text username without email format', () => {
    expect(validateLoginUsername('usuario123')).toBeNull();
    expect(validateLoginUsername('mi-usuario_sin_correo')).toBeNull();
  });

  test('rejects usernames longer than the allowed maximum', () => {
    const longUsername = 'a'.repeat(LOGIN_USERNAME_MAX_LENGTH + 1);

    expect(validateLoginUsername(longUsername)).toBe(
      loginValidationMessages.usernameTooLong,
    );
  });

  test('sanitizes unsafe characters from password input without removing spaces', () => {
    const rawPassword = 'clave \u200Bsegura\u0000';

    expect(sanitizeLoginPasswordInput(rawPassword)).toBe('clave segura');
    expect(hasDisallowedLoginPasswordCharacters(rawPassword)).toBe(true);
  });

  test('requires the minimum password length', () => {
    expect(validateLoginPassword('12345')).toBe(
      loginValidationMessages.passwordTooShort,
    );
  });

  test('rejects passwords longer than the allowed maximum', () => {
    const longPassword = 'a'.repeat(129);

    expect(validateLoginPassword(longPassword)).toBe(
      loginValidationMessages.passwordTooLong,
    );
  });
});
