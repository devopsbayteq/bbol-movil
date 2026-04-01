import {
  hasDisallowedTransferConceptCharacters,
  sanitizeTransferConceptInput,
  transferConceptMessages,
  validateTransferConcept,
} from '../../../src/domain/validation';

describe('transferConcept validation', () => {
  test('allows empty optional concept', () => {
    expect(validateTransferConcept('')).toBeNull();
    expect(validateTransferConcept('   ')).toBeNull();
  });

  test('sanitizes newlines and unsafe characters', () => {
    const raw = 'Pago\u200B\nzapatos\u0000';

    expect(sanitizeTransferConceptInput(raw)).toBe('Pago zapatos');
    expect(hasDisallowedTransferConceptCharacters(raw)).toBe(true);
  });

  test('rejects concept longer than maximum', () => {
    const longConcept = 'a'.repeat(121);

    expect(validateTransferConcept(longConcept)).toBe(
      transferConceptMessages.tooLong,
    );
  });

  test('accepts valid short concept', () => {
    expect(validateTransferConcept('Pago servicios')).toBeNull();
  });
});
