import type {AxiosInstance, InternalAxiosRequestConfig} from 'axios';
import {attachApiHeadersInterceptor} from '../../../src/data/api/apiHeadersInterceptor';
import {SecureStorageKeys} from '../../../src/data/datasources/storage/SecureStorageKeys';
import {rsaOaepEncryptUtf8MaterialPemBase64ToDoubleBase64} from '../../../src/security/certificate/rsaUtils';

jest.mock('../../../src/data/api/devLog', () => ({
  devLog: jest.fn(),
}));

jest.mock('../../../src/security/certificate/rsaUtils', () => ({
  rsaOaepEncryptUtf8MaterialPemBase64ToDoubleBase64: jest.fn(
    (_pem: string, payload: string) => `enc:${payload.length}`,
  ),
}));

jest.mock('../../../src/security/http/generateHMacContentHeader', () => ({
  generateHMacForContentHeaderFromAxios: jest.fn(() => 'hmac-body'),
}));

jest.mock('../../../src/data/bootstrap/ensureDeviceId', () => ({
  ensureDeviceId: jest.fn(() => Promise.resolve('dev-id-1')),
}));

jest.mock('../../../src/data/api/loadDeviceHeaderSnapshot', () => ({
  loadDeviceHeaderSnapshot: jest.fn(() =>
    Promise.resolve({
      platform: 'IOS',
      version: '1.0.0.1',
      model: 'iPhone',
      brand: 'Apple',
      systemVersion: '17.0',
    }),
  ),
}));

const mockedRsa = rsaOaepEncryptUtf8MaterialPemBase64ToDoubleBase64 as jest.MockedFunction<
  typeof rsaOaepEncryptUtf8MaterialPemBase64ToDoubleBase64
>;

function buildMockClient(): {
  client: AxiosInstance;
  runRequest: (
    cfg: Partial<InternalAxiosRequestConfig>,
  ) => Promise<InternalAxiosRequestConfig>;
} {
  let onFulfilled!: (
    c: InternalAxiosRequestConfig,
  ) => Promise<InternalAxiosRequestConfig>;
  const client = {
    interceptors: {
      request: {
        use: jest.fn((fulfilled: typeof onFulfilled) => {
          onFulfilled = fulfilled;
        }),
      },
    },
  } as unknown as AxiosInstance;
  return {
    client,
    runRequest: partial =>
      onFulfilled({
        url: '/path',
        method: 'get',
        headers: {},
        baseURL: 'https://api.example/',
        ...partial,
      } as InternalAxiosRequestConfig),
  };
}

describe('attachApiHeadersInterceptor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adjunta headers de banca y cifra huella en rutas normales', async () => {
    const secureStorage = {
      get: jest.fn((key: string) => {
        if (key === SecureStorageKeys.AUTH_TOKEN) {
          return Promise.resolve('my-jwt');
        }
        if (key === SecureStorageKeys.SERVER_PUBLIC_KEY) {
          return Promise.resolve('');
        }
        return Promise.resolve(null);
      }),
      save: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn(),
    };
    const deviceSecurityService = {
      getSnapshot: jest.fn().mockResolvedValue({
        isRootedOrJailbroken: false,
        isEmulator: false,
        isDeveloperModeEnabled: false,
        developerModeSupported: false,
        isDebuggedMode: false,
      }),
    };

    const {client, runRequest} = buildMockClient();
    attachApiHeadersInterceptor(client, {
      baseURL: 'https://api.bank/',
      secretKey: 'secret-k',
      requestId: 'req-uuid',
      secureStorage: secureStorage as never,
      serverPublicPemBase64: 'EMBEDDED_PEM_B64',
      deviceSecurityService: deviceSecurityService as never,
    });

    const out = await runRequest({url: '/accounts/list'});

    expect(out.baseURL).toBe('https://api.bank/');
    expect(out.headers.get('Authorization')).toBe('Bearer my-jwt');
    expect(out.headers.get('X-Device')).toBe('dev-id-1');
    expect(out.headers.get('X-RequestId')).toBe('req-uuid');
    expect(out.headers.get('X-Content')).toBe('hmac-body');
    expect(out.headers.get('X-Secret')).toBeTruthy();
    expect(out.headers.get('X-FingerPrint')).toBeTruthy();
    expect(mockedRsa).toHaveBeenCalled();
  });

  it('omite X-FingerPrint en solicitud de clave pública', async () => {
    const secureStorage = {
      get: jest.fn((key: string) => {
        if (key === SecureStorageKeys.AUTH_TOKEN) {
          return Promise.resolve('');
        }
        return Promise.resolve('');
      }),
      save: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn(),
    };
    const {client, runRequest} = buildMockClient();
    attachApiHeadersInterceptor(client, {
      baseURL: 'https://api.bank/',
      secretKey: 'sk',
      requestId: 'r1',
      secureStorage: secureStorage as never,
      serverPublicPemBase64: 'PEM',
      deviceSecurityService: {getSnapshot: jest.fn()} as never,
    });

    const out = await runRequest({
      url: '/api/v1/Security/public-key',
      baseURL: 'https://api.bank/',
    });

    expect(out.headers.get('X-FingerPrint')).toBe('');
  });

  it('usa SERVER_PUBLIC_KEY del almacén cuando existe', async () => {
    const secureStorage = {
      get: jest.fn((key: string) => {
        if (key === SecureStorageKeys.SERVER_PUBLIC_KEY) {
          return Promise.resolve('  FROM_STORAGE  ');
        }
        if (key === SecureStorageKeys.AUTH_TOKEN) {
          return Promise.resolve('');
        }
        return Promise.resolve(null);
      }),
      save: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn(),
    };
    const {client, runRequest} = buildMockClient();
    attachApiHeadersInterceptor(client, {
      baseURL: 'https://x/',
      secretKey: 'sk',
      requestId: 'r',
      secureStorage: secureStorage as never,
      serverPublicPemBase64: 'EMBEDDED',
      deviceSecurityService: {
        getSnapshot: jest.fn().mockResolvedValue({
          isRootedOrJailbroken: false,
          isEmulator: false,
          isDeveloperModeEnabled: false,
          developerModeSupported: false,
          isDebuggedMode: false,
        }),
      } as never,
    });

    await runRequest({url: '/x'});

    expect(mockedRsa.mock.calls.some(c => c[0] === 'FROM_STORAGE')).toBe(true);
  });

  it('rechaza la petición si el interceptor falla', async () => {
    mockedRsa.mockRejectedValueOnce(new Error('rsa down'));
    const secureStorage = {
      get: jest.fn().mockResolvedValue(''),
      save: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn(),
    };
    const {client, runRequest} = buildMockClient();
    attachApiHeadersInterceptor(client, {
      baseURL: 'https://x/',
      secretKey: 'sk',
      requestId: 'r',
      secureStorage: secureStorage as never,
      serverPublicPemBase64: 'PEM',
      deviceSecurityService: {
        getSnapshot: jest.fn().mockResolvedValue({
          isRootedOrJailbroken: false,
          isEmulator: false,
          isDeveloperModeEnabled: false,
          developerModeSupported: false,
          isDebuggedMode: false,
        }),
      } as never,
    });

    await expect(runRequest({url: '/y'})).rejects.toThrow('rsa down');
  });
});
