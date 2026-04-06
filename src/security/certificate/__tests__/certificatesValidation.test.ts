import type {CertificateEnvelopeResponse} from '../../../data/models/CertificateModels';
import {Buffer} from 'buffer';
import {
  buildCertificateRequest,
  deriveAes256KeyHexFromSecretMaterial,
  deriveIvHexFromIvMaterial,
  generateCertificateSession,
  materialHex16FromUuidV4,
  startCertificateValidation,
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
  it('produce base64 no vacío', () => {
    expect(materialHex16FromUuidV4()).toMatch(/^[A-Za-z0-9\-_]+$/);
  });

  it('devuelve exactamente 16 caracteres', () => {
    expect(materialHex16FromUuidV4()).toHaveLength(16);
  });
});

describe('derivación de clave e IV', () => {
  it('deriveAes256KeyHexFromSecretMaterial produce 32 bytes', () => {
    const key = deriveAes256KeyHexFromSecretMaterial('secret-material-16');
    expect(key).toHaveLength(32);
  });

  it('deriveIvHexFromIvMaterial produce IV de 16 bytes', () => {
    const iv = deriveIvHexFromIvMaterial('iv-material-16ch');
    expect(iv).toHaveLength(16);
  });
});

describe('generateCertificateSession y startCertificateValidation', () => {
  it('generateCertificateSession incluye materiales de 16 caracteres', () => {
    const s = generateCertificateSession();
    expect(s.secretMaterial).toHaveLength(16);
    expect(s.ivMaterial).toHaveLength(16);
  });

  it('startCertificateValidation invoca postCertificate y devuelve sesión', async () => {
    const post = jest.fn().mockResolvedValue({
      code: 0,
      responseType: 'Success',
      message: '',
      content: {
        certificate: {hashEncrypt: 'h', hashEncryptSign: 's'},
        validateHash: true,
        userMessage: 'ok',
      },
    });
    const {response, session} = await startCertificateValidation(post);
    expect(post).toHaveBeenCalledTimes(1);
    expect(session.secretMaterial).toHaveLength(16);
    expect(response.responseType).toBe('Success');
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

  it('buildCertificateRequest codifica los 3 campos en doble Base64', () => {
    const request = buildCertificateRequest(sessionFixture());
    const fields = [
      request.secretEncryptBase64,
      request.secretIvEncryptBase64,
      request.secretEncryptSignBase64,
    ];

    for (const value of fields) {
      // 2do nivel Base64 -> texto UTF-8 que debe ser el 1er nivel Base64.
      const innerBase64 = Buffer.from(value, 'base64').toString('utf8');
      expect(innerBase64).toMatch(/^[A-Za-z0-9+/=]+$/);
    }
  });
});
