import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  useLoginViewModel,
  BIOMETRIC_ENROLLMENT_CHANGED_MESSAGE,
} from './useLoginViewModel';
import {SecureStorageKeys} from '../../data/datasources/storage/SecureStorageKeys';
import {useAuth} from '../../providers';
import {useDI} from '../../di';
import {useTheme, type ThemeColors} from '../../providers';
import {
  Button,
  ErrorMessage,
  LoginTextField,
  LoginPasswordField,
  SecondaryIconButton,
  TertiaryLinkButton,
  OrSeparator,
  DevelopmentNoticeModal,
} from '../components';
import {Lexend} from '../../theme/lexend';
import {RootStackParamList} from '../../navigation/AppNavigator.tsx';

const loginFingerprintIcon = require('../../../assets/images/fingerprint.png');

export function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {login} = useAuth();
  const {biometricRSAAuthOrchestrator, secureStorageService} = useDI();
  const {colors} = useTheme();
  const styles = useStyles(colors);

  const [showBiometricLogin, setShowBiometricLogin] = useState(false);
  /** `null` = cargando almacén; string vacío = sin usuario vinculado; no vacío = modo compacto */
  const [deviceBoundLoginId, setDeviceBoundLoginId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    secureStorageService
      .get(SecureStorageKeys.DEVICE_BOUND_LOGIN_ID)
      .then(v => {
        if (!cancelled) {
          setDeviceBoundLoginId(v?.trim() ?? '');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [secureStorageService]);

  useEffect(() => {
    let cancelled = false;
    biometricRSAAuthOrchestrator.hasBiometricRegistration().then(has => {
      if (!cancelled) {
        setShowBiometricLogin(has);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [biometricRSAAuthOrchestrator]);

  const {
    email,
    password,
    emailError,
    passwordError,
    isLoadingLogin,
    isLoadingBiometric,
    isBusy,
    error,
    biometricEnrollmentRevoked,
    acknowledgeBiometricEnrollmentRevoked,
    isDeviceBoundCompact,
    resetForDifferentUser,
    isCredentialLoginEnabled,
    showDevelopMode,
    setShowDevelopMode,
    version,
    setEmail,
    setPassword,
    handleLogin,
    handleBiometricLogin,
  } = useLoginViewModel(
    user => {
      navigation.navigate('OtpValidation', {
        mode: 'login',
        user,
        email: user.email,
      });
    },
    user => {
      login(user).catch();
    },
    deviceBoundLoginId === null
      ? undefined
      : deviceBoundLoginId
        ? {deviceBoundLoginId}
        : undefined,
  );

  useEffect(() => {
    if (!biometricEnrollmentRevoked) {
      return;
    }
    setShowBiometricLogin(false);
    Alert.alert(
      'Acceso biométrico desactualizado',
      BIOMETRIC_ENROLLMENT_CHANGED_MESSAGE,
      [{text: 'Entendido', onPress: acknowledgeBiometricEnrollmentRevoked}],
    );
  }, [
    biometricEnrollmentRevoked,
    acknowledgeBiometricEnrollmentRevoked,
  ]);

  const onHelp = () => {
    setShowDevelopMode(true);
  };

  const handleChangeUser = async () => {
    await secureStorageService.remove(SecureStorageKeys.DEVICE_BOUND_LOGIN_ID);
    // Otro usuario en el mismo dispositivo debe poder ver de nuevo la oferta biométrica.
    await secureStorageService.remove(SecureStorageKeys.BIOMETRIC_OFFER_DECLINED);
    setDeviceBoundLoginId('');
    resetForDifferentUser();
  };

  const welcomeSubtitle =
    deviceBoundLoginId === null
      ? 'Ingresa con tu usuario y contraseña.'
      : isDeviceBoundCompact && deviceBoundLoginId
        ? `Bienvenido a tu banca móvil, ${deviceBoundLoginId}`
        : 'Ingresa con tu usuario y contraseña.';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAwareScrollView
        style={styles.root}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.contentColumn}>
          <Image
            source={require('../../../assets/images/BBBanner.png')}
            style={styles.bankLogo}
            resizeMode="contain"
            accessibilityLabel="Banco Bolivariano"
          />

          <View style={styles.hero}>
            <Text style={styles.heroTitle}>Identidad Digital</Text>
            <Text style={styles.heroSubtitle}>{welcomeSubtitle}</Text>
          </View>

          <View style={styles.inputs}>
            {deviceBoundLoginId === null ? (
              <ActivityIndicator
                accessibilityLabel="Cargando"
                color={colors.primary}
                style={styles.inputsLoading}
              />
            ) : (
              <>
                {isDeviceBoundCompact ? null : (
                  <LoginTextField
                    testID="login-email-input"
                    label="Ingresa tu usuario"
                    placeholder="Usuario"
                    value={email}
                    onChangeText={setEmail}
                    hasError={!!emailError}
                    errorMessage={emailError ?? undefined}
                    errorTestID="login-username-error"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isBusy}
                    autoComplete="username"
                  />
                )}

                <LoginPasswordField
                  testID="login-password-input"
                  label="Contraseña"
                  placeholder="Contraseña"
                  value={password}
                  onChangeText={setPassword}
                  hasError={!!passwordError}
                  errorMessage={passwordError ?? undefined}
                  errorTestID="login-password-error"
                  editable={!isBusy}
                  autoComplete="password"
                />

                {isDeviceBoundCompact ? (
                  <TertiaryLinkButton
                    testID="login-change-user"
                    title="No soy yo / Cambiar usuario"
                    onPress={handleChangeUser}
                    style={styles.changeUserLink}
                  />
                ) : null}
              </>
            )}
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
              onPress={handleLogin}
              iconSource={require('../../../assets/images/house.png')}
              loading={isLoadingLogin}
              disabled={
                isBusy ||
                deviceBoundLoginId === null ||
                !isCredentialLoginEnabled
              }
              variant="loginPrimary"
            />
            {showBiometricLogin ? (
              <>
                <OrSeparator />
                <SecondaryIconButton
                  title="Huella/FaceID"
                  iconSource={loginFingerprintIcon}
                  onPress={handleBiometricLogin}
                  disabled={isBusy || deviceBoundLoginId === null}
                  loading={isLoadingBiometric}
                />
              </>
            ) : null}
          </View>

          <TertiaryLinkButton
            title="Crear usuario"
            onPress={() => {
              setShowDevelopMode(true);
            }}
          />
          <TertiaryLinkButton
            title="Solicitar Productos"
            onPress={() => {
              setShowDevelopMode(true);
            }}
          />
          <Text style={styles.versionApp}>{version}</Text>
          <TertiaryLinkButton
            title="Contactos"
            onPress={() => {
              setShowDevelopMode(true);
            }}
          />

          <TertiaryLinkButton
            title="? Ayuda"
            onPress={onHelp}
            style={styles.helpLink}
          />
        </View>
      </KeyboardAwareScrollView>
      <DevelopmentNoticeModal
        visible={showDevelopMode}
        onClose={() => {
          setShowDevelopMode(false);
        }}
      />
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
        root: {
          flex: 1,
        },
        scrollContent: {
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingBottom: 32,
        },
        contentColumn: {
          width: '100%',
          maxWidth: 400,
          alignSelf: 'center',
        },
        bankLogo: {
          width: 196,
          height: 30,
          marginTop: 8,
          marginBottom: 24,
          alignSelf: 'flex-start',
        },
        hero: {
          marginBottom: 32,
          marginTop: 16,
          gap: 8,
          alignSelf: 'stretch',
        },
        heroTitle: {
          fontFamily: Lexend.bold,
          fontSize: 34,
          lineHeight: 44,
          color: colors.textPrimary,
        },
        heroSubtitle: {
          fontFamily: Lexend.regular,
          fontSize: 16,
          lineHeight: 26,
          color: colors.textSecondary,
        },
        versionApp: {
          textAlign: 'center',
          fontFamily: Lexend.regular,
          fontSize: 16,
          lineHeight: 26,
          color: colors.textSecondary,
        },
        inputs: {
          gap: 8,
          marginBottom: 16,
        },
        changeUserLink: {
          alignSelf: 'flex-start',
          marginTop: 4,
        },
        inputsLoading: {
          alignSelf: 'center',
          marginVertical: 24,
        },
        errorBanner: {
          marginBottom: 16,
        },
        actions: {
          marginTop: 26,
          gap: 8,
          marginBottom: 8,
        },
        helpLink: {
          alignSelf: 'center',
          marginBottom: 24,
        },
      }),
    [colors],
  );
}
