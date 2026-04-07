import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  Pressable,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp, useRoute} from '@react-navigation/native';
import {SecureStorageKeys} from '../../data/datasources/storage/SecureStorageKeys';
import {useAuth} from '../../providers';
import {useDI} from '../../di';
import {useTheme, type ThemeColors} from '../../providers';
import {Button, ErrorMessage} from '../components';
import {Lexend} from '../../theme/lexend';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {mapBiometricError} from './useLoginViewModel';
import FingerprintSvg from '../../../assets/images/svg/fingerprint.svg';

const BIOMETRIC_HERO_ICON_SIZE = 76;
const faceViewfinderIcon = require('../../../assets/images/face-viewfinder.png');
const shieldKeyholeIcon = require('../../../assets/images/shield-keyhole.png');

export function BiometricOfferScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'BiometricOffer'>>();
  const {user, email} = route.params;
  const {login} = useAuth();
  const {biometricRSAAuthOrchestrator, secureStorageService} = useDI();
  const {colors} = useTheme();
  const styles = useStyles(colors);

  const [isLoadingAccept, setIsLoadingAccept] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedEmail = email.trim();

  const heroAccessibilityLabel =
    Platform.OS === 'ios'
      ? 'Reconocimiento facial'
      : 'Huella digital';

  const handleSkip = useCallback(async () => {
    setError(null);
    await secureStorageService.save(
      SecureStorageKeys.BIOMETRIC_OFFER_DECLINED,
      'true',
    );
    await login(user);
  }, [login, secureStorageService, user]);

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
    <SafeAreaView
      style={styles.safe}
      edges={['top', 'bottom']}
      testID="biometric-offer-screen">
      <KeyboardAwareScrollView
        style={styles.root}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.contentColumn}>
          <View style={styles.iconCircle}>
            {Platform.OS === 'ios' ? (
              <Image
                source={faceViewfinderIcon}
                style={styles.iconInner}
                resizeMode="contain"
                accessibilityIgnoresInvertColors
                accessibilityLabel={heroAccessibilityLabel}
              />
            ) : (
              <FingerprintSvg
                width={BIOMETRIC_HERO_ICON_SIZE}
                height={BIOMETRIC_HERO_ICON_SIZE}
                color={colors.primary}
                accessibilityLabel={heroAccessibilityLabel}
              />
            )}
          </View>

          <Text style={styles.title}>Activa tu acceso biométrico</Text>
          <Text style={styles.body}>
            Accede de forma más rápida y segura con tu huella digital o
            reconocimiento facial. Podrás realizar transacciones y consultas al
            instante.
          </Text>

          {error ? (
            <ErrorMessage message={error} style={styles.errorBanner} />
          ) : null}

          <View style={styles.actions}>
            <Button
              testID="biometric-offer-accept"
              title="Activar biometría"
              onPress={() => handleAccept().catch(() => {})}
              loading={isLoadingAccept}
              disabled={isLoadingAccept}
              variant="loginPrimary"
              iconSourceRight={shieldKeyholeIcon}
              iconRightTintColor={colors.white}
            />
            <Pressable
              testID="biometric-offer-skip"
              onPress={() => handleSkip().catch(() => {})}
              disabled={isLoadingAccept}
              style={styles.skipPressable}
              accessibilityRole="button"
              accessibilityLabel="Ahora no">
              <Text style={styles.skipLabel}>Ahora no</Text>
            </Pressable>
          </View>

          <Text style={styles.footerNote}>
            Podrás activar esta opción más tarde desde los ajustes de seguridad
          </Text>
        </View>
      </KeyboardAwareScrollView>
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
          justifyContent: 'center',
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 32,
        },
        contentColumn: {
          width: '100%',
          maxWidth: 400,
          alignSelf: 'center',
          alignItems: 'center',
        },
        iconCircle: {
          width: 132,
          height: 132,
          borderRadius: 66,
          backgroundColor: colors.white,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 28,
          ...Platform.select({
            ios: {
              shadowColor: colors.shadowSoft,
              shadowOffset: {width: 0, height: 4},
              shadowOpacity: 1,
              shadowRadius: 8,
            },
            android: {
              elevation: 4,
            },
          }),
        },
        iconInner: {
          width: BIOMETRIC_HERO_ICON_SIZE,
          height: BIOMETRIC_HERO_ICON_SIZE,
        },
        title: {
          fontFamily: Lexend.regular,
          fontSize: 28,
          lineHeight: 42,
          color: colors.textPrimary,
          marginBottom: 12,
          textAlign: 'center',
        },
        body: {
          fontFamily: Lexend.regular,
          fontSize: 16,
          lineHeight: 26,
          color: colors.textSecondary,
          marginBottom: 24,
          textAlign: 'center',
        },
        errorBanner: {
          alignSelf: 'stretch',
          marginBottom: 16,
        },
        actions: {
          alignSelf: 'stretch',
          gap: 16,
          marginTop: 8,
        },
        skipPressable: {
          alignSelf: 'center',
          paddingVertical: 12,
          paddingHorizontal: 8,
        },
        skipLabel: {
          fontFamily: Lexend.bold,
          fontSize: 16,
          lineHeight: 26,
          color: colors.primary,
          textAlign: 'center',
        },
        footerNote: {
          marginTop: 16,
          fontFamily: Lexend.regular,
          fontSize: 16,
          lineHeight: 20,
          color: colors.textTertiary,
          textAlign: 'center',
        },
      }),
    [colors],
  );
}
