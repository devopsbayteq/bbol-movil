import React, {useMemo, type ReactNode} from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  ImageSourcePropType,
  Image,
  View,
} from 'react-native';
import {useTheme, type ThemeColors} from '../../providers/theme';
import {Lexend} from '../../theme/lexend';

type ButtonVariant = 'primary' | 'outline' | 'loginPrimary';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  iconSource?: ImageSourcePropType;
  iconSourceRight?: ImageSourcePropType;
  /** Si se define, sustituye a `iconSource` (p. ej. SVG). */
  iconNodeLeft?: ReactNode;
  /** Si se define, sustituye a `iconSourceRight` (p. ej. SVG). */
  iconNodeRight?: ReactNode;
  iconRightTintColor?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Button({
  title,
  onPress,
  loading = false,
  iconSource,
  iconSourceRight,
  iconNodeLeft,
  iconNodeRight,
  iconRightTintColor,
  variant = 'primary',
  disabled = false,
  style,
  testID,
}: ButtonProps) {
  const {colors} = useTheme();
  const styles = useStyles(colors);

  const isPressDisabled = disabled || loading;
  const loginPrimaryDisabledLook =
    variant === 'loginPrimary' && disabled && !loading;

  return (
    <TouchableOpacity
      testID={testID}
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'outline' && styles.outline,
        variant === 'loginPrimary' && styles.loginPrimary,
        loginPrimaryDisabledLook && styles.loginPrimaryDisabled,
        isPressDisabled && !loginPrimaryDisabledLook && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isPressDisabled}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'outline' ? colors.primary : colors.white
          }
          size="small"
        />
      ) : (
        <View style={styles.contentRow}>
          {iconNodeLeft ? (
            <View style={styles.iconLeadingWrap}>{iconNodeLeft}</View>
          ) : iconSource ? (
            <Image source={iconSource} style={styles.iconLeading} resizeMode="contain" />
          ) : null}
          <Text
            style={[
              styles.text,
              variant === 'outline' && styles.outlineText,
              variant === 'loginPrimary' && styles.loginPrimaryText,
            ]}>
            {title}
          </Text>
          {iconNodeRight ? (
            <View style={styles.iconTrailingWrap}>{iconNodeRight}</View>
          ) : iconSourceRight ? (
            <Image
              source={iconSourceRight}
              style={[
                styles.iconTrailing,
                iconRightTintColor ? {tintColor: iconRightTintColor} : null,
              ]}
              resizeMode="contain"
            />
          ) : null}
        </View>
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
        loginPrimaryDisabled: {
          backgroundColor: colors.textTertiary,
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
          fontSize: 16,
          lineHeight: 26,
          color: colors.white,
        },
        iconLeading: {
          width: 24,
          height: 24,
          marginRight: 8,
        },
        iconLeadingWrap: {
          marginRight: 8,
          justifyContent: 'center',
          alignItems: 'center',
        },
        iconTrailing: {
          width: 24,
          height: 24,
          marginLeft: 8,
        },
        iconTrailingWrap: {
          marginLeft: 8,
          justifyContent: 'center',
          alignItems: 'center',
        },
        contentRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        },
      }),
    [colors],
  );
}
