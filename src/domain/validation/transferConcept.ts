import {
  composeSanitizers,
  composeValidators,
  containsCharacters,
  containsMatchingCharacters,
  rejectCharacters,
  rejectMatchingCharacters,
  requireMaxLength,
} from './rules';
import {
  INVISIBLE_CHAR_PATTERN,
  isControlCharacter,
  sanitizeUnsafeTextInput,
} from './textSafety';

export const TRANSFER_CONCEPT_MAX_LENGTH = 120;

export const transferConceptMessages = {
  invalidCharacters: 'El concepto contiene caracteres no permitidos',
  tooLong: `El concepto no puede superar ${TRANSFER_CONCEPT_MAX_LENGTH} caracteres`,
} as const;

const NEWLINE_PATTERN = /\r|\n/;

function replaceNewlinesWithSpace(value: string): string {
  return value.replace(NEWLINE_PATTERN, ' ');
}

export const sanitizeTransferConceptInput = composeSanitizers(
  replaceNewlinesWithSpace,
  sanitizeUnsafeTextInput,
);

const validateNonEmptyTransferConcept = composeValidators(
  requireMaxLength(
    TRANSFER_CONCEPT_MAX_LENGTH,
    transferConceptMessages.tooLong,
  ),
  rejectMatchingCharacters(
    isControlCharacter,
    transferConceptMessages.invalidCharacters,
  ),
  rejectCharacters(
    INVISIBLE_CHAR_PATTERN,
    transferConceptMessages.invalidCharacters,
  ),
);

export function validateTransferConcept(value: string): string | null {
  const trimmed = value.trim();

  if (trimmed === '') {
    return null;
  }

  return validateNonEmptyTransferConcept(value);
}

export function hasDisallowedTransferConceptCharacters(value: string): boolean {
  return (
    containsMatchingCharacters(isControlCharacter, value) ||
    containsCharacters(INVISIBLE_CHAR_PATTERN, value) ||
    containsCharacters(NEWLINE_PATTERN, value)
  );
}
