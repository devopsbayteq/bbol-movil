import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {AppNavigator} from './src/navigation/AppNavigator';
import {DIProvider} from './src/di';
import {AuthProvider, SecurityProvider} from './src/providers';
import {ThemeProvider} from './src/providers/theme';

function App() {
  return (
    <DIProvider>
      <SecurityProvider>
        <AuthProvider>
          <ThemeProvider>
            <SafeAreaProvider>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </SafeAreaProvider>
          </ThemeProvider>
        </AuthProvider>
      </SecurityProvider>
    </DIProvider>
  );
}

export default App;
