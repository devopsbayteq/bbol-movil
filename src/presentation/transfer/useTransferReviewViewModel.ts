import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {TransferStackParamList} from '../../navigation/TransferStackNavigator';

function formatReviewDate(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleDateString('es-EC', {month: 'long'});
  const capMonth = month.charAt(0).toUpperCase() + month.slice(1);
  const year = date.getFullYear();
  return `${day} de ${capMonth}, ${year}`;
}

function beneficiaryAccountLine(
  bankName?: string,
  accountHint?: string,
): string | undefined {
  if (accountHint?.trim()) {
    return accountHint.trim();
  }
  if (bankName?.trim()) {
    return bankName.trim();
  }
  return undefined;
}

export function useTransferReviewViewModel() {
  const navigation =
    useNavigation<NativeStackNavigationProp<TransferStackParamList, 'TransferReview'>>();
  const route = useRoute<RouteProp<TransferStackParamList, 'TransferReview'>>();

  const {
    amountCents,
    displayAmount,
    beneficiary,
    fromHolderName,
    fromAccountLine,
    accountId,
    concept,
  } = route.params;

  const [commission, setCommission] = useState<
    'Sin cargo' | 'Con cargo' | null
  >(null);
  const [commissionLoading, setCommissionLoading] = useState(true);

  useEffect(() => {
    setCommissionLoading(true);
    setCommission('Sin cargo');
    setCommissionLoading(false);
  }, [amountCents]);

  const [devNoticeVisible, setDevNoticeVisible] = useState(false);

  const paraSubline = useMemo(
    () => beneficiaryAccountLine(beneficiary.bankName, beneficiary.accountHint),
    [beneficiary.accountHint, beneficiary.bankName],
  );

  const conceptDisplay = concept.trim() ? concept.trim() : '—';

  const transferDateLabel = useMemo(() => formatReviewDate(new Date()), []);

  const onBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    amountCents,
    displayAmount,
    beneficiary,
    fromHolderName,
    fromAccountLine,
    accountId,
    concept,
    commission,
    commissionLoading,
    devNoticeVisible,
    setDevNoticeVisible,
    paraSubline,
    conceptDisplay,
    transferDateLabel,
    onBack,
  };
}
