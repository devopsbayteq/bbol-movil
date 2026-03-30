import {useState, useCallback, useMemo, useEffect} from 'react';
import {GetTransactionsUseCase} from '../../domain/usecases/GetTransactionsUseCase';
import {TransactionRepositoryImpl} from '../../data/repositories/TransactionRepositoryImpl';
import {MockTransactionDataSource} from '../../data/datasources/MockTransactionDataSource';
import {Transaction} from '../../domain/entities/Transaction';

interface TransactionsState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

export function useTransactionsViewModel() {
  const [state, setState] = useState<TransactionsState>({
    transactions: [],
    isLoading: true,
    error: null,
  });

  const getTransactionsUseCase = useMemo(() => {
    const dataSource = new MockTransactionDataSource();
    const repository = new TransactionRepositoryImpl(dataSource);
    return new GetTransactionsUseCase(repository);
  }, []);

  const loadTransactions = useCallback(async () => {
    setState(prev => ({...prev, isLoading: true, error: null}));

    try {
      const transactions = await getTransactionsUseCase.execute();
      setState({transactions, isLoading: false, error: null});
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar transacciones';
      setState(prev => ({...prev, isLoading: false, error: message}));
    }
  }, [getTransactionsUseCase]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const balance = useMemo(() => {
    return state.transactions
      .filter(tx => tx.status !== 'cancelled')
      .reduce((acc, tx) => {
        return tx.type === 'income' ? acc + tx.amount : acc - tx.amount;
      }, 0);
  }, [state.transactions]);

  const income = useMemo(() => {
    return state.transactions
      .filter(tx => tx.type === 'income' && tx.status !== 'cancelled')
      .reduce((acc, tx) => acc + tx.amount, 0);
  }, [state.transactions]);

  const expenses = useMemo(() => {
    return state.transactions
      .filter(tx => tx.type === 'expense' && tx.status !== 'cancelled')
      .reduce((acc, tx) => acc + tx.amount, 0);
  }, [state.transactions]);

  return {
    transactions: state.transactions,
    isLoading: state.isLoading,
    error: state.error,
    balance,
    income,
    expenses,
    retry: loadTransactions,
  };
}
