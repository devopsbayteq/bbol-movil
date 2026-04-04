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
import {useAuth} from '../../providers';
import {
  ErrorMessage,
  OtpCodeInput,
  OtpNumericKeypad,
  type OtpKeypadKey,
} from '../components';
import {Lexend} from '../../theme/lexend';
import {useOtpValidationViewModel} from './useOtpValidationViewModel';
import {RootStackParamList} from "../../navigation/AppNavigator.tsx";
import {TransferStackParamList} from "../../navigation/TransferStackNavigator.tsx";
import {TransferReviewRouteParams} from "../transfer/TransferReview/transferReviewTypes.ts";

const otpBackArrow = require('../../../assets/images/arrow-left.png');
const otpLockOpen = require('../../../assets/images/lock-keyhole-open.png');
const otpDelete = require('../../../assets/images/delete.png');

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
  const styles = useStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList|TransferStackParamList>>();
  const {login} = useAuth();
  const params = route.params;

  const {
    code,
    error,
    isLoading,
    onChangeCode,
    handleValidate,
  } = useOtpValidationViewModel(async () => {
      if (params.mode === 'login') {
        await login(params.user);
        return;
      }
      if (params.mode === 'transfer') {
           navigation.dispatch(StackActions.popTo('TransferReview',
              { resultFromOtp: { otpValidated: true } },
              {merge:true}));
      }
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
      'Si no recuerdas tu PIN o no recibiste el código, contacta a soporte.',
    );
  };

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
          AUTENTICACIÓN
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text style={styles.instruction}>Introduce tu PIN para continuar</Text>
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

        {error ? (
          <ErrorMessage testID="otp-error" message={error} style={styles.error} />
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <OtpNumericKeypad
          onKeyPress={handleKeypad}
          disabled={isLoading}
          deleteIconSource={otpDelete}
        />

        <TouchableOpacity
          onPress={handleForgotPin}
          activeOpacity={0.8}
          style={styles.forgotWrap}
          accessibilityRole="button">
          <Text style={styles.forgotText}>¿Olvidaste tu PIN?</Text>
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
          paddingTop: 28,
          paddingBottom: 16,
          alignItems: 'center',
        },
        instruction: {
          fontFamily: Lexend.regular,
          fontSize: 16,
          lineHeight: 26,
          color: colors.textPrimary,
          textAlign: 'center',
          paddingHorizontal: 8,
        },
        emailHint: {
          marginTop: 8,
          fontFamily: Lexend.regular,
          fontSize: 14,
          lineHeight: 22,
          color: colors.textSecondary,
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
        },
        error: {
          alignSelf: 'stretch',
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
          marginTop: 6,
          paddingVertical: 4,
        },
        resendLabel: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          lineHeight: 22,
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
