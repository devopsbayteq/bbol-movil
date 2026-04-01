import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoginScreen} from '../presentation/auth/LoginScreen';
import {CertificateHandshakeScreen} from '../presentation/security/CertificateHandshakeScreen';
import {TransactionsScreen} from '../presentation/transactions/TransactionsScreen';
import {useAuth} from '../providers';
import {useTheme} from '../providers/theme';

export type RootStackParamList = {
  CertificateHandshake: undefined;
  Login: undefined;
  Transactions: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const {isAuthenticated, isLoading} = useAuth();
  const {colors} = useTheme();

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background}}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {isAuthenticated ? (
        <Stack.Screen name="Transactions" component={TransactionsScreen} />
      ) : (
        <>
          <Stack.Screen
            name="CertificateHandshake"
            component={CertificateHandshakeScreen}
          />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
