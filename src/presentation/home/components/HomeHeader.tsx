import React, {useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme, type ThemeColors} from '../../../providers/theme';
import {Lexend} from '../../../theme/lexend';

type Props = {
  userName?: string | null;
};

export function HomeHeader({userName}: Props) {
  const {colors} = useTheme();
  const styles = useStyles(colors);
  const displayName = userName?.trim() || 'Usuario';

  return (
    <View style={styles.row}>
      <View style={styles.logoMark} accessibilityLabel="Bolivariano">
        <Text style={styles.logoLetter}>B</Text>
      </View>
      <View style={styles.greetingBlock}>
        <Text style={styles.welcomeLabel}>Bienvenido de vuelta</Text>
        <Text style={styles.greetingName}>Hola, {displayName}</Text>
      </View>
    </View>
  );
}

function useStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          backgroundColor: colors.surface,
          paddingVertical: 16,
          paddingLeft: 24,
          paddingRight: 24,
        },
        logoMark: {
          width: 48,
          height: 48,
          borderRadius: 8,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        logoLetter: {
          fontFamily: Lexend.bold,
          fontSize: 22,
          color: colors.white,
        },
        greetingBlock: {
          flex: 1,
        },
        welcomeLabel: {
          fontFamily: Lexend.regular,
          fontSize: 10,
          lineHeight: 15,
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: colors.textSecondary,
        },
        greetingName: {
          fontFamily: Lexend.bold,
          fontSize: 22,
          lineHeight: 32,
          color: colors.textPrimary,
          marginTop: 2,
        },
      }),
    [colors],
  );
}
