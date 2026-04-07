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

import UserPlusSvg from '../../../assets/images/svg/user-plus.svg';
import MenuIconSvg from '../../../assets/images/svg/menu-icon.svg';

const bankMark = require('../../../assets/images/BBIcon.png');
const loginSubmitIcon = require('../../../assets/images/arrow-right-from-bracket.png');

const FOOTER_SVG_SIZE = 28;

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
            <UserPlusSvg width={FOOTER_SVG_SIZE} height={FOOTER_SVG_SIZE} />
          </View>
          <Text style={styles.footerQuickLabel}>Crear usuario</Text>
        </Pressable>
        <Pressable
          onPress={showDevelopmentNotice}
          style={styles.footerQuickItem}
          accessibilityRole="button"
          accessibilityLabel="Solicitar producto">
          <View style={styles.footerQuickIconWrap}>
            <MenuIconSvg width={FOOTER_SVG_SIZE} height={FOOTER_SVG_SIZE} />
          </View>
          <Text style={styles.footerQuickLabel}>Solicitar producto</Text>
        </Pressable>
      </View>

      <TertiaryLinkButton
        testID="login-contact-us"
        title="Contáctate con nosotros"
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
      }),
    [colors],
  );
}
