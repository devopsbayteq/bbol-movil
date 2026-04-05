import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {useDI} from '../../../src/di';
import {useHomeViewModel} from '../../../src/presentation/home/useHomeViewModel';

jest.mock('../../../src/di', () => ({
  useDI: jest.fn(),
}));

const mockedUseDI = useDI as jest.MockedFunction<typeof useDI>;

function flushPromises(): Promise<void> {
  return new Promise(resolve => setImmediate(resolve));
}

describe('useHomeViewModel', () => {
  let latest: ReturnType<typeof useHomeViewModel> | undefined;

  function Harness() {
    latest = useHomeViewModel();
    return null;
  }

  beforeEach(() => {
    latest = undefined;
    jest.clearAllMocks();
  });

  test('loads contract balance on mount', async () => {
    const homeBalance = {
      accounts: [],
      creditCards: [],
      loans: [],
      investments: [],
      frequentPayments: [],
    };
    mockedUseDI.mockReturnValue({
      getHomeContractBalanceUseCase: {
        execute: jest.fn().mockResolvedValue(homeBalance),
      },
    } as never);

    await act(async () => {
      ReactTestRenderer.create(<Harness />);
      await flushPromises();
    });

    expect(latest?.data).toEqual(homeBalance);
    expect(latest?.isLoading).toBe(false);
    expect(latest?.isRefreshing).toBe(false);
    expect(latest?.error).toBeNull();
  });

  test('refresh vuelve a pedir saldo sin activar isLoading inicial', async () => {
    const homeBalance = {
      accounts: [],
      creditCards: [],
      loans: [],
      investments: [],
      frequentPayments: [],
    };
    const execute = jest.fn().mockResolvedValue(homeBalance);

    mockedUseDI.mockReturnValue({
      getHomeContractBalanceUseCase: {execute},
    } as never);

    await act(async () => {
      ReactTestRenderer.create(<Harness />);
      await flushPromises();
    });

    expect(execute).toHaveBeenCalledTimes(1);

    await act(async () => {
      await latest?.refresh();
      await flushPromises();
    });

    expect(execute).toHaveBeenCalledTimes(2);
    expect(latest?.isRefreshing).toBe(false);
    expect(latest?.isLoading).toBe(false);
  });

  test('surfaces errors and supports retry', async () => {
    const execute = jest
      .fn()
      .mockRejectedValueOnce(new Error('Sin conexión'))
      .mockResolvedValueOnce({
        accounts: [],
        creditCards: [],
        loans: [],
        investments: [],
        frequentPayments: [],
      });

    mockedUseDI.mockReturnValue({
      getHomeContractBalanceUseCase: {execute},
    } as never);

    await act(async () => {
      ReactTestRenderer.create(<Harness />);
      await flushPromises();
    });

    expect(latest?.error).toBe('Sin conexión');

    await act(async () => {
      await latest?.retry();
      await flushPromises();
    });

    expect(latest?.error).toBeNull();
    expect(execute).toHaveBeenCalledTimes(2);
  });
});
