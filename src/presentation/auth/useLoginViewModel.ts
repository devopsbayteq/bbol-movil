import {useState, useCallback} from 'react';
import {User} from '../../domain/entities/User';
import {useDI} from '../../di';
import {SecureStorageKeys} from '../../data/datasources/storage/SecureStorageKeys';
import {BiometricAuthError} from '../../domain/services/BiometricAuthService';
import {
  hasDisallowedLoginEmailCharacters,
  hasDisallowedLoginPasswordCharacters,
  loginValidationMessages,
  sanitizeLoginEmailInput,
  sanitizeLoginPasswordInput,
  validateLoginEmail,
  validateLoginPassword,
} from '../../domain/validation';

interface LoginState {
  email: string;
  password: string;
  emailError: string | null;
  passwordError: string | null;
  isLoadingLogin: boolean;
  isLoadingBiometric: boolean;
  error: string | null;
}

interface StoredBiometricCredentials {
  email: string;
  password: string;
}

function mapBiometricError(err: unknown): string | null {
  if (err instanceof BiometricAuthError) {
    if (err.code === 'user_cancelled') {
      return null;
    }
    if (err.code === 'not_available') {
      return 'La autenticación biométrica no está disponible en este dispositivo.';
    }
    if (err.code === 'prompt_failed') {
      return 'No se pudo verificar tu identidad. Inténtalo de nuevo.';
    }
    return err.message || 'No se pudo completar la autenticación biométrica.';
  }
  if (err instanceof Error) {
    return err.message;
  }
  return 'Ocurrió un error inesperado';
}

function getLiveEmailError(email: string): string | null {
  return email ? validateLoginEmail(email) : null;
}

function getLivePasswordError(password: string): string | null {
  return password ? validateLoginPassword(password) : null;
}

export function useLoginViewModel(onLoginSuccess: (user: User) => void) {
  const [state, setState] = useState<LoginState>({
    email: '',
    password: '',
    emailError: null,
    passwordError: null,
    isLoadingLogin: false,
    isLoadingBiometric: false,
    error: null,
  });

  const {loginUseCase, secureStorageService, biometricAuthService} = useDI();

  const setEmail = useCallback((email: string) => {
    const sanitizedEmail = sanitizeLoginEmailInput(email);
    const emailError = hasDisallowedLoginEmailCharacters(email)
      ? loginValidationMessages.emailInvalidCharacters
      : getLiveEmailError(sanitizedEmail);

    setState(prev => ({
      ...prev,
      email: sanitizedEmail,
      emailError,
      error: null,
    }));
  }, []);

  const setPassword = useCallback((password: string) => {
    const sanitizedPassword = sanitizeLoginPasswordInput(password);
    const passwordError = hasDisallowedLoginPasswordCharacters(password)
      ? loginValidationMessages.passwordInvalidCharacters
      : getLivePasswordError(sanitizedPassword);

    setState(prev => ({
      ...prev,
      password: sanitizedPassword,
      passwordError,
      error: null,
    }));
  }, []);

  const saveBiometricCredentials = useCallback(
    async (email: string, password: string) => {
      const payload: StoredBiometricCredentials = {email, password};
      await secureStorageService.save(
        SecureStorageKeys.BIOMETRIC_CREDENTIALS,
        JSON.stringify(payload),
      );
    },
    [secureStorageService],
  );

  const handleLogin = useCallback(async () => {
    const trimmedEmail = state.email.trim();
    const trimmedPassword = state.password.trim();
    const emailError = validateLoginEmail(trimmedEmail);
    const passwordError = validateLoginPassword(trimmedPassword);

    if (emailError || passwordError) {
      setState(prev => ({
        ...prev,
        email: trimmedEmail,
        password: trimmedPassword,
        emailError,
        passwordError,
        error: null,
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      email: trimmedEmail,
      password: trimmedPassword,
      emailError: null,
      passwordError: null,
      isLoadingLogin: true,
      error: null,
    }));

    try {
      const user = await loginUseCase.execute(trimmedEmail, trimmedPassword);
      await saveBiometricCredentials(trimmedEmail, trimmedPassword);
      setState(prev => ({
        ...prev,
        emailError: null,
        passwordError: null,
        isLoadingLogin: false,
      }));
      onLoginSuccess(user);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Ocurrió un error inesperado';
      setState(prev => ({
        ...prev,
        isLoadingLogin: false,
        error: message,
      }));
    }
  }, [
    loginUseCase,
    state.email,
    state.password,
    onLoginSuccess,
    saveBiometricCredentials,
  ]);

  const handleBiometricLogin = useCallback(async () => {
    setState(prev => ({...prev, isLoadingBiometric: true, error: null}));

    try {
      const availability = await biometricAuthService.getAvailability();
      if (!availability.available) {
        throw new BiometricAuthError(
          availability.error ?? 'Biometric sensor unavailable',
          'not_available',
        );
      }

      await biometricAuthService.authenticate('Confirma tu identidad');

      const stored = await secureStorageService.get(
        SecureStorageKeys.BIOMETRIC_CREDENTIALS,
      );
      if (!stored) {
        setState(prev => ({
          ...prev,
          isLoadingBiometric: false,
          error:
            'Inicia sesión con usuario y contraseña al menos una vez para habilitar Huella / Face ID.',
        }));
        return;
      }

      let credentials: StoredBiometricCredentials;
      try {
        credentials = JSON.parse(stored) as StoredBiometricCredentials;
      } catch {
        setState(prev => ({
          ...prev,
          isLoadingBiometric: false,
          error: 'No se pudieron leer las credenciales guardadas. Inicia sesión de nuevo.',
        }));
        return;
      }

      if (!credentials.email?.trim() || !credentials.password?.trim()) {
        setState(prev => ({
          ...prev,
          isLoadingBiometric: false,
          error: 'Credenciales incompletas. Inicia sesión de nuevo.',
        }));
        return;
      }

      const user = await loginUseCase.execute(
        credentials.email.trim(),
        credentials.password.trim(),
      );
      await saveBiometricCredentials(
        credentials.email.trim(),
        credentials.password.trim(),
      );
      setState(prev => ({...prev, isLoadingBiometric: false}));
      onLoginSuccess(user);
    } catch (err) {
      const message = mapBiometricError(err);
      setState(prev => ({
        ...prev,
        isLoadingBiometric: false,
        ...(message ? {error: message} : {}),
      }));
    }
  }, [
    biometricAuthService,
    loginUseCase,
    onLoginSuccess,
    saveBiometricCredentials,
    secureStorageService,
  ]);

  const isBusy = state.isLoadingLogin || state.isLoadingBiometric;

  return {
    email: state.email,
    password: state.password,
    emailError: state.emailError,
    passwordError: state.passwordError,
    isLoadingLogin: state.isLoadingLogin,
    isLoadingBiometric: state.isLoadingBiometric,
    isBusy,
    error: state.error,
    setEmail,
    setPassword,
    handleLogin,
    handleBiometricLogin,
  };
}
