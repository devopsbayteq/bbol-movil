import {
  hasDisallowedLoginPasswordCharacters,
  hasDisallowedLoginUsernameCharacters,
  LOGIN_USERNAME_MIN_LENGTH,
  LOGIN_USERNAME_MAX_LENGTH,
  LOGIN_PASSWORD_MIN_LENGTH,
  LOGIN_PASSWORD_MAX_LENGTH,
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

  test('accepts plain text username within valid length range', () => {
    expect(validateLoginUsername('usuario1')).toBeNull();
    expect(validateLoginUsername('usuario123')).toBeNull();
  });

  test('rejects usernames shorter than the minimum length', () => {
    const shortUsername = 'a'.repeat(LOGIN_USERNAME_MIN_LENGTH - 1);

    expect(validateLoginUsername(shortUsername)).toBe(
      loginValidationMessages.usernameTooShort,
    );
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
    const shortPassword = 'a'.repeat(LOGIN_PASSWORD_MIN_LENGTH - 1);

    expect(validateLoginPassword(shortPassword)).toBe(
      loginValidationMessages.passwordTooShort,
    );
  });

  test('rejects passwords longer than the allowed maximum', () => {
    const longPassword = 'a'.repeat(LOGIN_PASSWORD_MAX_LENGTH + 1);

    expect(validateLoginPassword(longPassword)).toBe(
      loginValidationMessages.passwordTooLong,
    );
  });

  test('accepts a password within the valid length range', () => {
    expect(validateLoginPassword('12345678')).toBeNull();
    expect(validateLoginPassword('a'.repeat(LOGIN_PASSWORD_MAX_LENGTH))).toBeNull();
  });
});
