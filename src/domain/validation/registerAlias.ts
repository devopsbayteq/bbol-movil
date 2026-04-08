import {isControlCharacter} from './textSafety';

const ALIAS_MIN_LENGTH = 2;
const ALIAS_MAX_LENGTH = 64;

export function validateRegisterAliasInput(raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed.length < ALIAS_MIN_LENGTH) {
    return 'Ingresa un alias de al menos 2 caracteres.';
  }
  if (trimmed.length > ALIAS_MAX_LENGTH) {
    return 'El alias no puede superar 64 caracteres.';
  }
  for (let i = 0; i < trimmed.length; i += 1) {
    if (isControlCharacter(trimmed[i])) {
      return 'El alias contiene caracteres no válidos.';
    }
  }
  return null;
}
