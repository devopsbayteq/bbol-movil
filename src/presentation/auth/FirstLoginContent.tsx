import React, {useCallback, useMemo, useState} from 'react';
import {View, Text, Image, StyleSheet, Pressable} from 'react-native';
import {getVersion, getBuildNumber} from 'react-native-device-info';

import {formatAppVersionDisplay} from '../../utils/appVersion';
import {useTheme, type ThemeColors} from '../../providers';
import {
  Button,
  ErrorMessage,
  LoginTextField,
  LoginPasswordField,
  TertiaryLinkButton,
  DevelopmentNoticeModal,
} from '../components';
import {Lexend} from '../../theme/lexend';

const institutionIcon = require('../../../assets/images/institution.png');
const arrowRightIcon = require('../../../assets/images/arrow_right_black.png');
const loginSubmitArrowIcon = require('../../../assets/images/arrow-right-from-bracket.png');

const bankMark = require('../../../assets/images/BBIcon.png');

export interface FirstLoginContentProps {
  email: string;
  password: string;
  emailError: string | null;
  passwordError: string | null;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  isBusy: boolean;
  isLoadingLogin: boolean;
  error: string | null;
  onLogin: () => void;
}

export function FirstLoginContent({
  email,
  password,
  emailError,
  passwordError,
  onEmailChange,
  onPasswordChange,
  isBusy,
  isLoadingLogin,
  error,
  onLogin,
}: FirstLoginContentProps) {
  const {colors} = useTheme();
  const styles = useStyles(colors);
  const [devNoticeVisible, setDevNoticeVisible] = useState(false);

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

  const submitDisabled = isBusy || !email || !password;

  return (
    <View style={styles.column}>
      <View style={styles.brandBlock}>
        <Image
          source={bankMark}
          style={styles.logoMark}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />

        
        <Text style={styles.heroTitleContainer} accessibilityRole="text">
        <Text style={styles.heroTitle}>Bienvenido a</Text>
        {'\n'}
        <Text style={styles.heroTitle}>tu banca móvil</Text>
        </Text>
        <Text style={styles.heroSubtitle}>
          Ingresa con usuario y contraseña
        </Text>
      </View>

      <View style={styles.inputs}>
        <LoginTextField
          testID="login-email-input"
          placeholder="Alias o usuario"
          value={email}
          onChangeText={onEmailChange}
          hasError={!!emailError}
          errorMessage={emailError ?? undefined}
          errorTestID="login-username-error"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isBusy}
          autoComplete="username"
          variant="elevated"
        />
        <Pressable
          onPress={showDevelopmentNotice}
          style={styles.forgotRow}
          accessibilityRole="button"
          accessibilityLabel="¿Olvidaste tu usuario?">
          <Text style={styles.forgotText}>¿Olvidaste tu usuario?</Text>
        </Pressable>

        <LoginPasswordField
          testID="login-password-input"
          placeholder="Contraseña"
          value={password}
          onChangeText={onPasswordChange}
          hasError={!!passwordError}
          errorMessage={passwordError ?? undefined}
          errorTestID="login-password-error"
          editable={!isBusy}
          autoComplete="password"
          variant="elevated"
        />
        <Pressable
          onPress={showDevelopmentNotice}
          style={styles.forgotRow}
          accessibilityRole="button"
          accessibilityLabel="¿Olvidaste tu contraseña?">
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </Pressable>
      </View>

      {error ? (
        <ErrorMessage
          testID="login-error"
          message={error}
          style={styles.errorBanner}
        />
      ) : null}

      <View style={styles.actions}>
        <Button
          testID="login-submit"
          title="Iniciar sesión"
          onPress={onLogin}
          iconRightTintColor={colors.white}
          iconSourceRight={loginSubmitArrowIcon}
          loading={isLoadingLogin}
          disabled={submitDisabled}
          disabledBackgroundColor={"#c8c8c8"}
          variant="loginPrimary"
        />
      </View>

      <View style={styles.actionsSecondary}>
        <Pressable
          testID="login-create-user"
          onPress={showDevelopmentNotice}
          style={({pressed}) => [
            styles.createUserLinkHit,
            pressed && styles.createUserLinkHitPressed,
          ]}
          accessibilityRole="link"
          accessibilityLabel="Crear usuario">
          <Text style={styles.createUserLinkText}>Crear usuario</Text>
        </Pressable>
      </View>

      <Pressable
        testID="login-request-product"
        onPress={showDevelopmentNotice}
        style={({pressed}) => [
          styles.productCard,
          pressed && styles.productCardPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Solicitar productos">
        <View style={styles.productIconCircle}>
          <Image
            source={institutionIcon}
            style={styles.productIconImage}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        </View>
        <Text style={styles.productCardTitle}>Solicitar productos</Text>
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
        brandBlock: {
          alignItems: 'center',
          marginBottom: 28,
          marginTop: 8,
          gap: 12,
        },
        logoMark: {
          width: 72,
          height: 72,
          marginTop: 30,
        },
        heroTitle: {
          fontFamily: Lexend.regular,
          color: colors.textPrimary,
          textAlign: 'center',
          width: '65%',
        },
        heroTitleContainer: {
          fontFamily: Lexend.regular,
          fontSize: 20,
          color: colors.textPrimary,
          textAlign: 'center',
          paddingTop: 24,
          paddingBottom: 25,
          width: '65%',
        },
        heroSubtitle: {
          fontFamily: Lexend.regular,
          fontSize: 17,
          lineHeight: 26,
          color: colors.textTertiary,
          textAlign: 'center',
        },
        inputs: {
          gap: 8,
          marginBottom: 8,
        },
        forgotRow: {
          alignSelf: 'flex-end',
          marginTop: -4,
          marginBottom: 4,
          paddingVertical: 4,
        },
        forgotText: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          lineHeight: 22,
          opacity: 0.8,
          color: colors.textSecondary,
        },
        errorBanner: {
          marginBottom: 16,
        },
        actions: {
          marginTop: 8,
          gap: 8,
          marginBottom: 16,
        },
        /** Misma caja táctil que `Button` outline (`base`: 14/24, radio 12). */
        createUserLinkHit: {
          alignSelf: 'stretch',
          borderRadius: 12,
          paddingVertical: 4,
          paddingHorizontal: 24,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24
        },
        createUserLinkHitPressed: {
          opacity: 0.85,
        },
        createUserLinkText: {
          fontFamily: Lexend.bold,
          fontSize: 16,
          lineHeight: 26,
          color: colors.linkPrimary,
        },
        actionsSecondary: {
          marginBottom: 16,
        },
        footerQuickRow: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'flex-start',
          marginTop: 8,
          marginBottom: 12,
          paddingHorizontal: 8,
        },
        footerQuickItem: {
          alignItems: 'center',
          gap: 8,
          maxWidth: '45%',
        },
        footerQuickIconWrap: {
          width: 48,
          height: 48,
          borderRadius: 60,
          backgroundColor: colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
        },
        footerQuickLabel: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 18,
          color: colors.textSecondary,
          textAlign: 'center',
        },
        contactLink: {
          alignSelf: 'center',
          marginTop: 24,
          marginBottom: 8,
        },
        contactLinkLabel: {
          fontSize: 12,
          lineHeight: 18,
          textDecorationLine: 'underline',
        },
        versionText: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 18,
          color: colors.textTertiary,
          textAlign: 'center',
          marginBottom: 8,
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
          marginTop: 40,
          marginBottom: 8,
          height: 48,
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
          fontFamily: Lexend.regular,
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
      }),
    [colors],
  );
}
