import {useCallback, useMemo, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useDI} from '../../di';
import type {HomeBanner, HomeDashboardIcon} from '../../domain/entities/ContractBalance';
import {
  FALLBACK_HOME_BANNERS,
  FALLBACK_HOME_DASHBOARD_ICONS,
  MOCK_RECENT_ACTIVITY,
  MOCK_UPCOMING_PAYMENTS_SUMMARY,
  type RecentActivityItem,
  type UpcomingPaymentsSummary,
} from './homeDashboardMocks';

const HOME_BALANCE_KEY = ['homeContractBalance'] as const;

export function useHomeViewModel() {
  const [showDevelopmentMode, setShowDevelopmentMode] = useState(false);
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

  const bannersForHome: HomeBanner[] = useMemo(() => {
    const d = query.data;
    if (!d) {
      return [];
    }
    return d.banners.length > 0 ? d.banners : FALLBACK_HOME_BANNERS;
  }, [query.data]);

  const dashboardIconsForHome: HomeDashboardIcon[] = useMemo(() => {
    const d = query.data;
    if (!d) {
      return [];
    }
    return d.homeDashboardIcons.length > 0
      ? d.homeDashboardIcons
      : FALLBACK_HOME_DASHBOARD_ICONS;
  }, [query.data]);

  const upcomingPaymentsSummary: UpcomingPaymentsSummary =
    MOCK_UPCOMING_PAYMENTS_SUMMARY;
  const recentActivityItems: RecentActivityItem[] = MOCK_RECENT_ACTIVITY;

  return {
    showDevelopmentMode,
    setShowDevelopmentMode,
    data: query.data ?? null,
    bannersForHome,
    dashboardIconsForHome,
    upcomingPaymentsSummary,
    recentActivityItems,
    isLoading: query.isLoading,
    isRefreshing: query.isRefetching,
    error: query.error?.message ?? '',
    refresh,
    retry,
  };
}
