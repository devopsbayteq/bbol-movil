import React, {useMemo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme, type ThemeColors} from '../../../providers/theme';
import {Lexend} from '../../../theme/lexend';
import {EyeIcon, EyeSlashIcon} from '../../components';
import {UserAvatarIcon, LogoutIcon, PlusIcon} from './HomeIcons';

type Props = {
  userName?: string | null;
  /** Cuando es true, los importes del carousel se muestran enmascarados. */
  balancesMasked: boolean;
  onToggleBalances: () => void;
  onRequestProducts?: () => void;
  onLogout?: () => void;
};

export function HomeHeader({
  userName,
  balancesMasked,
  onToggleBalances,
  onRequestProducts,
  onLogout,
}: Readonly<Props>) {
  const {colors} = useTheme();
  const styles = useStyles(colors);
  const displayName = userName?.trim() || 'Usuario';

  return (
    <View style={styles.row}>
      <View style={styles.leftGroup}>
        <View style={styles.avatarCircle}>
          <UserAvatarIcon color={colors.white} size={16} />
        </View>
        <View style={styles.greetingBlock}>
          <Text style={styles.greetingLine} accessibilityRole="header">
            <Text style={styles.greetingHola}>Hola</Text>
            <Text style={styles.greetingComma}>, </Text>
            <Text style={styles.greetingName}>{displayName}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.rightGroup}>
        <TouchableOpacity
          onPress={onToggleBalances}
          accessibilityRole="button"
          accessibilityLabel={
            balancesMasked ? 'Mostrar montos de productos' : 'Ocultar montos'
          }
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
          activeOpacity={0.7}>
          {balancesMasked ? (
            <EyeSlashIcon color={colors.white} size={20} />
          ) : (
            <EyeIcon color={colors.white} size={20} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.productosPill}
          onPress={onRequestProducts}
          disabled={!onRequestProducts}
          accessibilityRole="button"
          accessibilityLabel="Solicitar productos"
          activeOpacity={0.75}>
          <PlusIcon color={colors.white} size={12} />
          <Text style={styles.productosPillText}>Productos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="logout-button"
          onPress={onLogout}
          accessibilityRole="button"
          accessibilityLabel="Cerrar sesión"
          style={styles.logoutBtn}
          activeOpacity={0.7}>
          <LogoutIcon color={colors.white} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function useStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 8,
        },
        leftGroup: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          flex: 1,
          minWidth: 0,
        },
        avatarCircle: {
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: colors.homeAvatarCircle,
          alignItems: 'center',
          justifyContent: 'center',
        },
        greetingBlock: {
          flex: 1,
          minWidth: 0,
        },
        greetingLine: {
          flexWrap: 'wrap',
        },
        greetingHola: {
          fontFamily: Lexend.regular,
          fontSize: 16,
          lineHeight: 24,
          color: colors.white,
        },
        greetingComma: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 24,
          color: colors.white,
        },
        greetingName: {
          fontFamily: Lexend.semiBold,
          fontSize: 16,
          lineHeight: 24,
          color: colors.white,
        },
        rightGroup: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
        },
        productosPill: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 8,
          backgroundColor: colors.homeHeaderIconButtonBg,
        },
        productosPillText: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.white,
        },
        logoutBtn: {
          width: 32,
          height: 32,
          borderRadius: 4,
          backgroundColor: colors.homeHeaderIconButtonBg,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }),
    [colors],
  );
}
