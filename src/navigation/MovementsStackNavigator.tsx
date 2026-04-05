import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {AccountMovement} from '../domain/entities/AccountMovement';
import {TransactionsScreen} from '../presentation/transactions/TransactionsScreen';
import {MovementDetailScreen} from '../presentation/transactions/MovementDetailScreen';

export type MovementsStackParamList = {
  MovementsList: {accountGuid?: string} | undefined;
  MovementDetail: {movement: AccountMovement};
};

const Stack = createNativeStackNavigator<MovementsStackParamList>();

export function MovementsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="MovementsList" component={TransactionsScreen} />
      <Stack.Screen name="MovementDetail" component={MovementDetailScreen} />
    </Stack.Navigator>
  );
}
