import type {
  CertificateContent,
  CertificateEnvelopeResponse,
  CertificateRequest,
} from '../../data/models/CertificateModels';
import {
  CLIENT_PRIVATE_KEY_PEM_BASE64,
  SERVER_PUBLIC_KEY_PEM_BASE64,
} from './keys.constants';
import {Buffer} from 'buffer';
import {AES_IV_LENGTH_BYTES, aes256CbcDecrypt} from './aesHelper';
import crypto from 'react-native-quick-crypto';
import {devLog, devWarn} from '../../data/api/devLog';
import {
  decodeApiBase64ToBinary,
  rsaOaepDecryptPrivateKeyPemBase64CipherBase64ToUtf8,
  rsaOaepEncryptHex16MaterialPemBase64ToBase64,
  rsaSignSha256PrivateKeyPemBase64OnCipherBase64,
  rsaVerifySha256PublicKeyPemBase64OnBase64,
} from './rsaUtils';

const LOG_CERT_VALIDATE = 'Security/certificate/validate';

export interface CertificateSession {
  secretMaterial: string;
  ivMaterial: string;
}

/**
 * Material de sesión de 16 caracteres ASCII (16 bytes UTF-8).
 * Evita incompatibilidades de longitud de IV (AES requiere 16 bytes).
 */
export function materialHex16FromUuidV4(): string {
  const base64url = crypto
    .randomBytes(16)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return base64url.slice(0, 16);
}

/** Clave AES-256 derivada del material de sesión (SHA-256 sobre UTF-8). */
export function deriveAes256KeyHexFromSecretMaterial(secretMaterial: string): Buffer {
  const hash = crypto.createHash('sha256');
  hash.update(secretMaterial);
  return Buffer.from(hash.digest());
}

/** IV AES derivado de material de sesión (primeros 16 bytes de SHA-256 sobre UTF-8). */
export function deriveIvHexFromIvMaterial(ivMaterial: string): Buffer {
  const hash = crypto.createHash('sha256');
  hash.update(ivMaterial);
  const ivCandidate = Buffer.from(hash.digest()).subarray(0, AES_IV_LENGTH_BYTES);
  return Buffer.from(ivCandidate);
}

function tryDecryptWithDerivationStrategies(
  ciphertext: Buffer,
  secretMaterial: string,
  ivMaterial: string,
): {plaintext: string; strategy: string} {
  const keySha256 = deriveAes256KeyHexFromSecretMaterial(secretMaterial);
  const ivSha256 = deriveIvHexFromIvMaterial(ivMaterial);
  const ivUtf8 = Buffer.from(ivMaterial, 'utf8').subarray(0, AES_IV_LENGTH_BYTES);

  const attempts: Array<{name: string; key: Buffer; iv: Buffer}> = [
    {name: 'key=sha256(secret), iv=sha256(iv)[0..15]', key: keySha256, iv: ivSha256},
    {name: 'key=sha256(secret), iv=utf8(iv)[0..15]', key: keySha256, iv: Buffer.from(ivUtf8)},
  ];

  let lastError: unknown;
  for (const attempt of attempts) {
    try {
      const plaintext = aes256CbcDecrypt(ciphertext, attempt.key, attempt.iv).toString(
        'utf8',
      );
      return {plaintext, strategy: attempt.name};
    } catch (error) {
      lastError = error;
      devWarn(LOG_CERT_VALIDATE, 'AES decrypt falló con estrategia', {
        strategy: attempt.name,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('No se pudo desencriptar AES con estrategias conocidas');
}

function tryDecryptWithDirectAes128(
  ciphertext: Buffer,
  secretMaterial: string,
  ivMaterial: string,
): {plaintext: string; strategy: string} {
  const key16 = Buffer.from(secretMaterial, 'utf8').subarray(0, 16);
  const iv16 = Buffer.from(ivMaterial, 'utf8').subarray(0, 16);
  if (key16.length !== 16 || iv16.length !== 16) {
    throw new Error('Material de sesión inválido para AES-128 directo');
  }
  const decipher = crypto.createDecipheriv('aes-128-cbc', key16, iv16);
  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return {plaintext: plain.toString('utf8'), strategy: 'key=utf8(secret)[16], iv=utf8(iv)[16], aes-128-cbc'};
}

export interface CertificateHandshakeKeys {
  clientPrivatePemBase64: string;
  serverPublicPemBase64: string;
}

export const DEFAULT_HANDSHAKE_KEYS: CertificateHandshakeKeys = {
  clientPrivatePemBase64: CLIENT_PRIVATE_KEY_PEM_BASE64,
  serverPublicPemBase64: SERVER_PUBLIC_KEY_PEM_BASE64,
};

function resolveContent(
  envelope: CertificateEnvelopeResponse,
): CertificateContent | undefined {
  return envelope.content ?? envelope.data;
}

function decodeAesCiphertextFromRsaPayload(payload: string): Buffer {
  const trimmed = payload.trim();
  const isHex = trimmed.length % 2 === 0 && /^[0-9a-fA-F]+$/.test(trimmed);
  if (isHex) {
    return Buffer.from(trimmed, 'hex');
  }
  return decodeApiBase64ToBinary(trimmed);
}

export function generateCertificateSession(): CertificateSession {
  return {
    secretMaterial: materialHex16FromUuidV4(),
    ivMaterial: materialHex16FromUuidV4(),
  };
}

export function buildCertificateRequest(
  session: CertificateSession,
  keys: CertificateHandshakeKeys = DEFAULT_HANDSHAKE_KEYS,
): CertificateRequest {
  const secretEncryptBase64Single = rsaOaepEncryptHex16MaterialPemBase64ToBase64(
    keys.serverPublicPemBase64,
    session.secretMaterial,
  );
  const secretIvEncryptBase64Single = rsaOaepEncryptHex16MaterialPemBase64ToBase64(
    keys.serverPublicPemBase64,
    session.ivMaterial,
  );
  const secretEncryptSignBase64 = rsaSignSha256PrivateKeyPemBase64OnCipherBase64(
    keys.clientPrivatePemBase64,
    secretEncryptBase64Single,
  );
  const secretEncryptBase64 = Buffer.from(secretEncryptBase64Single, 'utf8').toString(
    'base64',
  );
  const secretIvEncryptBase64 = Buffer.from(secretIvEncryptBase64Single, 'utf8').toString(
    'base64',
  );
  return {
    secretEncryptBase64,
    secretEncryptSignBase64,
    secretIvEncryptBase64,
  };
}

export type PostCertificateFn = (
  body: CertificateRequest,
) => Promise<CertificateEnvelopeResponse>;

export async function startCertificateValidation(
  postCertificate: PostCertificateFn,
  keys: CertificateHandshakeKeys = DEFAULT_HANDSHAKE_KEYS,
): Promise<{
  response: CertificateEnvelopeResponse;
  session: CertificateSession;
}> {
  const session = generateCertificateSession();
  const body = buildCertificateRequest(session, keys);
  const response = await postCertificate(body);
  return {response, session};
}

export interface ValidatedCertificateResult {
  /** Hash del certificado en texto plano (normalmente hex o base64 según backend). */
  certificateHashHex: string;
  userMessage: string;
  /** `validateHash` del API: pinning TLS. */
  pinningEnabled: boolean;
}

export function validateCertificateResponse(
  envelope: CertificateEnvelopeResponse,
  session: CertificateSession,
  keys: CertificateHandshakeKeys = DEFAULT_HANDSHAKE_KEYS,
): ValidatedCertificateResult {
  if (envelope.responseType === 'Error') {
    throw new Error(envelope.message || 'Error en validación de certificado');
  }

  const content = resolveContent(envelope);
  if (!content?.certificate) {
    throw new Error(envelope.message || 'Respuesta de certificado incompleta');
  }

  devLog(LOG_CERT_VALIDATE, 'Verificando firma RSA (hashEncrypt)', {
    hashEncryptChars: content.certificate.hashEncrypt.length,
    hashEncryptSignChars: content.certificate.hashEncryptSign.length,
    hashEncryptPreview: content.certificate.hashEncrypt.slice(0, 12),
    hashEncryptSignPreview: content.certificate.hashEncryptSign.slice(0, 12),
    sessionSecretLen: session.secretMaterial.length,
    sessionIvLen: session.ivMaterial.length,
  });
  let signatureOk = false;
  try {
    signatureOk = rsaVerifySha256PublicKeyPemBase64OnBase64(
      keys.serverPublicPemBase64,
      content.certificate.hashEncrypt,
      content.certificate.hashEncryptSign,
    );
  } catch (error) {
    devWarn(LOG_CERT_VALIDATE, 'Error verificando firma RSA (hashEncrypt)', {
      message: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
  if (!signatureOk) {
    devWarn(LOG_CERT_VALIDATE, 'Firma del servidor inválida (hashEncrypt)', {
      hashEncryptChars: content.certificate.hashEncrypt.length,
      hashEncryptSignChars: content.certificate.hashEncryptSign.length,
    });
    throw new Error('Firma del servidor inválida (hashEncrypt)');
  }
  devLog(LOG_CERT_VALIDATE, 'Firma RSA (hashEncrypt) OK');

  const aesCiphertextBase64 = rsaOaepDecryptPrivateKeyPemBase64CipherBase64ToUtf8(
    keys.clientPrivatePemBase64,
    content.certificate.hashEncrypt,
  );
  devLog(LOG_CERT_VALIDATE, 'RSA decrypt completado (payload AES base64)', {
    aesCiphertextBase64Chars: aesCiphertextBase64.length,
    aesCiphertextBase64Preview: aesCiphertextBase64.slice(0, 16),
  });
  const aesKey = deriveAes256KeyHexFromSecretMaterial(session.secretMaterial);
  const iv = deriveIvHexFromIvMaterial(session.ivMaterial);
  const ciphertext = decodeAesCiphertextFromRsaPayload(aesCiphertextBase64);
  devLog(LOG_CERT_VALIDATE, 'AES decrypt: tamaños de entrada', {
    ciphertextBytes: ciphertext.length,
    aesKeyBytes: aesKey.length,
    ivBytes: iv.length,
    ciphertextMod16: ciphertext.length % 16,
  });
  let plaintext: string;
  let strategy: string;
  try {
    const out = tryDecryptWithDerivationStrategies(
      ciphertext,
      session.secretMaterial,
      session.ivMaterial,
    );
    plaintext = out.plaintext;
    strategy = out.strategy;
  } catch (error) {
    devWarn(LOG_CERT_VALIDATE, 'AES-256 derivado falló, probando AES-128 directo', {
      message: error instanceof Error ? error.message : String(error),
    });
    const out = tryDecryptWithDirectAes128(
      ciphertext,
      session.secretMaterial,
      session.ivMaterial,
    );
    plaintext = out.plaintext;
    strategy = out.strategy;
  }
  devLog(LOG_CERT_VALIDATE, 'AES decrypt OK', {strategy});

  return {
    certificateHashHex: plaintext,
    userMessage: content.userMessage,
    pinningEnabled: content.validateHash,
  };
}


