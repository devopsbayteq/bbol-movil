import React, {useCallback, useMemo, useState} from 'react';
import {View, Text, Image, StyleSheet, Pressable} from 'react-native';
import {getVersion, getBuildNumber} from 'react-native-device-info';

import {formatAppVersionDisplay} from '../../utils/appVersion';
import {useTheme, type ThemeColors} from '../../providers';
import {
  Button,
  ErrorMessage,
  LoginPasswordField,
  SecondaryIconButton,
  TertiaryLinkButton,
  OrSeparator,
  DevelopmentNoticeModal,
  LoginHeroImageCarousel,
} from '../components';
import {Lexend} from '../../theme/lexend';

import UserPlusSvg from '../../../assets/images/svg/user-plus.svg';
import MenuIconSvg from '../../../assets/images/svg/menu-icon.svg';
import LoginSubmitArrowSvg from '../../../assets/images/svg/arrow-right-from-bracket.svg';

const bankBanner = require('../../../assets/images/BBBanner.png');
const heroLoginA = require('../../../assets/images/imagenfondo_login1.png');
const heroLoginB = require('../../../assets/images/imagenfondo_login2.png');
const loginFingerprintIcon = require('../../../assets/images/fingerprint.png');

const FOOTER_SVG_SIZE = 28;
const LOGIN_SUBMIT_ICON_SIZE = 24;

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
  onLogin,
  onBiometricLogin,
  onChangeUser,
}: CompactLoginContentProps) {
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

  return (
    <View style={styles.column}>
      <View style={styles.topRow}>
        <Image
          source={bankBanner}
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
        <Text style={styles.welcomePrefix}>Bienvenido a tu banca móvil, </Text>
        <Text style={styles.welcomeName}>{greetingName}</Text>
      </Text>

      <View style={styles.inputs}>
        <LoginPasswordField
          testID="login-password-input"
          label="Contraseña"
          placeholder="Contraseña"
          value={password}
          onChangeText={onPasswordChange}
          hasError={!!passwordError}
          errorMessage={passwordError ?? undefined}
          errorTestID="login-password-error"
          editable={!isBusy}
          autoComplete="password"
        />
        <Pressable
          onPress={showDevelopmentNotice}
          style={styles.forgotRow}
          accessibilityRole="button"
          accessibilityLabel="¿Olvidaste tu contraseña?">
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </Pressable>
        <TertiaryLinkButton
          testID="login-change-user"
          title="No soy yo / Cambiar usuario"
          onPress={onChangeUser}
          style={styles.changeUserLink}
        />
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
          title="Ingresar"
          onPress={onLogin}
          iconNodeRight={
            <LoginSubmitArrowSvg
              width={LOGIN_SUBMIT_ICON_SIZE}
              height={LOGIN_SUBMIT_ICON_SIZE}
            />
          }
          loading={isLoadingLogin}
          disabled={isBusy}
          variant="loginPrimary"
        />
        {showBiometricLogin ? (
          <>
            <OrSeparator />
            <SecondaryIconButton
              title="Huella / Face ID"
              iconSource={loginFingerprintIcon}
              onPress={onBiometricLogin}
              disabled={isBusy}
              loading={isLoadingBiometric}
            />
          </>
        ) : null}
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
        topRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 6,
          marginBottom: 14,
          gap: 12,
        },
        bankLogo: {
          width: 196,
          height: 30,
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
          paddingRight: 60,
          fontFamily: Lexend.regular,
          fontSize: 24,
          lineHeight: 32,
          color: colors.textSecondary,
          marginBottom: 16,
          textAlign: 'left',
        },
        welcomePrefix: {
          fontFamily: Lexend.regular,
          fontSize: 24,
          lineHeight: 32,
          color: colors.textSecondary,
        },
        welcomeName: {
          fontFamily: Lexend.bold,
          fontSize: 24,
          lineHeight: 32,
          textAlign: 'left',
          color: colors.textPrimary,
        },
        inputs: {
          gap: 8,
          marginBottom: 16,
        },
        forgotRow: {
          alignSelf: 'flex-end',
          marginTop: -4,
          marginBottom: 2,
          paddingVertical: 4,
        },
        forgotText: {
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          lineHeight: 16,
          color: colors.textSecondary,
        },
        changeUserLink: {
          alignSelf: 'flex-start',
          marginTop: 2,
        },
        errorBanner: {
          marginBottom: 16,
        },
        actions: {
          marginTop: 2,
          gap: 2,
          marginBottom: 6,
        },
        footerQuickRow: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'flex-start',
          marginTop: 8,
          marginBottom: 6,
          paddingHorizontal: 8,
        },
        footerQuickItem: {
          alignItems: 'center',
          gap: 4,
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
          marginTop: 16,
          marginBottom: 8,
        },
        contactLinkLabel: {
          fontSize: 12,
          lineHeight: 18,
          textDecorationLine: 'underline',
        },
      }),
    [colors],
  );
}
