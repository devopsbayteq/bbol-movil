import React, {useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useTheme, type ThemeColors} from '../../providers/theme';
import {Lexend} from '../../theme/lexend';

const arrowBack = require('../../../assets/images/arrow-left.png');

interface HomeStackDetailHeaderProps {
  /** Si se omite, solo se muestra el botón atrás (p. ej. calendario de actividades). */
  title?: string;
  onPressBack: () => void;
}

export function HomeStackDetailHeader({
  title,
  onPressBack,
}: Readonly<HomeStackDetailHeaderProps>) {
  const {colors} = useTheme();
  const styles = useStyles(colors);
  const showTitle = Boolean(title?.trim());

  return (
    <View style={[styles.headerBar, !showTitle && styles.headerBarBackOnly]}>
      <TouchableOpacity
        onPress={onPressBack}
        accessibilityRole="button"
        accessibilityLabel="Volver">
        <Image
          source={arrowBack}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      {showTitle ? (
        <>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.headerSpacer} />
        </>
      ) : null}
    </View>
  );
}

function useStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        headerBar: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          paddingVertical: 12,
          backgroundColor: colors.white,
        },
        headerBarBackOnly: {
          justifyContent: 'flex-start',
          minHeight: 48,
          paddingTop: 13,
          paddingBottom: 13,
        },
        backIcon: {
          width: 20,
          height: 22,
        },
        headerTitle: {
          flex: 1,
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.textPrimary,
          textAlign: 'center',
          textTransform: 'uppercase',
        },
        headerSpacer: {
          width: 22,
          height: 12,
        },
      }),
    [colors],
  );
}
