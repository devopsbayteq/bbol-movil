import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {getVersion, getBuildNumber} from 'react-native-device-info';

import {formatAppVersionDisplay} from '../../utils/appVersion';
import {useTheme, type ThemeColors} from '../../providers';
import {
  ErrorMessage,
  LoginPasswordField,
  TertiaryLinkButton,
  DevelopmentNoticeModal,
  LoginHeroImageCarousel,
} from '../components';
import {Lexend} from '../../theme/lexend';

import LoginSubmitArrowSvg from '../../../assets/images/svg/arrow-right-from-bracket.svg';
import FingerprintSvg from '../../../assets/images/svg/fingerprint.svg';

// const bankBanner = require('../../../assets/images/BBBanner.png');
const bankBannerTwoLines = require('../../../assets/images/BBBannerTwoLines.png');
const heroLoginA = require('../../../assets/images/imagenfondo_login1.png');
const heroLoginB = require('../../../assets/images/imagenfondo_login2.png');
const institutionIcon = require('../../../assets/images/institution.png');
const arrowRightIcon = require('../../../assets/images/arrow_rigth_black.png');
const faceViewfinderIcon = require('../../../assets/images/face-viewfinder.png');

const LOGIN_SUBMIT_ICON_SIZE = 24;
const SUBMIT_SQUARE_SIZE_WIDTH = 60;
const SUBMIT_SQUARE_SIZE_HEIGHT = 48;
const BIOMETRIC_ICON_SIZE = 24;
const IS_IOS = Platform.OS === 'ios';
const BIOMETRIC_LABEL = IS_IOS ? 'Face ID' : 'Huella';
const BIOMETRIC_ACCESSIBILITY_LABEL = IS_IOS
  ? 'Iniciar sesión con Face ID'
  : 'Iniciar sesión con huella';
const AUTO_BIOMETRIC_PROMPT_DELAY_MS = 250;

export interface CompactLoginContentProps {
  greetingName: string;
  password: string;
  passwordError: string | null;
  onPasswordChange: (value: string) => void;
  isBusy: boolean;
  isLoadingLogin: boolean;
  isLoadingBiometric: boolean;
  error: string | null;
  showBiometricLogin: boolean;
  /** Si true, no se dispara el prompt biométrico al montar (p. ej. tras cerrar sesión). */
  suppressAutoBiometricPromptOnce?: boolean;
  onLogin: () => void;
  onBiometricLogin: () => void;
  onChangeUser: () => void;
}

export function CompactLoginContent({
  greetingName,
  password,
  passwordError,
  onPasswordChange,
  isBusy,
  isLoadingLogin,
  isLoadingBiometric,
  error,
  showBiometricLogin,
  suppressAutoBiometricPromptOnce = false,
  onLogin,
  onBiometricLogin,
  onChangeUser,
}: CompactLoginContentProps) {
  const {colors} = useTheme();
  const styles = useStyles(colors);
  const [devNoticeVisible, setDevNoticeVisible] = useState(false);
  const autoBiometricTriggeredRef = useRef(false);

  // Solicita biometría automáticamente al entrar al login compacto cuando hay
  // una credencial biométrica registrada. Sólo se dispara una vez por montaje
  // para no acosar al usuario si cancela o si el componente re-renderiza.
  useEffect(() => {
    if (
      !showBiometricLogin ||
      suppressAutoBiometricPromptOnce ||
      autoBiometricTriggeredRef.current
    ) {
      return;
    }
    autoBiometricTriggeredRef.current = true;
    const timeoutId = setTimeout(() => {
      onBiometricLogin();
    }, AUTO_BIOMETRIC_PROMPT_DELAY_MS);
    return () => clearTimeout(timeoutId);
  }, [
    showBiometricLogin,
    suppressAutoBiometricPromptOnce,
    onBiometricLogin,
  ]);

  const showDevelopmentNotice = useCallback(() => {
    setDevNoticeVisible(true);
  }, []);

  const closeDevelopmentNotice = useCallback(() => {
    setDevNoticeVisible(false);
  }, []);

  const versionLabel = useMemo(() => {
    return `Versión ${formatAppVersionDisplay(
      getVersion(),
      getBuildNumber(),
    )}`;
  }, []);

  const notYouTitle = useMemo(
    () => `¿No eres ${greetingName}?`,
    [greetingName],
  );

  const loginSubmitDisabled = isBusy || isLoadingLogin;

  return (
    <View style={styles.column}>
      <View style={styles.topRow}>
        <Image
          source={bankBannerTwoLines}
          style={styles.bankLogo}
          resizeMode="contain"
          accessibilityLabel="Banco Bolivariano"
        />
      </View>

      <View style={styles.heroCarousel}>
        <LoginHeroImageCarousel
          sourceA={heroLoginA}
          sourceB={heroLoginB}
          height={210}
        />
      </View>

      <Text style={styles.welcomeLine} accessibilityRole="text">
        <Text style={styles.welcomePrefix}>Bienvenido a tu banca </Text> 
        {'\n'}
        <Text style={styles.welcomePrefix}>móvil, </Text><Text style={styles.welcomeName}>{greetingName}</Text>
      </Text>

      <View style={styles.inputs}>
        <View style={styles.passwordRow}>
          <View style={styles.passwordFieldWrap}>
            <LoginPasswordField
              testID="login-password-input"
              label=""
              placeholder="Contraseña"
              value={password}
              onChangeText={onPasswordChange}
              hasError={!!passwordError}
              errorMessage={passwordError ?? undefined}
              errorTestID="login-password-error"
              editable={!isBusy}
              autoComplete="password"
            />
          </View>
          <Pressable
            testID="login-submit"
            onPress={onLogin}
            disabled={loginSubmitDisabled}
            style={({pressed}) => [
              styles.submitSquare,
              loginSubmitDisabled && styles.submitSquareDisabled,
              pressed && !loginSubmitDisabled && styles.submitSquarePressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Ingresar"
            accessibilityState={{disabled: loginSubmitDisabled}}>
            {isLoadingLogin ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <LoginSubmitArrowSvg
                width={LOGIN_SUBMIT_ICON_SIZE}
                height={LOGIN_SUBMIT_ICON_SIZE}
              />
            )}
          </Pressable>
        </View>
      </View>

      {error ? (
        <ErrorMessage
          testID="login-error"
          message={error}
          style={styles.errorBanner}
        />
      ) : null}

      {showBiometricLogin ? (
        <Pressable
          onPress={onBiometricLogin}
          disabled={isBusy}
          style={({pressed}) => [
            styles.biometricButton,
            isBusy && styles.biometricButtonDisabled,
            pressed && !isBusy && styles.biometricButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={BIOMETRIC_ACCESSIBILITY_LABEL}
          accessibilityState={{disabled: isBusy}}>
          {isLoadingBiometric ? (
            <ActivityIndicator color={colors.primary} size="small" />
          ) : (
            <>
              <Text style={styles.biometricLabel}>{BIOMETRIC_LABEL}</Text>
              {IS_IOS ? (
                <Image
                  source={faceViewfinderIcon}
                  style={styles.biometricFaceImage}
                  resizeMode="contain"
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                  accessibilityIgnoresInvertColors
                />
              ) : (
                <FingerprintSvg
                  width={BIOMETRIC_ICON_SIZE}
                  height={BIOMETRIC_ICON_SIZE}
                  color={colors.primary}
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                />
              )}
            </>
          )}
        </Pressable>
      ) : null}

      <TertiaryLinkButton
        testID="login-change-user"
        title={notYouTitle}
        onPress={onChangeUser}
        style={styles.changeUserLink}
      />

      <Pressable
        testID="login-request-product"
        onPress={showDevelopmentNotice}
        style={({pressed}) => [
          styles.productCard,
          pressed && styles.productCardPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Solicita un producto">
        <View style={styles.productIconCircle}>
          <Image
            source={institutionIcon}
            style={styles.productIconImage}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        </View>
        <Text style={styles.productCardTitle}>Solicita un producto</Text>
        <View style={styles.arrowRightIconWrap}>
          <Image
            source={arrowRightIcon}
            style={styles.arrowRightIcon}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        </View>
      </Pressable>

      <TertiaryLinkButton
        testID="login-contact-us"
        title="¿Necesitas ayuda?"
        onPress={showDevelopmentNotice}
        style={styles.contactLink}
        labelStyle={styles.contactLinkLabel}
      />

      <Text style={styles.versionText} numberOfLines={1}>
        {versionLabel}
      </Text>

      <DevelopmentNoticeModal
        visible={devNoticeVisible}
        onClose={closeDevelopmentNotice}
      />
    </View>
  );
}

function useStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        column: {
          width: '100%',
          alignSelf: 'stretch',
        },
        topRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginTop: 30,
          marginBottom: 24,
        },
        bankLogo: {
          width: 147,
          height: 41,
        },
        versionText: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 18,
          color: colors.textTertiary,
          textAlign: 'center',
          marginBottom: 8,
        },
        heroCarousel: {
          alignSelf: 'stretch',
          marginBottom: 16,
        },
        welcomeLine: {
          fontFamily: Lexend.regular,
          fontSize: 20,
          lineHeight: 32,
          color: colors.textSecondary,
          marginBottom: 20,
          textAlign: 'left', // <-- Justificado a la izquierda
        },
        welcomePrefix: {
          fontFamily: Lexend.regular,
          fontSize: 20,
          lineHeight: 32,
          color: colors.textSecondary,
        },
        welcomeName: {
          fontFamily: Lexend.bold,
          fontSize: 20,
          lineHeight: 32,
          color: colors.textPrimary,
        },
        inputs: {
          marginBottom: 12,
        },
        passwordRow: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 16,
        },
        passwordFieldWrap: {
          flex: 1,
          minWidth: 0,
        },
        submitSquare: {
          width: SUBMIT_SQUARE_SIZE_WIDTH,
          height: SUBMIT_SQUARE_SIZE_HEIGHT,
          borderRadius: 12,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        submitSquareDisabled: {
          backgroundColor: colors.textTertiary,
          opacity: 0.85,
        },
        submitSquarePressed: {
          opacity: 0.92,
        },
        changeUserLink: {
          alignSelf: 'center',
          marginTop: 12,
          marginBottom: 20,
        },
        errorBanner: {
          marginBottom: 12,
        },
        biometricButton: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderRadius: 12,
          backgroundColor: colors.borderLight,
          borderWidth: 1,
          borderColor: colors.primary,
          marginBottom: 8,
        },
        biometricButtonDisabled: {
          opacity: 0.6,
        },
        biometricButtonPressed: {
          opacity: 0.9,
        },
        biometricLabel: {
          fontFamily: Lexend.semiBold,
          fontSize: 16,
          lineHeight: 26,
          color: colors.primary,
        },
        biometricFaceImage: {
          width: BIOMETRIC_ICON_SIZE,
          height: BIOMETRIC_ICON_SIZE,
        },
        productCard: {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'center',
          width: '100%',
          maxWidth: 280,
          gap: 12,
          paddingVertical: 12,
          paddingHorizontal: 14,
          borderRadius: 12,
          backgroundColor: colors.surface,
          marginBottom: 8,
        },
        productCardPressed: {
          opacity: 0.92,
        },
        productIconCircle: {
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        productIconImage: {
          width: 40,
          height: 40,
        },
        productCardTitle: {
          flex: 1,
          fontFamily: Lexend.semiBold,
          fontSize: 16,
          lineHeight: 24,
          color: colors.textPrimary,
        },
        arrowRightIconWrap: {
          width: 24,
          height: 24,
        },
        arrowRightIcon: {
          width: 24,
          height: 24,
        },
        contactLink: {
          alignSelf: 'center',
          marginTop: 12,
          marginBottom: 8,
        },
        contactLinkLabel: {
          fontSize: 14,
          lineHeight: 22,
          textDecorationLine: 'underline',
        },
      }),
    [colors],
  );
}
