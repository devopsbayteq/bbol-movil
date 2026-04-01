import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {useDI} from '../../../src/di';
import {useTransactionsViewModel} from '../../../src/presentation/transactions/useTransactionsViewModel';

jest.mock('../../../src/di', () => ({
  useDI: jest.fn(),
}));

const mockedUseDI = useDI as jest.MockedFunction<typeof useDI>;

function flushPromises(): Promise<void> {
  return new Promise(resolve => setImmediate(resolve));
}

describe('useTransactionsViewModel', () => {
  let latest:
    | ReturnType<typeof useTransactionsViewModel>
    | undefined;

  function Harness() {
    latest = useTransactionsViewModel();
    return null;
  }

  beforeEach(() => {
    latest = undefined;
    jest.clearAllMocks();
  });

  test('loads transactions on mount and computes balance summary', async () => {
    mockedUseDI.mockReturnValue({
      getTransactionsUseCase: {
        execute: jest.fn().mockResolvedValue([
          {
            id: '1',
            description: 'Ingreso',
            amount: 100,
            date: '2026-03-28',
            type: 'income',
            category: 'salary',
            status: 'completed',
          },
          {
            id: '2',
            description: 'Gasto',
            amount: 40,
            date: '2026-03-27',
            type: 'expense',
            category: 'food',
            status: 'completed',
          },
          {
            id: '3',
            description: 'Cancelada',
            amount: 20,
            date: '2026-03-26',
            type: 'expense',
            category: 'shopping',
            status: 'cancelled',
          },
        ]),
      },
    } as never);

    await act(async () => {
      ReactTestRenderer.create(<Harness />);
      await flushPromises();
    });

    expect(latest?.transactions).toHaveLength(3);
    expect(latest?.balance).toBe(60);
    expect(latest?.income).toBe(100);
    expect(latest?.expenses).toBe(40);
    expect(latest?.error).toBeNull();
    expect(latest?.isLoading).toBe(false);
  });

  test('stores the loading error and allows retry', async () => {
    const execute = jest
      .fn()
      .mockRejectedValueOnce(new Error('Fallo de red'))
      .mockResolvedValueOnce([
        {
          id: '1',
          description: 'Ingreso',
          amount: 50,
          date: '2026-03-28',
          type: 'income',
          category: 'salary',
          status: 'completed',
        },
      ]);

    mockedUseDI.mockReturnValue({
      getTransactionsUseCase: {execute},
    } as never);

    await act(async () => {
      ReactTestRenderer.create(<Harness />);
      await flushPromises();
    });

    expect(latest?.error).toBe('Fallo de red');
    expect(latest?.isLoading).toBe(false);

    await act(async () => {
      await latest?.retry();
      await flushPromises();
    });

    expect(latest?.transactions).toHaveLength(1);
    expect(latest?.error).toBeNull();
    expect(execute).toHaveBeenCalledTimes(2);
  });
});
