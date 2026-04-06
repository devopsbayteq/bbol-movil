import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {AppState} from 'react-native';
import {User} from '../domain/entities/User';
import {SecureStorageKeys} from '../data/datasources/storage/SecureStorageKeys';
import {useDI} from '../di';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const {secureStorageService: secureStorage} = useDI();

  useEffect(() => {
    restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      // Solo background: en `inactive` aparece la UI de Face ID y no debe borrarse aquí.
      if (nextState === 'background') {
        void secureStorage.remove(SecureStorageKeys.USER_LOGIN_DATA);
      }
    });
    return () => subscription.remove();
  }, [secureStorage]);

  async function restoreSession() {
    try {
      // Banca: no restaurar sesión tras reinicio en frío — siempre pantalla de login.
      await secureStorage.remove(SecureStorageKeys.USER_SESSION);
      await secureStorage.remove(SecureStorageKeys.AUTH_TOKEN);
    } catch {
      await secureStorage.clear();
    }
    setState({user: null, isAuthenticated: false, isLoading: false});
  }

  const login = useCallback(
    async (user: User) => {
      await secureStorage.save(
        SecureStorageKeys.USER_SESSION,
        JSON.stringify(user),
      );
      await secureStorage.save(SecureStorageKeys.AUTH_TOKEN, user.token);
      const existingBound = await secureStorage.get(
        SecureStorageKeys.DEVICE_BOUND_LOGIN_ID,
      );
      if (!existingBound?.trim()) {
        await secureStorage.save(
          SecureStorageKeys.DEVICE_BOUND_LOGIN_ID,
          user.email.trim(),
        );
      }
      setState({user, isAuthenticated: true, isLoading: false});
    },
    [secureStorage],
  );

  const logout = useCallback(async () => {
    await secureStorage.remove(SecureStorageKeys.USER_SESSION);
    await secureStorage.remove(SecureStorageKeys.AUTH_TOKEN);
    setState({user: null, isAuthenticated: false, isLoading: false});
  }, [secureStorage]);

  const value: AuthContextValue = useMemo(
    () => ({...state, login, logout}),
    [state, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
