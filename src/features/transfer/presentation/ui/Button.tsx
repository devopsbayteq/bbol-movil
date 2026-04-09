import React, {useMemo, type ReactNode} from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
  ImageSourcePropType,
  Image,
  View,
} from 'react-native';
import {useTheme, type ThemeColors} from '../../../../providers';
import {Lexend} from '../../theme/lexend';

type ButtonVariant = 'primary' | 'outline' | 'loginPrimary';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  iconSource?: ImageSourcePropType;
  iconSourceRight?: ImageSourcePropType | ReactNode;
  iconRightTintColor?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  /** Si se define, el fondo en estado deshabilitado o cargando usa este color (sin opacidad). */
  disabledBackgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  /** Estilo del texto del título (p. ej. tamaño en pantallas de comprobante). */
  labelStyle?: StyleProp<TextStyle>;
  testID?: string;
}

export function Button({
  title,
  onPress,
  loading = false,
  iconSource,
  iconSourceRight,
  iconRightTintColor,
  variant = 'primary',
  disabled = false,
  disabledBackgroundColor,
  style,
  labelStyle,
  testID,
}: ButtonProps) {
  const {colors} = useTheme();
  const styles = useStyles(colors);

  const isPressDisabled = disabled || loading;

  return (
    <TouchableOpacity
      testID={testID}
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'outline' && styles.outline,
        variant === 'loginPrimary' && styles.loginPrimary,
        isPressDisabled &&
          (disabledBackgroundColor
            ? {backgroundColor: disabledBackgroundColor}
            : styles.disabled),
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
          {iconSource ? (
            <Image source={iconSource} style={styles.iconLeading} resizeMode="contain" />
          ) : null}
          <Text
            style={[
              styles.text,
              variant === 'outline' && styles.outlineText,
              variant === 'loginPrimary' && styles.loginPrimaryText,
              labelStyle,
            ]}>
            {title}
          </Text>
          {iconSourceRight ? (
            React.isValidElement(iconSourceRight) ? (
              <View style={styles.iconTrailingContainer}>{iconSourceRight}</View>
            ) : (
              <Image
                source={iconSourceRight as ImageSourcePropType}
                style={[
                  styles.iconTrailing,
                  iconRightTintColor ? {tintColor: iconRightTintColor} : null,
                ]}
                resizeMode="contain"
              />
            )
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
        iconTrailingContainer: {
          marginLeft: 8,
          alignItems: 'center',
          justifyContent: 'center',
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
