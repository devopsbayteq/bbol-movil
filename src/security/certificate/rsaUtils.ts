import {Buffer} from 'buffer';
import {devLog} from '../../data/api/devLog';
import crypto, {createPublicKey} from 'react-native-quick-crypto';
import {
  base64ToBinaryLatin1,
  base64ToBuffer,
  bufferToBase64,
  bufferToHex,
} from './encoding';
import { generateKeyToPEM } from './certificatesValidation';

const LOG_RSA = 'Security/rsa';

type RsaPublicKey = ReturnType<typeof crypto.createPublicKey>;
type RsaPrivateKey = ReturnType<typeof crypto.createPrivateKey>;

/**
 * RSA-OAEP con SHA-1 (MGF1 con SHA-1).
 * Paridad con .NET `RSAEncryptionPadding.OaepSHA1`.
 */
export const RSA_OAEP_OPTIONS = {
  padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
  oaepHash: 'sha1',
} as const;

export const CLIENT_PRIVATE_SIGN_SCHEME = 'sha256' as const;
export const SERVER_SIGNATURE_VERIFY_SCHEME = 'sha256' as const;

export function pemFromBase64PemBlock(base64Pem: string): string {
  return Buffer.from(base64Pem, 'base64').toString('utf8');
}

export function createPublicKeyFromPemBase64(base64Pem: string): RsaPublicKey {
  return crypto.createPublicKey(pemFromBase64PemBlock(base64Pem));
}

export function createPrivateKeyFromPemBase64(
  base64Pem: string,
): RsaPrivateKey {
  return crypto.createPrivateKey(pemFromBase64PemBlock(base64Pem));
}

function rsaOaepEncryptWithPublicKey(
  publicKey: RsaPublicKey,
  plaintext: Buffer,
): Buffer {
  devLog(LOG_RSA, 'rsaOaepEncrypt: entrada', {
    plaintextBytes: plaintext.length,
  });
  const encrypted = Buffer.from(
    crypto.publicEncrypt(
      {
        key: publicKey,
        ...RSA_OAEP_OPTIONS,
      },
      plaintext,
    ),
  );
  devLog(LOG_RSA, 'rsaOaepEncrypt: salida', {
    ciphertextBytes: encrypted.length,
  });
  return encrypted;
}

function rsaOaepDecryptWithPrivateKey(
  privateKey: RsaPrivateKey,
  ciphertext: Buffer,
): Buffer {
  return Buffer.from(
    crypto.privateDecrypt(
      {
        key: privateKey,
        ...RSA_OAEP_OPTIONS,
      },
      ciphertext,
    ),
  );
}

function rsaSignSha256WithPrivateKey(
  privateKey: RsaPrivateKey,
  message: Buffer,
): Buffer {
  return Buffer.from(
    crypto.sign(CLIENT_PRIVATE_SIGN_SCHEME, message, privateKey),
  );
}

function rsaVerifySha256WithPublicKey(
  publicKey: RsaPublicKey,
  message: Buffer,
  signature: Buffer,
): boolean {
  return crypto.verify(
    SERVER_SIGNATURE_VERIFY_SCHEME,
    message,
    publicKey,
    signature,
  );
}

export function rsaVerifySha256PublicKeyPemBase64OnBase64(
  serverPublicPemBase64: string,
  messageBase64: string,
  signatureBase64: string,
): boolean {
  const serverPub = createPublicKeyFromPemBase64(serverPublicPemBase64);
  return rsaVerifySha256WithPublicKey(
    serverPub,
    base64ToBuffer(messageBase64),
    base64ToBuffer(signatureBase64),
  );
}

export function rsaOaepDecryptPrivateKeyPemBase64CipherBase64ToHex(
  clientPrivatePemBase64: string,
  cipherBase64: string,
): string {
  const clientPriv = createPrivateKeyFromPemBase64(clientPrivatePemBase64);
  const plain = rsaOaepDecryptWithPrivateKey(
    clientPriv,
    base64ToBuffer(cipherBase64),
  );
  return bufferToHex(plain);
}

export function rsaOaepEncryptHex16MaterialPemBase64ToBase64(
  publicKeyPem: string,
  hex16: string,
): string {
  devLog(LOG_RSA, 'rsaOaepEncryptHex16: entrada', {
    materialHexChars: hex16?.length ?? 0,
    hasPublicKeyPem: (publicKeyPem?.trim()),
  });
  if (!/^[0-9a-fA-F]{16}$/.test(hex16)) {
    devLog(LOG_RSA, 'rsaOaepEncryptHex16: salida (error validación material)');
    throw new Error(
      'El material debe ser exactamente 16 caracteres hexadecimales (8 bytes).',
    );
  }
  if (!publicKeyPem?.trim()) {
    devLog(LOG_RSA, 'rsaOaepEncryptHex16: salida (error sin clave)');
    throw new Error('La llave pública es requerida');
  }
  const keyPem = base64ToBinaryLatin1(publicKeyPem);
  const pub = createPublicKey({key: keyPem, format: 'pem'});
  const plain = Buffer.from(hex16, 'hex');
  const encrypted = crypto.publicEncrypt(
    {
      key: pub,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha1',
    },
    plain,
  );
  const firstBase64 = encrypted.toString('base64');
  const encryptValue = Buffer.from(firstBase64, 'utf8').toString('base64');
  devLog(LOG_RSA, 'rsaOaepEncryptHex16: salida OK', {
    encrypted: encrypted,
    encryptedBase64: encryptValue,
  });
  return encryptValue;
}

export function rsaSignSha256PrivateKeyPemBase64OnCipherBase64(
  clientPrivatePemBase64: string,
  cipherBase64: string,
): string {
  if (!clientPrivatePemBase64?.trim()) {
    throw new Error('La llave privada del cliente es requerida');
  }
  const clientPriv = createPrivateKeyFromPemBase64(clientPrivatePemBase64);
  const cipherBuf = base64ToBuffer(cipherBase64);
  const sig = rsaSignSha256WithPrivateKey(clientPriv, cipherBuf);
  return bufferToBase64(sig);
}

export function rsaEncryptPublicKeyPemBase64Utf8ToBase64(
  publicKeyBase64: string,
  plainText: string,
): string {
  devLog(LOG_RSA, 'rsaEncryptUtf8: entrada', {
    plainTextUtf8Bytes: plainText?.length ?? 0,
    hasPublicKey: Boolean(publicKeyBase64?.trim()),
  });
  if (plainText == null || plainText === '') {
    devLog(LOG_RSA, 'rsaEncryptUtf8: salida (error texto vacío)');
    throw new Error('No hay texto para encriptar');
  }
  if (!publicKeyBase64?.trim()) {
    devLog(LOG_RSA, 'rsaEncryptUtf8: salida (error sin clave)');
    throw new Error('La llave Pública es requerida');
  }
  try {
    const pub = createPublicKeyFromPemBase64(publicKeyBase64);
    const dataToEncrypt = Buffer.from(plainText, 'utf8');
    const encrypted = rsaOaepEncryptWithPublicKey(pub, dataToEncrypt);
    const out = bufferToBase64(encrypted);
    devLog(LOG_RSA, 'rsaEncryptUtf8: salida OK', {
      ciphertextBase64Chars: out.length,
    });
    return out;
  } catch (ex) {
    devLog(LOG_RSA, 'rsaEncryptUtf8: salida (error)', {
      message: ex instanceof Error ? ex.message : String(ex),
    });
    const inner = ex instanceof Error ? ex.message : String(ex);
    throw new Error(
      `Error mientras se intentaba encriptar texto: ${plainText}. ${inner}`,
    );
  }
}
