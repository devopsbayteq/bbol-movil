import {useState, useCallback, useMemo} from 'react';
import {User} from '../../domain/entities/User';
import {useDI} from '../../di';
import {BiometricAuthError} from '../../domain/services/BiometricAuthService';
import {BiometricRSAError} from '../../security/biometric';

import {
  hasDisallowedLoginPasswordCharacters,
  hasDisallowedLoginUsernameCharacters,
  LOGIN_PASSWORD_MAX_LENGTH,
  LOGIN_USERNAME_MAX_LENGTH,
  loginValidationMessages,
  sanitizeLoginPasswordInput,
  sanitizeLoginUsernameInput,
  validateLoginPassword,
  validateLoginUsername,
} from '../../domain/validation';
import DeviceInfo from "react-native-device-info";

interface LoginState {
  email: string;
  password: string;
  emailError: string | null;
  passwordError: string | null;
  isLoadingLogin: boolean;
  isLoadingBiometric: boolean;
  error: string | null;
}

export function mapBiometricError(err: unknown): string | null {
  if (err instanceof BiometricRSAError) {
    if (err.code === 'user_cancelled') {
      return null;
    }
    if (err.code === 'not_available') {
      return 'La autenticación biométrica no está disponible en este dispositivo.';
    }
    if (
      err.code === 'prompt_failed' ||
      err.code === 'keychain_error' ||
      err.code === 'crypto_error'
    ) {
      return err.message || 'No se pudo completar la operación biométrica.';
    }
    if (err.code === 'no_private_key' || err.code === 'no_stored_username') {
      return err.message;
    }
    if (err.code === 'network_error') {
      return err.message || 'Error de conexión. Verifica tu red e inténtalo de nuevo.';
    }
    return err.message || 'No se pudo completar la autenticación biométrica.';
  }
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

function getLiveUsernameError(username: string): string | null {
  return username ? validateLoginUsername(username) : null;
}

function getLivePasswordError(password: string): string | null {
  return password ? validateLoginPassword(password) : null;
}

export function useLoginViewModel(
  onCredentialLoginSuccess: (user: User) => void,
  onBiometricLoginSuccess: (user: User) => void,
) {

  const appVersion = DeviceInfo.getVersion();
  const buildNumber = DeviceInfo.getBuildNumber();

  const version = `Versión: ${appVersion} (${buildNumber})`;

  const [showDevelopMode, setShowDevelopMode] = useState(false);
  const [showBiometricLogin, setShowBiometricLogin] = useState(false);

  const [state, setState] = useState<LoginState>({
    email: '',
    password: '',
    emailError: null,
    passwordError: null,
    isLoadingLogin: false,
    isLoadingBiometric: false,
    error: null,
  });

  const {loginUseCase, biometricRSAAuthOrchestrator} = useDI();

  const setEmail = useCallback((email: string) => {
    const sanitizedEmail = sanitizeLoginUsernameInput(email);

    if (sanitizedEmail.length > LOGIN_USERNAME_MAX_LENGTH) {
      setState(prev => ({
        ...prev,
        email: sanitizedEmail.slice(0, LOGIN_USERNAME_MAX_LENGTH),
        emailError: loginValidationMessages.usernameTooLong,
        error: null,
      }));
      return;
    }

    const emailError = hasDisallowedLoginUsernameCharacters(email)
      ? loginValidationMessages.usernameInvalidCharacters
      : getLiveUsernameError(sanitizedEmail);

    setState(prev => ({
      ...prev,
      email: sanitizedEmail,
      emailError,
      error: null,
    }));
  }, []);

  const setPassword = useCallback((password: string) => {
    const sanitizedPassword = sanitizeLoginPasswordInput(password);

    if (sanitizedPassword.length > LOGIN_PASSWORD_MAX_LENGTH) {
      setState(prev => ({
        ...prev,
        password: sanitizedPassword.slice(0, LOGIN_PASSWORD_MAX_LENGTH),
        passwordError: loginValidationMessages.passwordTooLong,
        error: null,
      }));
      return;
    }

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

  const handleLogin = useCallback(async () => {
    const trimmedEmail = state.email.trim();
    const trimmedPassword = state.password.trim();
    const emailError = validateLoginUsername(trimmedEmail);
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
      setState(prev => ({
        ...prev,
        isLoadingLogin: false,
        emailError: null,
        passwordError: null,
      }));
      onCredentialLoginSuccess(user);
    } catch (err) {
      const message = mapBiometricError(err);
      setState(prev => ({
        ...prev,
        isLoadingLogin: false,
        ...(message ? {error: message} : {}),
      }));
    }
  }, [
    loginUseCase,
    state.email,
    state.password,
    onCredentialLoginSuccess,
  ]);

  const handleBiometricLogin = useCallback(async () => {
    setState(prev => ({...prev, isLoadingBiometric: true, error: null}));

    try {
      const result = await biometricRSAAuthOrchestrator.loginWithBiometric();
      const user: User = {
        id: result.email,
        email: result.email,
        name: result.email.split('@')[0] || 'User',
        token: result.accessToken,
        sessionExpiresAt: Date.now() + 3600 * 1000,
        inactivityTimeoutSeconds: 300,
      };
      setState(prev => ({...prev, isLoadingBiometric: false}));
      onBiometricLoginSuccess(user);
    } catch (err) {
      const message = mapBiometricError(err);
      setState(prev => ({
        ...prev,
        isLoadingBiometric: false,
        ...(message ? {error: message} : {}),
      }));
    }
  }, [biometricRSAAuthOrchestrator, onBiometricLoginSuccess]);

  const isBusy = state.isLoadingLogin || state.isLoadingBiometric;

  const isCredentialLoginEnabled = useMemo(
      () =>
          state.email.trim().length > 0 && state.password.trim().length > 0,
      [state.email, state.password],
  );
  return {
    email: state.email,
    password: state.password,
    emailError: state.emailError,
    passwordError: state.passwordError,
    isLoadingLogin: state.isLoadingLogin,
    isLoadingBiometric: state.isLoadingBiometric,
    isBusy,
    isCredentialLoginEnabled,
    error: state.error,
    setEmail,
    setPassword,
    handleLogin,
    handleBiometricLogin,
    showDevelopMode,
    setShowDevelopMode,
    showBiometricLogin,
    setShowBiometricLogin,
    version
  };
}
