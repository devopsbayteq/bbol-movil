import React, {useMemo} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {useTheme, type ThemeColors} from '../../../../providers/theme';
import {Lexend} from '../../../../theme/lexend';

export type OtpCodeInputVariant = 'dots' | 'boxed';

interface OtpCodeInputProps {
  value: string;
  length?: number;
  disabled?: boolean;
  hasError?: boolean;
  variant?: OtpCodeInputVariant;
}

export function OtpCodeInput({
  value,
  length = 6,
  disabled = false,
  hasError = false,
  variant = 'dots',
}: OtpCodeInputProps) {
  const {colors} = useTheme();
  const styles = useStyles(colors);

  const cells = Array.from({length}, (_, index) => value[index] ?? '');

  if (variant === 'boxed') {
    return (
      <View style={styles.rowBoxed}>
        {cells.map((digit, index) => {
          const filled = !!digit;
          return (
            <View
              key={index}
              style={[
                styles.box,
                hasError && styles.boxError,
                disabled && styles.boxDisabled,
              ]}>
              {filled ? (
                <Text style={styles.boxDigit}>{digit}</Text>
              ) : (
                <View style={styles.boxPlaceholder} />
              )}
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.row}>
      {cells.map((digit, index) => {
        const filled = !!digit;
        return (
          <View
            key={index}
            style={[
              styles.dot,
              filled ? styles.dotFilled : styles.dotEmpty,
              hasError && styles.dotError,
              disabled && styles.dotDisabled,
            ]}
          />
        );
      })}
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
          justifyContent: 'center',
          gap: 20,
        },
        dot: {
          width: 14,
          height: 14,
          borderRadius: 7,
          borderWidth: 2,
        },
        dotFilled: {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        },
        dotEmpty: {
          backgroundColor: 'transparent',
          borderColor: colors.textTertiary,
        },
        dotError: {
          borderColor: colors.error,
        },
        dotDisabled: {
          opacity: 0.7,
        },
        rowBoxed: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 8,
        },
        box: {
          width: 44,
          height: 48,
          borderRadius: 8,
          backgroundColor: colors.surface,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.borderLight,
          alignItems: 'center',
          justifyContent: 'center',
          ...Platform.select({
            ios: {
              shadowColor: colors.shadowSoft,
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 1,
              shadowRadius: 4,
            },
            android: {
              elevation: 2,
            },
          }),
        },
        boxError: {
          borderColor: colors.error,
        },
        boxDisabled: {
          opacity: 0.7,
        },
        boxDigit: {
          fontFamily: Lexend.semiBold,
          fontSize: 22,
          lineHeight: 28,
          color: colors.textPrimary,
        },
        boxPlaceholder: {
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: colors.textTertiary,
        },
      }),
    [colors],
  );
}
