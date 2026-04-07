import React, {useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {useTheme, type ThemeColors} from '../../../providers/theme';
import {Lexend} from '../../../theme/lexend';
import type {UpcomingPaymentsSummary} from '../homeDashboardMocks';
import {ChevronRightIcon, CreditCardOutlineIcon} from './HomeIcons';

type Props = {
  summary: UpcomingPaymentsSummary;
  onPress?: () => void;
};

export function UpcomingPaymentsRow({summary, onPress}: Props) {
  const {colors} = useTheme();
  const styles = useStyles(colors);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${summary.summaryLine}. ${summary.amountLabel}`}>
      <View style={styles.iconCircle}>
        <CreditCardOutlineIcon color={colors.primary} size={22} />
      </View>
      <View style={styles.centerBlock}>
        <Text style={styles.summary}>{summary.summaryLine}</Text>
        <Text style={styles.link}>{summary.linkLabel}</Text>
      </View>
      <View style={styles.rightBlock}>
        <Text style={styles.amount}>{summary.amountLabel}</Text>    
      </View>
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
        iconCircle: {
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: colors.primaryLight,
          alignItems: 'center',
          justifyContent: 'center',
        },
        centerBlock: {
          flex: 1,
          gap: 2,
        },
        summary: {
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          lineHeight: 20,
          color: colors.textPrimary,
        },
        link: {
          fontFamily: Lexend.regular,
          fontSize: 13,
          lineHeight: 18,
          color: colors.linkPrimary,
          textDecorationLine: 'underline',
        },
        rightBlock: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        },
        amount: {
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          lineHeight: 20,
          color: colors.textPrimary,
        },
      }),
    [colors],
  );
}
