import {useCallback, useMemo} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useDI} from '../../di';
import type {FrequentPayment, HomeBanner} from '../../domain/entities/ContractBalance';
import {
  FALLBACK_HOME_BANNERS,
  FALLBACK_HOME_FREQUENT_PAYMENTS,
  MOCK_RECENT_ACTIVITY,
  MOCK_UPCOMING_PAYMENTS_SUMMARY,
  type RecentActivityItem,
  type UpcomingPaymentsSummary,
} from './homeDashboardMocks';
import {mapHomeRecentTransactionToActivityItem} from './mapHomeRecentTransactionToActivityItem';

/** Compartido con `useCardDetailViewModel` para reutilizar caché de React Query. */
export const HOME_CONTRACT_BALANCE_QUERY_KEY = ['homeContractBalance'] as const;

export function useHomeViewModel() {
  const {getHomeContractBalanceUseCase} = useDI();

  const query = useQuery({
    queryKey: HOME_CONTRACT_BALANCE_QUERY_KEY,
    queryFn: () => getHomeContractBalanceUseCase.execute(),
  });

  const refresh = useCallback(async () => {
    await query.refetch();
  }, [query]);

  const retry = useCallback(async () => {
    await query.refetch();
  }, [query]);

  const bannersForHome: HomeBanner[] = useMemo(() => {
    const d = query.data;
    if (!d) {
      return [];
    }
    return d.banners.length > 0 ? d.banners : FALLBACK_HOME_BANNERS;
  }, [query.data]);

  const frequentPaymentsForHome: FrequentPayment[] = useMemo(() => {
    const d = query.data;
    if (!d) {
      return [];
    }
    return d.frequentPayments.length > 0
      ? d.frequentPayments
      : FALLBACK_HOME_FREQUENT_PAYMENTS;
  }, [query.data]);

  const upcomingPaymentsSummary: UpcomingPaymentsSummary =
    MOCK_UPCOMING_PAYMENTS_SUMMARY;

  const recentActivityItems: RecentActivityItem[] = useMemo(() => {
    const d = query.data;
    if (!d) {
      return [];
    }
    if (d.recentTransactions?.length) {
      return d.recentTransactions.map(mapHomeRecentTransactionToActivityItem);
    }
    return MOCK_RECENT_ACTIVITY;
  }, [query.data]);

  return {
    data: query.data ?? null,
    bannersForHome,
    frequentPaymentsForHome,
    upcomingPaymentsSummary,
    recentActivityItems,
    isLoading: query.isLoading,
    isRefreshing: query.isRefetching,
    error: query.error?.message ?? '',
    refresh,
    retry,
  };
}
