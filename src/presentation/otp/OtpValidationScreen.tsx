import React, {useMemo, useEffect, useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
  ScrollView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {useTheme, type ThemeColors} from '../../providers/theme';
import {useAuth} from '../../providers';
import {
  ErrorMessage,
  OtpCodeInput,
  OtpNumericKeypad,
  type OtpKeypadKey,
} from '../components';
import {Lexend} from '../../theme/lexend';
import {useOtpValidationViewModel} from './useOtpValidationViewModel';
import {FIGMA_OTP_ASSETS} from './figmaOtpAssets';

type Props = NativeStackScreenProps<RootStackParamList, 'OtpValidation'>;

const INSTRUCTION_COLOR = '#3E494B';

export function OtpValidationScreen({route}: Props) {
  const {colors} = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {login} = useAuth();
  const params = route.params;
  const email = params.email;

  const {
    code,
    error,
    isLoading,
    canResend,
    resendLabel,
    onChangeCode,
    handleValidate,
    handleResend,
  } = useOtpValidationViewModel(async () => {
    if (params.mode === 'transfer') {
      navigation.goBack();
      return;
    }
    await login(params.user);
  });

  const lastSubmitted = useRef<string | null>(null);

  useEffect(() => {
    if (code.length < 6) {
      lastSubmitted.current = null;
    }
  }, [code]);

  useEffect(() => {
    if (code.length !== 6 || isLoading || error) {
      return;
    }
    if (lastSubmitted.current === code) {
      return;
    }
    lastSubmitted.current = code;
    handleValidate().catch(() => {});
  }, [code, isLoading, error, handleValidate]);

  const handleKeypad = (key: OtpKeypadKey) => {
    if (key === 'backspace') {
      onChangeCode(code.slice(0, -1));
      return;
    }
    if (code.length < 6) {
      onChangeCode(code + key);
    }
  };

  const handleForgotPin = () => {
    Alert.alert(
      'Ayuda',
      'Si no recuerdas tu PIN o no recibiste el codigo, contacta a soporte.',
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View
        style={styles.textureBg}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants">
        <Image
          source={{uri: FIGMA_OTP_ASSETS.backgroundTexture}}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      </View>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Volver">
          <Image
            source={{uri: FIGMA_OTP_ASSETS.backArrow}}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          AUTENTICACIÓN
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text style={styles.instruction}>Introduce tu PIN para continuar</Text>
        <Text style={styles.emailHint}>Codigo enviado a {email}</Text>

        <Image
          source={{uri: FIGMA_OTP_ASSETS.padlock}}
          style={styles.padlock}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />

        <View style={styles.pinSection}>
          <OtpCodeInput
            value={code}
            hasError={!!error}
            disabled={isLoading}
            length={6}
          />
        </View>

        {error ? <ErrorMessage message={error} style={styles.error} /> : null}
      </ScrollView>

      <View style={styles.footer}>
        <OtpNumericKeypad
          onKeyPress={handleKeypad}
          disabled={isLoading}
          backspaceIconUri={FIGMA_OTP_ASSETS.backspace}
        />

        <TouchableOpacity
          onPress={handleForgotPin}
          activeOpacity={0.8}
          style={styles.forgotWrap}
          accessibilityRole="button">
          <Text style={styles.forgotText}>¿Olvidaste tu PIN?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResend}
          disabled={!canResend}
          activeOpacity={0.8}
          style={styles.resendWrap}
          accessibilityRole="button">
          <Text
            style={[
              styles.resendLabel,
              !canResend && styles.resendLabelDisabled,
            ]}>
            {resendLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function useStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        safe: {
          flex: 1,
          backgroundColor: colors.background,
        },
        textureBg: {
          ...StyleSheet.absoluteFillObject,
          opacity: 0.03,
          zIndex: 0,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          minHeight: 64,
          backgroundColor: colors.white,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.borderLight,
        },
        backIcon: {
          width: 20,
          height: 20,
          tintColor: colors.iconPrimary,
        },
        headerTitle: {
          flex: 1,
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          lineHeight: 22,
          color: colors.textPrimary,
          textAlign: 'center',
        },
        headerSpacer: {
          width: 20,
        },
        scrollContent: {
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 16,
          alignItems: 'center',
        },
        instruction: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          lineHeight: 22,
          color: INSTRUCTION_COLOR,
          textAlign: 'center',
        },
        emailHint: {
          marginTop: 8,
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 18,
          color: colors.textTertiary,
          textAlign: 'center',
        },
        padlock: {
          width: 100,
          height: 100,
          marginTop: 20,
          marginBottom: 24,
          opacity: 0.85,
        },
        pinSection: {
          marginBottom: 16,
          alignSelf: 'stretch',
          alignItems: 'center',
        },
        error: {
          alignSelf: 'stretch',
          marginBottom: 8,
        },
        footer: {
          paddingHorizontal: 24,
          paddingBottom: 8,
          paddingTop: 8,
        },
        forgotWrap: {
          alignSelf: 'center',
          marginTop: 24,
          paddingVertical: 8,
          paddingHorizontal: 4,
          borderRadius: 8,
        },
        forgotText: {
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          lineHeight: 22,
          color: colors.primary,
          textAlign: 'center',
        },
        resendWrap: {
          alignSelf: 'center',
          marginTop: 8,
          paddingVertical: 4,
        },
        resendLabel: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 18,
          color: colors.linkPrimary,
          textAlign: 'center',
        },
        resendLabelDisabled: {
          color: colors.textTertiary,
        },
      }),
    [colors],
  );
}
