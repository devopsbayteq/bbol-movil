import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import type {NavigatorScreenParams} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {HomeScreen} from '../presentation/home/HomeScreen';
import {TransferStackNavigator} from './TransferStackNavigator';
import {TransactionsScreen} from '../presentation/transactions/TransactionsScreen';
import {useTheme} from '../providers/theme';
import {Lexend} from '../theme/lexend';
import {TabHomeIcon, TabMovementsIcon, TabTransferIcon} from './tabIcons';
import type {TransferStackParamList} from './TransferStackNavigator';

const TAB_BAR_HEIGHT = 60;

export type MainTabParamList = {
  Home: undefined;
  Transfer: NavigatorScreenParams<TransferStackParamList>;
  Movements: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabBarIconProps = {color: string; size?: number};

type TabBarIconPropsWithFocused = TabBarIconProps & {focused: boolean};

const tabBarIconHome = ({color, size, focused}: TabBarIconPropsWithFocused) => (
  <TabHomeIcon focused={focused} color={color} size={size ?? 24} />
);

const tabBarIconTransfer = ({color, size, focused}: TabBarIconPropsWithFocused) => (
  <TabTransferIcon focused={focused} color={color} size={size ?? 24} />
);

const tabBarIconMovements = ({color, size, focused}: TabBarIconPropsWithFocused) => (
  <TabMovementsIcon focused={focused} color={color} size={size ?? 24} />
);

export function MainTabNavigator() {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.borderLight,
          height: TAB_BAR_HEIGHT + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 4),
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontFamily: Lexend.semiBold,
          fontSize: 12,
          marginLeft: 4,
          marginBottom: 0,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
        tabBarItemStyle: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          paddingTop: Platform.OS === 'android' ? 4 : 0,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: tabBarIconHome,
        }}
      />
      <Tab.Screen
        name="Transfer"
        component={TransferStackNavigator}
        options={{
          title: 'Transferir',
          tabBarIcon: tabBarIconTransfer,
        }}
      />
      <Tab.Screen
        name="Movements"
        component={TransactionsScreen}
        options={{
          title: 'Movimientos',
          tabBarIcon: tabBarIconMovements,
        }}
      />
    </Tab.Navigator>
  );
}
