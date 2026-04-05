import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {NavigationContainer} from '@react-navigation/native';
import {AppNavigator} from './src/navigation/AppNavigator';
import {DIProvider} from './src/di';
import {AuthProvider, SecurityProvider, SessionTimeoutProvider} from './src/providers';
import {ThemeProvider} from './src/providers';
import {TlsPinningBootstrap} from './src/presentation/TlsPinningBootstrap';
import {ErrorBoundary} from "react-error-boundary";
import {BoundaryAppFallback} from "./src/presentation/boundary/BoundaryAppFallback.tsx";

function App() {
  return (
    <ErrorBoundary fallbackRender={BoundaryAppFallback}>
      <DIProvider>
        <TlsPinningBootstrap />
        <SecurityProvider>
          <AuthProvider>
            <SessionTimeoutProvider>
              <ThemeProvider>
                <SafeAreaProvider>
                  <KeyboardProvider>
                    <NavigationContainer>
                      <AppNavigator />
                    </NavigationContainer>
                  </KeyboardProvider>
                </SafeAreaProvider>
              </ThemeProvider>
            </SessionTimeoutProvider>
          </AuthProvider>
        </SecurityProvider>
      </DIProvider>
    </ErrorBoundary>
  );
}

export default App;
