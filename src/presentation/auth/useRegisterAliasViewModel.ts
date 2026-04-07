import {useCallback, useState} from 'react';

import {useDI} from '../../di';
import {
  sanitizeRegisterAliasInput,
  validateRegisterAliasInput,
} from '../../domain/validation/registerAlias';

export function useRegisterAliasViewModel() {
  const {registerAliasUseCase} = useDI();
  const [alias, setAlias] = useState('');
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onChangeAlias = useCallback((value: string) => {
    setAlias(sanitizeRegisterAliasInput(value));
    if (inlineError) {
      setInlineError(null);
    }
    if (submitError) {
      setSubmitError(null);
    }
  }, [inlineError, submitError]);

  const submit = useCallback(async (): Promise<boolean> => {
    const normalized = sanitizeRegisterAliasInput(alias);
    const validation = validateRegisterAliasInput(normalized);
    if (validation) {
      setInlineError(validation);
      return false;
    }

    setIsLoading(true);
    setSubmitError(null);
    setInlineError(null);

    try {
      await registerAliasUseCase.execute(normalized);
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Ocurrió un error inesperado';
      setSubmitError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [alias, registerAliasUseCase]);

  return {
    alias,
    inlineError,
    submitError,
    isLoading,
    onChangeAlias,
    submit,
  };
}
