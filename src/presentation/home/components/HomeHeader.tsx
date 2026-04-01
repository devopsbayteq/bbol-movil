import React, {useMemo} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {useTheme, type ThemeColors} from '../../../providers/theme';
import {Lexend} from '../../../theme/lexend';

const bbIcon = require('../../../../assets/images/BBIcon.png');

type Props = {
  userName?: string | null;
};

export function HomeHeader({userName}: Props) {
  const {colors} = useTheme();
  const styles = useStyles(colors);
  const displayName = userName?.trim() || 'Usuario';

  return (
    <View style={styles.row}>
      <Image
        source={bbIcon}
        style={styles.logoMark}
        resizeMode="cover"
        accessibilityLabel="Banco Bolivariano"
      />
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
        },
        greetingBlock: {
          flex: 1,
        },
        welcomeLabel: {
          fontFamily: Lexend.regular,
          fontSize: 11,
          lineHeight: 16,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          color: colors.textSecondary,
        },
        greetingName: {
          fontFamily: Lexend.bold,
          fontSize: 26,
          lineHeight: 34,
          color: colors.textPrimary,
          marginTop: 2,
        },
      }),
    [colors],
  );
}
