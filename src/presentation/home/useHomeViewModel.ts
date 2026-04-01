import {useState, useCallback, useEffect} from 'react';
import {ContractBalance} from '../../domain/entities/ContractBalance';
import {useDI} from '../../di';

interface HomeState {
  data: ContractBalance | null;
  isLoading: boolean;
  error: string | null;
}

export function useHomeViewModel() {
  const [state, setState] = useState<HomeState>({
    data: null,
    isLoading: true,
    error: null,
  });

  const {getHomeContractBalanceUseCase} = useDI();

  const load = useCallback(async () => {
    setState(prev => ({...prev, isLoading: true, error: null}));

    try {
      const data = await getHomeContractBalanceUseCase.execute();
      setState({data, isLoading: false, error: null});
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar el inicio';
      setState(prev => ({...prev, isLoading: false, error: message}));
    }
  }, [getHomeContractBalanceUseCase]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    retry: load,
  };
}
