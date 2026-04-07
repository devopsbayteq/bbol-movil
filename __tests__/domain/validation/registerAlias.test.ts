import {
  LOGIN_USERNAME_MAX_LENGTH,
  LOGIN_USERNAME_MIN_LENGTH,
} from '../../../src/domain/validation/loginCredentials';
import {
  REGISTER_ALIAS_MAX_LENGTH,
  sanitizeRegisterAliasInput,
  validateRegisterAliasInput,
} from '../../../src/domain/validation/registerAlias';

describe('registerAlias validation', () => {
  test('validateRegisterAliasInput rechaza vacío', () => {
    expect(validateRegisterAliasInput('')).toBe('El alias es requerido');
    expect(validateRegisterAliasInput('   ')).toBe('El alias es requerido');
  });

  test('validateRegisterAliasInput rechaza menos de 12 caracteres', () => {
    expect(validateRegisterAliasInput('short')).toBe(
      `El alias debe tener al menos ${LOGIN_USERNAME_MIN_LENGTH} caracteres`,
    );
    const almost = 'a'.repeat(LOGIN_USERNAME_MIN_LENGTH - 1);
    expect(validateRegisterAliasInput(almost)).toBe(
      `El alias debe tener al menos ${LOGIN_USERNAME_MIN_LENGTH} caracteres`,
    );
  });

  test('validateRegisterAliasInput acepta 12–16 caracteres válidos', () => {
    const ok = 'a'.repeat(LOGIN_USERNAME_MIN_LENGTH);
    expect(validateRegisterAliasInput(ok)).toBeNull();
    expect(validateRegisterAliasInput('usuario-demo12')).toBeNull();
    expect(validateRegisterAliasInput('user.name_ok-1')).toBeNull();
  });

  test('validateRegisterAliasInput rechaza caracteres fuera del charset de usuario', () => {
    expect(validateRegisterAliasInput('user@domain.com1')).toBe(
      'El alias solo puede contener letras, números, punto (.), guion (-) y guion bajo (_).',
    );
    expect(validateRegisterAliasInput('user name123456')).toBe(
      'El alias solo puede contener letras, números, punto (.), guion (-) y guion bajo (_).',
    );
  });

  test('validateRegisterAliasInput rechaza más de 16 caracteres', () => {
    const long = 'a'.repeat(LOGIN_USERNAME_MAX_LENGTH + 1);
    expect(validateRegisterAliasInput(long)).toBe(
      `El alias no puede superar ${LOGIN_USERNAME_MAX_LENGTH} caracteres`,
    );
  });

  test('sanitizeRegisterAliasInput aplica saneo de login y limita longitud', () => {
    expect(sanitizeRegisterAliasInput('ab\tcd_12')).toBe('abcd_12');
    expect(sanitizeRegisterAliasInput('a'.repeat(30))).toHaveLength(
      REGISTER_ALIAS_MAX_LENGTH,
    );
  });
});
