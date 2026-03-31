import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoginScreen} from '../presentation/auth/LoginScreen';
import {TransactionsScreen} from '../presentation/transactions/TransactionsScreen';
import {SplashScreen} from '../presentation/splash';
import {OtpValidationScreen} from '../presentation/otp';
import {useAuth} from '../providers';
import {User} from '../domain/entities/User';

export type RootStackParamList = {
  Login: undefined;
  OtpValidation: {
    user: User;
    email: string;
  };
  Transactions: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const {isAuthenticated, isLoading} = useAuth();
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (isSplashVisible || isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {isAuthenticated ? (
        <Stack.Screen name="Transactions" component={TransactionsScreen} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="OtpValidation" component={OtpValidationScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
