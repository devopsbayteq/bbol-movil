import React, {useCallback, useMemo, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
    useNavigation,
    useRoute,
    type RouteProp,
} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {InvestmentDetail} from '../../domain/entities/InvestmentDetail';
import type {HomeStackParamList} from '../../navigation/HomeStackNavigator';
import {useTheme, type ThemeColors} from '../../providers/theme';
import {Lexend} from '../../theme/lexend';
import {
    formatIsoDateMediumEsEc,
    formatIsoDateShortEsEc,
    formatPercentEsMx,
} from '../../utils/formatLocale';
import {formatCurrency} from '../transactions/TransactionItem';
import {
    DevelopmentNoticeModal,
    EyeIcon,
    EyeSlashIcon,
    HomeStackDetailHeader,
} from '../components';
import {useInvestmentDetailViewModel} from './useInvestmentDetailViewModel';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'InvestmentDetail'>;

const PAGE_INDICATOR_DOTS = 4;
const PAGE_INDICATOR_ACTIVE_INDEX = 3;

function formatMoneyMasked(masked: boolean, amount: number): string {
    return masked ? '$**.**' : formatCurrency(amount);
}

function getMonthlyInterest(d: InvestmentDetail): number {
    if (d.installmentsTotal <= 0) {
        return 0;
    }
    return Math.round((d.interestAtMaturity / d.installmentsTotal) * 100) / 100;
}

function getAdvanceBarPercent(d: InvestmentDetail): number {
    if (d.installmentsTotal <= 0) {
        return 0;
    }
    return Math.min(100, (d.installmentsPaid / d.installmentsTotal) * 100);
}

export function InvestmentDetailScreen() {
    const {colors} = useTheme();
    const styles = useStyles(colors);
    const navigation = useNavigation<Nav>();
    const route = useRoute<RouteProp<HomeStackParamList, 'InvestmentDetail'>>();
    const {investmentGuid, investmentBalance} = route.params;

    const {detail, isLoading, errorMessage} = useInvestmentDetailViewModel(
        investmentGuid,
        investmentBalance,
    );

    const [amountMasked, setAmountMasked] = useState(true);
    const [devModalVisible, setDevModalVisible] = useState(false);
    const openDetailsDev = useCallback(() => setDevModalVisible(true), []);
    const closeDevModal = useCallback(() => setDevModalVisible(false), []);

    const headerTitle = useMemo(() => 'INVERSIONES', []);

    const goBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const showLoading = isLoading && !detail;
    const showError = !showLoading && (Boolean(errorMessage) || !detail);
    const resolvedDetail = !showLoading && !showError ? detail : null;

    return (
        <SafeAreaView
            style={styles.safe}
            edges={['top']}
            testID="investment-detail-screen"
        >

            {showLoading ? (
                <InvestmentDetailLoading colors={colors} styles={styles}/>
            ) : null}

            {showError ? (
                <InvestmentDetailError
                    errorMessage={errorMessage}
                    onBack={goBack}
                    styles={styles}
                />
            ) : null}

            {resolvedDetail ? (
                <InvestmentDetailLoadedContent
                    detail={resolvedDetail}
                    amountMasked={amountMasked}
                    onToggleAmountMasked={() => setAmountMasked(m => !m)}
                    colors={colors}
                    styles={styles}
                    onOpenDetailsDev={openDetailsDev}
                    devModalVisible={devModalVisible}
                    onCloseDevModal={closeDevModal}
                />
            ) : null}
            <HomeStackDetailHeader title={headerTitle} onPressBack={goBack}/>
        </SafeAreaView>
    );
}

function InvestmentDetailLoading({
                                     colors,
                                     styles,
                                 }: Readonly<{
    colors: ThemeColors;
    styles: Pick<ReturnType<typeof useStyles>, 'centered'>;
}>) {
    return (
        <View style={styles.centered}>
            <ActivityIndicator size="small" color={colors.primary}/>
        </View>
    );
}

function InvestmentDetailError({
                                   errorMessage,
                                   onBack,
                                   styles,
                               }: Readonly<{
    errorMessage: string;
    onBack: () => void;
    styles: Pick<
        ReturnType<typeof useStyles>,
        'centered' | 'errorInline' | 'retryLink'
    >;
}>) {
    return (
        <View style={styles.centered}>
            <Text style={styles.errorInline}>
                {errorMessage || 'No se encontró la información de esta inversión.'}
            </Text>
            <TouchableOpacity onPress={onBack} accessibilityRole="button">
                <Text style={styles.retryLink}>Volver</Text>
            </TouchableOpacity>
        </View>
    );
}

function InvestmentDetailLoadedContent({
                                           detail: d,
                                           amountMasked,
                                           onToggleAmountMasked,
                                           colors,
                                           styles,
                                           onOpenDetailsDev,
                                           devModalVisible,
                                           onCloseDevModal,
                                       }: Readonly<{
    detail: InvestmentDetail;
    amountMasked: boolean;
    onToggleAmountMasked: () => void;
    colors: ThemeColors;
    styles: ReturnType<typeof useStyles>;
    onOpenDetailsDev: () => void;
    devModalVisible: boolean;
    onCloseDevModal: () => void;
}>) {
    const advancePct = getAdvanceBarPercent(d);
    const monthlyInterest = getMonthlyInterest(d);

    return (
        <>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <LinearGradient
                    colors={[
                        colors.homeInvestmentCardGradientStart,
                        colors.homeInvestmentCardGradientEnd,
                    ]}
                    start={{x: 0.08, y: 1}}
                    end={{x: 0.95, y: 0}}
                    style={styles.heroGradient}
                >
                    <View style={styles.heroInner}>
                        <View style={styles.heroTopRow}>
                            <View style={styles.heroTitleBlock}>
                                <Text style={styles.heroProductMuted} numberOfLines={2}>
                                    {d.productName}
                                </Text>
                                <Text style={styles.heroLoanLine} numberOfLines={2}>
                                    Nº {d.maskedAccountNumber}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.eyeBtn}
                                onPress={onToggleAmountMasked}
                                accessibilityRole="button"
                                accessibilityLabel={
                                    amountMasked ? 'Mostrar montos' : 'Ocultar montos'
                                }
                            >
                                {amountMasked ? (
                                    <EyeSlashIcon color={colors.primary} size={16}/>
                                ) : (
                                    <EyeIcon color={colors.primary} size={16}/>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.heroCapitalBlock}>
                            <Text style={styles.heroAmount} numberOfLines={1}>
                                {formatMoneyMasked(amountMasked, d.initialAmount)}
                            </Text>
                            <Text style={styles.heroCapitalLabel}>Capital invertido</Text>
                        </View>

                        <View style={styles.pageDots} accessibilityElementsHidden>
                            {Array.from({length: PAGE_INDICATOR_DOTS}, (_, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.pageDot,
                                        i === PAGE_INDICATOR_ACTIVE_INDEX
                                            ? styles.pageDotActive
                                            : styles.pageDotInactive,
                                    ]}
                                />
                            ))}
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.lowerSection}>
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryTopRow}>
                            <Text style={styles.summaryLabelMuted}>Total a recibir</Text>
                            <Text style={styles.summaryValueStrong}>
                                {formatMoneyMasked(amountMasked, d.totalToReceive)}
                            </Text>
                        </View>

                        <View style={styles.cardHairline}/>

                        <View style={styles.avanceBlock}>
                            <View style={styles.avanceRow}>
                                <View style={styles.avanceColLeft}>
                                    <Text style={styles.bodyTextTertiary}>Avance</Text>
                                    <Text style={styles.bodyTextTertiary}>
                                        <Text style={styles.avancePaid}>
                                            {d.installmentsPaid}
                                        </Text>
                                        {` / ${d.installmentsTotal} meses`}
                                    </Text>
                                </View>
                                <View style={styles.avanceColRight}>
                                    <Text style={styles.dateLineSmall}>
                                        <Text style={styles.bodyTextTertiary}>Apertura </Text>
                                        <Text style={styles.dateLineStrong}>
                                            {formatIsoDateMediumEsEc(d.openingDateIso)}
                                        </Text>
                                    </Text>
                                    <Text style={styles.dateLineSmall}>
                                        <Text style={styles.bodyTextTertiary}>Vencimiento </Text>
                                        <Text style={styles.dateLineStrong}>
                                            {formatIsoDateMediumEsEc(d.maturityDateIso)}
                                        </Text>
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.summaryProgressTrack}>
                                <View
                                    style={[
                                        styles.summaryProgressFill,
                                        {
                                            width: `${advancePct}%`,
                                        },
                                    ]}
                                />
                            </View>
                        </View>

                        <View style={styles.cardHairline}/>

                        <View style={styles.yieldRow}>
                            <View style={styles.yieldCol}>
                                <Text style={styles.summaryValueStrong}>
                                    {formatMoneyMasked(amountMasked, d.interestAtMaturity)}
                                </Text>
                                <Text style={styles.summaryCaptionDark}>Rendimiento</Text>
                            </View>
                            <View style={[styles.yieldCol, styles.yieldColEnd]}>
                                <Text style={styles.summaryValueStrong}>
                                    {formatPercentEsMx(d.interestRatePercent, 1)}
                                </Text>
                                <Text style={styles.summaryCaptionDark}>Tasa anual</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.statRow}>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>
                                {formatMoneyMasked(amountMasked, d.totalToReceive)}
                            </Text>
                            <Text style={styles.statLabel}>Total a recibir</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>
                                {formatIsoDateShortEsEc(d.nextPaymentDateIso)}
                            </Text>
                            <Text style={styles.statLabel}>Próxima cuota</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>
                                {formatMoneyMasked(amountMasked, monthlyInterest)}
                            </Text>
                            <Text style={styles.statLabel}>Interés mensual</Text>
                        </View>
                    </View>

                    <View style={styles.detailCard}>
                        <View style={styles.detailRowBorder}>
                            <Text style={styles.detailLabelLeft}>Pago de intereses</Text>
                            <Text style={styles.detailValueRight}>
                                {d.paymentFrequencyLabel}
                            </Text>
                        </View>
                        <View style={styles.detailRowLast}>
                            <Text style={styles.detailLabelLeft}>Cuenta a acreditar</Text>
                            <View style={styles.detailRightCol}>
                                <Text style={styles.detailValueRight}>
                                    {d.debitPurposeLabel}
                                </Text>
                                <Text style={styles.detailAccountMuted}>
                                    {d.maskedDebitAccount}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Pressable
                        onPress={onOpenDetailsDev}
                        accessibilityRole="button"
                        accessibilityLabel="Cancelar antes del vencimiento"
                        style={styles.cancelLinkWrap}
                    >
                        <Text style={styles.cancelLinkText}>
                            Cancelar antes del vencimiento
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>

            <DevelopmentNoticeModal
                visible={devModalVisible}
                onClose={onCloseDevModal}
                title="En desarrollo"
                message="Esta sección estará disponible próximamente."
            />
        </>
    );
}

function useStyles(colors: ThemeColors) {
    return useMemo(
        () =>
            StyleSheet.create({
                safe: {
                    flex: 1,
                    backgroundColor: colors.background,
                },
                scroll: {
                    flex: 1,
                },
                scrollContent: {
                    paddingBottom: 32,
                },
                centered: {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 24,
                },
                errorInline: {
                    fontFamily: Lexend.regular,
                    fontSize: 14,
                    color: colors.textTertiary,
                    textAlign: 'center',
                    marginBottom: 12,
                },
                retryLink: {
                    fontFamily: Lexend.semiBold,
                    fontSize: 14,
                    color: colors.primary,
                },
                heroGradient: {
                    width: '100%',
                },
                heroInner: {
                    paddingHorizontal: 24,
                    paddingTop: 100,
                    paddingBottom: 24,
                    gap: 16,
                },
                heroTopRow: {
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 12,
                },
                heroTitleBlock: {
                    flex: 1,
                    gap: 4,
                },
                heroProductMuted: {
                    fontFamily: Lexend.regular,
                    fontSize: 14,
                    lineHeight: 20,
                    color: colors.homeAvatarCircle,
                    opacity: 0.85,
                },
                heroLoanLine: {
                    fontFamily: Lexend.regular,
                    fontSize: 14,
                    lineHeight: 20,
                    color: colors.white,
                },
                heroCapitalBlock: {
                    alignSelf: 'flex-start',
                    gap: 4,
                },
                heroAmount: {
                    fontFamily: Lexend.bold,
                    fontSize: 30,
                    lineHeight: 40,
                    color: colors.white,
                },
                heroCapitalLabel: {
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.homeAvatarCircle,
                    opacity: 0.85,
                },
                eyeBtn: {
                    backgroundColor: colors.homeBalanceToggleBg,
                    borderRadius: 4,
                    padding: 4,
                },
                pageDots: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    marginTop: 4,
                },
                pageDot: {
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                },
                pageDotActive: {
                    backgroundColor: colors.white,
                },
                pageDotInactive: {
                    backgroundColor: colors.homeInvestmentCardGradientStart,
                    opacity: 0.5,
                },
                lowerSection: {
                    paddingHorizontal: 24,
                    paddingTop: 16,
                    gap: 16,
                },
                summaryCard: {
                    backgroundColor: colors.white,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    gap: 10,
                    ...Platform.select({
                        ios: {
                            shadowColor: colors.shadowSoft,
                            shadowOffset: {width: 0, height: 1},
                            shadowOpacity: 0.1,
                            shadowRadius: 2,
                        },
                        android: {
                            elevation: 2,
                        },
                    }),
                },
                summaryTopRow: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                },
                summaryLabelMuted: {
                    fontFamily: Lexend.regular,
                    fontSize: 9,
                    lineHeight: 20,
                    color: colors.textPrimary,
                },
                summaryValueStrong: {
                    fontFamily: Lexend.semiBold,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.primary,
                },
                cardHairline: {
                    height: StyleSheet.hairlineWidth,
                    backgroundColor: colors.borderLight,
                    alignSelf: 'stretch',
                },
                avanceBlock: {
                    gap: 8,
                },
                avanceRow: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                },
                avanceColLeft: {
                    flex: 1,
                    gap: 4,
                },
                avanceColRight: {
                    alignItems: 'flex-end',
                    gap: 0,
                },
                bodyTextTertiary: {
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.textTertiary,
                },
                avancePaid: {
                    fontFamily: Lexend.semiBold,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.primary,
                },
                dateLineSmall: {
                    fontFamily: Lexend.regular,
                    fontSize: 10,
                    lineHeight: 20,
                    textAlign: 'right',
                },
                dateLineStrong: {
                    fontFamily: Lexend.semiBold,
                    fontSize: 10,
                    lineHeight: 20,
                    color: colors.textPrimary,
                },
                summaryProgressTrack: {
                    position: 'relative',
                    height: 6,
                    borderRadius: 4,
                    backgroundColor: colors.homeBorderSoft,
                    overflow: 'hidden',
                },
                summaryProgressFill: {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    borderRadius: 4,
                    backgroundColor: colors.primary,
                },
                yieldRow: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                },
                yieldCol: {
                    width: 58,
                    gap: 0,
                },
                yieldColEnd: {
                    alignItems: 'flex-end',
                    width: 72,
                },
                summaryCaptionDark: {
                    fontFamily: Lexend.regular,
                    fontSize: 9,
                    lineHeight: 20,
                    color: colors.textPrimary,
                },
                statRow: {
                    flexDirection: 'row',
                    gap: 12,
                    alignItems: 'stretch',
                },
                statCard: {
                    flex: 1,
                    minHeight: 54,
                    backgroundColor: colors.white,
                    borderRadius: 8,
                    paddingHorizontal: 7,
                    paddingTop: 8,
                    paddingBottom: 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...Platform.select({
                        ios: {
                            shadowColor: colors.shadowSoft,
                            shadowOffset: {width: 0, height: 1},
                            shadowOpacity: 0.12,
                            shadowRadius: 2,
                        },
                        android: {
                            elevation: 2,
                        },
                    }),
                },
                statValue: {
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.primary,
                    textAlign: 'center',
                },
                statLabel: {
                    fontFamily: Lexend.regular,
                    fontSize: 9,
                    lineHeight: 20,
                    color: colors.textPrimary,
                    textAlign: 'center',
                },
                detailCard: {
                    backgroundColor: colors.white,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    overflow: 'hidden',
                    ...Platform.select({
                        ios: {
                            shadowColor: colors.shadowSoft,
                            shadowOffset: {width: 0, height: 1},
                            shadowOpacity: 0.1,
                            shadowRadius: 2,
                        },
                        android: {
                            elevation: 2,
                        },
                    }),
                },
                detailRowBorder: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 4,
                    paddingTop: 12,
                    paddingBottom: 13,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.borderLight,
                    minHeight: 55,
                },
                detailRowLast: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 4,
                    paddingTop: 12,
                    paddingBottom: 13,
                    minHeight: 55,
                },
                detailLabelLeft: {
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.textSecondary,
                    flexShrink: 1,
                    paddingRight: 8,
                },
                detailRightCol: {
                    alignItems: 'flex-end',
                    maxWidth: '52%',
                },
                detailValueRight: {
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.primary,
                    textAlign: 'right',
                },
                detailAccountMuted: {
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.textTertiary,
                    textAlign: 'right',
                },
                cancelLinkWrap: {
                    alignSelf: 'center',
                    paddingVertical: 8,
                },
                cancelLinkText: {
                    fontFamily: Lexend.bold,
                    fontSize: 12,
                    lineHeight: 16,
                    color: colors.primary,
                    textDecorationLine: 'underline',
                    textAlign: 'center',
                },
            }),
        [colors],
    );
}
