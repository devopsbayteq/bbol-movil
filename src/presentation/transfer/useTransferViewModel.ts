import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {AccountBalance} from '../../domain/entities/ContractBalance';
import {useAuth} from '../../providers';
import {formatAccountKindLine} from '../../utils/accountDisplay';
import {formatMoneyEc} from '../../utils/formatMoneyEc';
import {useHomeViewModel} from '../home/useHomeViewModel';
import type {TransferReviewRouteParams} from './TransferReview/transferReviewTypes';
import type {BeneficiaryOption} from './transferTypes';

const MAX_CENTS = 999_999_999_999;

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

  const onAmountChange = useCallback((text: string) => {
    const digits = text.replace(/\D/g, '');
    if (digits === '') {
      setAmountCents(0);
      return;
    }
    const n = parseInt(digits, 10);
    if (Number.isNaN(n)) {
      return;
    }
    setAmountCents(Math.min(n, MAX_CENTS));
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
  }, []);

  const prepareTransferReview = useCallback(():
    | {ok: true; params: TransferReviewRouteParams}
    | {ok: false; message: string} => {
    if (amountCents <= 0) {
      return {ok: false, message: 'Ingresa un monto mayor a cero.'};
    }
    if (!beneficiary) {
      return {ok: false, message: 'Selecciona un beneficiario.'};
    }
    if (!selectedAccount) {
      return {ok: false, message: 'No hay una cuenta de origen disponible.'};
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
  }, [amountCents, beneficiary, concept, displayAmount, selectedAccount, user?.name]);

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
    setConcept,
    validationMessage,
    setValidationMessage,
    openAccountPicker,
    selectAccount,
    selectBeneficiary,
    accountIndex,
    prepareTransferReview,
  };
}
