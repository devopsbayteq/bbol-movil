import {DarkColors, LightColors} from '../../../src/providers/theme/colors';
import {
  resolveColors,
  resolveIsDark,
  useThemeStore,
} from '../../../src/providers/theme/useThemeStore';

describe('useThemeStore helpers', () => {
  test('resolveIsDark follows mode and system', () => {
    expect(resolveIsDark('light', false)).toBe(false);
    expect(resolveIsDark('dark', false)).toBe(true);
    expect(resolveIsDark('system', true)).toBe(true);
    expect(resolveIsDark('system', false)).toBe(false);
  });

  test('resolveColors picks palette by boolean', () => {
    expect(resolveColors(false)).toBe(LightColors);
    expect(resolveColors(true)).toBe(DarkColors);
  });
});

describe('useThemeStore actions', () => {
  beforeEach(() => {
    useThemeStore.setState({
      mode: 'system',
      systemIsDark: false,
    });
  });

  test('setMode updates mode', () => {
    useThemeStore.getState().setMode('dark');
    expect(useThemeStore.getState().mode).toBe('dark');
  });

  test('setSystemIsDark updates flag', () => {
    useThemeStore.getState().setSystemIsDark(true);
    expect(useThemeStore.getState().systemIsDark).toBe(true);
  });

  test('toggleTheme switches between light and dark based on resolved appearance', () => {
    useThemeStore.setState({mode: 'dark'});
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().mode).toBe('light');

    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().mode).toBe('dark');
  });

  test('toggleTheme when in system mode uses systemIsDark', () => {
    useThemeStore.setState({mode: 'system', systemIsDark: true});
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().mode).toBe('light');
  });
});
