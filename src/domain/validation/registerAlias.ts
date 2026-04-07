import {
  createValidateLoginUsernameStyle,
  LOGIN_USERNAME_MAX_LENGTH,
  LOGIN_USERNAME_MIN_LENGTH,
  sanitizeLoginUsernameInput,
} from './loginCredentials';
import type {LoginUsernameStyleValidationMessages} from './loginCredentials';

/** Misma longitud máxima que el usuario de login. */
export const REGISTER_ALIAS_MAX_LENGTH = LOGIN_USERNAME_MAX_LENGTH;

export const registerAliasValidationMessages = {
  usernameRequired: 'El alias es requerido',
  usernameInvalidCharacters: 'El alias contiene caracteres no permitidos',
  usernameInvalidCharset:
    'El alias solo puede contener letras, números, punto (.), guion (-) y guion bajo (_).',
  usernameTooShort: `El alias debe tener al menos ${LOGIN_USERNAME_MIN_LENGTH} caracteres`,
  usernameTooLong: `El alias no puede superar ${LOGIN_USERNAME_MAX_LENGTH} caracteres`,
} as const satisfies LoginUsernameStyleValidationMessages;

export const validateRegisterAliasInput = createValidateLoginUsernameStyle(
  registerAliasValidationMessages,
);

/**
 * Valor listo para enviar: mismo saneo que el usuario de login y tope de longitud.
 */
export function sanitizeRegisterAliasInput(raw: string): string {
  return sanitizeLoginUsernameInput(raw).slice(0, LOGIN_USERNAME_MAX_LENGTH);
}
