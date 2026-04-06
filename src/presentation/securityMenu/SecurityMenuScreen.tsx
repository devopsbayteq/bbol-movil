import {useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Switch, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTheme, type ThemeColors} from '../../providers';
import {Lexend} from '../../theme/lexend';
import type {RootStackParamList} from '../../navigation/AppNavigator';
import {ToolbarApp} from '../transfer/components/ToolbarApp';
import {SecurityBugIcon} from './SecurityMenuIcons';

export function SecurityMenuScreen() {
  const {colors} = useTheme();
  const styles = useStyles(colors);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'SecurityMenu'>>();
  const [screenshotBlockEnabled, setScreenshotBlockEnabled] = useState(false);

  return (
    <View style={styles.root}>
      <ToolbarApp
        title="Seguridad"
        onBackPress={() => {
          navigation.pop();
        }}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Bloqueo de capturas de pantalla</Text>
        <View style={styles.card}>
          <SecurityBugIcon color={colors.primary} size={24} />
          <View style={styles.cardTextCol}>
            <Text style={styles.cardTitle}>
              {screenshotBlockEnabled ? 'Activado' : 'Desactivado'}
            </Text>
            <Text style={styles.cardSubtitle}>
              Evita que aplicaciones maliciosas puedan grabar tu pantalla
            </Text>
          </View>
          <Switch
            value={screenshotBlockEnabled}
            onValueChange={setScreenshotBlockEnabled}
            trackColor={{
              false: colors.border,
              true: colors.primaryLight,
            }}
            thumbColor={colors.white}
            ios_backgroundColor={colors.border}
          />
        </View>
      </ScrollView>
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
        },
        scroll: {
          flex: 1,
        },
        scrollContent: {
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 32,
        },
        sectionTitle: {
          fontFamily: Lexend.semiBold,
          fontSize: 15,
          lineHeight: 22,
          color: colors.textPrimary,
          marginBottom: 10,
        },
        card: {
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
        },
        cardTextCol: {
          flex: 1,
          marginLeft: 12,
          minWidth: 0,
        },
        cardTitle: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          lineHeight: 22,
          color: colors.textPrimary,
          marginBottom: 4,
        },
        cardSubtitle: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 18,
          color: colors.textTertiary,
        },
      }),
    [colors],
  );
}
