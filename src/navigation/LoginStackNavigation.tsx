import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoginScreen} from "../presentation/auth/LoginScreen.tsx";
import {OtpValidationScreen} from "../presentation/otp";
import {User} from "../domain/entities/User.ts";

export type OtpValidationParams =
    | {mode: 'login'; user: User; email: string}
    | {mode: 'transfer'; email: string};

export type RootStackParamList = {
    Login: undefined;
    OtpValidation: OtpValidationParams;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function LoinStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OtpValidation" component={OtpValidationScreen} />
    </Stack.Navigator>
  );
}
