import React, {useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme, type ThemeColors} from '../../providers/theme';
import {Lexend} from '../../theme/lexend';
import {EmptyState} from '../components';

export function TransferPlaceholderScreen() {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useStyles(colors);

  return (
    <View style={[styles.root, {paddingTop: insets.top}]}>
      <Text style={styles.title}>Transferir</Text>
      <Text style={styles.subtitle}>
        Pronto podrás enviar dinero desde aquí.
      </Text>
      <EmptyState message="Función en preparación" />
    </View>
  );
}

function useStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          backgroundColor: colors.background,
          paddingHorizontal: 24,
        },
        title: {
          fontFamily: Lexend.bold,
          fontSize: 22,
          lineHeight: 32,
          color: colors.textPrimary,
          marginTop: 16,
          marginBottom: 8,
        },
        subtitle: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          lineHeight: 22,
          color: colors.textSecondary,
          marginBottom: 24,
        },
      }),
    [colors],
  );
}
