import React, {useMemo} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {useTheme, type ThemeColors} from '../../providers/theme';
import {Lexend} from '../../theme/lexend';

export type OtpKeypadKey =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'backspace';

interface OtpNumericKeypadProps {
  onKeyPress: (key: OtpKeypadKey) => void;
  disabled?: boolean;
  backspaceIconUri: string;
}

const ROWS: OtpKeypadKey[][] = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
];

export function OtpNumericKeypad({
  onKeyPress,
  disabled = false,
  backspaceIconUri,
}: OtpNumericKeypadProps) {
  const {colors} = useTheme();
  const styles = useStyles(colors);

  return (
    <View style={styles.wrap} accessibilityRole="keyboard">
      {ROWS.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map(key => (
            <TouchableOpacity
              key={key}
              style={[styles.key, disabled && styles.keyDisabled]}
              onPress={() => onKeyPress(key)}
              disabled={disabled}
              activeOpacity={0.75}
              accessibilityLabel={`Digito ${key}`}
              accessibilityRole="button">
              <Text style={styles.digit}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      <View style={styles.lastRowOuter}>
        <View style={styles.lastRowInner}>
          <TouchableOpacity
            style={[styles.key, styles.keyLastRow, disabled && styles.keyDisabled]}
            onPress={() => onKeyPress('0')}
            disabled={disabled}
            activeOpacity={0.75}
            accessibilityLabel="Digito 0"
            accessibilityRole="button">
            <Text style={styles.digit}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.key, styles.keyLastRow, disabled && styles.keyDisabled]}
            onPress={() => onKeyPress('backspace')}
            disabled={disabled}
            activeOpacity={0.75}
            accessibilityLabel="Borrar"
            accessibilityRole="button">
            <Image
              source={{uri: backspaceIconUri}}
              style={styles.backspaceIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function useStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          width: '100%',
          maxWidth: 274,
          alignSelf: 'center',
          gap: 24,
        },
        row: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          gap: 8,
        },
        lastRowOuter: {
          width: '100%',
          alignItems: 'center',
        },
        lastRowInner: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 168,
        },
        key: {
          flex: 1,
          minHeight: 64,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
          backgroundColor: colors.white,
          paddingVertical: 16,
          marginHorizontal: 0,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.12,
              shadowRadius: 3,
            },
            android: {
              elevation: 2,
            },
            default: {},
          }),
        },
        keyLastRow: {
          flex: 0,
          width: 76,
          minHeight: 68,
        },
        keyDisabled: {
          opacity: 0.5,
        },
        digit: {
          fontFamily: Lexend.bold,
          fontSize: 22,
          lineHeight: 32,
          color: '#1A1C1C',
        },
        backspaceIcon: {
          width: 25,
          height: 20,
        },
      }),
    [colors],
  );
}
