import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {MainTabNavigator} from '../../src/navigation/MainTabNavigator';

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => {
    const React = require('react');
    const {View, Text} = require('react-native');
    return {
      Navigator: ({children}: {children: React.ReactNode}) =>
        React.createElement(View, {testID: 'tab-navigator'}, children),
      Screen: ({
        name,
        component: Comp,
        options,
      }: {
        name: string;
        component: React.ComponentType;
        options?: {title?: string};
      }) =>
        React.createElement(
          View,
          {key: name, testID: `tab-screen-${name}`},
          React.createElement(Text, null, options?.title ?? name),
          Comp ? React.createElement(Comp) : null,
        ),
    };
  },
}));

jest.mock('../../src/presentation/home/HomeScreen', () => {
  const React = require('react');
  const {Text} = require('react-native');
  return {
    HomeScreen: () =>
      React.createElement(Text, {testID: 'screen-home'}, 'HomeScreen'),
  };
});

jest.mock('../../src/navigation/TransferStackNavigator', () => {
  const React = require('react');
  const {Text} = require('react-native');
  return {
    TransferStackNavigator: () =>
      React.createElement(Text, {testID: 'screen-transfer-stack'}, 'TransferStack'),
  };
});

jest.mock('../../src/presentation/transactions/TransactionsScreen', () => {
  const React = require('react');
  const {Text} = require('react-native');
  return {
    TransactionsScreen: () =>
      React.createElement(Text, {testID: 'screen-movements'}, 'Movements'),
  };
});

jest.mock('../../src/providers/theme', () => ({
  useTheme: () => ({
    colors: require('../../src/providers/theme/colors').LightColors,
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({top: 0, bottom: 8, left: 0, right: 0}),
}));

describe('MainTabNavigator', () => {
  test('renderiza el navegador de pestañas con títulos y pantallas simuladas', async () => {
    let root: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      root = ReactTestRenderer.create(<MainTabNavigator />);
    });

    const tree = root!.root;
    expect(tree.findByProps({testID: 'tab-navigator'})).toBeTruthy();
    expect(tree.findByProps({testID: 'screen-home'})).toBeTruthy();
    expect(tree.findByProps({testID: 'screen-transfer-stack'})).toBeTruthy();
    expect(tree.findByProps({testID: 'screen-movements'})).toBeTruthy();

    const flat = JSON.stringify(root!.toJSON());
    expect(flat).toContain('Inicio');
    expect(flat).toContain('Transferir');
    expect(flat).toContain('Movimientos');
  });
});
