import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {SecureStorageKeys} from '../../data/datasources/storage/SecureStorageKeys';
import type {User} from '../../domain/entities/User';
import type {SecureStorageService} from '../../domain/services/SecureStorageService';
import type {RootStackParamList} from '../../navigation/AppNavigator';
import type {BiometricRSAAuthOrchestrator} from '../../security/biometric';

export interface PostLoginEnrollmentDeps {
  biometricRSAAuthOrchestrator: BiometricRSAAuthOrchestrator;
  secureStorageService: SecureStorageService;
  login: (user: User) => Promise<void>;
}

export interface NavigatePostLoginEnrollmentOptions {
  /**
   * Primer login tras alias: ignorar `hasBiometricRegistration` (en iOS puede dar
   * falso positivo por Keychain/storage) y siempre mostrar `BiometricOffer`
   * salvo declinación previa.
   */
  forceShowBiometricOffer?: boolean;
}

/**
 * Tras OTP y registro de alias: misma rama que antes vivía en OtpValidationScreen
 * (biometría existente, declinación previa u oferta biométrica).
 */
export async function navigatePostLoginEnrollment(
  navigation: NativeStackNavigationProp<RootStackParamList>,
  user: User,
  email: string,
  deps: PostLoginEnrollmentDeps,
  options?: NavigatePostLoginEnrollmentOptions,
): Promise<void> {
  const {biometricRSAAuthOrchestrator, secureStorageService, login} = deps;
  if (!options?.forceShowBiometricOffer) {
    let hasBio = false;
    try {
      hasBio = await biometricRSAAuthOrchestrator.hasBiometricRegistration();
    } catch {
      hasBio = false;
    }
    if (hasBio) {
      await login(user);
      return;
    }
  }
  const declined = await secureStorageService.get(
    SecureStorageKeys.BIOMETRIC_OFFER_DECLINED,
  );
  if (declined === 'true') {
    await login(user);
    return;
  }
  navigation.replace('BiometricOffer', {user, email});
}
