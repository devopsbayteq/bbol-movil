import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useDI} from '../di';

interface SecurityState {
  publicKey: string | null;
  isLoading: boolean;
  error: string | null;
}

interface SecurityContextValue extends SecurityState {
  retry: () => Promise<void>;
}

const SecurityContext = createContext<SecurityContextValue | undefined>(
  undefined,
);

export function SecurityProvider({children}: {children: React.ReactNode}) {
  const {getPublicKeyUseCase} = useDI();
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const pk = await getPublicKeyUseCase.execute();
      setPublicKey(pk.value);
    } catch (err) {
      setPublicKey(null);
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo obtener la clave de seguridad',
      );
    } finally {
      setIsLoading(false);
    }
  }, [getPublicKeyUseCase]);

  useEffect(() => {
    void load();
  }, [load]);

  const value: SecurityContextValue = useMemo(
    () => ({
      publicKey,
      isLoading,
      error,
      retry: load,
    }),
    [publicKey, isLoading, error, load],
  );

  return (
    <SecurityContext.Provider value={value}>{children}</SecurityContext.Provider>
  );
}

export function useSecurity(): SecurityContextValue {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}
