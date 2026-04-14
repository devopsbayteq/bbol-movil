import React, {useCallback, useMemo, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import Svg, {Path} from 'react-native-svg';
import {
    useNavigation,
    useRoute,
    type RouteProp,
} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../../navigation/HomeStackNavigator';
import {useTheme, type ThemeColors} from '../../providers';
import {Lexend} from '../../theme/lexend';
import {formatIsoDateShortEsEc, formatPercentEsMx} from '../../utils/formatLocale';
import {formatCurrency} from '../transactions/TransactionItem';
import {
    DevelopmentNoticeModal,
    EyeIcon,
    EyeSlashIcon,
    HomeStackDetailHeader,
} from '../components';
import {useLoanDetailViewModel} from './useLoanDetailViewModel';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'LoanDetail'>;

type DevModalKind = 'payments' | 'amortization' | null;

const PAGE_INDICATOR_DOTS = 4;
const PAGE_INDICATOR_ACTIVE_INDEX = 3;

function HistoryClockIcon({color}: Readonly<{ color: string }>) {
    return (
        <Svg width={20} height={20} viewBox="0 0 24 24">
            <Path
                fill={color}
                d="M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21a9 9 0 000-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"
            />
        </Svg>
    );
}

export function LoanDetailScreen() {
    const {colors} = useTheme();
    const styles = useStyles(colors);
    const navigation = useNavigation<Nav>();
    const route = useRoute<RouteProp<HomeStackParamList, 'LoanDetail'>>();
    const {loanGuid, loanBalance} = route.params;

    const {detail, isLoading, errorMessage} = useLoanDetailViewModel(
        loanGuid,
        loanBalance,
    );

    const [amountMasked, setAmountMasked] = useState(true);
    const [devModal, setDevModal] = useState<DevModalKind>(null);

    const openPaymentsDev = useCallback(() => setDevModal('payments'), []);
    const openAmortizationDev = useCallback(() => setDevModal('amortization'), []);
    const closeDev = useCallback(() => setDevModal(null), []);

    const headerTitle = useMemo(() => 'PRÉSTAMOS', []);

    const goBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const showLoading = isLoading && !detail;
    const showError = !showLoading && (Boolean(errorMessage) || !detail);
    const resolvedDetail = !showLoading && !showError ? detail : null;

    const d = resolvedDetail;

    return (
        <SafeAreaView
            style={styles.safe}
            edges={['top']}
            testID="loan-detail-screen">


            {showLoading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="small" color={colors.primary}/>
                </View>
            ) : null}

            {showError ? (
                <View style={styles.centered}>
                    <Text style={styles.errorInline}>
                        {errorMessage || 'No se encontró la información de este préstamo.'}
                    </Text>
                    <TouchableOpacity
                        onPress={goBack}
                        accessibilityRole="button">
                        <Text style={styles.retryLink}>Volver</Text>
                    </TouchableOpacity>
                </View>
            ) : null}

            {d ? (
                <>
                    <ScrollView
                        style={styles.scroll}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}>
                        <LinearGradient
                            colors={[colors.homeHeaderIconButtonBg, colors.homeHeaderBackground]}
                            start={{x: 0.08, y: 1}}
                            end={{x: 0.95, y: 0}}
                            style={styles.heroGradient}>

                            <View style={styles.heroInner}>
                                <View style={styles.heroTopRow}>
                                    <View style={styles.heroTitleBlock}>
                                        <Text style={styles.heroProductMuted} numberOfLines={2}>
                                            {d.productLabel}
                                        </Text>
                                        <Text style={styles.heroLoanLine} numberOfLines={2}>
                                            Préstamo Nº {d.maskedAccountNumber}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.eyeBtn}
                                        onPress={() => setAmountMasked(m => !m)}
                                        accessibilityRole="button"
                                        accessibilityLabel={
                                            amountMasked ? 'Mostrar monto' : 'Ocultar monto'
                                        }>
                                        {amountMasked ? (
                                            <EyeSlashIcon color={colors.primary} size={16}/>
                                        ) : (
                                            <EyeIcon color={colors.primary} size={16}/>
                                        )}
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.heroCapitalBlock}>
                                    <Text style={styles.heroAmount} numberOfLines={1}>
                                        {amountMasked
                                            ? '$**.**'
                                            : formatCurrency(d.outstandingBalance)}
                                    </Text>
                                    <Text style={styles.heroNextPay}>
                                        Próximo pago:{' '}
                                        {formatIsoDateShortEsEc(d.nextInstallmentDate)}
                                    </Text>
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
                                <View style={styles.avanceRow}>
                                    <View style={styles.avanceColLeft}>
                                        <Text style={styles.bodyTextTertiary}>Avance</Text>
                                        <Text style={styles.monthsLine}>
                                            <Text style={styles.avanceIndex}>
                                                {d.installmentIndex}
                                            </Text>
                                            {` / ${d.installmentTotal} meses`}
                                        </Text>
                                    </View>
                                    <View style={styles.avanceColRight}>
                                        <Text style={styles.paidDueLine}>
                                            <Text style={styles.paidDueLabel}>Pagado </Text>
                                            <Text style={styles.paidDueAmount}>
                                                {formatCurrency(d.capitalPaid)}
                                            </Text>
                                        </Text>
                                        <Text style={styles.paidDueLine}>
                                            <Text style={styles.paidDueLabel}>Por pagar </Text>
                                            <Text style={styles.paidDueAmount}>
                                                {formatCurrency(d.outstandingBalance)}
                                            </Text>
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.summaryProgressTrack}>
                                    <View
                                        style={[
                                            styles.summaryProgressFill,
                                            {
                                                width: `${Math.min(
                                                    100,
                                                    Math.max(0, d.paidProgress * 100),
                                                )}%`,
                                            },
                                        ]}
                                    />
                                </View>

                                <View style={styles.cardHairline}/>

                                <View style={styles.debtSummaryRow}>
                                    <View style={styles.debtSummaryCol}>
                                        <Text style={styles.debtSummaryValue}>
                                            {formatCurrency(d.amountGranted)}
                                        </Text>
                                        <Text style={styles.debtSummaryCaption}>
                                            Deuda inicial
                                        </Text>
                                    </View>
                                    <View style={[styles.debtSummaryCol, styles.debtSummaryColEnd]}>
                                        <Text style={[styles.debtSummaryValue, styles.debtSummaryValueEnd]}>
                                            {formatCurrency(d.totalToReceiveAmount)}
                                        </Text>
                                        <Text style={[styles.debtSummaryCaption, styles.debtSummaryCaptionEnd]}>
                                            Deuda total
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.statRow}>
                                <View style={styles.statCard}>
                                    <Text style={styles.statValue}>
                                        {formatIsoDateShortEsEc(d.openingDateIso)}
                                    </Text>
                                    <Text style={styles.statLabel}>Fecha solicitada</Text>
                                </View>
                                <View style={styles.statCard}>
                                    <Text style={styles.statValueStrong}>
                                        {formatPercentEsMx(d.interestRatePercent, 2)}
                                    </Text>
                                    <Text style={styles.statLabel}>Tasa vigente</Text>
                                </View>
                                <View style={styles.statCard}>
                                    <Text style={styles.statValue}>
                                        {formatIsoDateShortEsEc(d.maturityDateIso)}
                                    </Text>
                                    <Text style={styles.statLabel}>Fecha vencimiento</Text>
                                </View>
                            </View>

                            <View style={styles.detailCard}>
                                <View style={styles.detailRowLast}>
                                    <Text style={styles.detailLabelLeft}>Cuenta a debitar</Text>
                                    <View style={styles.detailRightCol}>
                                        <Text style={styles.detailPurpose}>
                                            {d.creditPurposeLabel}
                                        </Text>
                                        <Text style={styles.detailAccountMuted}>
                                            {d.maskedCreditAccount}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.primaryBtn}
                                onPress={openPaymentsDev}
                                activeOpacity={0.9}
                                accessibilityRole="button"
                                accessibilityLabel="Historial de pagos">
                                <Text style={styles.primaryBtnText}>Historial de pagos</Text>
                                <HistoryClockIcon color={colors.white}/>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.secondaryBtn}
                                onPress={openAmortizationDev}
                                activeOpacity={0.9}
                                accessibilityRole="button"
                                accessibilityLabel="Tabla de amortización">
                                <Text style={styles.secondaryBtnText}>
                                    Tabla de amortización
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    <DevelopmentNoticeModal
                        visible={devModal === 'payments'}
                        onClose={closeDev}
                        title="En desarrollo"
                        message="El historial de pagos estará disponible próximamente."
                    />
                    <DevelopmentNoticeModal
                        visible={devModal === 'amortization'}
                        onClose={closeDev}
                        title="En desarrollo"
                        message="La tabla de amortización estará disponible próximamente."
                    />
                </>
            ) : null}


            <HomeStackDetailHeader title={headerTitle} onPressBack={goBack}/>
        </SafeAreaView>
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
                heroNextPay: {
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
                    backgroundColor: colors.white,
                    opacity: 0.35,
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
                monthsLine: {
                    fontFamily: Lexend.regular,
                    fontSize: 10,
                    lineHeight: 20,
                    color: colors.textPrimary,
                },
                avanceIndex: {
                    fontFamily: Lexend.semiBold,
                    fontSize: 10,
                    lineHeight: 20,
                    color: colors.primary,
                },
                paidDueLine: {
                    fontFamily: Lexend.regular,
                    fontSize: 10,
                    lineHeight: 20,
                    textAlign: 'right',
                },
                paidDueLabel: {
                    fontFamily: Lexend.regular,
                    fontSize: 10,
                    lineHeight: 20,
                    color: colors.textTertiary,
                },
                paidDueAmount: {
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
                cardHairline: {
                    height: StyleSheet.hairlineWidth,
                    backgroundColor: colors.borderLight,
                    alignSelf: 'stretch',
                },
                debtSummaryRow: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                },
                debtSummaryCol: {
                    alignItems: 'flex-start',
                    maxWidth: '48%',
                },
                debtSummaryColEnd: {
                    alignItems: 'flex-end',
                },
                debtSummaryValue: {
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.primary,
                },
                debtSummaryValueEnd: {
                    textAlign: 'right',
                },
                debtSummaryCaption: {
                    fontFamily: Lexend.regular,
                    fontSize: 9,
                    lineHeight: 20,
                    color: colors.textPrimary,
                },
                debtSummaryCaptionEnd: {
                    textAlign: 'right',
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
                statValueStrong: {
                    fontFamily: Lexend.semiBold,
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
                detailPurpose: {
                    fontFamily: Lexend.semiBold,
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
                primaryBtn: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    backgroundColor: colors.primary,
                    borderRadius: 8,
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    minHeight: 48,
                },
                primaryBtnText: {
                    fontFamily: Lexend.semiBold,
                    fontSize: 14,
                    lineHeight: 22,
                    color: colors.white,
                },
                secondaryBtn: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: colors.primary,
                    borderRadius: 8,
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    minHeight: 48,
                    backgroundColor: colors.white,
                    ...Platform.select({
                        ios: {
                            shadowColor: colors.shadowSoft,
                            shadowOffset: {width: 0, height: 4},
                            shadowOpacity: 0.15,
                            shadowRadius: 4,
                        },
                        android: {
                            elevation: 3,
                        },
                    }),
                },
                secondaryBtnText: {
                    fontFamily: Lexend.semiBold,
                    fontSize: 14,
                    lineHeight: 22,
                    color: colors.primary,
                },
            }),
        [colors],
    );
}
