import {BiometricRSAAuthOrchestrator} from '../BiometricRSAAuthOrchestrator';
import type {BiometricRemoteDataSource} from '../../../data/datasources/biometric/BiometricRemoteDataSource';
import type {CryptoService} from '../CryptoService';
import type {BiometricKeyStorageService} from '../BiometricKeyStorageService';
import type {SecureStorageService} from '../../../domain/services/SecureStorageService';
import type {GetPublicKeyUseCase} from '../../../domain/usecases/GetPublicKeyUseCase';
import {SecureStorageKeys} from '../../../data/datasources/storage/SecureStorageKeys';
import {SERVER_PUBLIC_KEY_PEM_BASE64} from '../../certificate/keys.constants';

describe('BiometricRSAAuthOrchestrator', () => {
  const serverPem = SERVER_PUBLIC_KEY_PEM_BASE64;

  function buildOrchestrator(mocks: {
    remote: jest.Mocked<Pick<BiometricRemoteDataSource, 'postBiometricChallenge' | 'postBiometricRegistration' | 'postBiometricLogin'>>;
    crypto: jest.Mocked<CryptoService>;
    keyStorage: jest.Mocked<Pick<BiometricKeyStorageService, 'savePrivateKey' | 'getPrivateKey' | 'hasPrivateKey'>>;
    secure: jest.Mocked<Pick<SecureStorageService, 'get' | 'save'>>;
    getPk: jest.Mocked<Pick<GetPublicKeyUseCase, 'execute'>>;
  }) {
    return new BiometricRSAAuthOrchestrator(
      mocks.remote as unknown as BiometricRemoteDataSource,
      mocks.crypto as unknown as CryptoService,
      mocks.keyStorage as unknown as BiometricKeyStorageService,
      mocks.secure as unknown as SecureStorageService,
      mocks.getPk as unknown as GetPublicKeyUseCase,
      SecureStorageKeys.SERVER_PUBLIC_KEY,
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registerBiometricForUser completes challenge, registration, storage', async () => {
    const remote = {
      postBiometricChallenge: jest.fn().mockResolvedValue({challenge: 'ch1'}),
      postBiometricRegistration: jest.fn().mockResolvedValue(undefined),
      postBiometricLogin: jest.fn(),
    };
    const crypto = {
      generateKeyPair: jest.fn().mockResolvedValue({
        publicKeyPem: '-----BEGIN PUBLIC KEY-----\nabc\n-----END PUBLIC KEY-----',
        privateKeyPem: '-----BEGIN PRIVATE KEY-----\ndef\n-----END PRIVATE KEY-----',
      }),
      signChallenge: jest.fn().mockResolvedValue('sigb64'),
      getPublicKeyBase64FromPem: jest.fn().mockReturnValue('cHVibGtleWI2NA=='),
      clearMemoryKeys: jest.fn(),
    };
    const keyStorage = {
      savePrivateKey: jest.fn().mockResolvedValue(undefined),
      getPrivateKey: jest.fn(),
      hasPrivateKey: jest.fn(),
    };
    const secure = {
      get: jest.fn().mockResolvedValue(serverPem),
      save: jest.fn().mockResolvedValue(undefined),
    };
    const getPk = {execute: jest.fn()};

    const orchestrator = buildOrchestrator({
      remote,
      crypto,
      keyStorage,
      secure,
      getPk,
    });

    await orchestrator.registerBiometricForUser('user@test.com');

    expect(remote.postBiometricChallenge).toHaveBeenCalled();
    expect(remote.postBiometricRegistration).toHaveBeenCalledWith(
      expect.objectContaining({
        challenge: 'ch1',
        challengeSignBase64: 'sigb64',
        mobilePublicKeyBase64: 'cHVibGtleWI2NA==',
      }),
    );
    expect(keyStorage.savePrivateKey).toHaveBeenCalled();
    expect(secure.save).toHaveBeenCalledWith(
      SecureStorageKeys.BIOMETRIC_USERNAME,
      'user@test.com',
    );
    expect(crypto.clearMemoryKeys).toHaveBeenCalled();
  });

  it('loginWithBiometric posts login with signed challenge', async () => {
    const remote = {
      postBiometricChallenge: jest.fn().mockResolvedValue({challenge: 'ch2'}),
      postBiometricRegistration: jest.fn(),
      postBiometricLogin: jest
        .fn()
        .mockResolvedValue({accessToken: 'tok'}),
    };
    const crypto = {
      generateKeyPair: jest.fn(),
      signChallenge: jest.fn().mockResolvedValue('sign2'),
      getPublicKeyBase64FromPem: jest.fn(),
      clearMemoryKeys: jest.fn(),
    };
    const keyStorage = {
      savePrivateKey: jest.fn(),
      getPrivateKey: jest.fn().mockResolvedValue('-----BEGIN PRIVATE KEY-----\nx\n-----END PRIVATE KEY-----'),
      hasPrivateKey: jest.fn().mockResolvedValue(true),
    };
    const secure = {
      get: jest.fn((key: string) => {
        if (key === SecureStorageKeys.BIOMETRIC_USERNAME) {
          return Promise.resolve('user@test.com');
        }
        if (key === SecureStorageKeys.SERVER_PUBLIC_KEY) {
          return Promise.resolve(serverPem);
        }
        return Promise.resolve(null);
      }),
      save: jest.fn().mockResolvedValue(undefined),
    };
    const getPk = {execute: jest.fn()};

    const orchestrator = buildOrchestrator({
      remote,
      crypto,
      keyStorage,
      secure,
      getPk,
    });

    const result = await orchestrator.loginWithBiometric();

    expect(result.accessToken).toBe('tok');
    expect(result.email).toBe('user@test.com');
    expect(remote.postBiometricLogin).toHaveBeenCalledWith(
      expect.objectContaining({
        challenge: 'ch2',
        challengeSignBase64: 'sign2',
      }),
    );
    expect(secure.save).toHaveBeenCalledWith(
      SecureStorageKeys.USER_LOGIN_DATA,
      JSON.stringify({accessToken: 'tok'}),
    );
  });
});
