import React, {useMemo} from 'react';
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
import {useLoginViewModel} from './useLoginViewModel';
import {useAuth} from '../../providers';
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
import {FIGMA_LOGIN_ASSETS} from './figmaLoginAssets';
import {Lexend} from '../../theme/lexend';

export function LoginScreen() {
  const {login} = useAuth();
  const {colors} = useTheme();
  const styles = useStyles(colors);

  const {
    email,
    password,
    isLoadingLogin,
    isLoadingBiometric,
    isBusy,
    error,
    setEmail,
    setPassword,
    handleLogin,
    handleBiometricLogin,
  } = useLoginViewModel(async user => {
    await login(user);
  });

  const hasFieldError = (fieldEmpty: boolean) =>
    !!error && fieldEmpty;

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
          <Image
            source={{uri: FIGMA_LOGIN_ASSETS.bankLogo}}
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
              label="Ingresa tu usuario"
              placeholder="Usuario"
              value={email}
              onChangeText={setEmail}
              hasError={hasFieldError(!email)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isBusy}
              autoComplete="username"
            />

            <LoginPasswordField
              label="Contraseña"
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              hasError={hasFieldError(!password)}
              editable={!isBusy}
              eyeIconUri={FIGMA_LOGIN_ASSETS.eye}
              autoComplete="password"
            />
          </View>

          {error ? (
            <ErrorMessage message={error} style={styles.errorBanner} />
          ) : null}

          <View style={styles.actions}>
            <Button
              title="Ingresar"
              onPress={handleLogin}
              loading={isLoadingLogin}
              disabled={isBusy}
              variant="loginPrimary"
            />
            <OrSeparator />
            <SecondaryIconButton
              title="Huella/FaceID"
              iconUri={FIGMA_LOGIN_ASSETS.fingerprint}
              onPress={handleBiometricLogin}
              disabled={isBusy}
              loading={isLoadingBiometric}
            />
          </View>

          <TertiaryLinkButton
            title="Ayuda"
            iconUri={FIGMA_LOGIN_ASSETS.question}
            onPress={onHelp}
            style={styles.helpLink}
          />

          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>
              Credenciales de prueba:{'\n'}
              <Text style={styles.hintBold}>user@test.com / password123</Text>
            </Text>
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
        bankLogo: {
          width: 194,
          height: 46,
          marginTop: 8,
          marginBottom: 32,
          alignSelf: 'flex-start',
        },
        hero: {
          marginBottom: 48,
          gap: 8,
          maxWidth: 384,
          alignSelf: 'stretch',
        },
        heroTitle: {
          fontFamily: Lexend.bold,
          fontSize: 26,
          lineHeight: 36,
          color: colors.textPrimary,
        },
        heroSubtitle: {
          fontFamily: Lexend.regular,
          fontSize: 14,
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
          gap: 8,
          marginBottom: 8,
        },
        helpLink: {
          alignSelf: 'center',
          marginBottom: 24,
        },
        hintContainer: {
          alignItems: 'center',
        },
        hintText: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textTertiary,
          textAlign: 'center',
        },
        hintBold: {
          fontFamily: Lexend.semiBold,
          color: colors.textSecondary,
        },
      }),
    [colors],
  );
}
