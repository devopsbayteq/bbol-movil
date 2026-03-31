import React, {useMemo} from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {useTheme, type ThemeColors} from '../../providers/theme';
import {Lexend} from '../../theme/lexend';

type ButtonVariant = 'primary' | 'outline' | 'loginPrimary';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  title,
  onPress,
  loading = false,
  variant = 'primary',
  disabled = false,
  style,
}: ButtonProps) {
  const {colors} = useTheme();
  const styles = useStyles(colors);

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'outline' && styles.outline,
        variant === 'loginPrimary' && styles.loginPrimary,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'outline' ? colors.primary : colors.white
          }
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.text,
            variant === 'outline' && styles.outlineText,
            variant === 'loginPrimary' && styles.loginPrimaryText,
          ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

function useStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        base: {
          borderRadius: 12,
          paddingVertical: 14,
          paddingHorizontal: 24,
          alignItems: 'center',
          justifyContent: 'center',
        },
        primary: {
          backgroundColor: colors.primary,
        },
        outline: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.borderLight,
        },
        loginPrimary: {
          borderRadius: 8,
          paddingVertical: 16,
          paddingHorizontal: 16,
          backgroundColor: colors.primary,
          width: '100%',
        },
        disabled: {
          opacity: 0.7,
        },
        text: {
          color: colors.white,
          fontSize: 16,
          fontWeight: '600',
        },
        outlineText: {
          color: colors.primary,
        },
        loginPrimaryText: {
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          lineHeight: 22,
          color: colors.white,
        },
      }),
    [colors],
  );
}
