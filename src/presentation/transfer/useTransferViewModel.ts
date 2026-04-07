import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {AccountBalance} from '../../domain/entities/ContractBalance';
import {
    balanceDollarsToCents,
    getLiveTransferAmountError,
    MAX_TRANSFER_CENTS,
    sanitizeTransferConceptInput,
    validateTransferAmountForSubmit,
    validateTransferConcept,
} from '../../domain/validation';
import {useAuth} from '../../providers';
import {formatAccountKindLine} from '../../utils/accountDisplay';
import {formatMoneyEc} from '../../utils/formatMoneyEc';
import {useHomeViewModel} from '../home/useHomeViewModel';
import type {TransferReviewRouteParams} from './TransferReview/transferReviewTypes';

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

    const [accountBeneficiaryModalVisible, setAccountBeneficiaryModalVisible] = useState(false);

    const accounts = useMemo(() => data?.accounts ?? [], [data?.accounts]);
    const defaultIdx = useMemo(() => defaultAccountIndex(accounts), [accounts]);

    const [concept, setConcept] = useState('');

    const [validationMessage, setValidationMessage] = useState<string | null>(null);


    const [fromAccountModalVisible, setFromAccountModalVisible] = useState(false);
    const [fromAccountIndex, setFromAccountIndex] = useState(0);


    const [toAccountIndex, setToAccountIndex] = useState(0);
    const [toAccountModalVisible, setToAccountModalVisible] = useState(false);


    const accountsInitializedRef = useRef(false);

    useEffect(() => {
        if (accounts.length === 0) {
            return;
        }
        if (!accountsInitializedRef.current) {
            setFromAccountIndex(defaultIdx);
            accountsInitializedRef.current = true;
            return;
        }
        if (fromAccountIndex >= accounts.length) {
            selectFromAccount(defaultIdx);
        }
    }, [accounts, defaultIdx, fromAccountIndex]);


    const selectedFromAccount = accounts[fromAccountIndex] ?? null;
    const selectedToAccount = accounts[fromAccountIndex] ?? null;

    const fromAccountDescription = useMemo(
        () => (selectedFromAccount ? formatAccountKindLine(selectedFromAccount) : ''),
        [selectedFromAccount],
    );

    const toAccountDescription = useMemo(
        () => (selectedToAccount ? formatAccountKindLine(selectedToAccount) : ''),
        [selectedToAccount],
    );

    const displayAmount = useMemo(
        () => formatMoneyEc(amountCents / 100),
        [amountCents],
    );

    const availableBalanceCents = useMemo(
        () => balanceDollarsToCents(selectedFromAccount?.balance ?? 0),
        [selectedFromAccount?.balance],
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
        setConcept(sanitized);
    }, []);

    const openFromAccountPicker = useCallback(() => {
        if (accounts.length > 1) {
            setFromAccountModalVisible(true);
        }
    }, [accounts.length]);

    const openToAccountPicker = useCallback(() => {
        if (accounts.length > 1) {
            setToAccountModalVisible(true);
        }
    }, [accounts.length]);

    const openAccountBeneficiaryPicker = useCallback(() => {
        if (accounts.length > 1) {
            setAccountBeneficiaryModalVisible(true);
        }
    }, [accounts.length]);

    const selectFromAccount = useCallback((index: number) => {
        setFromAccountIndex(index);
        setAccountBeneficiaryModalVisible(false);
    }, []);

    const selectToAccount = useCallback((index: number) => {
        setToAccountIndex(index);
        setToAccountModalVisible(false);
    }, []);





    const prepareTransferReview = useCallback(():
        | { ok: true; params: TransferReviewRouteParams }
        | { ok: false; message: string } => {
        const amountError = validateTransferAmountForSubmit(
            amountCents,
            availableBalanceCents,
        );
        if (amountError) {
            return {ok: false, message: amountError};
        }
        if (!selectedToAccount) {
            return {ok: false, message: 'Selecciona un beneficiario.'};
        }
        if (!selectFromAccount) {
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
                beneficiary:{
                    id:selectedToAccount.beneficiary.beneficiaryGuid,
                    bankName:selectedToAccount.beneficiary.bankName,
                    name:selectedToAccount.beneficiary.contactName,
                    kind:"own_account",
                    accountHint:selectedToAccount.beneficiary.lastFourDigits
                },
                fromHolderName: holderName,
                fromAccountLine: formatAccountKindLine(selectedFromAccount),
                accountId: selectedFromAccount.beneficiary.beneficiaryGuid,
                concept: concept,
            },
        };
    }, [
        amountCents,
        availableBalanceCents,
        concept,
        displayAmount,
        selectedFromAccount,
        user?.name,
    ]);

    return {
        user,
        isLoading,
        error,
        retry,
        accounts,
        selectedFromAccount,
        fromAccountDescription,
        fromAccountModalVisible,
        setFromAccountModalVisible,
        amountCents,
        displayAmount,
        onAmountChange,
        concept,
        onConceptChange,
        amountFieldError,
        validationMessage,
        setValidationMessage,
        openFromAccountPicker,
        openToAccountPicker,
        selectFromAccount,
        fromAccountIndex,
        prepareTransferReview,
        openAccountBeneficiaryPicker,
        accountBeneficiaryModalVisible,
        toAccountModalVisible,
        setToAccountModalVisible,
        toAccountIndex,
        selectToAccount,
        toAccountDescription,
        selectedToAccount
    };
}
