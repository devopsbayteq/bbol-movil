import {DeviceSecurityServiceImpl} from '../../../src/data/services/DeviceSecurityServiceImpl';
import DeviceInfo from 'react-native-device-info';
import JailMonkey from 'jail-monkey';

jest.mock('react-native-device-info');
jest.mock('jail-monkey', () => ({
  __esModule: true,
  default: {
    isJailBroken: jest.fn(() => false),
    isDevelopmentSettingsMode: jest.fn(() => Promise.resolve(true)),
    isDebuggedMode: jest.fn(() => Promise.resolve(false)),
  },
}));

describe('DeviceSecurityServiceImpl', () => {
  beforeEach(() => {
    jest.mocked(DeviceInfo.isEmulator).mockResolvedValue(true);
    jest.mocked(JailMonkey.isJailBroken).mockReturnValue(true);
    jest.mocked(JailMonkey.isDevelopmentSettingsMode).mockResolvedValue(false);
    jest.mocked(JailMonkey.isDebuggedMode).mockResolvedValue(true);
  });

  test('getSnapshot aggregates native signals', async () => {
    const svc = new DeviceSecurityServiceImpl();
    const s = await svc.getSnapshot();
    expect(s.isEmulator).toBe(true);
    expect(s.isRootedOrJailbroken).toBe(true);
    expect(s.isDeveloperModeEnabled).toBe(false);
    expect(s.isDebuggedMode).toBe(true);
  });
});
