import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {useTheme, type ThemeColors} from '../../providers/theme';
import {Lexend} from '../../theme/lexend';

interface LoginPasswordFieldProps
  extends Omit<TextInputProps, 'style' | 'secureTextEntry'> {
  label: string;
  hasError?: boolean;
  eyeIconUri: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function LoginPasswordField({
  label,
  hasError = false,
  eyeIconUri,
  containerStyle,
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
          <Image
            source={{uri: eyeIconUri}}
            style={styles.eyeIcon}
            resizeMode="contain"
          />
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
          fontSize: 12,
          lineHeight: 20,
          color: colors.textPrimary,
        },
        inputRow: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.inputBg,
          borderRadius: 8,
          paddingLeft: 16,
          paddingRight: 12,
          paddingVertical: 17,
          borderWidth: 0,
        },
        inputRowError: {
          borderWidth: 1,
          borderColor: colors.error,
        },
        input: {
          flex: 1,
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textPrimary,
          paddingVertical: 0,
        },
        eyeButton: {
          padding: 4,
        },
        eyeIcon: {
          width: 20,
          height: 20,
          tintColor: colors.iconPrimary,
        },
      }),
    [colors],
  );
}
