import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme, type ThemeColors} from '../../providers/theme';

interface OtpCodeInputProps {
  value: string;
  length?: number;
  disabled?: boolean;
  hasError?: boolean;
}

export function OtpCodeInput({
  value,
  length = 6,
  disabled = false,
  hasError = false,
}: OtpCodeInputProps) {
  const {colors} = useTheme();
  const styles = useStyles(colors);

  const cells = Array.from({length}, (_, index) => value[index] ?? '');

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
      }),
    [colors],
  );
}
