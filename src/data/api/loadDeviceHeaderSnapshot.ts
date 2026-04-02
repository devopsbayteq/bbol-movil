import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export interface DeviceHeaderSnapshot {
  platform: string;
  version: string;
  model: string;
  brand: string;
  systemVersion: string;
}

/** Solo caracteres alfanuméricos (paridad Flutter). */
export function alphanumericDeviceField(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '');
}

export async function loadDeviceHeaderSnapshot(): Promise<DeviceHeaderSnapshot> {
  const [version, model, brand, systemVersion] = await Promise.all([
    DeviceInfo.getVersion(),
    DeviceInfo.getModel(),
    DeviceInfo.getBrand(),
    DeviceInfo.getSystemVersion(),
  ]);

  return {
    platform: Platform.OS === 'android' ? 'ANDROID' : 'IOS',
    version,
    model: alphanumericDeviceField(model),
    brand: alphanumericDeviceField(brand),
    systemVersion,
  };
}
