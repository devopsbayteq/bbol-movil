import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {AppNavigator} from '../../src/navigation/AppNavigator';

jest.mock('react-native-screenguard', () => ({
  __esModule: true,
  default: {},
  useSGScreenRecord: () => ({status: 'off'}),
}));

const mockUseAuth = jest.fn();
const mockUseSecurity = jest.fn();

jest.mock('../../src/providers', () => ({
  useAuth: () => mockUseAuth(),
  useSecurity: () => mockUseSecurity(),
  useTheme: () => ({colors: {primary: '#000', textPrimary: '#111', white: '#fff'}}),
}));

jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');
  const {View, Text} = require('react-native');
  return {
    createNativeStackNavigator: () => ({
      Navigator: ({children}: {children: React.ReactNode}) =>
        React.createElement(View, {testID: 'root-stack'}, children),
      Screen: ({
        name,
        component: Comp,
      }: {
        name: string;
        component: React.ComponentType;
      }) =>
        React.createElement(
          View,
          {key: name, testID: `stack-screen-${name}`},
          React.createElement(Text, null, name),
          Comp ? React.createElement(Comp) : null,
        ),
    }),
  };
});

jest.mock('../../src/navigation/MainTabNavigator', () => {
  const React = require('react');
  const {Text} = require('react-native');
  return {
    MainTabNavigator: () =>
      React.createElement(Text, {testID: 'main-tab-mock'}, 'Main'),
  };
});

jest.mock('../../src/presentation/auth/LoginScreen', () => {
  const React = require('react');
  const {Text} = require('react-native');
  return {
    LoginScreen: () =>
      React.createElement(Text, {testID: 'login-mock'}, 'Login'),
  };
});

jest.mock('../../src/presentation/otp', () => {
  const React = require('react');
  const {Text} = require('react-native');
  return {
    OtpValidationScreen: () =>
      React.createElement(Text, {testID: 'otp-mock'}, 'Otp'),
  };
});

jest.mock('../../src/presentation/auth/RegisterAliasScreen', () => {
  const React = require('react');
  const {Text} = require('react-native');
  return {
    RegisterAliasScreen: () =>
      React.createElement(Text, {testID: 'register-alias-mock'}, 'RegisterAlias'),
  };
});

jest.mock('../../src/presentation/auth/BiometricOfferScreen', () => {
  const React = require('react');
  const {Text} = require('react-native');
  return {
    BiometricOfferScreen: () =>
      React.createElement(Text, {testID: 'bio-mock'}, 'Bio'),
  };
});

jest.mock('../../src/presentation/securityMenu/SecurityMenuScreen', () => {
  const React = require('react');
  const {Text} = require('react-native');
  return {
    SecurityMenuScreen: () =>
      React.createElement(Text, {testID: 'security-menu-mock'}, 'SecurityMenu'),
  };
});

jest.mock('../../src/presentation/splash', () => {
  const React = require('react');
  const {View, Text} = require('react-native');
  return {
    SplashScreen: () =>
      React.createElement(Text, {testID: 'splash-mock'}, 'Splash'),
    PublicKeyErrorScreen: ({message}: {message: string}) =>
      React.createElement(
        View,
        {testID: 'public-key-error'},
        React.createElement(Text, null, message),
      ),
  };
});

describe('AppNavigator', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });
    mockUseSecurity.mockReturnValue({
      publicKey: 'pk',
      isLoading: false,
      error: null as string | null,
      retry: jest.fn(),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('muestra error de clave pública cuando falla la carga y no hay clave', async () => {
    mockUseSecurity.mockReturnValue({
      publicKey: null,
      isLoading: false,
      error: 'sin red',
      retry: jest.fn(),
    });

    let root: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      root = ReactTestRenderer.create(<AppNavigator />);
    });

    expect(root!.root.findByProps({testID: 'public-key-error'})).toBeTruthy();
    expect(JSON.stringify(root!.toJSON())).toContain('sin red');
  });

  test('muestra Splash mientras carga la clave pública', async () => {
    mockUseSecurity.mockReturnValue({
      publicKey: null,
      isLoading: true,
      error: null,
      retry: jest.fn(),
    });

    let root: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      root = ReactTestRenderer.create(<AppNavigator />);
    });

    expect(root!.root.findByProps({testID: 'splash-mock'})).toBeTruthy();
  });

  test('tras el timer de splash y sin sesión, muestra stack de login', async () => {
    let root: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      root = ReactTestRenderer.create(<AppNavigator />);
    });

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    expect(root!.root.findByProps({testID: 'root-stack'})).toBeTruthy();
    expect(root!.root.findByProps({testID: 'login-mock'})).toBeTruthy();
    expect(root!.root.findByProps({testID: 'register-alias-mock'})).toBeTruthy();
    expect(root!.root.findAllByProps({testID: 'stack-screen-Login'}).length).toBeGreaterThan(
      0,
    );
  });

  test('con sesión autenticada muestra Main', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    let root: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      root = ReactTestRenderer.create(<AppNavigator />);
    });

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    expect(root!.root.findByProps({testID: 'main-tab-mock'})).toBeTruthy();
  });

  test('mantiene Splash si auth aún está cargando', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    let root: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      root = ReactTestRenderer.create(<AppNavigator />);
    });

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    expect(root!.root.findByProps({testID: 'splash-mock'})).toBeTruthy();
  });
});
