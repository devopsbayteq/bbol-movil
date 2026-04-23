import type {AccountBalance} from '../../domain/entities/ContractBalance';

/** Prefijo estable para cuentas solo UI del carrusel (no existen en el API). */
export const CAROUSEL_MOCK_ACCOUNT_GUID_PREFIX = 'carousel-mock-';

export function isCarouselMockAccount(accountGuid: string): boolean {
  return accountGuid.startsWith(CAROUSEL_MOCK_ACCOUNT_GUID_PREFIX);
}

/**
 * Tres cuentas de demostración para el carrusel del hero en Movimientos.
 * El servicio no las envía; solo enriquecen la UI.
 */
export function getMockCarouselAccounts(): AccountBalance[] {
  return [
    {
      accountGuid: `${CAROUSEL_MOCK_ACCOUNT_GUID_PREFIX}1`,
      maskedAccountNumber: '******2201',
      accountKind: 'checking',
      balance: 4_250.75,
      beneficiary: {
        beneficiaryGuid: `own-${CAROUSEL_MOCK_ACCOUNT_GUID_PREFIX}1`,
        contactName: 'Cuenta corriente demo',
        bankName: '',
        accountType: 'checking',
        lastFourDigits: '2201',
        accountTypeLabel: 'Cta. Corriente',
      },
      maskedAccountHome: '******2201',
      accountTypeLabel: 'Cta. Corriente',
      accountAlias: 'Operaciones',
    },
    {
      accountGuid: `${CAROUSEL_MOCK_ACCOUNT_GUID_PREFIX}2`,
      maskedAccountNumber: '******8804',
      accountKind: 'savings',
      balance: 12_180,
      beneficiary: {
        beneficiaryGuid: `own-${CAROUSEL_MOCK_ACCOUNT_GUID_PREFIX}2`,
        contactName: 'Cuenta ahorros demo',
        bankName: '',
        accountType: 'savings',
        lastFourDigits: '8804',
        accountTypeLabel: 'Cta. Ahorros',
      },
      maskedAccountHome: '******8804',
      accountTypeLabel: 'Cta. Ahorros',
      accountAlias: 'Reserva',
    },
    {
      accountGuid: `${CAROUSEL_MOCK_ACCOUNT_GUID_PREFIX}3`,
      maskedAccountNumber: '******1100',
      accountKind: 'other',
      balance: 500,
      beneficiary: {
        beneficiaryGuid: `own-${CAROUSEL_MOCK_ACCOUNT_GUID_PREFIX}3`,
        contactName: 'Cuenta básica demo',
        bankName: '',
        accountType: 'other',
        lastFourDigits: '1100',
        accountTypeLabel: 'Cta. Básica',
      },
      maskedAccountHome: '******1100',
      accountTypeLabel: 'Cta. Básica',
    },
  ];
}
