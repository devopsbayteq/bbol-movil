import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme, type ThemeColors} from '../../providers/theme';

/** Figma: filled #096877, empty border #757575, 12px circle, 16px gap */
const PIN_FILLED = '#096877';
const PIN_EMPTY_BORDER = '#757575';

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
              filled && styles.dotFilled,
              !filled && styles.dotEmpty,
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
          gap: 16,
        },
        dot: {
          width: 12,
          height: 12,
          borderRadius: 6,
          borderWidth: 2,
        },
        dotFilled: {
          backgroundColor: PIN_FILLED,
          borderColor: PIN_FILLED,
        },
        dotEmpty: {
          backgroundColor: 'transparent',
          borderColor: PIN_EMPTY_BORDER,
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
