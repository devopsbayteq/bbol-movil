import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {useTheme, type ThemeColors} from '../../providers/theme';
import {Lexend} from '../../theme/lexend';

function EyeOnIcon({color}: {color: string}) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 15a3 3 0 100-6 3 3 0 000 6z"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function EyeOffIcon({color}: {color: string}) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M1 1l22 22"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

interface LoginPasswordFieldProps
  extends Omit<TextInputProps, 'style' | 'secureTextEntry'> {
  label: string;
  hasError?: boolean;
  eyeIconUri?: string;
  containerStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export function LoginPasswordField({
  label,
  hasError = false,
  containerStyle,
  testID,
  ...textInputProps
}: LoginPasswordFieldProps) {
  const {colors} = useTheme();
  const styles = useStyles(colors);
  const [visible, setVisible] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={[styles.inputRow, hasError && styles.inputRowError]}>
        <TextInput
          testID={testID}
          style={styles.input}
          placeholderTextColor={colors.placeholder}
          {...textInputProps}
          secureTextEntry={!visible}
        />
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={
            visible ? 'Ocultar contraseña' : 'Mostrar contraseña'
          }
          onPress={() => setVisible(v => !v)}
          style={styles.eyeButton}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          {visible ? (
            <EyeOnIcon color={colors.iconPrimary} />
          ) : (
            <EyeOffIcon color={colors.iconPrimary} />
          )}
        </TouchableOpacity>
      </View>
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
        labelRow: {
          paddingHorizontal: 4,
          marginBottom: 8,
        },
        label: {
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          lineHeight: 22,
          color: colors.textPrimary,
        },
        inputRow: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.inputBg,
          borderRadius: 8,
          paddingLeft: 16,
          paddingRight: 12,
          paddingVertical: 14,
          borderWidth: 0,
        },
        inputRowError: {
          borderWidth: 1,
          borderColor: colors.error,
        },
        input: {
          flex: 1,
          fontFamily: Lexend.regular,
          fontSize: 14,
          lineHeight: 22,
          color: colors.textPrimary,
          paddingVertical: 0,
        },
        eyeButton: {
          padding: 4,
        },
      }),
    [colors],
  );
}
