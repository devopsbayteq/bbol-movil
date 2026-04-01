import React, {useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme, type ThemeColors} from '../../../providers/theme';
import {Lexend} from '../../../theme/lexend';
import {HOME_BORDER_SOFT, HOME_PRIMARY_LAYER} from '../homeConstants';

type Props = {
  label: string;
  icon: React.ReactNode;
};

export function FrequentPaymentCard({label, icon}: Props) {
  const {colors} = useTheme();
  const styles = useStyles(colors);

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </View>
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
