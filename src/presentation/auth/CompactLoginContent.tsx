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

const bankBanner = require('../../../assets/images/BBBanner.png');
const heroLoginA = require('../../../assets/images/imagenfondo_login1.png');
const heroLoginB = require('../../../assets/images/imagenfondo_login2.png');
const loginFingerprintIcon = require('../../../assets/images/fingerprint.png');
const footerIconCreate = require('../../../assets/images/user-plus.png');
const footerIconProduct = require('../../../assets/images/product_menu_icon.png');

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
        <Text style={styles.versionText} numberOfLines={1}>
          {versionLabel}
        </Text>
      </View>

      <View style={styles.heroCarousel}>
        <LoginHeroImageCarousel
          sourceA={heroLoginA}
          sourceB={heroLoginB}
          height={180}
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
          marginBottom: 20,
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
