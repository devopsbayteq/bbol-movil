import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useLoginViewModel} from './useLoginViewModel';
import {useAuth} from '../../providers';
import {useDI} from '../../di';
import {useTheme, type ThemeColors} from '../../providers/theme';
import {
  Button,
  ErrorMessage,
  LoginTextField,
  LoginPasswordField,
  SecondaryIconButton,
  TertiaryLinkButton,
  OrSeparator,
} from '../components';
import {Lexend} from '../../theme/lexend';
import {LOGIN_USERNAME_MAX_LENGTH, LOGIN_PASSWORD_MAX_LENGTH} from '../../domain/validation';
import {RootStackParamList} from "../../navigation/AppNavigator.tsx";


const loginFingerprintIcon = require('../../../assets/images/fingerprint.png');

export function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {login} = useAuth();
  const {biometricRSAAuthOrchestrator} = useDI();
  const {colors} = useTheme();
  const styles = useStyles(colors);

  const [showBiometricLogin, setShowBiometricLogin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void biometricRSAAuthOrchestrator.hasBiometricRegistration().then(has => {
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
      void login(user);
    },
  );

  const onHelp = () => {
    Alert.alert('Ayuda', 'Contacta a soporte para recuperar tu acceso.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
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
            <Text style={styles.heroSubtitle}>
              Ingresa con tu usuario y contraseña.
            </Text>
          </View>

          <View style={styles.inputs}>
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
              maxLength={LOGIN_USERNAME_MAX_LENGTH}
            />

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
              maxLength={LOGIN_PASSWORD_MAX_LENGTH}
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
              onPress={handleLogin}
              iconSource={require('../../../assets/images/house.png')}
              loading={isLoadingLogin}
              disabled={isBusy}
              variant="loginPrimary"
            />
            {showBiometricLogin ? (
              <>
                <OrSeparator />
                <SecondaryIconButton
                  title="Huella/FaceID"
                  iconSource={loginFingerprintIcon}
                  onPress={handleBiometricLogin}
                  disabled={isBusy}
                  loading={isLoadingBiometric}
                />
              </>
            ) : null}
          </View>

          <TertiaryLinkButton
            title="? Ayuda"
            onPress={onHelp}
            style={styles.helpLink}
          />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
        inputs: {
          gap: 8,
          marginBottom: 16,
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
