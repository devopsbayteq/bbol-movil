import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TransferScreen} from '../presentation/transfer/TransferScreen';
import type {TransferReviewRouteParams} from '../presentation/transfer/TransferReview/transferReviewTypes';
import {TransferReviewScreen} from '../presentation/transfer/TransferReview/TransferReviewScreen';
import {OtpValidationParams} from "./AppNavigator.tsx";
import {OtpValidationScreen} from "../presentation/otp";
import {TransferVoucherScreen} from "../presentation/transfer/TranferVoucherScreen.tsx";
import {TransferDataResume} from "../presentation/transfer/components/TransferModalSuccess.tsx";

export type TransferStackParamList = {
    TransferMain: undefined;
    TransferReview: TransferReviewRouteParams;
    OtpValidationTransfer: OtpValidationParams;
    TransferVoucher: {routeSuccessTransactionData: TransferDataResume};
};

const Stack = createNativeStackNavigator<TransferStackParamList>();

export function TransferStackNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}>
            <Stack.Screen name="TransferMain" component={TransferScreen}/>
            <Stack.Screen name="TransferReview" component={TransferReviewScreen}/>
            <Stack.Screen name="OtpValidationTransfer" component={OtpValidationScreen}/>
            <Stack.Screen name="TransferVoucher" component={TransferVoucherScreen}/>
        </Stack.Navigator>
    );
}
