export interface InfoFingerprintModel {
  deviceState: string;
  isRoot: boolean;
  isDebugger: boolean;
  isDevelopment: boolean;
  isPhysicalDevice: boolean;
}

export function infoFingerprintModelToJson(model: InfoFingerprintModel): string {
  return JSON.stringify({
    deviceState: model.deviceState,
    isRoot: model.isRoot,
    isDebugger: model.isDebugger,
    isDevelopment: model.isDevelopment,
    isPhysicalDevice: model.isPhysicalDevice,
  });
}
