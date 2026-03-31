import React, {useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {useTheme, type ThemeColors} from '../../providers/theme';
import {Lexend} from '../../theme/lexend';

interface LoginTextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  hasError?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export function LoginTextField({
  label,
  hasError = false,
  containerStyle,
  ...textInputProps
}: LoginTextFieldProps) {
  const {colors} = useTheme();
  const styles = useStyles(colors);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, hasError && styles.inputError]}
        placeholderTextColor={colors.placeholder}
        {...textInputProps}
      />
    </View>
  );
}

function useStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          width: '100%',
        },
        label: {
          fontFamily: Lexend.semiBold,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textPrimary,
          marginLeft: 4,
          marginBottom: 8,
        },
        input: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textPrimary,
          backgroundColor: colors.inputBg,
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 17,
          borderWidth: 0,
        },
        inputError: {
          borderWidth: 1,
          borderColor: colors.error,
        },
      }),
    [colors],
  );
}
