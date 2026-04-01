import {
  composeSanitizers,
  composeValidators,
  containsCharacters,
  containsMatchingCharacters,
  filterCharacters,
  removeCharacters,
  rejectCharacters,
  rejectMatchingCharacters,
  requireMaxLength,
  requireMinLength,
  requirePattern,
  requireTrimmedValue,
} from './rules';

export const INVISIBLE_CHAR_PATTERN = /[\u200B-\u200D\u2060\uFEFF]/g;
export const WHITESPACE_PATTERN = /\s/g;
export const LOGIN_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LOGIN_EMAIL_MAX_LENGTH = 254;
export const LOGIN_PASSWORD_MIN_LENGTH = 6;
export const LOGIN_PASSWORD_MAX_LENGTH = 128;

export const loginValidationMessages = {
  emailRequired: 'El email es requerido',
  emailInvalidCharacters: 'El email contiene caracteres no permitidos',
  emailInvalidFormat: 'El formato del email no es válido',
  emailTooLong: `El email no puede superar ${LOGIN_EMAIL_MAX_LENGTH} caracteres`,
  passwordRequired: 'La contraseña es requerida',
  passwordInvalidCharacters:
    'La contraseña contiene caracteres no permitidos',
  passwordTooShort: `La contraseña debe tener al menos ${LOGIN_PASSWORD_MIN_LENGTH} caracteres`,
  passwordTooLong: `La contraseña no puede superar ${LOGIN_PASSWORD_MAX_LENGTH} caracteres`,
} as const;

function isControlCharacter(character: string): boolean {
  const code = character.charCodeAt(0);

  return (code >= 0 && code <= 31) || (code >= 127 && code <= 159);
}

const removeUnsafeCharacters = composeSanitizers(
  filterCharacters(isControlCharacter),
  removeCharacters(INVISIBLE_CHAR_PATTERN),
);

export const sanitizeLoginEmailInput = composeSanitizers(
  removeUnsafeCharacters,
  removeCharacters(WHITESPACE_PATTERN),
);

export const sanitizeLoginPasswordInput = removeUnsafeCharacters;

export const validateLoginEmail = composeValidators(
  requireTrimmedValue(loginValidationMessages.emailRequired),
  rejectMatchingCharacters(
    isControlCharacter,
    loginValidationMessages.emailInvalidCharacters,
  ),
  rejectCharacters(
    INVISIBLE_CHAR_PATTERN,
    loginValidationMessages.emailInvalidCharacters,
  ),
  rejectCharacters(
    WHITESPACE_PATTERN,
    loginValidationMessages.emailInvalidCharacters,
  ),
  requireMaxLength(
    LOGIN_EMAIL_MAX_LENGTH,
    loginValidationMessages.emailTooLong,
  ),
  requirePattern(LOGIN_EMAIL_PATTERN, loginValidationMessages.emailInvalidFormat),
);

export const validateLoginPassword = composeValidators(
  requireTrimmedValue(loginValidationMessages.passwordRequired),
  rejectMatchingCharacters(
    isControlCharacter,
    loginValidationMessages.passwordInvalidCharacters,
  ),
  rejectCharacters(
    INVISIBLE_CHAR_PATTERN,
    loginValidationMessages.passwordInvalidCharacters,
  ),
  requireMaxLength(
    LOGIN_PASSWORD_MAX_LENGTH,
    loginValidationMessages.passwordTooLong,
  ),
  requireMinLength(
    LOGIN_PASSWORD_MIN_LENGTH,
    loginValidationMessages.passwordTooShort,
  ),
);

export function hasDisallowedLoginEmailCharacters(value: string): boolean {
  return (
    containsMatchingCharacters(isControlCharacter, value) ||
    containsCharacters(INVISIBLE_CHAR_PATTERN, value) ||
    containsCharacters(WHITESPACE_PATTERN, value)
  );
}

export function hasDisallowedLoginPasswordCharacters(value: string): boolean {
  return (
    containsMatchingCharacters(isControlCharacter, value) ||
    containsCharacters(INVISIBLE_CHAR_PATTERN, value)
  );
}
