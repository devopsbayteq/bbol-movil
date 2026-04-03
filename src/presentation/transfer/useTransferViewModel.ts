import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {AccountBalance} from '../../domain/entities/ContractBalance';
import {
  balanceDollarsToCents,
  getLiveTransferAmountError,
  hasDisallowedTransferConceptCharacters,
  MAX_TRANSFER_CENTS,
  sanitizeTransferConceptInput,
  transferConceptMessages,
  validateTransferAmountForSubmit,
  validateTransferConcept,
} from '../../domain/validation';
import {useAuth} from '../../providers';
import {formatAccountKindLine} from '../../utils/accountDisplay';
import {formatMoneyEc} from '../../utils/formatMoneyEc';
import {useHomeViewModel} from '../home/useHomeViewModel';
import type {TransferReviewRouteParams} from './TransferReview/transferReviewTypes';
import type {BeneficiaryOption} from '../beneficiary/transferTypes.ts';

function defaultAccountIndex(accounts: AccountBalance[]): number {
  if (accounts.length === 0) {
    return 0;
  }
  const savingsIdx = accounts.findIndex(a => a.accountKind === 'savings');
  return savingsIdx >= 0 ? savingsIdx : 0;
}

export function useTransferViewModel() {
  const {user} = useAuth();
  const {data, isLoading, error, retry} = useHomeViewModel();

  const [amountCents, setAmountCents] = useState(0);
  const [accountIndex, setAccountIndex] = useState(0);
  const [beneficiary, setBeneficiary] = useState<BeneficiaryOption | null>(null);
  const [concept, setConcept] = useState('');
  const [conceptError, setConceptError] = useState<string | null>(null);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const accounts = useMemo(() => data?.accounts ?? [], [data?.accounts]);
  const defaultIdx = useMemo(() => defaultAccountIndex(accounts), [accounts]);

  const accountsInitializedRef = useRef(false);

  useEffect(() => {
    if (accounts.length === 0) {
      return;
    }
    if (!accountsInitializedRef.current) {
      setAccountIndex(defaultIdx);
      accountsInitializedRef.current = true;
      return;
    }
    if (accountIndex >= accounts.length) {
      setAccountIndex(defaultIdx);
    }
  }, [accounts, defaultIdx, accountIndex]);

  const selectedAccount = accounts[accountIndex] ?? null;

  const fromAccountDescription = useMemo(
    () => (selectedAccount ? formatAccountKindLine(selectedAccount) : ''),
    [selectedAccount],
  );

  const displayAmount = useMemo(
    () => formatMoneyEc(amountCents / 100),
    [amountCents],
  );

  const availableBalanceCents = useMemo(
    () => balanceDollarsToCents(selectedAccount?.balance ?? 0),
    [selectedAccount?.balance],
  );

  const amountFieldError = useMemo(
    () => getLiveTransferAmountError(amountCents, availableBalanceCents),
    [amountCents, availableBalanceCents],
  );

  const onAmountChange = useCallback((text: string) => {
    const digits = text.replace(/\D/g, '');
    setValidationMessage(null);

    if (digits === '') {
      setAmountCents(0);
      return;
    }
    const n = parseInt(digits, 10);
    if (Number.isNaN(n)) {
      return;
    }
    setAmountCents(Math.min(n, MAX_TRANSFER_CENTS));
  }, []);

  const onConceptChange = useCallback((text: string) => {
    const sanitized = sanitizeTransferConceptInput(text);
    const nextError = hasDisallowedTransferConceptCharacters(text)
      ? transferConceptMessages.invalidCharacters
      : validateTransferConcept(sanitized);

    setConcept(sanitized);
    setConceptError(nextError);
    setValidationMessage(null);
  }, []);

  const openAccountPicker = useCallback(() => {
    if (accounts.length > 1) {
      setAccountModalVisible(true);
    }
  }, [accounts.length]);

  const selectAccount = useCallback((index: number) => {
    setAccountIndex(index);
    setAccountModalVisible(false);
  }, []);

  const selectBeneficiary = useCallback((b: BeneficiaryOption) => {
    setBeneficiary(b);
    setValidationMessage(null);
  }, []);

  const prepareTransferReview = useCallback(():
    | {ok: true; params: TransferReviewRouteParams}
    | {ok: false; message: string} => {
    const amountError = validateTransferAmountForSubmit(
      amountCents,
      availableBalanceCents,
    );
    if (amountError) {
      return {ok: false, message: amountError};
    }
    if (!beneficiary) {
      return {ok: false, message: 'Selecciona un beneficiario.'};
    }
    if (!selectedAccount) {
      return {ok: false, message: 'No hay una cuenta de origen disponible.'};
    }

    const conceptError = validateTransferConcept(concept);
    if (conceptError) {
      return {ok: false, message: conceptError};
    }

    const holderName = user?.name?.trim() || 'Titular';

    return {
      ok: true,
      params: {
        amountCents,
        displayAmount,
        beneficiary,
        fromHolderName: holderName,
        fromAccountLine: formatAccountKindLine(selectedAccount),
        accountId: selectedAccount.accountGuid,
        concept: concept,
      },
    };
  }, [
    amountCents,
    availableBalanceCents,
    beneficiary,
    concept,
    displayAmount,
    selectedAccount,
    user?.name,
  ]);

  return {
    user,
    isLoading,
    error,
    retry,
    accounts,
    selectedAccount,
    fromAccountDescription,
    accountModalVisible,
    setAccountModalVisible,
    beneficiary,
    amountCents,
    displayAmount,
    onAmountChange,
    concept,
    onConceptChange,
    conceptError,
    amountFieldError,
    validationMessage,
    setValidationMessage,
    openAccountPicker,
    selectAccount,
    selectBeneficiary,
    accountIndex,
    prepareTransferReview,
  };
}
