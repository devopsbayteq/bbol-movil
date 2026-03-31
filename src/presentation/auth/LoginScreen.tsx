import React, {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useLoginViewModel} from './useLoginViewModel';
import {useAuth} from '../../providers';
import {useTheme, type ThemeColors} from '../../providers/theme';
import {Button, LabeledInput, ErrorMessage} from '../components';

export function LoginScreen() {
  const {login} = useAuth();
  const {colors} = useTheme();
  const styles = useStyles(colors);

  const {email, password, isLoading, error, setEmail, setPassword, handleLogin} =
    useLoginViewModel(async user => {
      await login(user);
    });

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>BB</Text>
          </View>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        </View>

        <View style={styles.form}>
          <LabeledInput
            label="Email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChangeText={setEmail}
            hasError={!!error && !email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />

          <LabeledInput
            label="Contraseña"
            placeholder="Tu contraseña"
            value={password}
            onChangeText={setPassword}
            hasError={!!error && !password}
            secureTextEntry
            editable={!isLoading}
          />

          {error && <ErrorMessage message={error} />}

          <Button
            title="Iniciar Sesión"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />

          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>
              Credenciales de prueba:{'\n'}
              <Text style={styles.hintBold}>user@test.com / password123</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function useStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          backgroundColor: colors.background,
        },
        scrollContent: {
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 24,
          paddingVertical: 48,
        },
        header: {
          alignItems: 'center',
          marginBottom: 40,
        },
        logoContainer: {
          width: 72,
          height: 72,
          borderRadius: 20,
          backgroundColor: colors.error,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        },
        logoText: {
          fontSize: 28,
          fontWeight: '700',
          color: colors.white,
        },
        title: {
          fontSize: 28,
          fontWeight: '700',
          color: colors.textPrimary,
          marginBottom: 8,
        },
        subtitle: {
          fontSize: 16,
          color: colors.textSecondary,
        },
        form: {
          gap: 16,
        },
        loginButton: {
          marginTop: 8,
        },
        hintContainer: {
          marginTop: 16,
          alignItems: 'center',
        },
        hintText: {
          fontSize: 13,
          color: colors.textTertiary,
          textAlign: 'center',
          lineHeight: 20,
        },
        hintBold: {
          fontWeight: '600',
          color: colors.textSecondary,
        },
      }),
    [colors],
  );
}
