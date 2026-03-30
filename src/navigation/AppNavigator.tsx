import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoginScreen} from '../presentation/auth/LoginScreen';
import {TransactionsScreen} from '../presentation/transactions/TransactionsScreen';

export type RootStackParamList = {
  Login: undefined;
  Transactions: {userName: string; userEmail: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Transactions" component={TransactionsScreen} />
    </Stack.Navigator>
  );
}
