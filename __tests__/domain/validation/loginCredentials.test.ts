import {
  hasDisallowedLoginEmailCharacters,
  hasDisallowedLoginPasswordCharacters,
  loginValidationMessages,
  sanitizeLoginEmailInput,
  sanitizeLoginPasswordInput,
  validateLoginEmail,
  validateLoginPassword,
} from '../../../src/domain/validation';

describe('loginCredentials validation', () => {
  test('sanitizes unsafe characters from login email input', () => {
    const rawEmail = ' test\u200B@gmai\u0000l.com ';

    expect(sanitizeLoginEmailInput(rawEmail)).toBe('test@gmail.com');
    expect(hasDisallowedLoginEmailCharacters(rawEmail)).toBe(true);
  });

  test('requires a valid login email format', () => {
    expect(validateLoginEmail('correo-invalido')).toBe(
      loginValidationMessages.emailInvalidFormat,
    );
  });

  test('rejects login emails longer than the allowed maximum', () => {
    const localPart = 'a'.repeat(246);
    const longEmail = `${localPart}@mail.com`;

    expect(validateLoginEmail(longEmail)).toBe(
      loginValidationMessages.emailTooLong,
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
