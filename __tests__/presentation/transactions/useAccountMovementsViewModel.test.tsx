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
              beneficiaryAccountTypeLabel: 'Ahorros',
              beneficiaryAccountNumber: '',
              amount: -91.02,
              transferDate: '2026-04-04T15:00:00.000Z',
              transactionTypeLabel: 'Transferencia realizada',
              transactionType: 1,
              balanceAfterTransaction: 12450.8,
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
});
