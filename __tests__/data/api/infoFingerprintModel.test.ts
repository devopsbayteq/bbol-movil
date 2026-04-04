import {
  buildInfoFingerprintModelFromSnapshot,
  encodeDeviceState,
  infoFingerprintModelToJson,
} from '../../../src/data/api/infoFingerprintModel';
import type {DeviceSecuritySnapshot} from '../../../src/domain/entities/DeviceSecuritySnapshot';

describe('infoFingerprintModel', () => {
  const baseSnapshot: DeviceSecuritySnapshot = {
    isRootedOrJailbroken: false,
    isEmulator: false,
    isDeveloperModeEnabled: false,
    developerModeSupported: true,
    isDebuggedMode: false,
  };

  test('encodeDeviceState encodes flags', () => {
    expect(encodeDeviceState(baseSnapshot)).toBe(
      'root:0|emu:0|devopt:0|dbg:0|devsup:1',
    );
    expect(
      encodeDeviceState({
        ...baseSnapshot,
        isRootedOrJailbroken: true,
        isEmulator: true,
        isDeveloperModeEnabled: true,
        isDebuggedMode: true,
        developerModeSupported: false,
      }),
    ).toBe('root:1|emu:1|devopt:1|dbg:1|devsup:0');
  });

  test('buildInfoFingerprintModelFromSnapshot maps fields', () => {
    const m = buildInfoFingerprintModelFromSnapshot({
      ...baseSnapshot,
      isRootedOrJailbroken: true,
      isEmulator: true,
      isDebuggedMode: true,
    });
    expect(m.isRoot).toBe(true);
    expect(m.isPhysicalDevice).toBe(false);
    expect(m.isDebugger).toBe(true);
    expect(m.isDeveloperModeEnabled).toBe(false);
    expect(m.deviceState).toContain('root:1');
  });

  test('infoFingerprintModelToJson includes isDeveloperModeEnabled', () => {
    const json = infoFingerprintModelToJson({
      deviceState: 'root:0|emu:0',
      isRoot: false,
      isDebugger: false,
      isDevelopment: false,
      isPhysicalDevice: true,
      isDeveloperModeEnabled: true,
    });
    const parsed = JSON.parse(json) as Record<string, unknown>;
    expect(parsed.isDeveloperModeEnabled).toBe(true);
  });
});
