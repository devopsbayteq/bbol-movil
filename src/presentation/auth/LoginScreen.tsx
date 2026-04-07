import React, {useEffect, useMemo, useState} from 'react';
import {View, StyleSheet, Alert, ActivityIndicator} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  useLoginViewModel,
  BIOMETRIC_ENROLLMENT_CHANGED_MESSAGE,
} from './useLoginViewModel';
import {CompactLoginContent} from './CompactLoginContent';
import {FirstLoginContent} from './FirstLoginContent';
import {SecureStorageKeys} from '../../data/datasources/storage/SecureStorageKeys';
import {useAuth} from '../../providers';
import {useDI} from '../../di';
import {useTheme, type ThemeColors} from '../../providers';
import {RootStackParamList} from '../../navigation/AppNavigator.tsx';

export function LoginScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {login} = useAuth();
  const {biometricRSAAuthOrchestrator, secureStorageService} = useDI();
  const {colors} = useTheme();
  const styles = useStyles(colors);

  const [showBiometricLogin, setShowBiometricLogin] = useState(false);
  /** `null` = cargando almacén; string vacío = sin usuario vinculado; no vacío = modo compacto */
  const [deviceBoundLoginId, setDeviceBoundLoginId] = useState<string | null>(
    null,
  );
  const [deviceBoundGreetingName, setDeviceBoundGreetingName] =
    useState<string>('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      secureStorageService.get(SecureStorageKeys.DEVICE_BOUND_LOGIN_ID),
      secureStorageService.get(SecureStorageKeys.DEVICE_BOUND_GREETING_NAME),
    ]).then(([id, name]) => {
      if (!cancelled) {
        setDeviceBoundLoginId(id?.trim() ?? '');
        setDeviceBoundGreetingName(name?.trim() ?? '');
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

  const isDeviceBoundCredentialsFlow =
    deviceBoundLoginId !== null && deviceBoundLoginId.length > 0;

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
        ...(isDeviceBoundCredentialsFlow ? {skipRegisterAlias: true} : {}),
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

  const handleChangeUser = async () => {
    await secureStorageService.remove(SecureStorageKeys.DEVICE_BOUND_LOGIN_ID);
    await secureStorageService.remove(
      SecureStorageKeys.DEVICE_BOUND_GREETING_NAME,
    );
    // Otro usuario en el mismo dispositivo debe poder ver de nuevo la oferta biométrica.
    await secureStorageService.remove(SecureStorageKeys.BIOMETRIC_OFFER_DECLINED);
    setDeviceBoundLoginId('');
    setDeviceBoundGreetingName('');
    resetForDifferentUser();
  };

  const compactGreetingName =
    deviceBoundGreetingName.length > 0
      ? deviceBoundGreetingName
      : deviceBoundLoginId ?? '';

  const showCompactLayout =
    deviceBoundLoginId !== null &&
    deviceBoundLoginId.length > 0 &&
    isDeviceBoundCompact;

  return (
    <View style={[styles.shell, {backgroundColor: colors.background}]}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAwareScrollView
          style={styles.root}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.contentColumn}>
            {deviceBoundLoginId === null ? (
              <ActivityIndicator
                accessibilityLabel="Cargando"
                color={colors.primary}
                style={styles.inputsLoading}
              />
            ) : showCompactLayout ? (
              <CompactLoginContent
                greetingName={compactGreetingName}
                password={password}
                passwordError={passwordError}
                onPasswordChange={setPassword}
                isBusy={isBusy}
                isLoadingLogin={isLoadingLogin}
                isLoadingBiometric={isLoadingBiometric}
                error={error}
                showBiometricLogin={showBiometricLogin}
                onLogin={handleLogin}
                onBiometricLogin={handleBiometricLogin}
                onChangeUser={handleChangeUser}
              />
            ) : (
              <FirstLoginContent
                email={email}
                password={password}
                emailError={emailError}
                passwordError={passwordError}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                isBusy={isBusy}
                isLoadingLogin={isLoadingLogin}
                error={error}
                onLogin={handleLogin}
              />
            )}
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </View>
  );
}

function useStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        shell: {
          flex: 1,
        },
        safe: {
          flex: 1,
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
        inputsLoading: {
          alignSelf: 'center',
          marginVertical: 24,
        },
      }),
    [colors],
  );
}
