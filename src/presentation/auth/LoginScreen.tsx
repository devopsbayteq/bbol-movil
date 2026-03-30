import React, {useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useLoginViewModel} from './useLoginViewModel';
import {useAuth} from '../../providers';
import {useTheme, type ThemeColors} from '../../providers/theme';

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
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, error && !email && styles.inputError]}
              placeholder="correo@ejemplo.com"
              placeholderTextColor={colors.placeholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={[styles.input, error && !password && styles.inputError]}
              placeholder="Tu contraseña"
              placeholderTextColor={colors.placeholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}>
            {isLoading ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

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
          backgroundColor: colors.primary,
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
        inputGroup: {
          gap: 6,
        },
        label: {
          fontSize: 14,
          fontWeight: '600',
          color: colors.textLabel,
          marginLeft: 4,
        },
        input: {
          backgroundColor: colors.inputBg,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 14,
          fontSize: 16,
          color: colors.textPrimary,
        },
        inputError: {
          borderColor: colors.error,
        },
        errorContainer: {
          backgroundColor: colors.errorBg,
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 12,
          borderWidth: 1,
          borderColor: colors.errorBorder,
        },
        errorText: {
          color: colors.error,
          fontSize: 14,
          textAlign: 'center',
        },
        button: {
          backgroundColor: colors.primary,
          borderRadius: 12,
          paddingVertical: 16,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 8,
        },
        buttonDisabled: {
          opacity: 0.7,
        },
        buttonText: {
          color: colors.white,
          fontSize: 16,
          fontWeight: '600',
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
