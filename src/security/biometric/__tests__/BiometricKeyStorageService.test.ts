import * as Keychain from 'react-native-keychain';
import {Platform} from 'react-native';
import {BiometricKeyStorageService} from '../BiometricKeyStorageService';
import {BiometricRSAError} from '../errors';

describe('BiometricKeyStorageService', () => {
  const service = new BiometricKeyStorageService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('savePrivateKey lanza si setGenericPassword devuelve false', async () => {
    (Keychain.setGenericPassword as jest.Mock).mockResolvedValueOnce(false);
    await expect(service.savePrivateKey('pem')).rejects.toMatchObject({
      code: 'keychain_error',
      message: 'No se pudo guardar la clave privada',
    });
  });

  it('savePrivateKey propaga opciones de prompt (Android con subtitle)', async () => {
    const prev = Platform.OS;
    Object.defineProperty(Platform, 'OS', {value: 'android', configurable: true});
    (Keychain.setGenericPassword as jest.Mock).mockResolvedValueOnce(true);
    await service.savePrivateKey('my-pem');
    expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
      expect.any(String),
      'my-pem',
      expect.objectContaining({
        authenticationPrompt: expect.objectContaining({
          subtitle: expect.any(String),
        }),
      }),
    );
    Object.defineProperty(Platform, 'OS', {value: prev, configurable: true});
  });

  it('getPrivateKey lanza no_private_key si no hay credenciales', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValueOnce(false);
    await expect(service.getPrivateKey()).rejects.toMatchObject({
      code: 'no_private_key',
    });
  });

  it('getPrivateKey lanza no_private_key si password vacío', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValueOnce({
      username: 'u',
      password: '   ',
    });
    await expect(service.getPrivateKey()).rejects.toMatchObject({
      code: 'no_private_key',
    });
  });

  it('getPrivateKey devuelve password cuando existe', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValueOnce({
      username: 'u',
      password: 'pem-content',
    });
    await expect(service.getPrivateKey()).resolves.toBe('pem-content');
  });

  it('getPrivateKey mapea cancelación del usuario', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockRejectedValueOnce(
      new Error('User canceled the operation'),
    );
    await expect(service.getPrivateKey()).rejects.toMatchObject({
      code: 'user_cancelled',
    });
  });

  it('getPrivateKey mapea fallo de biometría', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockRejectedValueOnce(
      new Error('Biometry is not enrolled'),
    );
    await expect(service.getPrivateKey()).rejects.toMatchObject({
      code: 'prompt_failed',
    });
  });

  it('getPrivateKey re-lanza BiometricRSAError sin envolver', async () => {
    const err = new BiometricRSAError('x', 'no_private_key');
    (Keychain.getGenericPassword as jest.Mock).mockRejectedValueOnce(err);
    await expect(service.getPrivateKey()).rejects.toBe(err);
  });

  it('getPrivateKey mapea errores genéricos del keychain', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockRejectedValueOnce(
      new Error('Keychain read failed'),
    );
    await expect(service.getPrivateKey()).rejects.toMatchObject({
      code: 'keychain_error',
    });
  });

  it('hasPrivateKey delega en Keychain', async () => {
    (Keychain.hasGenericPassword as jest.Mock).mockResolvedValueOnce(true);
    await expect(service.hasPrivateKey()).resolves.toBe(true);
  });

  it('deletePrivateKey delega en resetGenericPassword', async () => {
    await service.deletePrivateKey();
    expect(Keychain.resetGenericPassword).toHaveBeenCalled();
  });
});
