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
import {RouteProp, StackActions, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useTheme, type ThemeColors} from '../../providers';
import {
  ErrorMessage,
  OtpCodeInput,
  OtpNumericKeypad,
  type OtpKeypadKey,
} from '../components';
import {Lexend} from '../../theme/lexend';
import {useOtpValidationViewModel} from './useOtpValidationViewModel';
import {RootStackParamList} from '../../navigation/AppNavigator.tsx';
import {TransferStackParamList} from '../../navigation/TransferStackNavigator.tsx';

const otpBackArrow = require('../../../assets/images/arrow-left.png');
const otpLockOpen = require('../../../assets/images/lock-keyhole-open.png');
const otpDelete = require('../../../assets/images/delete.png');
const otpShield = require('../../../assets/images/icon_shell.png');
const otpClock = require('../../../assets/images/clock-rotate-left.png');

type OTPScreenNavigationProp =
  | NativeStackNavigationProp<RootStackParamList, 'OtpValidation'>
  | NativeStackNavigationProp<TransferStackParamList, 'OtpValidationTransfer'>;

type OTPScreenRouteProp =
  | RouteProp<RootStackParamList, 'OtpValidation'>
  | RouteProp<TransferStackParamList, 'OtpValidationTransfer'>;

interface OTPScreenComponentProps {
  navigation: OTPScreenNavigationProp;
  route: OTPScreenRouteProp;
}

export function OtpValidationScreen({route}: OTPScreenComponentProps) {
  const {colors} = useTheme();
  const params = route.params;
  const isLogin = params.mode === 'login';
  const styles = useStyles(colors, isLogin ? 'login' : 'transfer');
  const navigation = useNavigation<
    NativeStackNavigationProp<RootStackParamList | TransferStackParamList>
  >();

  const {
    code,
    error,
    isLoading,
    onChangeCode,
    handleValidate,
    canResend,
    showResendControl,
    formattedCountdown,
    handleResend,
  } = useOtpValidationViewModel(
    async () => {
      if (params.mode === 'login') {
        (
          navigation as NativeStackNavigationProp<RootStackParamList>
        ).navigate('RegisterAlias', {
          user: params.user,
          email: params.email,
        });
        return;
      }
      if (params.mode === 'transfer') {
        navigation.dispatch(
          StackActions.popTo(
            'TransferReview',
            {resultFromOtp: {otpValidated: true}},
            {merge: true},
          ),
        );
      }
    },
    {flow: isLogin ? 'login' : 'transfer'},
  );

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
      'Si no recuerdas tu PIN o no recibiste el código, contacta a soporte.',
    );
  };

  const headerTitle = isLogin ? 'ENROLAMIENTO' : 'AUTENTICACIÓN';

  return (
    <SafeAreaView
      testID="otp-screen"
      style={styles.safe}
      edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Volver">
          <Image
            source={otpBackArrow}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {headerTitle}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {isLogin ? (
          <>
            <Text style={styles.sectionTitle}>Verificación de seguridad</Text>
            <Image
              source={otpShield}
              style={styles.shieldIcon}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
              accessibilityLabel="Verificación de seguridad"
            />
            <Text style={styles.loginBody}>
              Enviamos un código de verificación de 6 dígitos a tu celular
              terminado en ****458.
            </Text>
            <View style={styles.pinSection}>
              <OtpCodeInput
                value={code}
                hasError={!!error}
                disabled={isLoading}
                length={6}
                variant="boxed"
              />
            </View>
            <View style={styles.timerRow}>
              <Image
                source={otpClock}
                style={styles.timerIcon}
                resizeMode="contain"
                accessibilityIgnoresInvertColors
              />
              <Text style={styles.timerText}>
                El código expira en: {formattedCountdown}
              </Text>
            </View>
            {showResendControl ? (
              <Pressable
                onPress={() => handleResend()}
                disabled={!canResend}
                style={styles.resendWrap}
                accessibilityRole="button"
                accessibilityState={{disabled: !canResend}}
                accessibilityLabel="Reenviar código">
                <Text
                  style={[
                    styles.resendLabel,
                    !canResend && styles.resendLabelDisabled,
                  ]}>
                  Reenviar código
                </Text>
              </Pressable>
            ) : null}
          </>
        ) : (
          <>
            <Text style={styles.instruction}>
              Introduce tu PIN para continuar
            </Text>
            <Image
              source={otpLockOpen}
              style={styles.padlock}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
              accessibilityLabel="Candado abierto"
            />
            <View style={styles.pinSection}>
              <OtpCodeInput
                value={code}
                hasError={!!error}
                disabled={isLoading}
                length={6}
              />
            </View>
          </>
        )}

        {error ? (
          <ErrorMessage
            testID="otp-error"
            message={error}
            style={styles.error}
          />
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <OtpNumericKeypad
          onKeyPress={handleKeypad}
          disabled={isLoading}
          deleteIconSource={otpDelete}
        />

        {isLogin ? null : (
          <TouchableOpacity
            onPress={handleForgotPin}
            activeOpacity={0.8}
            style={styles.forgotWrap}
            accessibilityRole="button">
            <Text style={styles.forgotText}>¿Olvidaste tu PIN?</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

function useStyles(colors: ThemeColors, layout: 'login' | 'transfer') {
  return useMemo(
    () =>
      StyleSheet.create({
        safe: {
          flex: 1,
          backgroundColor: colors.background,
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
          width: 24,
          height: 24,
        },
        headerTitle: {
          flex: 1,
          fontFamily: Lexend.bold,
          fontSize: 16,
          lineHeight: 24,
          letterSpacing: 0.6,
          color: colors.textPrimary,
          textAlign: 'center',
        },
        headerSpacer: {
          width: 24,
        },
        scrollContent: {
          paddingHorizontal: 24,
          paddingTop: layout === 'login' ? 20 : 28,
          paddingBottom: 16,
          alignItems: layout === 'login' ? 'stretch' : 'center',
        },
        sectionTitle: {
          alignSelf: 'stretch',
          fontFamily: Lexend.bold,
          fontSize: 22,
          lineHeight: 30,
          color: colors.textPrimary,
          textAlign: 'left',
          marginBottom: 8,
        },
        loginBody: {
          alignSelf: 'stretch',
          fontFamily: Lexend.regular,
          fontSize: 15,
          lineHeight: 24,
          color: colors.textSecondary,
          textAlign: 'center',
          marginTop: 16,
          marginBottom: 8,
        },
        shieldIcon: {
          width: 120,
          height: 120,
          alignSelf: 'center',
          marginTop: 8,
          marginBottom: 8,
        },
        timerRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 20,
          gap: 8,
        },
        timerIcon: {
          width: 18,
          height: 18,
          tintColor: colors.textSecondary,
        },
        timerText: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          lineHeight: 22,
          color: colors.textSecondary,
        },
        instruction: {
          fontFamily: Lexend.regular,
          fontSize: 16,
          lineHeight: 26,
          color: colors.textPrimary,
          textAlign: 'center',
          paddingHorizontal: 8,
        },
        padlock: {
          width: 120,
          height: 120,
          marginTop: 28,
          marginBottom: 28,
        },
        pinSection: {
          alignSelf: 'stretch',
          alignItems: 'center',
          marginTop: layout === 'login' ? 20 : 0,
        },
        error: {
          alignSelf: 'stretch',
          marginTop: 12,
          marginBottom: 8,
        },
        footer: {
          paddingHorizontal: 24,
          paddingBottom: 8,
        },
        forgotWrap: {
          alignSelf: 'center',
          marginTop: 20,
          paddingVertical: 8,
          paddingHorizontal: 4,
          borderRadius: 8,
        },
        forgotText: {
          fontFamily: Lexend.bold,
          fontSize: 16,
          lineHeight: 26,
          color: colors.primary,
          textAlign: 'center',
        },
        resendWrap: {
          alignSelf: 'center',
          marginTop: 20,
          paddingVertical: 8,
          paddingHorizontal: 4,
        },
        resendLabel: {
          fontFamily: Lexend.regular,
          fontSize: 15,
          lineHeight: 24,
          color: colors.linkPrimary,
          textAlign: 'center',
        },
        resendLabelDisabled: {
          color: colors.textTertiary,
        },
      }),
    [colors, layout],
  );
}
