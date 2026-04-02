import {Buffer} from 'buffer';
import {RSA} from 'react-native-rsa-native';
import {BiometricRSAError} from './errors';

const RSA_KEY_BITS = 2048;

/** Firma RSA-SHA256; mismo esquema que expone react-native-rsa-native. */
const SIGN_ALGORITHM = 'SHA256withRSA' as const;

export interface RsaKeyPairPem {
  readonly publicKeyPem: string;
  readonly privateKeyPem: string;
}

/**
 * RSA vía react-native-rsa-native: generación, exportación de pública en Base64 (UTF-8 PEM → Base64),
 * firma de challenge.
 */
export class CryptoService {
  private memoryPrivatePem: string | null = null;
  private memoryPublicPem: string | null = null;

  async generateKeyPair(): Promise<RsaKeyPairPem> {
    try {
      const pair = await RSA.generateKeys(RSA_KEY_BITS);
      this.memoryPrivatePem = pair.private;
      this.memoryPublicPem = pair.public;
      return {
        publicKeyPem: pair.public,
        privateKeyPem: pair.private,
      };
    } catch (e) {
      throw new BiometricRSAError(
        'No se pudo generar el par de claves RSA',
        'crypto_error',
        e,
      );
    }
  }

  /**
   * Clave pública para el registro biométrico: PEM codificado en Base64 (UTF-8).
   */
  getPublicKeyBase64FromPem(publicKeyPem: string): string {
    return Buffer.from(publicKeyPem, 'utf8').toString('base64');
  }

  getPublicKeyBase64(): string {
    if (!this.memoryPublicPem) {
      throw new BiometricRSAError(
        'No hay clave pública en memoria',
        'crypto_error',
      );
    }
    return this.getPublicKeyBase64FromPem(this.memoryPublicPem);
  }

  /**
   * Firma el challenge (UTF-8) con la clave privada PEM.
   */
  async signChallenge(
    challenge: string,
    privateKeyPem: string,
  ): Promise<string> {
    try {
      return await RSA.signWithAlgorithm(
        challenge,
        privateKeyPem,
        SIGN_ALGORITHM,
      );
    } catch (e) {
      throw new BiometricRSAError(
        'No se pudo firmar el challenge',
        'crypto_error',
        e,
      );
    }
  }

  clearMemoryKeys(): void {
    this.memoryPrivatePem = null;
    this.memoryPublicPem = null;
  }

  getMemoryPrivatePem(): string | null {
    return this.memoryPrivatePem;
  }

  getMemoryPublicPem(): string | null {
    return this.memoryPublicPem;
  }
}
