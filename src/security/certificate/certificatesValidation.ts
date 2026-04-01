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
import {aes256CbcDecryptHex} from './aesHelper';
import crypto from 'react-native-quick-crypto';
import {v4 as uuidv4} from 'uuid';
import {
  rsaOaepDecryptPrivateKeyPemBase64CipherBase64ToHex,
  rsaOaepEncryptHex16MaterialPemBase64ToBase64,
  rsaSignSha256PrivateKeyPemBase64OnCipherBase64,
  rsaVerifySha256PublicKeyPemBase64OnBase64,
} from './rsaUtils';

/**
 * Material de sesión: strings hex (16 caracteres = 8 bytes al decodificar).
 */
export interface CertificateSession {
  secretMaterial: string;
  ivMaterial: string;
}

/** Primeros 16 caracteres hex del UUID v4 (sin guiones). */
export function materialHex16FromUuidV4(): string {
  return uuidv4().replace(/-/g, '').slice(0, 16);
}

/** Clave AES-256 como string **hex** (64 caracteres). */
export function deriveAes256KeyHexFromSecretMaterial(
  secretMaterialHex: string,
): string {
  return crypto
    .createHash('sha256')
    .update(Buffer.from(secretMaterialHex, 'hex'))
    .digest('hex');
}

/** IV AES como string **hex** (32 caracteres = 16 bytes). */
export function deriveIvHexFromIvMaterial(ivMaterialHex: string): string {
  return crypto
    .createHash('sha256')
    .update(Buffer.from(ivMaterialHex, 'hex'))
    .digest('hex')
    .slice(0, 32);
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
  const secretEncryptBase64 = rsaOaepEncryptHex16MaterialPemBase64ToBase64(
    keys.serverPublicPemBase64,
    session.secretMaterial,
  );
  const secretIvEncryptBase64 = rsaOaepEncryptHex16MaterialPemBase64ToBase64(
    keys.serverPublicPemBase64,
    session.ivMaterial,
  );
  const secretEncryptSignBase64 = rsaSignSha256PrivateKeyPemBase64OnCipherBase64(
    keys.clientPrivatePemBase64,
    secretEncryptBase64,
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
  /** Hash del certificado en hex (plaintext AES descifrado). */
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

  const signatureOk = rsaVerifySha256PublicKeyPemBase64OnBase64(
    keys.serverPublicPemBase64,
    content.certificate.hashEncrypt,
    content.certificate.hashEncryptSign,
  );
  if (!signatureOk) {
    throw new Error('Firma del servidor inválida (hashEncrypt)');
  }

  const aesWrappedHex = rsaOaepDecryptPrivateKeyPemBase64CipherBase64ToHex(
    keys.clientPrivatePemBase64,
    content.certificate.hashEncrypt,
  );

  const aesKeyHex = deriveAes256KeyHexFromSecretMaterial(session.secretMaterial);
  const ivHex = deriveIvHexFromIvMaterial(session.ivMaterial);
  const plaintextHex = aes256CbcDecryptHex(aesWrappedHex, aesKeyHex, ivHex);

  return {
    certificateHashHex: plaintextHex,
    userMessage: content.userMessage,
    pinningEnabled: content.validateHash,
  };
}



export function generateKeyToPEM(stringKey: string, isPrivate: boolean): string {
  stringKey = stringKey.trim();
  let pemFormat = "";
  pemFormat = isPrivate
      ? '-----BEGIN PRIVATE KEY-----\n'
      : '-----BEGIN PUBLIC KEY-----\n';
  pemFormat += _encodePEM(stringKey);
  pemFormat +=
      isPrivate ? '-----END PRIVATE KEY-----\n' : '-----END PUBLIC KEY-----\n';
  return pemFormat;
}

export function _encodePEM(keyString: string): string {
  const lineLength = 64;
  let result = "";
  let offset = 0;
  while (offset < keyString.length) {
    const end = (offset + lineLength < keyString.length)
        ? offset + lineLength
        : keyString.length;
    result += keyString.substring(offset, end);
    result += '\n';
    offset = end;
  }
  return result;
}