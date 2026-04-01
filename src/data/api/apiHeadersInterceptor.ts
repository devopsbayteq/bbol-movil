import {AxiosHeaders, AxiosInstance, InternalAxiosRequestConfig} from 'axios';
import DeviceInfo from 'react-native-device-info';
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
  infoFingerprintModelToJson,
  type InfoFingerprintModel,
} from './infoFingerprintModel';

const LOG = 'ApiHeaders/interceptor';

export type ApiHeadersInterceptorDeps = {
  baseURL: string;
  secretKey: string;
  requestId: string;
  secureStorage: SecureStorageService;
  serverPublicPemBase64: string;  
  getDeviceState: () => string;
};

async function buildEncryptedFingerprint(
  serverPublicPemBase64: string,
  getDeviceState: () => string,
): Promise<string> {
  const isEmu = await DeviceInfo.isEmulator();
  const model: InfoFingerprintModel = {
    deviceState: getDeviceState(),
    isRoot: false,
    isDebugger: false,
    isDevelopment: __DEV__,
    isPhysicalDevice: !isEmu,
  };
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
              deps.serverPublicPemBase64,
              deps.secretKey,
            ),
          ),
          buildEncryptedFingerprint(
            deps.serverPublicPemBase64,
            deps.getDeviceState,
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
