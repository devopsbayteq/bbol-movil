import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainTabNavigator} from './MainTabNavigator';
import {PublicKeyErrorScreen, SplashScreen} from '../presentation/splash';
import {useAuth, useSecurity} from '../providers';
import {LoinStackNavigator} from "./LoginStackNavigation.tsx";

export type RootStackParamList = {
  LoginStack: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const {isAuthenticated, isLoading} = useAuth();
  const {
    publicKey,
    isLoading: isPublicKeyLoading,
    error: publicKeyError,
    retry: retryPublicKey,
  } = useSecurity();
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (publicKeyError && !publicKey) {
    return (
      <PublicKeyErrorScreen
        message={publicKeyError}
        onRetry={() => {
          void retryPublicKey();
        }}
        isRetrying={isPublicKeyLoading}
      />
    );
  }

  if (isPublicKeyLoading || publicKey === null) {
    return <SplashScreen />;
  }

  if (isSplashVisible || isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator  screenOptions={{headerShown: false}}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
        </>
      ) : (
        <Stack.Screen name="LoginStack" component={LoinStackNavigator}/>
      )}
    </Stack.Navigator>
  );
}
