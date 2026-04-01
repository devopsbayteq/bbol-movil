import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoginScreen} from '../presentation/auth/LoginScreen';
import {MainTabNavigator} from './MainTabNavigator';
import {PublicKeyErrorScreen, SplashScreen} from '../presentation/splash';
import {OtpValidationScreen} from '../presentation/otp';
import {useAuth, useSecurity} from '../providers';
import {User} from '../domain/entities/User';

export type RootStackParamList = {
  Login: undefined;
  OtpValidation: {
    user: User;
    email: string;
  };
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
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="OtpValidation" component={OtpValidationScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
