import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TransferScreen} from '../presentation/transfer/TransferScreen';
import {BeneficiarySelectScreen} from '../presentation/beneficiary/BeneficiarySelectScreen';
import type {BeneficiaryOption} from '../presentation/transfer/transferTypes';
import type {TransferReviewRouteParams} from '../presentation/transfer/transferReviewTypes';
import { TransferReviewScreen } from '../presentation/transfer/TransferReviewScreen';

export type TransferStackParamList = {
  TransferMain:
    | {
        selectedBeneficiary?: BeneficiaryOption;
      }
    | undefined;
  BeneficiarySelect: undefined;
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
      <Stack.Screen
        name="BeneficiarySelect"
        component={BeneficiarySelectScreen}
      />
    </Stack.Navigator>
  );
}
