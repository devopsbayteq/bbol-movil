import React, {useMemo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme, type ThemeColors} from '../../../providers/theme';
import {Lexend} from '../../../theme/lexend';
import {HOME_HEADER_AVATAR_BG, HOME_PRIMARY_PRESSED} from '../homeConstants';
import {UserAvatarIcon, BellIcon, LogoutIcon} from './HomeIcons';

type Props = {
  userName?: string | null;
  onLogout?: () => void;
};

export function HomeHeader({userName, onLogout}: Props) {
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
          <Text style={styles.welcomeLabel}>Bienvenido de vuelta,</Text>
          <Text style={styles.greetingName}>{displayName}</Text>
        </View>
      </View>

      <View style={styles.rightGroup}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Notificaciones"
          activeOpacity={0.7}>
          <BellIcon color={colors.white} size={20} />
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
          paddingTop: 8,
          paddingBottom: 16,
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
          backgroundColor: HOME_HEADER_AVATAR_BG,
          alignItems: 'center',
          justifyContent: 'center',
        },
        greetingBlock: {
          flex: 1,
          minWidth: 0,
        },
        welcomeLabel: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.white,
        },
        greetingName: {
          fontFamily: Lexend.regular,
          fontSize: 18,
          lineHeight: 28,
          color: colors.white,
        },
        rightGroup: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
        },
        logoutBtn: {
          width: 32,
          height: 32,
          borderRadius: 4,
          backgroundColor: HOME_PRIMARY_PRESSED,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }),
    [colors],
  );
}
