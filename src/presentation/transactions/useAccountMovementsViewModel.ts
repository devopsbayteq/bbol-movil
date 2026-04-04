import {useState, useCallback, useEffect, useMemo} from 'react';
import type {AccountBalance} from '../../domain/entities/ContractBalance';
import type {AccountMovement} from '../../domain/entities/AccountMovement';
import {useDI} from '../../di';

const PAGE_SIZE = 20;

export type DateRangePreset = 'all' | 'week' | 'month';

export type MovementTypeFilter = 'all' | 'in' | 'out';

export type AmountSort = 'none' | 'asc' | 'desc';

function isoStartOfDay(d: Date): string {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString();
}

function isoEndOfDay(d: Date): string {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x.toISOString();
}

/** Evita filas duplicadas (misma respuesta o solapamiento al paginar). */
function dedupeAccountMovements(items: AccountMovement[]): AccountMovement[] {
  const map = new Map<string, AccountMovement>();
  for (const item of items) {
    const guid = item.transactionGuid?.trim();
    const key = guid
      ? guid
      : `${item.transactionIdentifier}|${item.transferDate}|${item.amount}|${item.beneficiaryName}`;
    if (!map.has(key)) {
      map.set(key, item);
    }
  }
  return [...map.values()];
}

function dateRangeFromPreset(preset: DateRangePreset): {
  dateFrom?: string;
  dateTo?: string;
} {
  const now = new Date();
  if (preset === 'all') {
    return {};
  }
  const end = isoEndOfDay(now);
  const startBase = new Date(now);
  if (preset === 'week') {
    startBase.setDate(startBase.getDate() - 7);
  } else {
    startBase.setDate(startBase.getDate() - 30);
  }
  return {dateFrom: isoStartOfDay(startBase), dateTo: end};
}

export function useAccountMovementsViewModel(accountGuidFromRoute?: string) {
  const {getHomeContractBalanceUseCase, getAccountMovementsUseCase} = useDI();

  const [selectedAccount, setSelectedAccount] = useState<AccountBalance | null>(
    null,
  );
  const [accountError, setAccountError] = useState<string | null>(null);
  const [items, setItems] = useState<AccountMovement[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoadingAccount, setIsLoadingAccount] = useState(true);
  const [isLoadingMovements, setIsLoadingMovements] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [movementsError, setMovementsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [datePreset, setDatePreset] = useState<DateRangePreset>('all');
  const [typeFilter, setTypeFilter] = useState<MovementTypeFilter>('all');
  const [amountSort, setAmountSort] = useState<AmountSort>('none');

  const resolveAccount = useCallback(
    async (guidParam?: string) => {
      setIsLoadingAccount(true);
      setAccountError(null);
      try {
        const data = await getHomeContractBalanceUseCase.execute();
        if (!data.accounts.length) {
          setSelectedAccount(null);
          setAccountError('No hay cuentas disponibles');
          return null;
        }
        const preferred = guidParam
          ? data.accounts.find(a => a.accountGuid === guidParam)
          : undefined;
        const acc = preferred ?? data.accounts[0];
        setSelectedAccount(acc);
        return acc;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Error al cargar la cuenta';
        setAccountError(message);
        setSelectedAccount(null);
        return null;
      } finally {
        setIsLoadingAccount(false);
      }
    },
    [getHomeContractBalanceUseCase],
  );

  useEffect(() => {
    void resolveAccount(accountGuidFromRoute);
  }, [accountGuidFromRoute, resolveAccount]);

  const fetchPage = useCallback(
    async (
      account: AccountBalance,
      page: number,
      range: {dateFrom?: string; dateTo?: string},
      mode: 'replace' | 'append',
    ) => {
      if (page === 1 && mode === 'replace') {
        setIsLoadingMovements(true);
      } else if (page > 1) {
        setIsLoadingMore(true);
      }
      setMovementsError(null);
      try {
        const result = await getAccountMovementsUseCase.execute({
          accountGuid: account.accountGuid,
          ...range,
          pageNumber: page,
          pageSize: PAGE_SIZE,
        });
        setTotalCount(result.totalCount);
        setPageNumber(result.pageNumber);
        setItems(prev => {
          const merged =
            page === 1 || mode === 'replace'
              ? result.items
              : [...prev, ...result.items];
          return dedupeAccountMovements(merged);
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Error al cargar movimientos';
        setMovementsError(message);
        if (page === 1) {
          setItems([]);
        }
      } finally {
        setIsLoadingMovements(false);
        setIsLoadingMore(false);
      }
    },
    [getAccountMovementsUseCase],
  );

  useEffect(() => {
    if (!selectedAccount || isLoadingAccount) {
      return;
    }
    const range = dateRangeFromPreset(datePreset);
    void fetchPage(selectedAccount, 1, range, 'replace');
  }, [selectedAccount, isLoadingAccount, datePreset, fetchPage]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const acc = await resolveAccount(accountGuidFromRoute);
      if (acc) {
        const range = dateRangeFromPreset(datePreset);
        await fetchPage(acc, 1, range, 'replace');
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [accountGuidFromRoute, datePreset, resolveAccount, fetchPage]);

  const loadMore = useCallback(async () => {
    if (!selectedAccount || isLoadingMore || isLoadingMovements) {
      return;
    }
    if (items.length >= totalCount) {
      return;
    }
    const nextPage = pageNumber + 1;
    const range = dateRangeFromPreset(datePreset);
    await fetchPage(selectedAccount, nextPage, range, 'append');
  }, [
    selectedAccount,
    isLoadingMore,
    isLoadingMovements,
    items.length,
    totalCount,
    pageNumber,
    datePreset,
    fetchPage,
  ]);

  const cycleDatePreset = useCallback(() => {
    setDatePreset(prev => {
      if (prev === 'all') {
        return 'week';
      }
      if (prev === 'week') {
        return 'month';
      }
      return 'all';
    });
  }, []);

  const cycleTypeFilter = useCallback(() => {
    setTypeFilter(prev => {
      if (prev === 'all') {
        return 'in';
      }
      if (prev === 'in') {
        return 'out';
      }
      return 'all';
    });
  }, []);

  const cycleAmountSort = useCallback(() => {
    setAmountSort(prev => {
      if (prev === 'none') {
        return 'desc';
      }
      if (prev === 'desc') {
        return 'asc';
      }
      return 'none';
    });
  }, []);

  const displayItems = useMemo(() => {
    let list = [...items];
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(t =>
        t.beneficiaryName.toLowerCase().includes(q),
      );
    }
    if (typeFilter === 'in') {
      list = list.filter(t => t.amount > 0);
    } else if (typeFilter === 'out') {
      list = list.filter(t => t.amount <= 0);
    }
    if (amountSort === 'asc') {
      list.sort((a, b) => a.amount - b.amount);
    } else if (amountSort === 'desc') {
      list.sort((a, b) => b.amount - a.amount);
    }
    return list;
  }, [items, searchQuery, typeFilter, amountSort]);

  const datePresetLabel =
    datePreset === 'all'
      ? 'Fecha'
      : datePreset === 'week'
        ? '7 días'
        : '30 días';

  const typeFilterLabel =
    typeFilter === 'all'
      ? 'Tipo'
      : typeFilter === 'in'
        ? 'Entradas'
        : 'Salidas';

  const amountSortLabel =
    amountSort === 'none' ? 'Monto' : amountSort === 'desc' ? 'Monto ↓' : 'Monto ↑';

  return {
    selectedAccount,
    accountError,
    isLoadingAccount,
    items: displayItems,
    rawCount: items.length,
    totalCount,
    isLoadingMovements,
    isLoadingMore,
    isRefreshing,
    movementsError,
    searchQuery,
    setSearchQuery,
    datePreset,
    datePresetLabel,
    cycleDatePreset,
    typeFilter,
    typeFilterLabel,
    cycleTypeFilter,
    amountSort,
    amountSortLabel,
    cycleAmountSort,
    refresh,
    loadMore,
    hasMore: selectedAccount !== null && items.length < totalCount,
  };
}
