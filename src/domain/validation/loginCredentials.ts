import {
  composeValidators,
  containsCharacters,
  containsMatchingCharacters,
  rejectCharacters,
  rejectMatchingCharacters,
  requireMaxLength,
  requireMinLength,
  requireTrimmedValue,
} from './rules';
import {
  INVISIBLE_CHAR_PATTERN,
  isControlCharacter,
  sanitizeUnsafeTextInput,
} from './textSafety';

export const LOGIN_USERNAME_MAX_LENGTH = 128;
export const LOGIN_PASSWORD_MIN_LENGTH = 6;
export const LOGIN_PASSWORD_MAX_LENGTH = 128;

export const loginValidationMessages = {
  usernameRequired: 'El usuario es requerido',
  usernameInvalidCharacters: 'El usuario contiene caracteres no permitidos',
  usernameTooLong: `El usuario no puede superar ${LOGIN_USERNAME_MAX_LENGTH} caracteres`,
  passwordRequired: 'La contraseña es requerida',
  passwordInvalidCharacters:
    'La contraseña contiene caracteres no permitidos',
  passwordTooShort: `La contraseña debe tener al menos ${LOGIN_PASSWORD_MIN_LENGTH} caracteres`,
  passwordTooLong: `La contraseña no puede superar ${LOGIN_PASSWORD_MAX_LENGTH} caracteres`,
} as const;

export const sanitizeLoginUsernameInput = sanitizeUnsafeTextInput;

export const sanitizeLoginPasswordInput = sanitizeUnsafeTextInput;

export const validateLoginUsername = composeValidators(
  requireTrimmedValue(loginValidationMessages.usernameRequired),
  rejectMatchingCharacters(
    isControlCharacter,
    loginValidationMessages.usernameInvalidCharacters,
  ),
  rejectCharacters(
    INVISIBLE_CHAR_PATTERN,
    loginValidationMessages.usernameInvalidCharacters,
  ),
  requireMaxLength(
    LOGIN_USERNAME_MAX_LENGTH,
    loginValidationMessages.usernameTooLong,
  ),
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

export function hasDisallowedLoginUsernameCharacters(value: string): boolean {
  return (
    containsMatchingCharacters(isControlCharacter, value) ||
    containsCharacters(INVISIBLE_CHAR_PATTERN, value)
  );
}

export function hasDisallowedLoginPasswordCharacters(value: string): boolean {
  return (
    containsMatchingCharacters(isControlCharacter, value) ||
    containsCharacters(INVISIBLE_CHAR_PATTERN, value)
  );
}
