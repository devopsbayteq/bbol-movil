import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import type {ReactTestRendererJSON} from 'react-test-renderer';
import {ActivityIndicator} from 'react-native';
import {HomeScreen} from '../../../src/presentation/home/HomeScreen';

const mockUseHomeViewModel = jest.fn();

/** Evita JSON.stringify sobre el árbol (p. ej. RefreshControl puede introducir referencias circulares). */
function renderedText(
  node: ReactTestRendererJSON | ReactTestRendererJSON[] | string | number | null | undefined,
): string {
  if (node == null || typeof node === 'boolean') {
    return '';
  }
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(renderedText).join('');
  }
  if (typeof node === 'object' && node && 'children' in node) {
    return renderedText(
      node.children as ReactTestRendererJSON | ReactTestRendererJSON[],
    );
  }
  return '';
}

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

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useRoute: () => ({params: undefined}),
    useNavigation: () => ({setParams: jest.fn()}),
    useFocusEffect: jest.fn(fn => {
      fn();
    }),
  };
});

jest.mock('react-native-safe-area-context', () => {
  const Rn = require('react');
  const {View} = require('react-native');
  return {
    SafeAreaView: ({children, ...props}: {children: Rn.ReactNode}) =>
      Rn.createElement(View, props, children),
    useSafeAreaInsets: () => ({top: 0, bottom: 0, left: 0, right: 0}),
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
      isRefreshing: false,
      error: null,
      refresh: jest.fn(),
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
      isRefreshing: false,
      error: 'Error de red',
      refresh: jest.fn(),
      retry,
    });

    let root: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      root = ReactTestRenderer.create(<HomeScreen />);
    });

    const flat = renderedText(root!.toJSON());
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
      isRefreshing: false,
      error: null,
      refresh: jest.fn(),
      retry: jest.fn(),
    });

    let root: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      root = ReactTestRenderer.create(<HomeScreen />);
    });

    const flat = renderedText(root!.toJSON());
    expect(flat).toContain('Mis Productos');
    expect(flat).toContain('Pagos frecuentes');
    expect(flat).toContain('****4242');
    expect(flat).toContain('Pago luz');
  });

  test('muestra mensaje vacío cuando no hay productos en el filtro', async () => {
    mockUseHomeViewModel.mockReturnValue({
      data: emptyBalance,
      isLoading: false,
      isRefreshing: false,
      error: null,
      refresh: jest.fn(),
      retry: jest.fn(),
    });

    let root: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      root = ReactTestRenderer.create(<HomeScreen />);
    });

    expect(renderedText(root!.toJSON())).toContain(
      'No hay productos en esta categoría',
    );
  });
});
