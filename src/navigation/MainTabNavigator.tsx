import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {HomeScreen} from '../presentation/home/HomeScreen';
import {TransferStackNavigator} from './TransferStackNavigator';
import {TransactionsScreen} from '../presentation/transactions/TransactionsScreen';
import {useTheme} from '../providers/theme';
import {Lexend} from '../theme/lexend';
import {TabHomeIcon, TabMovementsIcon, TabTransferIcon} from './tabIcons';

const TAB_BAR_HEIGHT = 60;

export type MainTabParamList = {
  Home: undefined;
  Transfer: undefined;
  Movements: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabBarIconProps = {color: string; size?: number};

const tabBarIconHome = ({color, size}: TabBarIconProps) => (
  <TabHomeIcon color={color} size={size ?? 24} />
);

const tabBarIconTransfer = ({color, size}: TabBarIconProps) => (
  <TabTransferIcon color={color} size={size ?? 24} />
);

const tabBarIconMovements = ({color, size}: TabBarIconProps) => (
  <TabMovementsIcon color={color} size={size ?? 24} />
);

export function MainTabNavigator() {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#C8C8C8',
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.borderLight,
          height: TAB_BAR_HEIGHT + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 4),
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontFamily: Lexend.semiBold,
          fontSize: 12,
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
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
