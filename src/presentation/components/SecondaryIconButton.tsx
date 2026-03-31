import React, {useMemo} from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {useTheme, type ThemeColors} from '../../providers/theme';
import {Lexend} from '../../theme/lexend';

interface SecondaryIconButtonProps {
  title: string;
  iconUri: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function SecondaryIconButton({
  title,
  iconUri,
  onPress,
  disabled = false,
  style,
}: SecondaryIconButtonProps) {
  const {colors} = useTheme();
  const styles = useStyles(colors);

  return (
    <TouchableOpacity
      style={[styles.root, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}>
      <Image
        source={{uri: iconUri}}
        style={styles.icon}
        resizeMode="contain"
      />
      <Text style={styles.label}>{title}</Text>
    </TouchableOpacity>
  );
}

function useStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          paddingVertical: 16,
          paddingHorizontal: 16,
          borderRadius: 8,
          backgroundColor: colors.buttonSecondaryBg,
          width: '100%',
        },
        disabled: {
          opacity: 0.6,
        },
        icon: {
          width: 20,
          height: 20,
          tintColor: colors.iconPrimary,
        },
        label: {
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          lineHeight: 22,
          color: colors.textPrimary,
        },
      }),
    [colors],
  );
}
