import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TransferScreen} from '../presentation/transfer/TransferScreen';
import type {TransferReviewRouteParams} from '../presentation/transfer/TransferReview/transferReviewTypes';
import {TransferReviewScreen} from '../presentation/transfer/TransferReview/TransferReviewScreen';

export type TransferStackParamList = {
  TransferMain: undefined;
  TransferReview: TransferReviewRouteParams;
};

const Stack = createNativeStackNavigator<TransferStackParamList>();

export function TransferStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="TransferMain" component={TransferScreen} />
      <Stack.Screen name="TransferReview" component={TransferReviewScreen} />
    </Stack.Navigator>
  );
}
