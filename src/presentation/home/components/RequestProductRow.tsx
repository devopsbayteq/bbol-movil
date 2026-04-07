import React, {useMemo} from 'react';
import {Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {useTheme, type ThemeColors} from '../../../providers/theme';
import {Lexend} from '../../../theme/lexend';
import {BankBuildingIcon, ChevronRightIcon} from './HomeIcons';

type Props = {
  onPress?: () => void;
};

export function RequestProductRow({onPress}: Props) {
  const {colors} = useTheme();
  const styles = useStyles(colors);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Solicita un producto"
      disabled={!onPress}>
      <BankBuildingIcon color={colors.primaryLight} size={44} />
      <Text style={styles.label}>Solicitar productos</Text>
      <ChevronRightIcon color={colors.textTertiary} size={18} />
    </TouchableOpacity>
  );
}

function useStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          backgroundColor: colors.surface,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 14,
          ...Platform.select({
            ios: {
              shadowColor: colors.shadowSoft,
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.08,
              shadowRadius: 8,
            },
            android: {
              elevation: 3,
            },
          }),
        },
        label: {
          flex: 1,
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          lineHeight: 20,
          color: colors.textPrimary,
        },
      }),
    [colors],
  );
}
