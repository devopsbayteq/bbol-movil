import React, {useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {useTheme, type ThemeColors} from '../../providers/theme';
import {Lexend} from '../../theme/lexend';

type LoginTextFieldVariant = 'flat' | 'elevated';

interface LoginTextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  hasError?: boolean;
  errorMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
  variant?: LoginTextFieldVariant;
  testID?: string;
  errorTestID?: string;
}

export function LoginTextField({
  label = '',
  hasError = false,
  errorMessage,
  containerStyle,
  variant = 'flat',
  testID,
  errorTestID,
  ...textInputProps
}: LoginTextFieldProps) {
  const {colors} = useTheme();
  const styles = useStyles(colors);
  const showLabel = label.trim().length > 0;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {showLabel ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        testID={testID}
        style={[
          styles.input,
          variant === 'elevated' && styles.inputElevated,
          (hasError || !!errorMessage) && styles.inputError,
        ]}
        placeholderTextColor={colors.placeholder}
        {...textInputProps}
      />
      {errorMessage ? (
        <Text testID={errorTestID} style={styles.errorText}>{errorMessage}</Text>
      ) : null}
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
          fontSize: 14,
          lineHeight: 22,
          color: colors.textPrimary,
          marginLeft: 4,
          marginBottom: 8,
        },
        input: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          lineHeight: 22,
          color: colors.textPrimary,
          backgroundColor: colors.inputBg,
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderWidth: 0,
        },
        inputElevated:
          Platform.OS === 'ios'
            ? {
                shadowColor: '#000000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.12,
                shadowRadius: 6,
              }
            : {
                elevation: 4,
              },
        inputError: {
          borderWidth: 1,
          borderColor: colors.error,
        },
        errorText: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 18,
          color: colors.error,
          marginTop: 4,
          marginLeft: 4,
        },
      }),
    [colors],
  );
}
