import React, {createContext, useContext, useEffect, useMemo} from 'react';
import {ensureDeviceId} from '../data/bootstrap/ensureDeviceId';
import {AppContainer, createContainer} from './container';

const DIContext = createContext<AppContainer | undefined>(undefined);

export function DIProvider({children}: {children: React.ReactNode}) {
  const container = useMemo(() => createContainer(), []);

  useEffect(() => {
    ensureDeviceId(container.secureStorageService).catch(() => {});
  }, [container]);

  return <DIContext.Provider value={container}>{children}</DIContext.Provider>;
}

export function useDI(): AppContainer {
  const context = useContext(DIContext);
  if (!context) {
    throw new Error('useDI must be used within a DIProvider');
  }
  return context;
}
