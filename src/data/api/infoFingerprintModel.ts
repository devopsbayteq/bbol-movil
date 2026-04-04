import type {DeviceSecuritySnapshot} from '../../domain/entities/DeviceSecuritySnapshot';

export interface InfoFingerprintModel {
  deviceState: string;
  isRoot: boolean;
  isDebugger: boolean;
  isDevelopment: boolean;
  isPhysicalDevice: boolean;
  /** Opciones de desarrollador del sistema (Android); en iOS suele ser false. */
  isDeveloperModeEnabled: boolean;
}

/** Codificación estable para auditoría / backend (flags separados por |). */
export function encodeDeviceState(snapshot: DeviceSecuritySnapshot): string {
  return [
    `root:${snapshot.isRootedOrJailbroken ? 1 : 0}`,
    `emu:${snapshot.isEmulator ? 1 : 0}`,
    `devopt:${snapshot.isDeveloperModeEnabled ? 1 : 0}`,
    `dbg:${snapshot.isDebuggedMode ? 1 : 0}`,
    `devsup:${snapshot.developerModeSupported ? 1 : 0}`,
  ].join('|');
}

export function buildInfoFingerprintModelFromSnapshot(
  snapshot: DeviceSecuritySnapshot,
): InfoFingerprintModel {
  return {
    deviceState: encodeDeviceState(snapshot),
    isRoot: snapshot.isRootedOrJailbroken,
    isDebugger: snapshot.isDebuggedMode,
    isDevelopment: __DEV__,
    isPhysicalDevice: !snapshot.isEmulator,
    isDeveloperModeEnabled: snapshot.isDeveloperModeEnabled,
  };
}

export function infoFingerprintModelToJson(model: InfoFingerprintModel): string {
  return JSON.stringify({
    deviceState: model.deviceState,
    isRoot: model.isRoot,
    isDebugger: model.isDebugger,
    isDevelopment: model.isDevelopment,
    isPhysicalDevice: model.isPhysicalDevice,
    isDeveloperModeEnabled: model.isDeveloperModeEnabled,
  });
}
