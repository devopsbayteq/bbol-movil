import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useAuth} from '../../providers';
import {useDI} from '../../di';
import {useTheme, type ThemeColors} from '../../providers/theme';
import {Button, ErrorMessage} from '../components';
import {Lexend} from '../../theme/lexend';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {mapBiometricError} from './useLoginViewModel';

const fingerprintIcon = require('../../../assets/images/fingerprint.png');

export function BiometricOfferScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'BiometricOffer'>>();
  const {user, email} = route.params;
  const {login} = useAuth();
  const {biometricRSAAuthOrchestrator} = useDI();
  const {colors} = useTheme();
  const styles = useStyles(colors);

  const [isLoadingAccept, setIsLoadingAccept] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedEmail = email.trim();

  const handleSkip = useCallback(async () => {
    setError(null);
    await login(user);
  }, [login, user]);

  const handleAccept = useCallback(async () => {
    setIsLoadingAccept(true);
    setError(null);
    try {
      await biometricRSAAuthOrchestrator.registerBiometricForUser(trimmedEmail);
      await login(user);
    } catch (err) {
      const message = mapBiometricError(err);
      setError(message ?? 'No se pudo registrar la biometría.');
    } finally {
      setIsLoadingAccept(false);
    }
  }, [biometricRSAAuthOrchestrator, login, trimmedEmail, user]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']} testID="biometric-offer-screen">
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.contentColumn}>
            <Text style={styles.title}>Acceso biométrico</Text>
            <Text style={styles.subtitle}>
              ¿Deseas registrar tu huella o Face ID para iniciar sesión más rápido la próxima vez?
            </Text>
            <Image
              source={fingerprintIcon}
              style={styles.icon}
              resizeMode="contain"
              accessibilityLabel="Biometría"
            />
            {error ? (
              <ErrorMessage message={error} style={styles.errorBanner} />
            ) : null}
            <View style={styles.actions}>
              <Button
                testID="biometric-offer-accept"
                title="Aceptar"
                onPress={() => void handleAccept()}
                loading={isLoadingAccept}
                disabled={isLoadingAccept}
                variant="loginPrimary"
              />
              <Button
                testID="biometric-offer-skip"
                title="Omitir"
                onPress={() => void handleSkip()}
                disabled={isLoadingAccept}
                variant="outline"
              />
            </View>
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
          paddingTop: 24,
        },
        title: {
          fontFamily: Lexend.bold,
          fontSize: 28,
          lineHeight: 36,
          color: colors.textPrimary,
          marginBottom: 12,
        },
        subtitle: {
          fontFamily: Lexend.regular,
          fontSize: 16,
          lineHeight: 26,
          color: colors.textSecondary,
          marginBottom: 24,
        },
        icon: {
          width: 120,
          height: 120,
          alignSelf: 'center',
          marginBottom: 24,
        },
        errorBanner: {
          marginBottom: 16,
        },
        actions: {
          gap: 12,
          marginTop: 8,
        },
      }),
    [colors],
  );
}
