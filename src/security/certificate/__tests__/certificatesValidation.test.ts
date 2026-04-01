import type {CertificateEnvelopeResponse} from '../../../data/models/CertificateModels';
import {
  materialHex16FromUuidV4,
  validateCertificateResponse,
  type CertificateSession,
} from '../certificatesValidation';

function sessionFixture(): CertificateSession {
  return {
    secretMaterial: '0101010101010101',
    ivMaterial: '0202020202020202',
  };
}

describe('materialHex16FromUuidV4', () => {
  it('produce 16 caracteres hex (primeros del UUID sin guiones)', () => {
    expect(materialHex16FromUuidV4()).toMatch(/^[0-9a-f]{16}$/i);
  });
});

describe('validateCertificateResponse', () => {
  it('throws when responseType is Error', () => {
    const envelope: CertificateEnvelopeResponse = {
      code: 1,
      responseType: 'Error',
      message: 'fallo',
    };
    expect(() =>
      validateCertificateResponse(envelope, sessionFixture()),
    ).toThrow('fallo');
  });

  it('throws when content is missing', () => {
    const envelope: CertificateEnvelopeResponse = {
      code: 0,
      responseType: 'Success',
      message: 'sin content',
    };
    expect(() =>
      validateCertificateResponse(envelope, sessionFixture()),
    ).toThrow();
  });
});
