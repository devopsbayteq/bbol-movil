import {
  REGISTER_ALIAS_MAX_LENGTH,
  sanitizeRegisterAliasInput,
  validateRegisterAliasInput,
} from '../../../src/domain/validation/registerAlias';

describe('registerAlias validation', () => {
  test('validateRegisterAliasInput rechaza vacío', () => {
    expect(validateRegisterAliasInput('')).toBe('Ingresa un alias.');
    expect(validateRegisterAliasInput('   ')).toBe('Ingresa un alias.');
  });

  test('validateRegisterAliasInput acepta un carácter alfanumérico', () => {
    expect(validateRegisterAliasInput('a')).toBeNull();
    expect(validateRegisterAliasInput('7')).toBeNull();
  });

  test('validateRegisterAliasInput rechaza caracteres no alfanuméricos', () => {
    expect(validateRegisterAliasInput('a-b')).toBe(
      'El alias solo puede contener letras y números.',
    );
    expect(validateRegisterAliasInput('a b')).toBe(
      'El alias solo puede contener letras y números.',
    );
  });

  test('validateRegisterAliasInput rechaza más de 16 caracteres', () => {
    const long = 'a'.repeat(REGISTER_ALIAS_MAX_LENGTH + 1);
    expect(validateRegisterAliasInput(long)).toBe(
      `El alias no puede superar ${REGISTER_ALIAS_MAX_LENGTH} caracteres.`,
    );
  });

  test('sanitizeRegisterAliasInput elimina no alfanuméricos y limita longitud', () => {
    expect(sanitizeRegisterAliasInput('ab-cd_12')).toBe('abcd12');
    expect(sanitizeRegisterAliasInput('a'.repeat(30))).toHaveLength(
      REGISTER_ALIAS_MAX_LENGTH,
    );
  });
});
