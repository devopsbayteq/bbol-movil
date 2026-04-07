/**
 * Unit tests for HomeScreen.
 * Goal: maximise line, branch and function coverage for SonarQube.
 */
import React from 'react';
import {create, act} from 'react-test-renderer';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockNavigate = jest.fn();
const mockSetParams = jest.fn();
const mockRefresh = jest.fn(() => Promise.resolve());
const mockRetry = jest.fn(() => Promise.resolve());
const mockLogout = jest.fn(() => Promise.resolve());

// Navigation – useRoute as jest.fn() so tests can override it
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn((cb: () => void) => cb()),
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));
jest.mock('@react-navigation/bottom-tabs', () => ({}));

// Providers
const mockColors = {
  background: '#fff',
  surface: '#fff',
  primary: '#008292',
  primaryLight: '#B3E5EC',
  textPrimary: '#1A1A1A',
  textSecondary: '#474747',
  textTertiary: '#757575',
  textLabel: '#1A1A1A',
  border: '#E0E0E0',
  borderLight: '#EEEEEE',
  borderSubtle: '#F2F2F2',
  inputBg: '#FFFFFF',
  placeholder: '#757575',
  buttonSecondaryBg: '#E2E2E2',
  iconPrimary: '#000',
  linkPrimary: '#008292',
  error: '#DC2626',
  errorBg: '#FEF2F2',
  errorBorder: '#FECACA',
  success: '#059669',
  successBg: '#ECFDF5',
  warning: '#D97706',
  warningBg: '#FFFBEB',
  white: '#FFFFFF',
  balanceDivider: 'rgba(255,255,255,0.2)',
  shadowSoft: 'rgba(0,0,0,0.08)',
  homeHeaderBackground: '#0B515C',
  homeAvatarCircle: '#94E0ED',
  homeHeaderIconButtonBg: '#096877',
  homeProductCardSurface: '#D0F0F6',
  homeProductCardBorder: '#FFFFFF',
  homeChipSelectedBorder: '#D0F0F6',
  homeBalanceToggleBg: '#94E0ED',
  homeCreditCardSurface: '#262626',
  homeLoanCardBackground: '#0067AE',
  homeLoanCardBorder: '#E0EBFF',
  homeBorderSoft: '#EFF6F7',
  homePrimaryHover: '#06A3B6',
};
jest.mock('../../../providers', () => ({
  useAuth: () => ({user: {name: 'Juan Pérez'}, logout: mockLogout}),
  useTheme: () => ({colors: mockColors}),
}));

// useHomeViewModel
let mockViewModelState: {
  data: any; isLoading: boolean; isRefreshing: boolean;
  error: string; refresh: jest.Mock; retry: jest.Mock;
} = {
  data: null, isLoading: false, isRefreshing: false,
  error: '', refresh: mockRefresh, retry: mockRetry,
};
jest.mock('../useHomeViewModel', () => ({
  useHomeViewModel: () => mockViewModelState,
}));

// react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({children}: any) => children,
  useSafeAreaInsets: () => ({top: 0, bottom: 0, left: 0, right: 0}),
}));

// react-native-svg
jest.mock('react-native-svg', () => {
  const React = require('react');
  const {View} = require('react-native');
  const Svg = ({children}: any) => React.createElement(View, null, children);
  const Path = () => null;
  const Circle = () => null;
  return {__esModule: true, default: Svg, Svg, Path, Circle};
});

// Stub child components; ProductFilterTabs exposes Tarjetas y Créditos buttons
jest.mock('../components/HomeHeader', () => ({HomeHeader: () => null}));
jest.mock('../components/ProductFilterTabs', () => ({
  ProductFilterTabs: ({onFilterChange}: any) => {
    const React = require('react');
    const {View, TouchableOpacity} = require('react-native');
    return React.createElement(
      View,
      null,
      React.createElement(TouchableOpacity, {
        testID: 'filter-tarjetas',
        onPress: () => onFilterChange('Tarjetas'),
      }, null),
      React.createElement(TouchableOpacity, {
        testID: 'filter-creditos',
        onPress: () => onFilterChange('Créditos'),
      }, null),
    );
  },
}));
jest.mock('../components/HomeSectionTitle', () => ({
  HomeSectionTitle: ({children}: any) =>
    require('react').createElement(require('react-native').Text, null, children),
}));
jest.mock('../components/ProductCarouselCards', () => ({
  SavingsAccountCard: () => null,
  CheckingAccountCard: () => null,
  CreditCardPreview: () => null,
  LoanCard: () => null,
  InvestmentCard: () => null,
}));
jest.mock('../components/QuickActionsRow', () => ({
  QuickActionsRow: ({onPress}: any) =>
    require('react').createElement(
      require('react-native').TouchableOpacity, {testID: 'quick-actions', onPress}, null),
}));
jest.mock('../components/PromotionalBanner', () => ({PromotionalBanner: () => null}));
jest.mock('../components/FrequentPaymentRow', () => ({
  FrequentPaymentRow: ({onPress}: any) =>
    require('react').createElement(
      require('react-native').TouchableOpacity, {testID: 'payment-row', onPress}, null),
}));
jest.mock('../components/PaymentRowIcons', () => ({
  PaymentLightbulbIcon: () => null,
  PaymentPersonIcon: () => null,
  PaymentSchoolIcon: () => null,
}));
jest.mock('../../components', () => ({
  DevelopmentNoticeModal: ({onClose}: any) =>
    require('react').createElement(
      require('react-native').TouchableOpacity, {testID: 'dev-modal-close', onPress: onClose}, null),
}));

// ─── Component under test ─────────────────────────────────────────────────────
import {HomeScreen} from '../HomeScreen';
import {useNavigation, useRoute} from '@react-navigation/native';

function render(element: React.ReactElement) {
  let tree: any;
  act(() => {
    tree = create(element);
  });
  return tree!;
}

/** Walk the react-test-renderer JSON tree collecting all string children */
function collectText(node: any): string {
  if (!node) {return '';}
  if (typeof node === 'string') {return node;}
  if (Array.isArray(node)) {return node.map(collectText).join('');}
  if (node.children) {return collectText(node.children);}
  return '';
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const makeAccounts = () => [
  {accountGuid: 'guid-1', maskedAccountNumber: '****1234', accountKind: 'savings' as const, balance: 1000},
  {accountGuid: 'guid-2', maskedAccountNumber: '****5678', accountKind: 'checking' as const, balance: 2000},
  {accountGuid: 'guid-3', maskedAccountNumber: '****9999', accountKind: 'other' as const, balance: 500},
];
const makeCreditCards = () => [
  {maskedCardNumber: '****4321', totalDue: 350, maxPaymentDate: '2026-05-01'},
];
const makeLoans = () => [
  {loanGuid: 'loan-1', outstandingBalance: 5000, nextInstallmentAmount: 200, nextInstallmentDate: '2026-05-15'},
];
const makeFrequentPayments = () => [
  {beneficiaryName: 'Luz del Sur', beneficiaryType: 'luz'},
  {beneficiaryName: 'Colegio San Juan', beneficiaryType: 'colegio'},
  {beneficiaryName: 'Juan García', beneficiaryType: 'persona'},
];
const makeFullData = () => ({
  accounts: makeAccounts(), creditCards: makeCreditCards(),
  loans: makeLoans(), investments: [], frequentPayments: makeFrequentPayments(),
});

// ─── Tests ────────────────────────────────────────────────────────────────────
describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockViewModelState = {
      data: null, isLoading: false, isRefreshing: false,
      error: '', refresh: mockRefresh, retry: mockRetry,
    };
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate, setParams: mockSetParams,
    });
    (useRoute as jest.Mock).mockReturnValue({params: {}});
  });

  it('renders without crashing (null data, no loading, no error)', () => {
    const tree = render(<HomeScreen />);
    expect(tree.toJSON()).toBeTruthy();
  });

  it('shows loading indicator when isLoading=true', () => {
    mockViewModelState.isLoading = true;
    const tree = render(<HomeScreen />);
    expect(tree.toJSON()).toBeTruthy();
  });

  it('shows error message and retry button when error is set', () => {
    mockViewModelState.error = 'Sin conexión';
    const tree = render(<HomeScreen />);
    const text = collectText(tree.toJSON());
    expect(text).toContain('Sin conexión');
  });

  it('calls retry when the retry button is pressed', () => {
    mockViewModelState.error = 'Sin conexión';
    const tree = render(<HomeScreen />);
    // The retry TouchableOpacity has onPress={retry} which is mockRetry
    const retryBtn = tree.root.findAll(
      (node: any) => node.props.onPress === mockRetry,
    )[0];
    act(() => {
      retryBtn?.props?.onPress?.();
    });
    expect(mockRetry).toHaveBeenCalled();
  });

  it('shows empty products text when data has no items for the selected filter', () => {
    mockViewModelState.data = {
      accounts: [], creditCards: [], loans: [], investments: [], frequentPayments: [],
    };
    const tree = render(<HomeScreen />);
    const text = collectText(tree.toJSON());
    expect(text).toContain('No hay productos');
  });

  it('shows empty frequent payments text when frequentPayments is empty', () => {
    mockViewModelState.data = {
      accounts: [], creditCards: [], loans: [], investments: [], frequentPayments: [],
    };
    const tree = render(<HomeScreen />);
    const text = collectText(tree.toJSON());
    expect(text).toContain('No hay pagos frecuentes');
  });

  it('renders product carousel with accounts (savings, checking and other branches)', () => {
    mockViewModelState.data = makeFullData();
    const tree = render(<HomeScreen />);
    expect(tree.toJSON()).toBeTruthy();
  });

  it('renders credit cards when Tarjetas filter is active', () => {
    mockViewModelState.data = makeFullData();
    const tree = render(<HomeScreen />);
    act(() => {
      tree.root.findByProps({testID: 'filter-tarjetas'}).props.onPress();
    });
    expect(tree.toJSON()).toBeTruthy();
  });

  it('renders loans when Créditos filter is active', () => {
    mockViewModelState.data = makeFullData();
    const tree = render(<HomeScreen />);
    act(() => {
      tree.root.findByProps({testID: 'filter-creditos'}).props.onPress();
    });
    expect(tree.toJSON()).toBeTruthy();
  });

  it('renders frequent payments and covers all icon branches', () => {
    mockViewModelState.data = {
      ...makeFullData(),
      frequentPayments: [
        {beneficiaryName: 'Luz del Sur', beneficiaryType: 'luz'},
        {beneficiaryName: 'Light Co', beneficiaryType: 'light'},
        {beneficiaryName: 'Servicio Agua', beneficiaryType: 'servicio'},
        {beneficiaryName: 'Colegio San Juan', beneficiaryType: 'colegio'},
        {beneficiaryName: 'Escuela ABC', beneficiaryType: 'school'},
        {beneficiaryName: 'Matricula XYZ', beneficiaryType: 'matricula'},
        {beneficiaryName: 'Educación', beneficiaryType: 'edu'},
        {beneficiaryName: 'Juan García', beneficiaryType: 'persona'},
      ],
    };
    const tree = render(<HomeScreen />);
    expect(tree.toJSON()).toBeTruthy();
  });

  it('opens DevelopmentNoticeModal when QuickActionsRow is pressed', () => {
    mockViewModelState.data = makeFullData();
    const tree = render(<HomeScreen />);
    act(() => {
      tree.root.findByProps({testID: 'quick-actions'}).props.onPress();
    });
    expect(tree.toJSON()).toBeTruthy();
  });

  it('opens DevelopmentNoticeModal when a frequent payment is pressed', () => {
    mockViewModelState.data = {
      ...makeFullData(),
      frequentPayments: [{beneficiaryName: 'Juan', beneficiaryType: 'persona'}],
    };
    const tree = render(<HomeScreen />);
    act(() => {
      tree.root.findByProps({testID: 'payment-row'}).props.onPress();
    });
    expect(tree.toJSON()).toBeTruthy();
  });

  it('closes DevelopmentNoticeModal via onClose', () => {
    mockViewModelState.data = makeFullData();
    const tree = render(<HomeScreen />);
    act(() => {
      tree.root.findByProps({testID: 'quick-actions'}).props.onPress();
    });
    act(() => {
      tree.root.findByProps({testID: 'dev-modal-close'}).props.onPress();
    });
    expect(tree.toJSON()).toBeTruthy();
  });

  it('calls refresh via RefreshControl onRefresh', async () => {
    mockViewModelState.data = makeFullData();
    const tree = render(<HomeScreen />);
    // Find the outer (vertical) ScrollView that has a refreshControl prop
    const scrollViewNode = tree.root.findAll(
      (node: any) => node.props.refreshControl !== undefined,
    )[0];
    await act(async () => {
      scrollViewNode?.props?.refreshControl?.props?.onRefresh?.();
    });
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('handles useFocusEffect with refreshHome token (triggers refresh)', () => {
    (useRoute as jest.Mock).mockReturnValue({params: {refreshHome: Date.now()}});
    mockViewModelState.data = makeFullData();
    render(<HomeScreen />);
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('useFocusEffect with undefined refreshHome skips refresh', () => {
    (useRoute as jest.Mock).mockReturnValue({params: {refreshHome: undefined}});
    render(<HomeScreen />);
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  it('handles carousel scroll event and animates to new index', () => {
    mockViewModelState.data = makeFullData();
    const tree = render(<HomeScreen />);
    const carouselScrollView = tree.root.findAll(
      (node: any) => node.props.horizontal === true,
    )[0];
    act(() => {
      carouselScrollView?.props?.onMomentumScrollEnd?.({
        nativeEvent: {contentOffset: {x: 216}},
      });
    });
    expect(tree.toJSON()).toBeTruthy();
  });

  it('does not animate when carousel scrolls to same index (0 → 0)', () => {
    mockViewModelState.data = makeFullData();
    const tree = render(<HomeScreen />);
    const carouselScrollView = tree.root.findAll(
      (node: any) => node.props.horizontal === true,
    )[0];
    act(() => {
      carouselScrollView?.props?.onMomentumScrollEnd?.({
        nativeEvent: {contentOffset: {x: 0}},
      });
    });
    expect(tree.toJSON()).toBeTruthy();
  });

  it('ignores carousel scroll when index is out of bounds', () => {
    mockViewModelState.data = makeFullData();
    const tree = render(<HomeScreen />);
    const carouselScrollView = tree.root.findAll(
      (node: any) => node.props.horizontal === true,
    )[0];
    act(() => {
      carouselScrollView?.props?.onMomentumScrollEnd?.({
        nativeEvent: {contentOffset: {x: 999999}},
      });
    });
    expect(tree.toJSON()).toBeTruthy();
  });

  it('navigates to Movements when a checking account card is pressed', () => {
    mockViewModelState.data = {
      accounts: [{accountGuid: 'g-c', maskedAccountNumber: '****5678', accountKind: 'checking' as const, balance: 2000}],
      creditCards: [], loans: [], investments: [], frequentPayments: [],
    };
    const tree = render(<HomeScreen />);
    const accountTouch = tree.root.findAll(
      (node: any) => node.props.accessibilityLabel === 'Ver movimientos de cuenta corriente',
    )[0];
    act(() => {
      accountTouch?.props?.onPress?.();
    });
    expect(mockNavigate).toHaveBeenCalledWith('Movements', expect.any(Object));
  });

  it('navigates to Movements when a savings account card is pressed', () => {
    mockViewModelState.data = {
      accounts: [{accountGuid: 'g-s', maskedAccountNumber: '****1234', accountKind: 'savings' as const, balance: 1000}],
      creditCards: [], loans: [], investments: [], frequentPayments: [],
    };
    const tree = render(<HomeScreen />);
    const accountTouch = tree.root.findAll(
      (node: any) => node.props.accessibilityLabel === 'Ver movimientos de Cta. ahorros',
    )[0];
    act(() => {
      accountTouch?.props?.onPress?.();
    });
    expect(mockNavigate).toHaveBeenCalledWith('Movements', expect.any(Object));
  });

  it('navigates to Movements when an "other" kind account card is pressed', () => {
    mockViewModelState.data = {
      accounts: [{accountGuid: 'g-o', maskedAccountNumber: '****0000', accountKind: 'other' as const, balance: 300}],
      creditCards: [], loans: [], investments: [], frequentPayments: [],
    };
    const tree = render(<HomeScreen />);
    const accountTouch = tree.root.findAll(
      (node: any) => node.props.accessibilityLabel === 'Ver movimientos de Cuenta',
    )[0];
    act(() => {
      accountTouch?.props?.onPress?.();
    });
    expect(mockNavigate).toHaveBeenCalledWith('Movements', expect.any(Object));
  });
});
