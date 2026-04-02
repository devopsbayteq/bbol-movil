import React, {useMemo, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    FlatList,
    Pressable,
    ActivityIndicator,
    Keyboard,
    Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {useTheme, type ThemeColors} from '../../providers';
import {Lexend} from '../../theme/lexend';
import type {TransferStackParamList} from '../../navigation/TransferStackNavigator';
import type {MainTabParamList} from '../../navigation/MainTabNavigator';
import {TransferWatermark} from './components/TransferWatermark';
import {
    TransferIconArrowRight,
    TransferIconArrowUp,
    TransferIconClose,
    TransferIconUser,
    TransferIconWallet,
    TransferIconArrowRightWhite,
} from './transferIcons';
import {useTransferViewModel} from './useTransferViewModel';
import {BeneficiarySelectModal} from '../beneficiary/BeneficiarySelectModal';
import {accountTypeModalLabel} from '../../utils/accountDisplay';
import {formatMoneyEc} from '../../utils/formatMoneyEc';
import {ToolbarApp} from "./components/ToolbarApp.tsx";


const ZERO_DISPLAY = formatMoneyEc(0);

const HERO_BG = '#0B515C';
const ICON_CHIP_BG = '#D0F0F6';
const CONCEPT_INPUT_BG = '#EFF0F4';

export function TransferScreen() {
    const {colors} = useTheme();
    const insets = useSafeAreaInsets();
    const navigation =
        useNavigation<NativeStackNavigationProp<TransferStackParamList, 'TransferMain'>>();
    const styles = useStyles(colors);

    const transferViewModel = useTransferViewModel();

    const {selectBeneficiary} = transferViewModel;

    const [beneficiarySelectorVisible, setBeneficiarySelectorVisible] = useState(false);

    const holderName = transferViewModel.user?.name?.trim() || 'Titular';

    const beneficiaryTitle = transferViewModel.beneficiary
        ? transferViewModel.beneficiary.name
        : 'Selecciona el beneficiario';

    const onBack = () => {
        const tabNav =
            navigation.getParent<BottomTabNavigationProp<MainTabParamList>>();
        tabNav?.navigate('Home');
    };

    return (
        <View style={styles.root} testID="transfer-main-screen">
            <ToolbarApp
                title={"TRANSFERIR"}
                onBackPress={() => {
                    onBack()
                }}/>

            {transferViewModel.error ? (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorText}>{transferViewModel.error}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            transferViewModel.retry();
                        }}>
                        <Text style={styles.retryText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            ) : null}

            {transferViewModel.isLoading ? (
                <View style={styles.loadingWrap}>
                    <ActivityIndicator size="large" color={colors.primary}/>
                </View>
            ) : (
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={[
                        styles.scrollContent,
                        {paddingBottom: Math.max(insets.bottom, 24) + 16},
                    ]}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.hero}>
                        <TransferWatermark/>
                        <Text style={styles.heroHint}>Ingresa el monto a transferir</Text>

                        <View style={styles.amountWrap}>
                            <TextInput
                                style={styles.amountInput}
                                value={transferViewModel.displayAmount}
                                onChangeText={transferViewModel.onAmountChange}
                                keyboardType="number-pad"
                                returnKeyType="done"
                                onSubmitEditing={() => Keyboard.dismiss()}
                                placeholderTextColor="rgba(255,255,255,0.45)"
                                placeholder={ZERO_DISPLAY}
                                selectionColor={colors.white}
                                underlineColorAndroid="transparent"
                                testID="transfer-amount-input"
                            />
                            {transferViewModel.amountFieldError ? (
                                <Text style={styles.amountFieldError}>{transferViewModel.amountFieldError}</Text>
                            ) : null}
                        </View>

                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => setBeneficiarySelectorVisible(true)}
                            activeOpacity={0.9}>
                            <View style={styles.iconChip}>
                                <TransferIconUser color={HERO_BG} size={16}/>
                            </View>
                            <View style={styles.cardBody}>
                                <Text style={styles.cardLabel}>Para</Text>
                                <Text style={styles.cardTitle} numberOfLines={2}>
                                    {beneficiaryTitle}
                                </Text>
                            </View>
                            <TransferIconArrowRight color={colors.iconPrimary} size={16}/>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.card}
                            onPress={
                                transferViewModel.accounts.length > 1 ? transferViewModel.openAccountPicker : undefined
                            }
                            activeOpacity={transferViewModel.accounts.length > 1 ? 0.9 : 1}
                            disabled={transferViewModel.accounts.length <= 1}>
                            <View style={styles.iconChip}>
                                <TransferIconWallet color={HERO_BG} size={16}/>
                            </View>
                            <View style={styles.cardBody}>
                                <Text style={styles.cardLabel}>Desde</Text>
                                <Text style={styles.cardTitle} numberOfLines={1}>
                                    {holderName}
                                </Text>
                                {transferViewModel.selectedAccount ? (
                                    <Text style={styles.cardSub} numberOfLines={1}>
                                        {transferViewModel.fromAccountDescription}
                                    </Text>
                                ) : (
                                    <Text style={styles.cardSub}>Sin cuenta disponible</Text>
                                )}
                            </View>
                            {transferViewModel.accounts.length > 1 ? (
                                <TransferIconArrowUp color={colors.iconPrimary} size={16}/>
                            ) : (
                                <View style={styles.cardChevronSpacer}/>
                            )}
                        </TouchableOpacity>

                    </View>

                    <View style={styles.bottomSection}>
                        <View style={styles.conceptBlock}>
                            <Text style={styles.conceptLabel}>
                                <Text style={styles.conceptLabelStrong}>Concepto </Text>
                                <Text style={styles.conceptLabelMuted}>(Opcional)</Text>
                            </Text>
                            <TextInput
                                style={styles.conceptInput}
                                value={transferViewModel.concept}
                                onChangeText={transferViewModel.setConcept}
                                placeholder="Ej. Pago zapatos"
                                placeholderTextColor={colors.placeholder}
                                maxLength={120}
                                testID="transfer-concept-input"
                            />
                            {transferViewModel.validationMessage ? (
                                <Text style={styles.validationText}>{transferViewModel.validationMessage}</Text>
                            ) : null}
                        </View>

                        {transferViewModel.validationMessage ? (
                            <Text style={styles.validationText}>{transferViewModel.validationMessage}</Text>
                        ) : null}

                        <TouchableOpacity
                            style={styles.primaryCta}
                            onPress={() => {
                                const result = transferViewModel.prepareTransferReview();

                                if (!result.ok) {
                                    transferViewModel.setValidationMessage(result.message);
                                    return;
                                }
                                transferViewModel.setValidationMessage(null);
                                navigation.navigate('TransferReview', result.params);
                            }}
                            activeOpacity={0.9}
                            testID="transfer-continue-button">
                            <TransferIconArrowRightWhite
                                color={colors.white}
                                size={20}
                            />
                            <Text style={styles.primaryCtaText}>Continuar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}

            <Modal
                visible={transferViewModel.accountModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => transferViewModel.setAccountModalVisible(false)}>
                <View style={styles.modalRoot}>
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={() => transferViewModel.setAccountModalVisible(false)}
                        accessibilityLabel="Cerrar"
                    />
                    <View
                        style={[
                            styles.modalSheet,
                            {paddingBottom: Math.max(insets.bottom, 12)},
                        ]}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalHeaderSide}/>
                            <Text style={styles.modalHeaderTitle}>CUENTAS</Text>
                            <TouchableOpacity
                                style={styles.modalCloseBtn}
                                onPress={() => transferViewModel.setAccountModalVisible(false)}
                                accessibilityRole="button"
                                accessibilityLabel="Cerrar selección de cuentas">
                                <TransferIconClose color={colors.iconPrimary} size={20}/>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={transferViewModel.accounts}
                            keyExtractor={item => item.accountGuid}
                            scrollEnabled={transferViewModel.accounts.length > 4}
                            contentContainerStyle={styles.modalListContent}
                            renderItem={({item, index}) => {
                                const isSelected = index === transferViewModel.accountIndex;
                                const isDisabled = item.balance <= 0;
                                return (
                                    <TouchableOpacity
                                        style={[
                                            styles.accountPickCard,
                                            isSelected &&
                                            !isDisabled &&
                                            styles.accountPickCardSelected,
                                            isDisabled && styles.accountPickCardDisabled,
                                        ]}
                                        onPress={() => transferViewModel.selectAccount(index)}
                                        activeOpacity={isDisabled ? 1 : 0.88}
                                        disabled={isDisabled}
                                        accessibilityState={{
                                            selected: isSelected && !isDisabled,
                                            disabled: isDisabled,
                                        }}>
                                        <View
                                            style={[
                                                styles.accountPickRow,
                                                isDisabled && styles.accountPickRowDisabled,
                                            ]}>
                                            <View style={styles.accountPickLeft}>
                                                <Text style={styles.accountPickType}>
                                                    {accountTypeModalLabel(item)}
                                                </Text>
                                                <Text style={styles.accountPickNumber}>
                                                    {item.maskedAccountNumber}
                                                </Text>
                                            </View>
                                            <View style={styles.accountPickRight}>
                                                <Text style={styles.accountPickBalance}>
                                                    {formatMoneyEc(item.balance)}
                                                </Text>
                                                <Text style={styles.accountPickSaldoLabel}>
                                                    Saldo disponible
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                </View>
            </Modal>

            <BeneficiarySelectModal
                visible={beneficiarySelectorVisible}
                onRequestClose={() => setBeneficiarySelectorVisible(false)}
                onSelect={b => {
                    selectBeneficiary(b);
                    setBeneficiarySelectorVisible(false);
                }}
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
                header: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: 64,
                    paddingHorizontal: 16,
                    backgroundColor: colors.white,
                },
                backBtn: {
                    width: 44,
                    height: 44,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                },
                headerTitle: {
                    flex: 1,
                    textAlign: 'center',
                    fontFamily: Lexend.semiBold,
                    fontSize: 14,
                    lineHeight: 22,
                    color: colors.textPrimary,
                },
                headerRightSpacer: {
                    width: 44,
                },
                errorBanner: {
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    gap: 8,
                    backgroundColor: colors.errorBg,
                },
                errorText: {
                    color: colors.error,
                    fontSize: 13,
                },
                retryText: {
                    color: colors.primary,
                    fontSize: 14,
                    fontFamily: Lexend.semiBold,
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
                    backgroundColor: HERO_BG,
                    paddingHorizontal: 24,
                    paddingTop: 24,
                    paddingBottom: 32,
                    minHeight: 320,
                },
                heroHint: {
                    fontFamily: Lexend.regular,
                    fontSize: 16,
                    lineHeight: 24,
                    color: colors.white,
                    textAlign: 'center',
                    marginBottom: 8,
                },
                amountWrap: {
                    alignSelf: 'center',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.white,
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
                    color: '#FFB8B8',
                    textAlign: 'center',
                    alignSelf: 'center',
                    maxWidth: 280,
                },
                amountInput: {
                    fontFamily: Lexend.bold,
                    fontSize: 50,
                    lineHeight: 60,
                    color: colors.white,
                    textAlign: 'center',
                    paddingVertical: 0,
                    minHeight: 70,
                    ...(Platform.OS === 'android' ? {textAlignVertical: 'center'} : null),
                },
                card: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 16,
                    backgroundColor: colors.white,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 16,
                    marginBottom: 16,
                },
                iconChip: {
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: ICON_CHIP_BG,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                cardBody: {
                    flex: 1,
                    minWidth: 0,
                },
                cardLabel: {
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.textTertiary,
                },
                cardTitle: {
                    fontFamily: Lexend.semiBold,
                    fontSize: 14,
                    lineHeight: 22,
                    color: colors.textPrimary,
                },
                cardSub: {
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 20,
                    color: '#3E494B',
                    marginTop: 2,
                },
                cardChevronSpacer: {
                    width: 16,
                    height: 16,
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
                    color: '#3E494B',
                },
                conceptLabelMuted: {
                    fontFamily: Lexend.regular,
                    color: colors.textTertiary,
                },
                conceptInput: {
                    fontFamily: Lexend.regular,
                    fontSize: 14,
                    color: colors.textPrimary,
                    backgroundColor: CONCEPT_INPUT_BG,
                    borderWidth: 1,
                    borderColor: colors.white,
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 17,
                    overflow: 'visible',
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 4},
                            shadowOpacity: 0.08,
                            shadowRadius: 4,
                        },
                        android: {
                            elevation: 3,
                        },
                        default: {},
                    }),
                },
                conceptInputError: {
                    borderColor: colors.error,
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
                    backgroundColor: colors.primary,
                    borderRadius: 8,
                    paddingVertical: 16,
                },
                primaryCtaText: {
                    fontFamily: Lexend.semiBold,
                    fontSize: 14,
                    lineHeight: 22,
                    color: colors.white,
                },
                modalRoot: {
                    flex: 1,
                    justifyContent: 'flex-end',
                    backgroundColor: 'rgba(0,0,0,0.45)',
                },
                modalSheet: {
                    backgroundColor: colors.background,
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    maxHeight: '78%',
                    width: '100%',
                    zIndex: 1,
                    ...Platform.select({
                        android: {elevation: 24},
                        default: {},
                    }),
                },
                modalHeader: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    minHeight: 64,
                    backgroundColor: colors.surface,
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    paddingHorizontal: 8,
                },
                modalHeaderSide: {
                    width: 44,
                    height: 44,
                },
                modalHeaderTitle: {
                    flex: 1,
                    fontFamily: Lexend.semiBold,
                    fontSize: 14,
                    lineHeight: 22,
                    color: colors.iconPrimary,
                    textAlign: 'center',
                },
                modalCloseBtn: {
                    width: 44,
                    height: 44,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                modalListContent: {
                    paddingHorizontal: 24,
                    paddingTop: 24,
                    paddingBottom: 12,
                    gap: 12,
                },
                accountPickCard: {
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                },
                accountPickCardSelected: {
                    backgroundColor: ICON_CHIP_BG,
                    borderWidth: 1,
                    borderColor: colors.primary,
                },
                accountPickCardDisabled: {
                    backgroundColor: colors.buttonSecondaryBg,
                },
                accountPickRow: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                },
                accountPickRowDisabled: {
                    opacity: 0.4,
                },
                accountPickLeft: {
                    flex: 1,
                    minWidth: 0,
                    marginRight: 12,
                },
                accountPickType: {
                    fontFamily: Lexend.semiBold,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.textPrimary,
                },
                accountPickNumber: {
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.textTertiary,
                },
                accountPickRight: {
                    alignItems: 'flex-end',
                },
                accountPickBalance: {
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.textPrimary,
                    textAlign: 'right',
                },
                accountPickSaldoLabel: {
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.textTertiary,
                    textAlign: 'right',
                },
            }),
        [colors],
    );
}
