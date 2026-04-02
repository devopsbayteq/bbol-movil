import {useState, useCallback} from 'react';
import {User} from '../../domain/entities/User';
import {useDI} from '../../di';
import {BiometricAuthError} from '../../domain/services/BiometricAuthService';
import {BiometricRSAError} from '../../security/biometric';

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

function getLiveEmailError(email: string): string | null {
  return email ? validateLoginEmail(email) : null;
}

function getLivePasswordError(password: string): string | null {
  return password ? validateLoginPassword(password) : null;
}

export function useLoginViewModel(
  onCredentialLoginSuccess: (user: User) => void,
  onBiometricLoginSuccess: (user: User) => void,
) {
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
