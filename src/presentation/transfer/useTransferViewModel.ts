import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert} from 'react-native';
import type {AccountBalance} from '../../domain/entities/ContractBalance';
import {useAuth} from '../../providers';
import {formatAccountKindLine} from '../../utils/accountDisplay';
import {formatMoneyEc} from '../../utils/formatMoneyEc';
import {useHomeViewModel} from '../home/useHomeViewModel';

export type BeneficiaryOption = {
  id: string;
  name: string;
  kind: 'own_account' | 'contact';
  bankName?: string;
  accountHint?: string;
};

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

  const onContinue = useCallback(() => {
    setValidationMessage(null);

    if (amountCents <= 0) {
      setValidationMessage('Ingresa un monto mayor a cero.');
      return;
    }
    if (!beneficiary) {
      setValidationMessage('Selecciona un beneficiario.');
      return;
    }
    if (!selectedAccount) {
      setValidationMessage('No hay una cuenta de origen disponible.');
      return;
    }

    const holderName = user?.name?.trim() || 'Titular';
    const fromLine = `${holderName}\n${formatAccountKindLine(selectedAccount)}`;

    const paraLines = [
      beneficiary.name,
      beneficiary.bankName,
      beneficiary.accountHint,
    ].filter(Boolean);

    Alert.alert(
      'Confirmar transferencia',
      [
        `Monto: ${displayAmount}`,
        `Desde: ${fromLine.replace('\n', ' — ')}`,
        `Para: ${paraLines.join(' — ')}`,
        `Concepto: ${concept.trim() ? concept.trim() : '—'}`,
      ].join('\n'),
      [{text: 'OK'}],
    );
  }, [
    amountCents,
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
    setConcept,
    validationMessage,
    openAccountPicker,
    selectAccount,
    selectBeneficiary,
    accountIndex,
    onContinue,
  };
}
