import React, {useCallback, useMemo, useState} from 'react';
import {View, Text, Image, StyleSheet, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
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

const arrowBack = require('../../../assets/images/arrow-left.png');
const bankMark = require('../../../assets/images/BBIcon.png');
const footerIconCreate = require('../../../assets/images/user-plus.png');
const footerIconProduct = require('../../../assets/images/product_menu_icon.png');
const loginSubmitIcon = require('../../../assets/images/arrow-right-from-bracket.png');

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
  const navigation = useNavigation();
  const {colors} = useTheme();
  const styles = useStyles(colors);
  const [termsAccepted, setTermsAccepted] = useState(false);
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

  const canGoBack = navigation.canGoBack();
  const submitDisabled = isBusy || !termsAccepted;

  return (
    <View style={styles.column}>
      <View style={styles.topRow}>
        {canGoBack ? (
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Volver">
            <Image
              source={arrowBack}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        <Text style={styles.versionText} numberOfLines={1}>
          {versionLabel}
        </Text>
      </View>

      <View style={styles.brandBlock}>
        <View style={styles.logoTile} accessibilityLabel="Banco Bolivariano">
          <Image
            source={bankMark}
            style={styles.logoMark}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        </View>
        <Text style={styles.heroTitle}>Bienvenido a tu banca móvil</Text>
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

      <View style={styles.termsRow}>
        <Pressable
          testID="login-terms-checkbox"
          onPress={() => setTermsAccepted(v => !v)}
          style={styles.checkboxHit}
          accessibilityRole="checkbox"
          accessibilityState={{checked: termsAccepted}}
          accessibilityLabel="Acepto los términos y condiciones">
          <View
            style={[
              styles.checkbox,
              termsAccepted && styles.checkboxChecked,
            ]}>
            {termsAccepted ? (
              <Text style={styles.checkboxMark}>✓</Text>
            ) : null}
          </View>
        </Pressable>
        <View style={styles.termsTextWrap}>
          <Text style={styles.termsText}>
            Acepto los{' '}
            <Text onPress={showDevelopmentNotice} style={styles.termsLink}>
              términos y condiciones
            </Text>
          </Text>
        </View>
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
          iconSourceRight={loginSubmitIcon}
          iconRightTintColor={colors.white}
          loading={isLoadingLogin}
          disabled={submitDisabled}
          variant="loginPrimary"
        />
      </View>

      <View style={styles.footerQuickRow}>
        <Pressable
          onPress={showDevelopmentNotice}
          style={styles.footerQuickItem}
          accessibilityRole="button"
          accessibilityLabel="Crear usuario">
          <View style={styles.footerQuickIconWrap}>
            <Image
              source={footerIconCreate}
              style={styles.footerQuickIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.footerQuickLabel}>Crear usuario</Text>
        </Pressable>
        <Pressable
          onPress={showDevelopmentNotice}
          style={styles.footerQuickItem}
          accessibilityRole="button"
          accessibilityLabel="Solicitar producto">
          <View style={styles.footerQuickIconWrap}>
            <Image
              source={footerIconProduct}
              style={styles.footerQuickIconInner}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.footerQuickLabel}>Solicitar producto</Text>
        </Pressable>
      </View>

      <TertiaryLinkButton
        testID="login-contact-us"
        title="Contáctate con nosotros"
        onPress={showDevelopmentNotice}
        style={styles.contactLink}
      />

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
          justifyContent: 'space-between',
          marginTop: 8,
          marginBottom: 20,
          gap: 12,
        },
        backButton: {
          padding: 8,
          marginLeft: -8,
        },
        backIcon: {
          width: 24,
          height: 24,
        },
        backPlaceholder: {
          width: 40,
        },
        versionText: {
          flex: 1,
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 18,
          color: colors.textTertiary,
          textAlign: 'right',
        },
        brandBlock: {
          alignItems: 'center',
          marginBottom: 28,
          gap: 12,
        },
        logoTile: {
          width: 72,
          height: 72,
          borderRadius: 12,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        logoMark: {
          width: 40,
          height: 40,
          tintColor: colors.white,
        },
        heroTitle: {
          fontFamily: Lexend.regular,
          fontSize: 32,
          lineHeight: 42,
          color: colors.textPrimary,
          textAlign: 'center',
          paddingTop: 24,
          paddingBottom: 6,
          width: '65%',
        },
        heroSubtitle: {
          fontFamily: Lexend.regular,
          fontSize: 16,
          lineHeight: 26,
          color: colors.textSecondary,
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
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          lineHeight: 22,
          color: colors.linkPrimary,
        },
        termsRow: {
          flexDirection: 'row',
        //  alignItems: 'flex-start',
          gap: 12,
          marginTop: 8,
          marginBottom: 16,
          paddingVertical: 4,
          alignItems: 'center',
        },
        checkboxHit: {
          paddingVertical: 4,
        },
        termsTextWrap: {
          flex: 1,
        },
        checkbox: {
          width: 22,
          height: 22,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 2,
        },
        checkboxChecked: {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        },
        checkboxMark: {
          color: colors.white,
          fontSize: 14,
          fontWeight: '700',
          lineHeight: 16,
        },
        termsText: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          lineHeight: 22,
          color: colors.textSecondary,
        },
        termsLink: {
          fontFamily: Lexend.semiBold,
          color: colors.linkPrimary,
          textDecorationLine: 'underline',
        },
        errorBanner: {
          marginBottom: 16,
        },
        actions: {
          marginTop: 8,
          gap: 8,
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
          shadowColor: '#000000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 4,
        },
        footerQuickIcon: {
          width: 28,
          height: 28,
          tintColor: colors.primary,
        },
        footerQuickIconInner: {
          width: 28,
          height: 28,
          tintColor: colors.primary,
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
          marginBottom: 16,
          marginTop: 24,
          fontSize: 12,
          textDecorationLine: 'underline',
        },
      }),
    [colors],
  );
}
