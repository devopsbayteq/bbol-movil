/** Longitud máxima del alias en registro (alfanumérico). */
export const REGISTER_ALIAS_MAX_LENGTH = 16;

const ALIAS_MIN_LENGTH = 1;
const ALIAS_PATTERN = /^[a-zA-Z0-9]+$/;

/**
 * Deja solo letras y números ASCII y recorta a la longitud máxima permitida.
 */
export function sanitizeRegisterAliasInput(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9]/g, '').slice(0, REGISTER_ALIAS_MAX_LENGTH);
}

export function validateRegisterAliasInput(raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed.length < ALIAS_MIN_LENGTH) {
    return 'Ingresa un alias.';
  }
  if (trimmed.length > REGISTER_ALIAS_MAX_LENGTH) {
    return `El alias no puede superar ${REGISTER_ALIAS_MAX_LENGTH} caracteres.`;
  }
  if (!ALIAS_PATTERN.test(trimmed)) {
    return 'El alias solo puede contener letras y números.';
  }
  return null;
}
