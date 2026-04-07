import React, {useMemo} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    Keyboard,
    Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {useTheme, type ThemeColors} from '../../providers';
import {Lexend} from '../../theme/lexend';
import type {TransferStackParamList} from '../../navigation/TransferStackNavigator';
import type {MainTabParamList} from '../../navigation/MainTabNavigator';
import {TransferIconAnglesDown, TransferIconArrowRightWhite} from './components/transferIcons.tsx';
import {useTransferViewModel} from './useTransferViewModel';
import {formatMoneyEc} from '../../utils/formatMoneyEc';
import {accountProductTitle} from '../../utils/accountDisplay';
import {ToolbarApp} from './components/ToolbarApp.tsx';
import {ErrorBannerComponent} from './transferInit/components/ErrorBannerComponent.tsx';
import {Button, TertiaryLinkButton} from '../components';
import {AccountBeneficiarySelectorModal} from './AccountBeneficiarySelectorModal.tsx';
import {AccountSelectorButton} from './components/AccountSelectorButton.tsx';
import {SpacerView} from "../components/SpacerView.tsx";

const ZERO_DISPLAY = formatMoneyEc(0);

export function TransferScreen() {
    const {colors} = useTheme();
    const insets = useSafeAreaInsets();
    const styles = useStyles(colors);

    const navigation = useNavigation<NativeStackNavigationProp<TransferStackParamList, 'TransferMain'>>();

    const navigationTab = useNavigation<BottomTabNavigationProp<MainTabParamList, 'ConsolidatedPosition'>>();

    const {
        displayAmount,
        onAmountChange,
        amountFieldError,
        canContinueToReview,
        accounts,
        openFromAccountPicker,
        selectedFromAccount,
        fromAccountIndex,
        selectFromAccount,
        fromAccountModalVisible,
        setFromAccountModalVisible,
        concept,
        onConceptChange,
        validationMessage,
        prepareTransferReview,
        setValidationMessage,
        error,
        isLoading,
        retry,
        toAccountModalVisible,
        setToAccountModalVisible,
        toAccountIndex,
        selectToAccount,
        openToAccountPicker,
        selectedToAccount,
    } = useTransferViewModel();

    const fromAccountTitle = useMemo(
        () => selectedFromAccount?.accountTypeLabel?.trim() ?? '',
        [selectedFromAccount],
    );

    const fromAccountSubtitle = useMemo(() => {
        if (!selectedFromAccount) {
            return '';
        }
        const a = selectedFromAccount;
        return `${accountProductTitle(a)} ${a.maskedAccountNumber}`.trim();
    }, [selectedFromAccount]);

    const fromBalanceLabel = useMemo(
        () => (selectedFromAccount != null ? formatMoneyEc(selectedFromAccount.balance) : ''),
        [selectedFromAccount],
    );

    const toBalanceLabel = useMemo(
        () => (selectedToAccount != null ? formatMoneyEc(selectedToAccount.balance) : ''),
        [selectedToAccount],
    );

    const toAccountTitle = useMemo(
        () => selectedToAccount?.accountTypeLabel?.trim() ?? '',
        [selectedToAccount],
    );

    const toAccountSubtitle = useMemo(() => {
        if (!selectedToAccount) {
            return '';
        }
        const a = selectedToAccount;
        return `${accountProductTitle(a)} ${a.maskedAccountNumber}`.trim();
    }, [selectedToAccount]);

    const toContactName = selectedToAccount?.beneficiary.contactName?.trim() ?? '';

    const toName = useMemo(() => {
        if (!selectedToAccount) {
            return 'Selecciona una cuenta de destino';
        }
        if (toContactName !== '') {
            return toContactName;
        }
        return toAccountTitle !== '' ? toAccountTitle : 'Cuenta';
    }, [selectedToAccount, toAccountTitle, toContactName]);

    const toDescription = toAccountSubtitle;

    const onBack = () => {
        const tabNav =
            navigationTab.getParent<BottomTabNavigationProp<MainTabParamList>>();
        tabNav?.navigate('ConsolidatedPosition', {});
    };

    return (
        <View style={styles.root} testID="transfer-main-screen">
            <ToolbarApp
                title="TRANSFERIR"
                onBackPress={() => {
                    onBack();
                }}
            />

            {error ? (
                <ErrorBannerComponent
                    textRetry="Reintentar"
                    errorText={error}
                    onRetry={() => {
                        retry().catch();
                    }}
                />
            ) : null}

            {isLoading ? (
                <View style={styles.loadingWrap}>
                    <ActivityIndicator size="large" color={colors.primary}/>
                </View>
            ) : (
                <KeyboardAwareScrollView
                    style={styles.scroll}
                    contentContainerStyle={[
                        styles.scrollContent,
                        {paddingBottom: Math.max(insets.bottom, 24) + 16},
                    ]}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.hero}>
                        <View style={styles.cardsBlock}>
                            <AccountSelectorButton
                                variant="from"
                                onPress={openFromAccountPicker}
                                accounts={accounts}
                                selectedAccount={selectedFromAccount}
                                origin="Desde"
                                name={fromAccountTitle}
                                description={fromAccountSubtitle}
                                balanceLabel={fromBalanceLabel}
                            />
                            <SpacerView/>
                            <View style={styles.bridgeRow}>
                                <View style={styles.bridgeCircle}>
                                    <TransferIconAnglesDown color={colors.primary} size={24}/>
                                </View>
                            </View>
                            <AccountSelectorButton
                                variant="to"
                                onPress={openToAccountPicker}
                                accounts={accounts}
                                selectedAccount={selectedToAccount}
                                origin="Hacia"
                                name={toName}
                                description={toDescription}
                                balanceLabel={toBalanceLabel}
                            />
                        </View>
                        <SpacerView/>
                        <Text style={styles.heroHint}>Ingresa el monto a transferir</Text>
                        <View style={styles.amountWrap}>
                            <TextInput
                                style={styles.amountInput}
                                value={displayAmount}
                                onChangeText={onAmountChange}
                                keyboardType="number-pad"
                                returnKeyType="done"
                                onSubmitEditing={() => Keyboard.dismiss()}
                                placeholderTextColor={colors.placeholder}
                                placeholder={ZERO_DISPLAY}
                                selectionColor={colors.primary}
                                underlineColorAndroid="transparent"
                                testID="transfer-amount-input"
                            />
                            {amountFieldError ? (
                                <Text style={styles.amountFieldError}>{amountFieldError}</Text>
                            ) : null}
                        </View>
                    </View>

                    <View style={styles.bottomSection}>
                        <View style={styles.conceptBlock}>
                            <Text style={styles.conceptLabel}>
                                <Text style={styles.conceptLabelStrong}>Concepto </Text>
                                <Text style={styles.conceptLabelMuted}>(Opcional)</Text>
                            </Text>
                            <TextInput
                                style={styles.conceptInput}
                                value={concept}
                                onChangeText={onConceptChange}
                                placeholder="Ej. Pago zapatos"
                                placeholderTextColor={colors.placeholder}
                                maxLength={120}
                                testID="transfer-concept-input"
                            />
                            {validationMessage ? (
                                <Text style={styles.validationText}>{validationMessage}</Text>
                            ) : null}
                        </View>

                        <Button
                            disabled={!canContinueToReview}
                            disabledBackgroundColor={colors.textTertiary}
                            testID="transfer-continue-button"
                            iconSourceRight={<TransferIconArrowRightWhite color={colors.white} size={20}/>}
                            title="Continuar"
                            onPress={() => {
                                const result = prepareTransferReview();

                                if (!result.ok) {
                                    setValidationMessage(result.message);
                                    return;
                                }
                                setValidationMessage(null);
                                navigation.navigate('TransferReview', result.params);
                            }}/>
                        <TertiaryLinkButton title="Cancelar" onPress={() => {
                            onBack()
                        }}/>
                    </View>
                </KeyboardAwareScrollView>
            )}

            <AccountBeneficiarySelectorModal
                accounts={accounts}
                accountIndexSelected={fromAccountIndex}
                selectAccount={selectedId => selectFromAccount(selectedId)}
                visible={fromAccountModalVisible}
                onClose={() => setFromAccountModalVisible(false)}
                pickerRole="source"
            />

            <AccountBeneficiarySelectorModal
                accounts={accounts}
                accountIndexSelected={toAccountIndex}
                selectAccount={selectedId => selectToAccount(selectedId)}
                visible={toAccountModalVisible}
                onClose={() => setToAccountModalVisible(false)}
                pickerRole="destination"
            />
        </View>
    );
}

function useStyles(colors: ThemeColors) {
    return useMemo(
        () =>
            StyleSheet.create({
                root: {
                    flex: 1,
                    backgroundColor: colors.background,
                },
                loadingWrap: {
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                scroll: {
                    flex: 1,
                },
                scrollContent: {
                    flexGrow: 1,
                },
                hero: {
                    backgroundColor: colors.transferSectionBg,
                    paddingHorizontal: 24,
                    paddingTop: 24,
                    paddingBottom: 32,
                    minHeight: 320,
                },
                cardsBlock: {
                    width: '100%',
                },
                bridgeRow: {
                    alignItems: 'center',
                    marginTop: -20,
                    marginBottom: -20,
                    zIndex: 2,
                    height: 40,
                    justifyContent: 'center',
                },
                bridgeCircle: {
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.primaryIconContainerBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                heroHint: {
                    fontFamily: Lexend.regular,
                    fontSize: 16,
                    lineHeight: 24,
                    textAlign: 'center',
                    marginBottom: 8,
                    color: colors.textSecondary,
                },
                amountWrap: {
                    alignSelf: 'center',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.primary,
                    marginBottom: 24,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    minWidth: 200,
                },
                amountFieldError: {
                    marginTop: 8,
                    fontFamily: Lexend.regular,
                    fontSize: 13,
                    lineHeight: 18,
                    color: colors.error,
                    textAlign: 'center',
                    alignSelf: 'center',
                    maxWidth: 280,
                },
                amountInput: {
                    fontFamily: Lexend.bold,
                    fontSize: 50,
                    lineHeight: 60,
                    textAlign: 'center',
                    paddingVertical: 0,
                    minHeight: 70,
                    color: colors.textPrimary,
                    ...(Platform.OS === 'android' ? {textAlignVertical: 'center'} : null),
                },
                bottomSection: {
                    paddingHorizontal: 24,
                    paddingTop: 24,
                    gap: 16,
                    backgroundColor: colors.background,
                },
                conceptBlock: {
                    gap: 8,
                },
                conceptLabel: {
                    fontSize: 12,
                    lineHeight: 20,
                },
                conceptLabelStrong: {
                    fontFamily: Lexend.semiBold,
                    color: colors.textSecondary,
                },
                conceptLabelMuted: {
                    fontFamily: Lexend.regular,
                    color: colors.textTertiary,
                },
                conceptInput: {
                    fontFamily: Lexend.regular,
                    fontSize: 14,
                    color: colors.textPrimary,
                    backgroundColor: colors.white,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 17,
                    overflow: 'visible',
                    ...Platform.select({
                        ios: {
                            shadowColor: colors.shadowSoft,
                            shadowOffset: {width: 0, height: 4},
                            shadowOpacity: 1,
                            shadowRadius: 4,
                        },
                        android: {
                            elevation: 3,
                        },
                        default: {},
                    }),
                },
                validationText: {
                    fontFamily: Lexend.regular,
                    fontSize: 13,
                    color: colors.error,
                },
                primaryCta: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    backgroundColor: colors.textTertiary,
                    borderRadius: 8,
                    paddingVertical: 16,
                },
                primaryCtaText: {
                    fontFamily: Lexend.semiBold,
                    fontSize: 14,
                    lineHeight: 22,
                    color: colors.white,
                },
            }),
        [colors],
    );
}
