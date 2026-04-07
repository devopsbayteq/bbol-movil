import {useCallback, useEffect, useMemo, useState} from 'react';
import {
    useRoute,
    type RouteProp,

} from '@react-navigation/native';
import type {TransferStackParamList} from '../../../navigation/TransferStackNavigator';
import {useDI} from '../../../di';
import {useAuth} from '../../../providers';
import type {TransferDataResume} from '../transferResult/TransferModalSuccess.tsx';
import {formatMoneyEc} from '../../../utils/formatMoneyEc';

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

export type TransferReviewViewModelOptions = {
    onTransferSuccess?: (data: TransferDataResume) => void;
};

export function useTransferReviewViewModel(
    navigateOtp: () => void,
    options?: TransferReviewViewModelOptions,
) {
    const {onTransferSuccess} = options ?? {};
    const route = useRoute<RouteProp<TransferStackParamList, 'TransferReview'>>();
    const {validateTransactionAmountUseCase, executeTransferUseCase} = useDI();
    const {user} = useAuth();

    const {
        amountCents,
        displayAmount,
        beneficiary,
        fromHolderName,
        fromAccountLine,
        fromAccountTitle,
        fromAccountSubtitle,
        fromBalanceDisplay,
        toBalanceDisplay,
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

    const [confirmLoading, setConfirmLoading] = useState(false);
    const [confirmError, setConfirmError] = useState<string | null>(null);

    const paraSubline = useMemo(
        () => beneficiaryAccountLine(beneficiary.bankName, beneficiary.accountHint),
        [beneficiary.accountHint, beneficiary.bankName],
    );

    const conceptDisplay = concept.trim() ? concept.trim() : '—';

    const commissionDisplay = useMemo(() => {
        if (commission === 'Con cargo') {
            return 'Con cargo';
        }
        return formatMoneyEc(0);
    }, [commission]);

    const doTransacction = useCallback(async () => {
        setConfirmError(null);
        const amount = Math.round(amountCents) / 100;
        setConfirmLoading(true);
        try {
            const execution = await executeTransferUseCase.execute({
                amount,
                beneficiaryContactGuid: beneficiary.id,
                accountGuid: accountId,
                concept: concept.trim(),
            });
            const payload: TransferDataResume = {
                amountCents: String(amountCents),
                displayAmount,
                beneficiary,
                fromHolderName,
                fromAccountLine,
                accountId,
                concept: concept.trim(),
                transactionIdentifier: execution.transactionIdentifier,
            };
            onTransferSuccess?.(payload);
            setConfirmLoading(false);
        }catch (err){
            const message =
                err instanceof Error ? err.message : 'No se pudo validar el monto.';
            setConfirmError(message);
        }finally {
            setConfirmLoading(false)
        }

    },[accountId, amountCents, beneficiary, concept, displayAmount, executeTransferUseCase, fromAccountLine, fromHolderName, onTransferSuccess])

    const onConfirm = useCallback(async () => {
        setConfirmError(null);

        const email = user?.email?.trim() ?? '';
        if (!email) {
            setConfirmError('No hay un correo en la sesión para continuar con la autenticación.');
            return;
        }


        setConfirmLoading(true);
        try {
            const amount = Math.round(amountCents) / 100;
            const result = await validateTransactionAmountUseCase.execute({
                amount,
                beneficiaryGuid: beneficiary.id,
                accountGuid: accountId,
                concept: concept.trim(),
            });

            if (!result.isValid) {
                const execution = await executeTransferUseCase.execute({
                    amount,
                    beneficiaryContactGuid: beneficiary.id,
                    accountGuid: accountId,
                    concept: concept.trim(),
                });
                const payload: TransferDataResume = {
                    amountCents: String(amountCents),
                    displayAmount,
                    beneficiary,
                    fromHolderName,
                    fromAccountLine,
                    accountId,
                    concept: concept.trim(),
                    transactionIdentifier: execution.transactionIdentifier,
                };
                onTransferSuccess?.(payload);
                return;
            } else {
                navigateOtp()
            }
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'No se pudo validar el monto.';
            setConfirmError(message);
        } finally {
            setConfirmLoading(false);
        }
    }, [
        navigateOtp,
        accountId,
        amountCents,
        beneficiary,
        concept,
        displayAmount,
        fromAccountLine,
        fromHolderName,
        user?.email,
        validateTransactionAmountUseCase,
        executeTransferUseCase,
        onTransferSuccess,
    ]);

    return {
        amountCents,
        displayAmount,
        beneficiary,
        fromHolderName,
        fromAccountLine,
        fromAccountTitle,
        fromAccountSubtitle,
        fromBalanceDisplay,
        toBalanceDisplay,
        accountId,
        concept,
        commission,
        commissionLoading,
        commissionDisplay,
        confirmLoading,
        confirmError,
        setConfirmError,
        paraSubline,
        conceptDisplay,
        onConfirm,
        doTransacction
    };
}
