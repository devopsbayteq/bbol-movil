import React, {useCallback} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {TransferScreen} from '../presentation/transfer/TransferScreen';
import type {TransferReviewRouteParams} from '../presentation/transfer/TransferReview/transferReviewTypes';
import {TransferReviewScreen} from '../presentation/transfer/TransferReview/TransferReviewScreen';
import {OtpValidationScreen} from "../presentation/otp";
import {OtpValidationParams} from "./LoginStackNavigation.tsx";
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {MainTabParamList} from './MainTabNavigator';

export type TransferStackParamList = {
  TransferMain: undefined;
  TransferReview: TransferReviewRouteParams;
  OtpValidationTransfer:OtpValidationParams
};

const Stack = createNativeStackNavigator<TransferStackParamList>();

export function TransferStackNavigator() {

    const navigation =
        useNavigation<BottomTabNavigationProp<MainTabParamList>>();

    useFocusEffect(
        useCallback(() => {
            navigation.navigate('Transfer', {
                screen: 'TransferMain',
            });
        }, [navigation])
    );

    return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',

      }}>
      <Stack.Screen name="TransferMain" component={TransferScreen} />
      <Stack.Screen name="TransferReview" component={TransferReviewScreen} />
      <Stack.Screen name="OtpValidationTransfer" component={OtpValidationScreen} />
    </Stack.Navigator>
  );
}
