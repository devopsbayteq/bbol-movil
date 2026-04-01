import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {ActivityIndicator} from 'react-native';
import {HomeScreen} from '../../../src/presentation/home/HomeScreen';

const mockUseHomeViewModel = jest.fn();

jest.mock('../../../src/presentation/home/useHomeViewModel', () => ({
  useHomeViewModel: () => mockUseHomeViewModel(),
}));

jest.mock('../../../src/providers', () => ({
  useAuth: () => ({user: {name: 'Usuario Demo', email: 'u@b.com'}}),
}));

jest.mock('../../../src/providers/theme', () => ({
  useTheme: () => ({
    colors: require('../../../src/providers/theme/colors').LightColors,
  }),
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const {View} = require('react-native');
  return {
    SafeAreaView: ({children, ...props}: {children: React.ReactNode}) =>
      React.createElement(View, props, children),
  };
});

const emptyBalance = {
  accounts: [] as [],
  creditCards: [] as [],
  loans: [] as [],
  investments: [] as [],
  frequentPayments: [] as [],
};

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('muestra el indicador de carga cuando isLoading es true', async () => {
    mockUseHomeViewModel.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      retry: jest.fn(),
    });

    let root: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      root = ReactTestRenderer.create(<HomeScreen />);
    });

    expect(
      root!.root.findAllByType(ActivityIndicator as never).length,
    ).toBeGreaterThan(0);
  });

  test('muestra error y Reintentar cuando hay fallo', async () => {
    const retry = jest.fn();
    mockUseHomeViewModel.mockReturnValue({
      data: emptyBalance,
      isLoading: false,
      error: 'Error de red',
      retry,
    });

    let root: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      root = ReactTestRenderer.create(<HomeScreen />);
    });

    const flat = JSON.stringify(root!.toJSON());
    expect(flat).toContain('Error de red');
    expect(flat).toContain('Reintentar');
  });

  test('muestra secciones y productos cuando hay datos', async () => {
    mockUseHomeViewModel.mockReturnValue({
      data: {
        accounts: [
          {
            accountGuid: 'a1',
            maskedAccountNumber: '****4242',
            accountKind: 'savings' as const,
            balance: 1500,
          },
        ],
        creditCards: [],
        loans: [],
        investments: [],
        frequentPayments: [
          {beneficiaryName: 'Pago luz', beneficiaryType: 'servicio luz'},
        ],
      },
      isLoading: false,
      error: null,
      retry: jest.fn(),
    });

    let root: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      root = ReactTestRenderer.create(<HomeScreen />);
    });

    const flat = JSON.stringify(root!.toJSON());
    expect(flat).toContain('Mis Productos');
    expect(flat).toContain('Pagos frecuentes');
    expect(flat).toContain('****4242');
    expect(flat).toContain('Pago luz');
  });

  test('muestra mensaje vacío cuando no hay productos en el filtro', async () => {
    mockUseHomeViewModel.mockReturnValue({
      data: emptyBalance,
      isLoading: false,
      error: null,
      retry: jest.fn(),
    });

    let root: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      root = ReactTestRenderer.create(<HomeScreen />);
    });

    expect(JSON.stringify(root!.toJSON())).toContain(
      'No hay productos en esta categoría',
    );
  });
});
