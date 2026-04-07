import {
  composeValidators,
  containsCharacters,
  containsMatchingCharacters,
  rejectCharacters,
  rejectMatchingCharacters,
  requireMaxLength,
  requireMinLength,
  requirePattern,
  requireTrimmedValue,
} from './rules';
import {
  INVISIBLE_CHAR_PATTERN,
  isControlCharacter,
  sanitizeUnsafeTextInput,
} from './textSafety';

/** Letras (Unicode), números, punto, guion y guion bajo. */
export const LOGIN_USERNAME_ALLOWED_PATTERN = /^[\p{L}\p{N}._-]+$/u;

export const LOGIN_USERNAME_MIN_LENGTH = 12;
export const LOGIN_USERNAME_MAX_LENGTH = 16;

export const LOGIN_PASSWORD_MIN_LENGTH = 8;
export const LOGIN_PASSWORD_MAX_LENGTH = 16;

export const loginValidationMessages = {
  usernameRequired: 'El usuario es requerido',
  usernameInvalidCharacters: 'El usuario contiene caracteres no permitidos',
  usernameInvalidCharset:
    'El usuario solo puede contener letras, números, punto (.), guion (-) y guion bajo (_).',
  usernameTooShort: `El usuario debe tener al menos ${LOGIN_USERNAME_MIN_LENGTH} caracteres`,
  usernameTooLong: `El usuario no puede superar ${LOGIN_USERNAME_MAX_LENGTH} caracteres`,
  passwordRequired: 'La contraseña es requerida',
  passwordInvalidCharacters:
    'La contraseña contiene caracteres no permitidos',
  passwordTooShort: `La contraseña debe tener al menos ${LOGIN_PASSWORD_MIN_LENGTH} caracteres`,
  passwordTooLong: `La contraseña no puede superar ${LOGIN_PASSWORD_MAX_LENGTH} caracteres`,
} as const;

export const sanitizeLoginUsernameInput = sanitizeUnsafeTextInput;

export const sanitizeLoginPasswordInput = sanitizeUnsafeTextInput;

/** Mensajes para la cadena de validación estilo usuario (login / alias). */
export type LoginUsernameStyleValidationMessages = {
  usernameRequired: string;
  usernameInvalidCharacters: string;
  usernameInvalidCharset: string;
  usernameTooShort: string;
  usernameTooLong: string;
};

export function createValidateLoginUsernameStyle(
  messages: LoginUsernameStyleValidationMessages,
) {
  return composeValidators(
    requireTrimmedValue(messages.usernameRequired),
    rejectMatchingCharacters(
      isControlCharacter,
      messages.usernameInvalidCharacters,
    ),
    rejectCharacters(
      INVISIBLE_CHAR_PATTERN,
      messages.usernameInvalidCharacters,
    ),
    requirePattern(
      LOGIN_USERNAME_ALLOWED_PATTERN,
      messages.usernameInvalidCharset,
    ),
    requireMinLength(
      LOGIN_USERNAME_MIN_LENGTH,
      messages.usernameTooShort,
    ),
    requireMaxLength(
      LOGIN_USERNAME_MAX_LENGTH,
      messages.usernameTooLong,
    ),
  );
}

const loginUsernameStyleMessages: LoginUsernameStyleValidationMessages = {
  usernameRequired: loginValidationMessages.usernameRequired,
  usernameInvalidCharacters: loginValidationMessages.usernameInvalidCharacters,
  usernameInvalidCharset: loginValidationMessages.usernameInvalidCharset,
  usernameTooShort: loginValidationMessages.usernameTooShort,
  usernameTooLong: loginValidationMessages.usernameTooLong,
};

export const validateLoginUsername =
  createValidateLoginUsernameStyle(loginUsernameStyleMessages);

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
