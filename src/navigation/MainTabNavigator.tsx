import React, {useCallback} from 'react';
import {Platform, StyleSheet} from 'react-native';
import {PlatformPressable} from '@react-navigation/elements';
import {
  createBottomTabNavigator,
  type BottomTabBarButtonProps,
} from '@react-navigation/bottom-tabs';
import {useIsFocused} from '@react-navigation/core';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {HomeScreen} from '../presentation/home/HomeScreen';
import {TransferStackNavigator} from './TransferStackNavigator';
import {TransactionsScreen} from '../presentation/transactions/TransactionsScreen';
import {useTheme} from '../providers/theme';
import {Lexend} from '../theme/lexend';
import {TabHomeIcon, TabMovementsIcon, TabTransferIcon} from './tabIcons';

const TAB_BAR_HEIGHT = 60;

export type MainTabParamList = {
  /** `refreshHome`: timestamp para forzar recarga al volver desde transferencia (opcional). */
  Home: {refreshHome?: number};
  Transfer: undefined;
  /** `accountGuid`: cuenta a consultar; si no se envía (tab), se usa la primera cuenta del home. */
  Movements: {accountGuid?: string} | undefined;
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

function UnmountOnBlur({children}: {children: React.ReactNode}) {
  const isFocused = useIsFocused();

  if (!isFocused) {
    return null;
  }

  return children;
}

function transferStackTabLayout({children}: {children: React.ReactNode}) {
  return <UnmountOnBlur>{children}</UnmountOnBlur>;
}

export function MainTabNavigator() {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();

  const tabBarButton = useCallback(
    (props: BottomTabBarButtonProps) => {
      const focused = props.accessibilityState?.selected;
      return (
        <PlatformPressable
          {...props}
          pressOpacity={0.88}
          style={[
            props.style,
            focused && {
              backgroundColor: colors.primary,
              borderRadius: 10,
              marginHorizontal: 4,
            },
          ]}
        />
      );
    },
    [colors.primary],
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarButton,
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
        layout={transferStackTabLayout}
        options={{
          popToTopOnBlur: true,
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
