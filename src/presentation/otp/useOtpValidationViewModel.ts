import {useCallback, useEffect, useMemo, useState} from 'react';

const RESEND_WINDOW_SECONDS = 30;
const MOCK_VALID_OTP = '123456';

export function useOtpValidationViewModel(onSuccess: () => Promise<void>) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_WINDOW_SECONDS);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => Math.max(prev - 1, 0));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [secondsLeft]);

  const onChangeCode = useCallback((nextCode: string) => {
    setCode(nextCode);
    if (error) {
      setError(null);
    }
  }, [error]);

  const canSubmit = code.length === 6 && !isLoading;
  const canResend = secondsLeft === 0 && !isLoading;

  const resendLabel = useMemo(() => {
    if (secondsLeft > 0) {
      return `Reenviar codigo en ${secondsLeft}s`;
    }
    return 'Reenviar codigo';
  }, [secondsLeft]);

  const handleValidate = useCallback(async () => {
    if (code.length !== 6) {
      setError('Ingresa los 6 digitos del codigo.');
      return;
    }

    setIsLoading(true);
    setError(null);

    await new Promise<void>(resolve => {
      setTimeout(() => resolve(), 900);
    });

    if (code !== MOCK_VALID_OTP) {
      setIsLoading(false);
      setError('Codigo invalido. Usa 123456 para el flujo demo.');
      return;
    }

    await onSuccess();
    setIsLoading(false);
  }, [code, onSuccess]);

  const handleResend = useCallback(async () => {
    if (!canResend) {
      return;
    }
    setError(null);
    setCode('');
    setSecondsLeft(RESEND_WINDOW_SECONDS);
  }, [canResend]);

  return {
    code,
    error,
    isLoading,
    canSubmit,
    canResend,
    resendLabel,
    onChangeCode,
    handleValidate,
    handleResend,
  };
}
