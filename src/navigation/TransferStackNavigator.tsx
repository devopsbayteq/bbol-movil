import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TransferPlaceholderScreen} from '../presentation/transfer/TransferPlaceholderScreen';
import {BeneficiarySelectScreen} from '../presentation/transfer/BeneficiarySelectScreen';
import type {BeneficiaryOption} from '../presentation/transfer/useTransferViewModel';

export type TransferStackParamList = {
  TransferMain:
    | {
        selectedBeneficiary?: BeneficiaryOption;
      }
    | undefined;
  BeneficiarySelect: undefined;
};

const Stack = createNativeStackNavigator<TransferStackParamList>();

export function TransferStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="TransferMain" component={TransferPlaceholderScreen} />
      <Stack.Screen
        name="BeneficiarySelect"
        component={BeneficiarySelectScreen}
      />
    </Stack.Navigator>
  );
}
