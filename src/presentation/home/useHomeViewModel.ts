import {useState, useCallback, useEffect} from 'react';
import {ContractBalance} from '../../domain/entities/ContractBalance';
import {useDI} from '../../di';

type LoadMode = 'initial' | 'refresh';

interface HomeState {
  data: ContractBalance | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

export function useHomeViewModel() {
  const [state, setState] = useState<HomeState>({
    data: null,
    isLoading: true,
    isRefreshing: false,
    error: null,
  });

  const {getHomeContractBalanceUseCase} = useDI();

  const load = useCallback(
    async (mode: LoadMode = 'initial') => {
      if (mode === 'initial') {
        setState(prev => ({...prev, isLoading: true, error: null}));
      } else {
        setState(prev => ({...prev, isRefreshing: true, error: null}));
      }

      try {
        const data = await getHomeContractBalanceUseCase.execute();
        setState({
          data,
          isLoading: false,
          isRefreshing: false,
          error: null,
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Error al cargar el inicio';
        setState(prev => ({
          ...prev,
          isLoading: false,
          isRefreshing: false,
          error: message,
        }));
      }
    },
    [getHomeContractBalanceUseCase],
  );

  useEffect(() => {
    void load('initial');
  }, [load]);

  const refresh = useCallback(() => load('refresh'), [load]);
  const retry = useCallback(() => load('initial'), [load]);

  return {
    data: state.data,
    isLoading: state.isLoading,
    isRefreshing: state.isRefreshing,
    error: state.error,
    refresh,
    retry,
  };
}
