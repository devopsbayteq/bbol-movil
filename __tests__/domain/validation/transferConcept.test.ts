import {
  hasDisallowedTransferConceptCharacters,
  sanitizeTransferConceptInput,
  TRANSFER_CONCEPT_MAX_LENGTH,
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

  test('detects zero-width characters as disallowed', () => {
    expect(hasDisallowedTransferConceptCharacters('Pago\u200Bservicio')).toBe(true);
    expect(hasDisallowedTransferConceptCharacters('Pago\u200Cservicio')).toBe(true);
    expect(hasDisallowedTransferConceptCharacters('Pago\uFEFFservicio')).toBe(true);
  });

  test('detects newlines as disallowed', () => {
    expect(hasDisallowedTransferConceptCharacters('Pago\nservicio')).toBe(true);
    expect(hasDisallowedTransferConceptCharacters('Pago\rservicio')).toBe(true);
  });

  test('detects control characters as disallowed', () => {
    expect(hasDisallowedTransferConceptCharacters('Pago\u0000servicio')).toBe(true);
    expect(hasDisallowedTransferConceptCharacters('Pago\u001Fservicio')).toBe(true);
  });

  test('sanitizer replaces newline with space', () => {
    expect(sanitizeTransferConceptInput('Pago\nservicio')).toBe('Pago servicio');
    expect(sanitizeTransferConceptInput('linea1\r\nlinea2')).toBe('linea1 linea2');
  });

  test('sanitizer removes zero-width and control characters', () => {
    expect(sanitizeTransferConceptInput('Pago\u200Bservicio')).toBe('Pagoservicio');
    expect(sanitizeTransferConceptInput('texto\u0000limpio')).toBe('textolimpio');
  });

  test('rejects concept longer than maximum', () => {
    const longConcept = 'a'.repeat(TRANSFER_CONCEPT_MAX_LENGTH + 1);

    expect(validateTransferConcept(longConcept)).toBe(
      transferConceptMessages.tooLong,
    );
  });

  test('accepts concept exactly at maximum length', () => {
    const maxConcept = 'a'.repeat(TRANSFER_CONCEPT_MAX_LENGTH);

    expect(validateTransferConcept(maxConcept)).toBeNull();
  });

  test('accepts valid short concept', () => {
    expect(validateTransferConcept('Pago servicios')).toBeNull();
  });

  test('accepts concept with accented characters and punctuation', () => {
    expect(validateTransferConcept('Pago de cuota #3 - Año 2025')).toBeNull();
    expect(validateTransferConcept('Transferencia mensual (nómina)')).toBeNull();
  });

  test('does not flag normal printable characters as disallowed', () => {
    expect(hasDisallowedTransferConceptCharacters('Pago servicio mensual')).toBe(false);
    expect(hasDisallowedTransferConceptCharacters('Cuota 01/2025')).toBe(false);
  });
});
