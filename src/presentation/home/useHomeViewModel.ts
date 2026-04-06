import {useCallback} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useDI} from '../../di';

const HOME_BALANCE_KEY = ['homeContractBalance'] as const;

export function useHomeViewModel() {
  const {getHomeContractBalanceUseCase} = useDI();

  const query = useQuery({
    queryKey: HOME_BALANCE_KEY,
    queryFn: () => getHomeContractBalanceUseCase.execute(),
  });

  const refresh = useCallback(async () => {
    await query.refetch();
  }, [query]);

  const retry = useCallback(async () => {
    await query.refetch();
  }, [query]);

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    isRefreshing: query.isRefetching,
    error: query.error?.message ?? "",
    refresh,
    retry,
  };
}
