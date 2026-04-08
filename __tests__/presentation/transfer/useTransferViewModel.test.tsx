import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {useTransferViewModel} from '../../../src/presentation/transfer/useTransferViewModel';

// ── Módulos nativos ──────────────────────────────────────────────────────────
jest.mock('react-native-encrypted-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('react-native-biometrics', () =>
  jest.fn().mockImplementation(() => ({
    isSensorAvailable: jest.fn(() => Promise.resolve({available: false})),
  })),
);

// ── Providers ────────────────────────────────────────────────────────────────
jest.mock('../../../src/providers', () => ({
  useAuth: () => ({user: {name: 'Titular Demo', email: 'titular@demo.com'}, logout: jest.fn()}),
  useTheme: () => ({colors: {}}),
}));

// ── useHomeViewModel ─────────────────────────────────────────────────────────
const mockHomeData: {data: {accounts: {accountGuid: string; accountKind: string; balance: number; maskedAccountNumber: string}[]} | null; isLoading: boolean; error: string; retry: jest.Mock} = {
  data: null,
  isLoading: false,
  error: '',
  retry: jest.fn(),
};

jest.mock('../../../src/presentation/home/useHomeViewModel', () => ({
  useHomeViewModel: () => mockHomeData,
}));

// ── Harness ──────────────────────────────────────────────────────────────────
let latest: ReturnType<typeof useTransferViewModel> | undefined;

function Harness() {
  latest = useTransferViewModel();
  return null;
}

async function mount() {
  await act(async () => {
    ReactTestRenderer.create(<Harness />);
  });
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const savingsAccount = {
  accountGuid: 'acc-savings',
  accountKind: 'savings' as const,
  balance: 1000,
  maskedAccountNumber: '****1111',
};

const checkingAccount = {
  accountGuid: 'acc-checking',
  accountKind: 'checking' as const,
  balance: 500,
  maskedAccountNumber: '****2222',
};

const contactBeneficiary = {
  id: 'ben-001',
  name: 'Ana Pérez',
  kind: 'contact' as const,
  bankName: 'Banco Pichincha',
  accountHint: '****4321',
};

// ────────────────────────────────────────────────────────────────────────────
describe('useTransferViewModel', () => {
  beforeEach(() => {
    latest = undefined;
    jest.clearAllMocks();
    mockHomeData.data = null;
    mockHomeData.isLoading = false;
    mockHomeData.error = '';
  });

  // ── Estado inicial ───────────────────────────────────────────────────────
  test('initial state: amountCents 0, no beneficiary, empty concept', async () => {
    await mount();
    expect(latest?.amountCents).toBe(0);
    expect(latest?.beneficiary).toBeNull();
    expect(latest?.concept).toBe('');
    expect(latest?.validationMessage).toBeNull();
    expect(latest?.accountModalVisible).toBe(false);
    expect(latest?.beneficiarySelectorVisible).toBe(false);
  });

  test('expone isLoading y error del homeViewModel', async () => {
    mockHomeData.isLoading = true;
    mockHomeData.error = 'Sin conexión';
    await mount();
    expect(latest?.isLoading).toBe(true);
    expect(latest?.error).toBe('Sin conexión');
  });

  // ── onAmountChange ───────────────────────────────────────────────────────
  test('onAmountChange parsea dígitos y actualiza amountCents', async () => {
    await mount();
    act(() => {
      latest?.onAmountChange('500');
    });
    expect(latest?.amountCents).toBe(500);
  });

  test('onAmountChange ignora texto vacío y resetea a cero', async () => {
    await mount();
    act(() => {
      latest?.onAmountChange('100');
    });
    act(() => {
      latest?.onAmountChange('');
    });
    expect(latest?.amountCents).toBe(0);
  });

  test('onAmountChange filtra caracteres no numéricos', async () => {
    await mount();
    act(() => {
      latest?.onAmountChange('$1,234.56');
    });
    expect(latest?.amountCents).toBe(123456);
  });

  test('onAmountChange limita al máximo permitido', async () => {
    await mount();
    act(() => {
      // Valor más grande que MAX_TRANSFER_CENTS = 999_999_999_999
      latest?.onAmountChange('9999999999999');
    });
    expect(latest?.amountCents).toBe(999999999999);
  });

  test('onAmountChange limpia validationMessage al cambiar', async () => {
    await mount();
    act(() => {
      latest?.setValidationMessage('Monto requerido');
    });
    act(() => {
      latest?.onAmountChange('200');
    });
    expect(latest?.validationMessage).toBeNull();
  });

  // ── onConceptChange ──────────────────────────────────────────────────────
  test('onConceptChange sanitiza la entrada', async () => {
    await mount();
    act(() => {
      latest?.onConceptChange('Pago de servicios');
    });
    expect(latest?.concept).toBe('Pago de servicios');
  });

  // ── Cuenta por defecto ───────────────────────────────────────────────────
  test('inicializa el índice de cuenta en la cuenta de ahorros por defecto', async () => {
    mockHomeData.data = {accounts: [checkingAccount, savingsAccount]};
    await mount();
    // defaultAccountIndex elige savings (índice 1)
    expect(latest?.accountIndex).toBe(1);
    expect(latest?.selectedAccount?.accountKind).toBe('savings');
  });

  test('usa índice 0 cuando no hay cuenta de ahorros', async () => {
    mockHomeData.data = {accounts: [checkingAccount]};
    await mount();
    expect(latest?.accountIndex).toBe(0);
  });

  test('selectedAccount es null cuando no hay cuentas', async () => {
    mockHomeData.data = {accounts: []};
    await mount();
    expect(latest?.selectedAccount).toBeNull();
  });

  // ── openAccountPicker / selectAccount ────────────────────────────────────
  test('openAccountPicker abre el modal cuando hay más de una cuenta', async () => {
    mockHomeData.data = {accounts: [savingsAccount, checkingAccount]};
    await mount();
    act(() => {
      latest?.openAccountPicker();
    });
    expect(latest?.accountModalVisible).toBe(true);
  });

  test('openAccountPicker no abre el modal con una sola cuenta', async () => {
    mockHomeData.data = {accounts: [savingsAccount]};
    await mount();
    act(() => {
      latest?.openAccountPicker();
    });
    expect(latest?.accountModalVisible).toBe(false);
  });

  test('selectAccount actualiza índice y cierra modal', async () => {
    mockHomeData.data = {accounts: [savingsAccount, checkingAccount]};
    await mount();
    act(() => {
      latest?.openAccountPicker();
    });
    act(() => {
      latest?.selectAccount(1);
    });
    expect(latest?.accountIndex).toBe(1);
    expect(latest?.accountModalVisible).toBe(false);
  });

  // ── selectBeneficiary ────────────────────────────────────────────────────
  test('selectBeneficiary establece beneficiario y limpia validationMessage', async () => {
    await mount();
    act(() => {
      latest?.setValidationMessage('Selecciona un beneficiario.');
    });
    act(() => {
      latest?.selectBeneficiary(contactBeneficiary);
    });
    expect(latest?.beneficiary).toEqual(contactBeneficiary);
    expect(latest?.validationMessage).toBeNull();
  });

  // ── prepareTransferReview ────────────────────────────────────────────────
  test('prepareTransferReview falla cuando el monto es cero', async () => {
    mockHomeData.data = {accounts: [savingsAccount]};
    await mount();
    const result = latest?.prepareTransferReview();
    expect(result?.ok).toBe(false);
    if (!result?.ok) {
      expect(result?.message).toMatch(/monto/i);
    }
  });

  test('prepareTransferReview falla cuando no hay beneficiario', async () => {
    mockHomeData.data = {accounts: [savingsAccount]};
    await mount();
    act(() => {
      latest?.onAmountChange('100');
    });
    const result = latest?.prepareTransferReview();
    expect(result?.ok).toBe(false);
    if (!result?.ok) {
      expect(result?.message).toContain('beneficiario');
    }
  });

  test('prepareTransferReview retorna ok con params cuando es válido', async () => {
    mockHomeData.data = {accounts: [savingsAccount]};
    await mount();
    act(() => {
      latest?.onAmountChange('500');
      latest?.selectBeneficiary(contactBeneficiary);
    });
    const result = latest?.prepareTransferReview();
    expect(result?.ok).toBe(true);
    if (result?.ok) {
      expect(result.params.amountCents).toBe(500);
      expect(result.params.beneficiary).toEqual(contactBeneficiary);
      expect(result.params.accountId).toBe(savingsAccount.accountGuid);
    }
  });

  test('prepareTransferReview incluye concepto en los params', async () => {
    mockHomeData.data = {accounts: [savingsAccount]};
    await mount();
    act(() => {
      latest?.onAmountChange('300');
      latest?.selectBeneficiary(contactBeneficiary);
      latest?.onConceptChange('Pago renta');
    });
    const result = latest?.prepareTransferReview();
    expect(result?.ok).toBe(true);
    if (result?.ok) {
      expect(result.params.concept).toBe('Pago renta');
    }
  });

  // ── fromAccountDescription ───────────────────────────────────────────────
  test('fromAccountDescription retorna cadena vacía cuando no hay cuenta', async () => {
    mockHomeData.data = {accounts: []};
    await mount();
    expect(latest?.fromAccountDescription).toBe('');
  });

  test('fromAccountDescription retorna descripción de la cuenta seleccionada', async () => {
    mockHomeData.data = {accounts: [savingsAccount]};
    await mount();
    expect(typeof latest?.fromAccountDescription).toBe('string');
    expect(latest?.fromAccountDescription.length).toBeGreaterThan(0);
  });

  // ── availableBalanceCents / amountFieldError ─────────────────────────────
  test('amountFieldError es null cuando el monto es válido', async () => {
    mockHomeData.data = {accounts: [savingsAccount]};
    await mount();
    act(() => {
      latest?.onAmountChange('100');
    });
    expect(latest?.amountFieldError).toBeNull();
  });

  test('amountFieldError cuando el monto supera el saldo', async () => {
    mockHomeData.data = {accounts: [{...savingsAccount, balance: 0.5}]};
    await mount();
    act(() => {
      // 10000 centavos = $100 > saldo 0.5
      latest?.onAmountChange('10000');
    });
    expect(latest?.amountFieldError).not.toBeNull();
  });

  // ── setAccountModalVisible / setBeneficiarySelectorVisible ───────────────
  test('setAccountModalVisible controla la visibilidad del modal de cuentas', async () => {
    await mount();
    act(() => {
      latest?.setAccountModalVisible(true);
    });
    expect(latest?.accountModalVisible).toBe(true);
    act(() => {
      latest?.setAccountModalVisible(false);
    });
    expect(latest?.accountModalVisible).toBe(false);
  });

  test('setBeneficiarySelectorVisible controla la visibilidad del selector de beneficiarios', async () => {
    await mount();
    act(() => {
      latest?.setBeneficiarySelectorVisible(true);
    });
    expect(latest?.beneficiarySelectorVisible).toBe(true);
  });

  // ── retry ────────────────────────────────────────────────────────────────
  test('retry delega al homeViewModel', async () => {
    const retryMock = jest.fn().mockResolvedValue(undefined);
    mockHomeData.retry = retryMock;
    await mount();
    await act(async () => {
      await latest?.retry();
    });
    expect(retryMock).toHaveBeenCalled();
  });
});
