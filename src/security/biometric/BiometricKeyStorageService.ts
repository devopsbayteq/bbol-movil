import * as Keychain from 'react-native-keychain';
import {Platform} from 'react-native';
import {BiometricRSAError} from './errors';

const KEYCHAIN_SERVICE = 'com.bbapp.biometric.rsa.private.v1';
const KEYCHAIN_USERNAME = 'bb_biometric_rsa_private';

function mapKeychainError(err: unknown): BiometricRSAError {
  const msg = err instanceof Error ? err.message : String(err);
  const lower = msg.toLowerCase();
  if (
    lower.includes('cancel') ||
    lower.includes('user canceled') ||
    lower.includes('user_cancel')
  ) {
    return new BiometricRSAError(
      'Autenticación biométrica cancelada',
      'user_cancelled',
      err,
    );
  }
  if (lower.includes('biometry') || lower.includes('authentication failed')) {
    return new BiometricRSAError(
      'No se pudo verificar la biometría',
      'prompt_failed',
      err,
    );
  }
  return new BiometricRSAError(
    'Error al acceder al almacén seguro',
    'keychain_error',
    err,
  );
}

/**
 * Persiste la clave privada RSA (PEM) en Keychain / Keystore con control biométrico.
 */
export class BiometricKeyStorageService {
  async savePrivateKey(privateKeyPem: string): Promise<void> {
    const result = await Keychain.setGenericPassword(
      KEYCHAIN_USERNAME,
      privateKeyPem,
      {
        service: KEYCHAIN_SERVICE,
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        authenticationPrompt: {
          title: 'Proteger acceso biométrico',
          subtitle:
            Platform.OS === 'android'
              ? 'Se guardará la clave con huella digital o Face ID'
              : undefined,
          description: 'Autentícate para guardar la clave de forma segura',
          cancel: 'Cancelar',
        },
      },
    );
    if (result === false) {
      throw new BiometricRSAError(
        'No se pudo guardar la clave privada',
        'keychain_error',
      );
    }
  }

  async getPrivateKey(): Promise<string> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: KEYCHAIN_SERVICE,
        authenticationPrompt: {
          title: 'Acceso biométrico',
          subtitle:
            Platform.OS === 'android'
              ? 'Usa huella o Face ID para continuar'
              : undefined,
          description: 'Desbloquea tu clave privada',
          cancel: 'Cancelar',
        },
      });
      if (credentials === false || !credentials.password?.trim()) {
        throw new BiometricRSAError(
          'No hay clave biométrica registrada',
          'no_private_key',
        );
      }
      return credentials.password;
    } catch (e) {
      if (e instanceof BiometricRSAError) {
        throw e;
      }
      throw mapKeychainError(e);
    }
  }

  async hasPrivateKey(): Promise<boolean> {
    return Keychain.hasGenericPassword({service: KEYCHAIN_SERVICE});
  }

  async deletePrivateKey(): Promise<void> {
    await Keychain.resetGenericPassword({service: KEYCHAIN_SERVICE});
  }
}
