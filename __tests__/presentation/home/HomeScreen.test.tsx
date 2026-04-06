import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import type {ReactTestRendererJSON} from 'react-test-renderer';
import {ActivityIndicator, RefreshControl, Text, TouchableOpacity} from 'react-native';
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

jest.mock('../../../src/providers', () => {
  const {LightColors} = require('../../../src/providers/theme/colors');
  return {
    useAuth: () => ({user: {name: 'Usuario Demo', email: 'u@b.com'}}),
    useTheme: () => ({colors: LightColors}),
  };
});

const mockSetParams = jest.fn();
const mockNavigate = jest.fn();
const mockUseRoute = jest.fn(() => ({params: undefined as {refreshHome?: number} | undefined}));

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useRoute: () => mockUseRoute(),
    useNavigation: () => ({setParams: mockSetParams, navigate: mockNavigate}),
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
    mockUseRoute.mockReturnValue({params: undefined});
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
    expect(flat).toContain('Cuentas');
    expect(flat).toContain('Pagos frecuentes');
    expect(flat).toContain('****4242');
    expect(flat).toContain('Pago luz');
  });

  test('refreshHome en params dispara refresh y limpia el parámetro', async () => {
    const refresh = jest.fn().mockResolvedValue(undefined);
    mockUseRoute.mockReturnValue({params: {refreshHome: 42}});
    mockUseHomeViewModel.mockReturnValue({
      data: emptyBalance,
      isLoading: false,
      isRefreshing: false,
      error: null,
      refresh,
      retry: jest.fn(),
    });

    await act(async () => {
      ReactTestRenderer.create(<HomeScreen />);
    });

    expect(refresh).toHaveBeenCalled();
    expect(mockSetParams).toHaveBeenCalledWith({refreshHome: undefined});
  });

  test('muestra tarjetas de crédito en filtro Tarjetas', async () => {
    mockUseHomeViewModel.mockReturnValue({
      data: {
        accounts: [],
        creditCards: [
          {
            maskedCardNumber: '****9999',
            totalDue: 50,
            maxPaymentDate: '2026-05-01',
          },
        ],
        loans: [],
        investments: [],
        frequentPayments: [],
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

    expect(renderedText(root!.toJSON())).toContain('Cuentas');

    const tarjetasTab = root!.root
      .findAllByType(TouchableOpacity as never)
      .find(inst => {
        try {
          return inst.findByType(Text as never).props.children === 'Tarjetas';
        } catch {
          return false;
        }
      });
    expect(tarjetasTab).toBeDefined();

    await act(async () => {
      tarjetasTab!.props.onPress();
    });

    expect(renderedText(root!.toJSON())).toContain('****9999');
  });

  test('Reintentar llama a retry del view model', async () => {
    const retry = jest.fn();
    mockUseHomeViewModel.mockReturnValue({
      data: emptyBalance,
      isLoading: false,
      isRefreshing: false,
      error: 'fallo',
      refresh: jest.fn(),
      retry,
    });

    let root: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      root = ReactTestRenderer.create(<HomeScreen />);
    });

    const retryBtn = root!.root
      .findAllByType(TouchableOpacity as never)
      .find(t => {
        try {
          return t.findByType(Text as never).props.children === 'Reintentar';
        } catch {
          return false;
        }
      });
    expect(retryBtn).toBeDefined();
    await act(async () => {
      retryBtn!.props.onPress();
    });
    expect(retry).toHaveBeenCalled();
  });

  test('pull-to-refresh invoca refresh', async () => {
    const refresh = jest.fn();
    mockUseHomeViewModel.mockReturnValue({
      data: emptyBalance,
      isLoading: false,
      isRefreshing: true,
      error: null,
      refresh,
      retry: jest.fn(),
    });

    let root: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      root = ReactTestRenderer.create(<HomeScreen />);
    });

    const rc = root!.root.findByType(RefreshControl as never);
    await act(async () => {
      rc.props.onRefresh();
    });
    expect(refresh).toHaveBeenCalled();
  });

  test('muestra préstamos en filtro Préstamos', async () => {
    mockUseHomeViewModel.mockReturnValue({
      data: {
        accounts: [],
        creditCards: [],
        loans: [
          {
            loanGuid: 'lg1',
            outstandingBalance: 1000,
            nextInstallmentAmount: 50,
            nextInstallmentDate: '2026-06-01',
          },
        ],
        investments: [],
        frequentPayments: [],
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

    const prestamosTab = root!.root
      .findAllByType(TouchableOpacity as never)
      .find(inst => {
        try {
          return inst.findByType(Text as never).props.children === 'Préstamos';
        } catch {
          return false;
        }
      });
    expect(prestamosTab).toBeDefined();
    await act(async () => {
      prestamosTab!.props.onPress();
    });
    const flat = renderedText(root!.toJSON());
    expect(flat).toContain('Préstamo');
    expect(flat).toContain('Saldo pendiente');
    expect(flat).toMatch(/1[.,\s]000/);
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
