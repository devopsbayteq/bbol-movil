import {useState, useCallback} from 'react';
import {User} from '../../domain/entities/User';
import {useDI} from '../../di';

interface LoginState {
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
}

export function useLoginViewModel(onLoginSuccess: (user: User) => void) {
  const [state, setState] = useState<LoginState>({
    email: '',
    password: '',
    isLoading: false,
    error: null,
  });

  const {loginUseCase} = useDI();

  const setEmail = useCallback((email: string) => {
    setState(prev => ({...prev, email, error: null}));
  }, []);

  const setPassword = useCallback((password: string) => {
    setState(prev => ({...prev, password, error: null}));
  }, []);

  const handleLogin = useCallback(async () => {
    setState(prev => ({...prev, isLoading: true, error: null}));

    try {
      const user = await loginUseCase.execute(state.email, state.password);
      setState(prev => ({...prev, isLoading: false}));
      onLoginSuccess(user);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Ocurrió un error inesperado';
      setState(prev => ({...prev, isLoading: false, error: message}));
    }
  }, [loginUseCase, state.email, state.password, onLoginSuccess]);

  return {
    email: state.email,
    password: state.password,
    isLoading: state.isLoading,
    error: state.error,
    setEmail,
    setPassword,
    handleLogin,
  };
}
