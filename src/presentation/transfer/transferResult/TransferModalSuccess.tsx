import {
    Modal,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
} from 'react-native';
import {ThemeColors, useTheme} from '../../../providers';
import React, {useMemo} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CardAccountItem} from '../components/CardAccountItem.tsx';
import {BeneficiaryOption} from '../../beneficiary/transferTypes.ts';
import {Lexend} from '../../../theme/lexend.ts';
import {TransactionHeaderInformation} from "../components/TransactionHeaderInformation.tsx";

interface TransferModalSuccessProps {
    visible: boolean;
    onClose: () => void;
    navigateToHome: () => void;
    navigateToTransfer: () => void;
    openVoucher: () => void;
    transactionData: TransferDataResume;
}

export interface TransferDataResume {
    amountCents: string;
    displayAmount: string;
    beneficiary: BeneficiaryOption;
    fromHolderName: string;
    fromAccountLine: string;
    accountId: string;
    concept: string;
    transactionIdentifier: string;
}

export const TransferModalSuccess = ({
                                         visible,
                                         onClose,
                                         navigateToTransfer,
                                         navigateToHome,
                                         transactionData,
                                         openVoucher
                                     }: TransferModalSuccessProps) => {
    const {colors} = useTheme();
    const insets = useSafeAreaInsets();
    const styles = useStyles(colors);


    return (
        <Modal
            transparent
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}>
            <View style={styles.modalRoot}>
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onClose}
                    accessibilityRole="button"
                    accessibilityLabel="Cerrar"
                />
                <View
                    style={[
                        styles.sheet,
                        {paddingBottom: Math.max(insets.bottom, 12)},
                    ]}>
                    <View style={styles.sheetInner}>
                        <View style={styles.cardInfoContainer}>
                            <TransactionHeaderInformation transferResume={transactionData}/>
                            <View style={styles.accountsBlock}>
                                <CardAccountItem
                                    origin="Desde"
                                    accountType={transactionData.fromAccountLine}
                                    name={transactionData.fromHolderName}
                                    showBottomBorder
                                />
                                <CardAccountItem
                                    origin="Para"
                                    accountType={transactionData.beneficiary.accountHint}
                                    name={transactionData.beneficiary.name}
                                />
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={navigateToTransfer}
                                activeOpacity={0.85}
                                accessibilityRole="button"
                                accessibilityLabel="Nueva transferencia">
                                <Text style={styles.primaryButtonText}>Nueva transferencia</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.tertiaryButton}
                                onPress={openVoucher}
                                activeOpacity={0.85}
                                accessibilityRole="button"
                                accessibilityLabel="Voucher">
                                <Text style={styles.tertiaryButtonText}>Voucher</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.tertiaryButton}
                                onPress={navigateToHome}
                                activeOpacity={0.85}
                                accessibilityRole="button"
                                accessibilityLabel="Ir al inicio">
                                <Text style={styles.tertiaryButtonText}>Ir al inicio</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

function useStyles(colors: ThemeColors) {
    return useMemo(
        () =>
            StyleSheet.create({
                modalRoot: {
                    flex: 1,
                    justifyContent: 'flex-end',
                },
                backdrop: {
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                },
                sheet: {
                    backgroundColor: colors.background,
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    paddingTop: 24,
                    maxWidth: '100%',
                    alignSelf: 'stretch',
                },
                sheetInner: {
                    gap: 24,
                    alignItems: 'center',
                    paddingHorizontal: 24,
                },
                accountsBlock: {
                    width: '100%',
                },
                cardInfoContainer: {
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    padding: 12,
                    width: '100%',
                    maxWidth: 312,
                    gap: 24,
                },
                buttonContainer: {
                    width: '100%',
                    maxWidth: 312,
                    gap: 12,
                    alignItems: 'center',
                },
                primaryButton: {
                    backgroundColor: colors.primary,
                    borderRadius: 8,
                    height: 54,
                    width: '100%',
                    maxWidth: 312,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 16,
                },
                primaryButtonText: {
                    fontFamily: Lexend.semiBold,
                    fontSize: 14,
                    lineHeight: 22,
                    color: colors.white,
                },
                tertiaryButton: {
                    paddingVertical: 8,
                    paddingHorizontal: 4,
                    borderRadius: 8,
                    width: 261,
                    alignItems: 'center',
                },
                tertiaryButtonText: {
                    fontFamily: Lexend.semiBold,
                    fontSize: 14,
                    lineHeight: 22,
                    color: colors.linkPrimary,
                },
            }),
        [colors],
    );
}
