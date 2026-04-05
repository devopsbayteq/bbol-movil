import {AxiosHeaders, AxiosInstance, InternalAxiosRequestConfig} from 'axios';
import {devLog} from './devLog';
import {generateHMacForContentHeaderFromAxios} from '../../security/http/generateHMacContentHeader';
import {rsaOaepEncryptUtf8MaterialPemBase64ToDoubleBase64} from '../../security/certificate/rsaUtils';
import type {SecureStorageService} from '../../domain/services/SecureStorageService';
import {SecureStorageKeys} from '../datasources/storage/SecureStorageKeys';
import {ensureDeviceId} from '../bootstrap/ensureDeviceId';
import {
  loadDeviceHeaderSnapshot,
  type DeviceHeaderSnapshot,
} from './loadDeviceHeaderSnapshot';
import {
  buildInfoFingerprintModelFromSnapshot,
  infoFingerprintModelToJson,
} from './infoFingerprintModel';
import type {DeviceSecurityService} from '../../domain/services/DeviceSecurityService';

const LOG = 'ApiHeaders/interceptor';

/** Misma ruta que `SecurityRemoteDataSource.getPublicKey` — ahí aún no aplica enviar huella cifrada. */
const PUBLIC_KEY_PATH_SEGMENT = 'Security/public-key';

function isPublicKeyRequest(config: InternalAxiosRequestConfig): boolean {
  const pathOnly = (config.url ?? '').split('?')[0] ?? '';
  if (pathOnly.includes(PUBLIC_KEY_PATH_SEGMENT)) {
    return true;
  }
  const absolute = `${config.baseURL ?? ''}${pathOnly}`;
  return absolute.includes(PUBLIC_KEY_PATH_SEGMENT);
}

export type ApiHeadersInterceptorDeps = {
  baseURL: string;
  secretKey: string;
  requestId: string;
  secureStorage: SecureStorageService;
  /**
   * Clave pública embebida (bootstrap). Si ya existe la guardada por
   * `GetPublicKeyUseCase` en `SecureStorageKeys.SERVER_PUBLIC_KEY`, se usa esa
   * — misma fuente que `LoginUseCase` tras `getPublicKeyUseCase.execute()`.
   */
  serverPublicPemBase64: string;
  deviceSecurityService: DeviceSecurityService;
};

/** Misma lógica de material que el login: PEM del servicio persistido, o fallback embebido. */
async function resolveServerPublicKeyPemBase64ForHeaders(
  secureStorage: SecureStorageService,
  embeddedFallbackPemBase64: string,
): Promise<string> {
  const stored = await secureStorage.get(SecureStorageKeys.SERVER_PUBLIC_KEY);
  const trimmed = stored?.trim() ?? '';
  if (trimmed) {
    return trimmed;
  }
  return embeddedFallbackPemBase64;
}

/**
 * Cifrado del fingerprint: mismo esquema que `X-Secret` y que las credenciales en
 * `LoginUseCase` (RSA-OAEP SHA-1 + doble Base64 con la clave pública del servicio);
 * el texto plano es el JSON UTF-8 del modelo de huella.
 */
async function buildEncryptedFingerprint(
  serverPublicPemBase64: string,
  deviceSecurityService: DeviceSecurityService,
): Promise<string> {
  const snapshot = await deviceSecurityService.getSnapshot();
  const model = buildInfoFingerprintModelFromSnapshot(snapshot);
  const json = infoFingerprintModelToJson(model);
  return rsaOaepEncryptUtf8MaterialPemBase64ToDoubleBase64(
    serverPublicPemBase64,
    json,
  );
}

export function attachApiHeadersInterceptor(
  client: AxiosInstance,
  deps: ApiHeadersInterceptorDeps,
): void {
  let snapshotPromise: Promise<DeviceHeaderSnapshot> | null = null;
  const loadSnapshot = (): Promise<DeviceHeaderSnapshot> => {
    if (!snapshotPromise) {
      snapshotPromise = loadDeviceHeaderSnapshot();
    }
    return snapshotPromise;
  };

  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        config.baseURL = deps.baseURL;
        const timeStamp = String(Math.floor(Date.now() / 1000));
        const skipFingerprint = isPublicKeyRequest(config);

        const serverPublicKeyPemBase64 =
          await resolveServerPublicKeyPemBase64ForHeaders(
            deps.secureStorage,
            deps.serverPublicPemBase64,
          );

        const [
          authorization,
          deviceId,          
          xSecret,
          xFingerPrint,
          snapshot,
        ] = await Promise.all([
          deps.secureStorage
            .get(SecureStorageKeys.AUTH_TOKEN)
            .then(t => t ?? ''),
          ensureDeviceId(deps.secureStorage),
          
          Promise.resolve(
            rsaOaepEncryptUtf8MaterialPemBase64ToDoubleBase64(
              serverPublicKeyPemBase64,
              deps.secretKey,
            ),
          ),
          skipFingerprint
            ? Promise.resolve('')
            : buildEncryptedFingerprint(
                serverPublicKeyPemBase64,
                deps.deviceSecurityService,
              ),
          loadSnapshot(),
        ]);

        const xContent = generateHMacForContentHeaderFromAxios(
          deps.secretKey,
          timeStamp,
          config,
        );

        
        const headers = AxiosHeaders.from(config.headers ?? {});

        const set = (key: string, value: string) => {
          headers.set(key, value);
        };

        set('Authorization', 'Bearer ' + authorization);
        set('X-Platform', snapshot.platform);
        set('X-Version', snapshot.version);
        set('X-Device', deviceId);
        set('X-Model', snapshot.model);
        set('X-SystemOperationVersion', snapshot.systemVersion);
        set('X-Brand', snapshot.brand);
        set('X-Content', xContent);
        set('X-Time', timeStamp);
        set('X-Secret', xSecret);            
        set('X-FingerPrint', xFingerPrint);
        set('X-RequestId', deps.requestId);                
        config.headers = headers;
        return config;
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        devLog(LOG, 'request interceptor failed', {message});
        return Promise.reject(e instanceof Error ? e : new Error(message));
      }
    },
    error => Promise.reject(error),
  );
}
