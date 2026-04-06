import React, {useMemo} from 'react';
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
} from '../components';
import {Lexend} from '../../theme/lexend';

/** Banner login compacto (exportado desde el diseño; evita import SVG como componente en Metro). */
const heroIllustration = require('../../../assets/images/login_compact_hero.png');
const bankBanner = require('../../../assets/images/BBBanner.png');
const loginFingerprintIcon = require('../../../assets/images/fingerprint.png');
const footerIconCreate = require('../../../assets/images/BBIcon.png');
const footerIconProduct = require('../../../assets/images/share-nodes.png');

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
  onForgotPassword: () => void;
  onChangeUser: () => void;
  onContactUs: () => void;
  onStubCreateUser: () => void;
  onStubRequestProduct: () => void;
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
  onForgotPassword,
  onChangeUser,
  onContactUs,
  onStubCreateUser,
  onStubRequestProduct,
}: CompactLoginContentProps) {
  const {colors} = useTheme();
  const styles = useStyles(colors);

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
        <Text style={styles.versionText} numberOfLines={1}>
          {versionLabel}
        </Text>
      </View>

      <View style={styles.heroImageWrap}>
        <Image
          source={heroIllustration}
          style={styles.heroImage}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
          accessibilityLabel="Ilustración de banca móvil"
        />
        <View
          style={styles.carouselDots}
          accessibilityLabel="Indicadores de contenido">
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>
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
          onPress={onForgotPassword}
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
          iconSource={require('../../../assets/images/house.png')}
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
          onPress={onStubCreateUser}
          style={styles.footerQuickItem}
          accessibilityRole="button"
          accessibilityLabel="Crear usuario">
          <Image
            source={footerIconCreate}
            style={styles.footerQuickIcon}
            resizeMode="contain"
          />
          <Text style={styles.footerQuickLabel}>Crear usuario</Text>
        </Pressable>
        <Pressable
          onPress={onStubRequestProduct}
          style={styles.footerQuickItem}
          accessibilityRole="button"
          accessibilityLabel="Solicitar producto">
          <Image
            source={footerIconProduct}
            style={styles.footerQuickIcon}
            resizeMode="contain"
          />
          <Text style={styles.footerQuickLabel}>Solicitar producto</Text>
        </Pressable>
      </View>

      <TertiaryLinkButton
        testID="login-contact-us"
        title="Contáctate con nosotros"
        onPress={onContactUs}
        style={styles.contactLink}
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
          marginBottom: 16,
          gap: 12,
        },
        bankLogo: {
          width: 196,
          height: 30,
          flexShrink: 0,
        },
        versionText: {
          flex: 1,
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 18,
          color: colors.textTertiary,
          textAlign: 'right',
        },
        heroImageWrap: {
          alignItems: 'center',
          marginBottom: 16,
        },
        heroImage: {
          width: '100%',
          maxWidth: 320,
          height: 200,
        },
        carouselDots: {
          flexDirection: 'row',
          gap: 8,
          marginTop: 12,
          justifyContent: 'center',
        },
        dot: {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.border,
        },
        dotActive: {
          backgroundColor: colors.primary,
        },
        welcomeLine: {
          fontFamily: Lexend.regular,
          fontSize: 16,
          lineHeight: 26,
          color: colors.textSecondary,
          marginBottom: 20,
          textAlign: 'center',
        },
        welcomePrefix: {
          fontFamily: Lexend.regular,
          fontSize: 16,
          lineHeight: 26,
          color: colors.textSecondary,
        },
        welcomeName: {
          fontFamily: Lexend.bold,
          fontSize: 16,
          lineHeight: 26,
          color: colors.textPrimary,
        },
        inputs: {
          gap: 8,
          marginBottom: 16,
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
        changeUserLink: {
          alignSelf: 'flex-start',
          marginTop: 4,
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
        footerQuickIcon: {
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
          marginBottom: 24,
        },
      }),
    [colors],
  );
}
