import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {useDI} from '../../../src/di';
import {useAccountMovementsViewModel} from '../../../src/presentation/transactions/useAccountMovementsViewModel';

jest.mock('../../../src/di', () => ({
  useDI: jest.fn(),
}));

const mockedUseDI = useDI as jest.MockedFunction<typeof useDI>;

function flushPromises(): Promise<void> {
  return new Promise(resolve => setImmediate(resolve));
}

describe('useAccountMovementsViewModel', () => {
  let latest: ReturnType<typeof useAccountMovementsViewModel> | undefined;

  function Harness({guid}: {guid?: string}) {
    latest = useAccountMovementsViewModel(guid);
    return null;
  }

  beforeEach(() => {
    latest = undefined;
    jest.clearAllMocks();
  });

  test('loads home account and first page of movements', async () => {
    mockedUseDI.mockReturnValue({
      getHomeContractBalanceUseCase: {
        execute: jest.fn().mockResolvedValue({
          accounts: [
            {
              accountGuid: 'acc-1',
              maskedAccountNumber: '****8829',
              accountKind: 'savings',
              balance: 314.78,
            },
          ],
          creditCards: [],
          loans: [],
          investments: [],
          frequentPayments: [],
        }),
      },
      getAccountMovementsUseCase: {
        execute: jest.fn().mockResolvedValue({
          totalCount: 1,
          pageNumber: 1,
          pageSize: 20,
          items: [
            {
              transactionGuid: 't1',
              transactionIdentifier: 'x',
              beneficiaryName: 'Ricardo Gomez',
              beneficiaryAccountType: 'Savings',
              beneficiaryAccountTypeLabel: 'Ahorros',
              beneficiaryAccountNumber: '****1234',
              ownerAccountType: 'Savings',
              ownerAccountLabel: 'Cuenta propia',
              accountNumber: '****8829',
              accountType: 'Savings',
              accountTypeLabel: 'Cta. ahorros',
              amount: -91.02,
              transferDate: '2026-04-04T15:00:00.000Z',
              transactionTypeLabel: 'Transferencia realizada',
              transactionType: 'SentTransfers',
              concept: null,
              balanceAfterTransaction: 12450.8,
              allowedShared: true,
            },
          ],
        }),
      },
    } as never);

    await act(async () => {
      ReactTestRenderer.create(<Harness />);
      await flushPromises();
    });

    expect(latest?.selectedAccount?.accountGuid).toBe('acc-1');
    expect(latest?.items).toHaveLength(1);
    expect(latest?.items[0].beneficiaryName).toBe('Ricardo Gomez');
    expect(latest?.movementsError).toBeNull();
    expect(latest?.isLoadingMovements).toBe(false);
  });

  test('surfaces movements error and allows refresh', async () => {
    const executeMovements = jest
      .fn()
      .mockRejectedValueOnce(new Error('Sin conexión'))
      .mockResolvedValueOnce({
        totalCount: 0,
        pageNumber: 1,
        pageSize: 20,
        items: [],
      });

    mockedUseDI.mockReturnValue({
      getHomeContractBalanceUseCase: {
        execute: jest.fn().mockResolvedValue({
          accounts: [
            {
              accountGuid: 'acc-1',
              maskedAccountNumber: '****1111',
              accountKind: 'checking',
              balance: 100,
            },
          ],
          creditCards: [],
          loans: [],
          investments: [],
          frequentPayments: [],
        }),
      },
      getAccountMovementsUseCase: {
        execute: executeMovements,
      },
    } as never);

    await act(async () => {
      ReactTestRenderer.create(<Harness />);
      await flushPromises();
    });

    expect(latest?.movementsError).toBe('Sin conexión');

    await act(async () => {
      await latest?.refresh();
      await flushPromises();
    });

    expect(latest?.movementsError).toBeNull();
    expect(executeMovements).toHaveBeenCalledTimes(2);
  });

  test('applyDateRange passes DateFrom and DateTo as ISO date-time to the use case', async () => {
    const executeMovements = jest.fn().mockResolvedValue({
      totalCount: 0,
      pageNumber: 1,
      pageSize: 20,
      items: [],
    });

    mockedUseDI.mockReturnValue({
      getHomeContractBalanceUseCase: {
        execute: jest.fn().mockResolvedValue({
          accounts: [
            {
              accountGuid: 'acc-1',
              maskedAccountNumber: '****8829',
              accountKind: 'savings',
              balance: 314.78,
            },
          ],
          creditCards: [],
          loans: [],
          investments: [],
          frequentPayments: [],
        }),
      },
      getAccountMovementsUseCase: {
        execute: executeMovements,
      },
    } as never);

    await act(async () => {
      ReactTestRenderer.create(<Harness />);
      await flushPromises();
    });

    const from = new Date(2026, 1, 10);
    const to = new Date(2026, 1, 13);

    await act(async () => {
      latest?.applyDateRange(from, to);
      await flushPromises();
    });

    const withRange = executeMovements.mock.calls.find(
      args =>
        args[0].dateFrom !== undefined && args[0].dateTo !== undefined,
    );
    expect(withRange).toBeDefined();
    expect(withRange?.[0].dateFrom).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    expect(withRange?.[0].dateTo).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    expect(withRange?.[0].accountGuid).toBe('acc-1');
  });

  test('applyAmountRange passes minAmount and maxAmount to the use case', async () => {
    const executeMovements = jest.fn().mockResolvedValue({
      totalCount: 0,
      pageNumber: 1,
      pageSize: 20,
      items: [],
    });

    mockedUseDI.mockReturnValue({
      getHomeContractBalanceUseCase: {
        execute: jest.fn().mockResolvedValue({
          accounts: [
            {
              accountGuid: 'acc-1',
              maskedAccountNumber: '****8829',
              accountKind: 'savings',
              balance: 314.78,
            },
          ],
          creditCards: [],
          loans: [],
          investments: [],
          frequentPayments: [],
        }),
      },
      getAccountMovementsUseCase: {
        execute: executeMovements,
      },
    } as never);

    await act(async () => {
      ReactTestRenderer.create(<Harness />);
      await flushPromises();
    });

    await act(async () => {
      latest?.applyAmountRange(10.5, 500);
      await flushPromises();
    });

    const withAmount = executeMovements.mock.calls.find(
      args =>
        args[0].minAmount === 10.5 && args[0].maxAmount === 500,
    );
    expect(withAmount).toBeDefined();
    expect(withAmount?.[0].accountGuid).toBe('acc-1');
  });

  test('applyTransactionEnumType passes transactionType to the use case', async () => {
    const executeMovements = jest.fn().mockResolvedValue({
      totalCount: 0,
      pageNumber: 1,
      pageSize: 20,
      items: [],
    });

    mockedUseDI.mockReturnValue({
      getHomeContractBalanceUseCase: {
        execute: jest.fn().mockResolvedValue({
          accounts: [
            {
              accountGuid: 'acc-1',
              maskedAccountNumber: '****8829',
              accountKind: 'savings',
              balance: 314.78,
            },
          ],
          creditCards: [],
          loans: [],
          investments: [],
          frequentPayments: [],
        }),
      },
      getAccountMovementsUseCase: {
        execute: executeMovements,
      },
    } as never);

    await act(async () => {
      ReactTestRenderer.create(<Harness />);
      await flushPromises();
    });

    await act(async () => {
      latest?.applyTransactionEnumType('SentTransfers');
      await flushPromises();
    });

    const withEnum = executeMovements.mock.calls.find(
      args => args[0].transactionType === 'SentTransfers',
    );
    expect(withEnum).toBeDefined();
    expect(withEnum?.[0].accountGuid).toBe('acc-1');
  });
});
