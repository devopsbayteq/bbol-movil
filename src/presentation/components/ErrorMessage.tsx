import React, {useMemo} from 'react';
import {View, Text, StyleSheet, type StyleProp, type ViewStyle} from 'react-native';
import {useTheme, type ThemeColors} from '../../providers/theme';

interface ErrorMessageProps {
  message: string;
  style?: StyleProp<ViewStyle>;
}

export function ErrorMessage({message, style}: ErrorMessageProps) {
  const {colors} = useTheme();
  const styles = useStyles(colors);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

function useStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.errorBg,
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 12,
          borderWidth: 1,
          borderColor: colors.errorBorder,
        },
        text: {
          color: colors.error,
          fontSize: 14,
          textAlign: 'center',
        },
      }),
    [colors],
  );
}
