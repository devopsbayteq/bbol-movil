import React, {useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme, type ThemeColors} from '../../../providers/theme';
import {Lexend} from '../../../theme/lexend';
import {HOME_BORDER_SOFT, HOME_PRIMARY_LAYER} from '../homeConstants';

type Props = {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
};

export function FrequentPaymentCard({label, icon, onPress}: Props) {
  const {colors} = useTheme();
  const styles = useStyles(colors);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function useStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          width: 96,
          padding: 12,
          borderRadius: 8,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: HOME_BORDER_SOFT,
        },
        iconWrap: {
          alignSelf: 'flex-start',
          backgroundColor: HOME_PRIMARY_LAYER,
          borderRadius: 8,
          padding: 8,
          marginBottom: 8,
        },
        label: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textPrimary,
          minHeight: 40,
        },
      }),
    [colors],
  );
}
