import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
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
import {useTheme, type ThemeColors} from '../../providers/theme';
import {Lexend} from '../../theme/lexend';
import {formatCurrency} from '../transactions/TransactionItem';
import {DevelopmentNoticeModal} from '../components';
import {useLoanDetailViewModel} from './useLoanDetailViewModel';

const arrowBack = require('../../../assets/images/arrow-left.png');

type Nav = NativeStackNavigationProp<HomeStackParamList, 'LoanDetail'>;

type DevModalKind = 'payments' | 'amortization' | null;

function formatLoanDateShort(iso: string): string {
  const d = new Date(iso.includes('T') ? iso : `${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) {
    return '—';
  }
  return d.toLocaleDateString('es-EC', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatPercent(value: number): string {
  return `${value.toLocaleString('es-MX', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  })}%`;
}

function EyeIcon({
  color,
  size = 16,
}: Readonly<{color: string; size?: number}>) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
      />
    </Svg>
  );
}

function EyeSlashIcon({
  color,
  size = 16,
}: Readonly<{color: string; size?: number}>) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-2.76-2.24-5-5-5l-.17.01z"
      />
    </Svg>
  );
}

function HistoryClockIcon({color}: Readonly<{color: string}>) {
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

  if (isLoading && !detail) {
    return (
      <SafeAreaView
        style={styles.safe}
        edges={['top']}
        testID="loan-detail-screen">
        <View style={styles.headerBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Volver">
            <Image
              source={arrowBack}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {headerTitle}
          </Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (errorMessage || !detail) {
    return (
      <SafeAreaView
        style={styles.safe}
        edges={['top']}
        testID="loan-detail-screen">
        <View style={styles.headerBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Volver">
            <Image
              source={arrowBack}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {headerTitle}
          </Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.centered}>
          <Text style={styles.errorInline}>
            {errorMessage || 'No se encontró la información de este préstamo.'}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            accessibilityRole="button">
            <Text style={styles.retryLink}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const d = detail;
  const paidPct = Math.min(100, Math.max(0, d.primaryProgressRatio * 100));
  const secondaryPct = Math.min(
    paidPct,
    Math.max(0, d.secondaryProgressRatio * 100),
  );

  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top']}
      testID="loan-detail-screen">
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Volver">
          <Image
            source={arrowBack}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {headerTitle}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

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
            <View style={styles.heroTitleBlock}>
              <Text style={styles.heroProductMuted} numberOfLines={2}>
                {d.productLabel}
              </Text>
              <Text style={styles.heroLoanLine} numberOfLines={2}>
                Préstamo Nº {d.maskedAccountNumber}
              </Text>
            </View>

            <View style={styles.heroBalanceRow}>
              <View style={styles.heroBalanceSide} />
              <View style={styles.heroAmountCol}>
                <Text style={styles.heroAmount} numberOfLines={1}>
                  {amountMasked
                    ? '$**.**'
                    : formatCurrency(d.outstandingBalance)}
                </Text>
                <Text style={styles.heroNextPay}>
                  Próximo pago: {formatLoanDateShort(d.nextInstallmentDate)}
                </Text>
              </View>
              <View style={styles.heroBalanceSideEnd}>
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setAmountMasked(m => !m)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    amountMasked ? 'Mostrar monto' : 'Ocultar monto'
                  }>
                  {amountMasked ? (
                    <EyeSlashIcon color={colors.primary} size={16} />
                  ) : (
                    <EyeIcon color={colors.primary} size={16} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  styles.progressFillWide,
                  {width: `${paidPct}%`, backgroundColor: colors.homeAvatarCircle},
                ]}
              />
              <View
                style={[
                  styles.progressFill,
                  styles.progressFillTop,
                  {
                    width: `${secondaryPct}%`,
                    backgroundColor: colors.homePrimaryHover,
                  },
                ]}
              />
            </View>

            <View style={styles.breakdownRow}>
              <View style={styles.breakdownCol}>
                <Text style={styles.breakdownAmount}>
                  {formatCurrency(d.capitalPaid)}
                </Text>
                <Text style={styles.breakdownLabel}>Pagado</Text>
              </View>
              <View style={styles.breakdownColCenter}>
                <Text style={styles.breakdownCuotasMain}>
                  {d.installmentIndex}/{d.installmentTotal}
                </Text>
                <Text style={styles.breakdownCuotasSub}>cuotas</Text>
              </View>
              <View style={[styles.breakdownCol, styles.breakdownColEnd]}>
                <Text style={styles.breakdownAmount}>
                  {formatCurrency(d.outstandingBalance)}
                </Text>
                <Text style={styles.breakdownLabel}>Por pagar</Text>
              </View>
            </View>

            <View style={styles.heroDivider} />

            <View style={styles.debtRow}>
              <View>
                <Text style={styles.breakdownAmount}>
                  {formatCurrency(d.amountGranted)}
                </Text>
                <Text style={styles.breakdownLabel}>Deuda inicial</Text>
              </View>
              <View style={styles.breakdownColEnd}>
                <Text style={styles.breakdownAmount}>
                  {formatCurrency(d.totalToReceiveAmount)}
                </Text>
                <Text style={styles.breakdownLabel}>Deuda total</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.lowerSection}>
          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {formatLoanDateShort(d.openingDateIso)}
              </Text>
              <Text style={styles.statLabel}>Fecha solicitada</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValueStrong}>
                {formatPercent(d.interestRatePercent)}
              </Text>
              <Text style={styles.statLabel}>Tasa vigente</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {formatLoanDateShort(d.maturityDateIso)}
              </Text>
              <Text style={styles.statLabel}>Fecha vencimiento</Text>
            </View>
          </View>

          <View style={styles.debitCard}>
            <Text style={styles.debitPurpose}>{d.creditPurposeLabel}</Text>
            <Text style={styles.debitAccount}>{d.maskedCreditAccount}</Text>
            <Text style={styles.debitCaption}>Cuenta a debitar</Text>
          </View>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={openPaymentsDev}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="Historial de pagos">
            <Text style={styles.primaryBtnText}>Historial de pagos</Text>
            <HistoryClockIcon color={colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={openAmortizationDev}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="Tabla de amortización">
            <Text style={styles.secondaryBtnText}>Tabla de amortización</Text>
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
        headerBar: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          paddingVertical: 12,
          backgroundColor: colors.white,
        },
        backIcon: {
          width: 20,
          height: 22,
        },
        headerTitle: {
          flex: 1,
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.textPrimary,
          textAlign: 'center',
          textTransform: 'uppercase',
        },
        headerSpacer: {
          width: 22,
          height: 12,
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
          paddingTop: 24,
          paddingBottom: 28,
          gap: 18,
        },
        heroTitleBlock: {
          gap: 4,
          alignSelf: 'stretch',
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
        heroBalanceRow: {
          flexDirection: 'row',
          alignItems: 'flex-end',
        },
        heroBalanceSide: {
          flex: 1,
        },
        heroAmountCol: {
          alignItems: 'center',
          gap: 4,
        },
        heroBalanceSideEnd: {
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
        },
        heroAmount: {
          fontFamily: Lexend.bold,
          fontSize: 30,
          lineHeight: 40,
          color: colors.white,
          textAlign: 'center',
        },
        heroNextPay: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.homeAvatarCircle,
          opacity: 0.85,
          textAlign: 'center',
        },
        eyeBtn: {
          backgroundColor: colors.homeBalanceToggleBg,
          borderRadius: 4,
          padding: 4,
        },
        periodInterestBlock: {
          alignItems: 'center',
          alignSelf: 'stretch',
        },
        periodInterestCaption: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.buttonSecondaryBg,
          textAlign: 'center',
        },
        periodInterestAmount: {
          fontFamily: Lexend.bold,
          fontSize: 22,
          lineHeight: 32,
          color: colors.homeAvatarCircle,
          textAlign: 'center',
        },
        progressWrap: {
          marginTop: 4,
          position: 'relative',
          height: 12,
          justifyContent: 'center',
        },
        progressTrack: {
          height: 12,
          borderRadius: 6,
          backgroundColor: colors.homeBorderSoft,
          overflow: 'hidden',
          position: 'relative',
        },
        progressFill: {
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          borderRadius: 6,
        },
        progressFillWide: {
          zIndex: 1,
        },
        progressFillTop: {
          zIndex: 2,
        },
        progressThumb: {
          position: 'absolute',
          width: 16,
          height: 16,
          borderRadius: 8,
          borderWidth: 2,
          top: -2,
          zIndex: 3,
        },
        breakdownRow: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        },
        breakdownCol: {
          flex: 1,
        },
        breakdownColEnd: {
          alignItems: 'flex-end',
        },
        breakdownColCenter: {
          flex: 1,
          alignItems: 'center',
          paddingHorizontal: 4,
        },
        breakdownAmount: {
          fontFamily: Lexend.semiBold,
          fontSize: 12,
          lineHeight: 20,
          color: colors.homeAvatarCircle,
        },
        breakdownLabel: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.buttonSecondaryBg,
        },
        breakdownCuotasMain: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 13,
          color: colors.homeAvatarCircle,
          opacity: 0.85,
          textAlign: 'center',
        },
        breakdownCuotasSub: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 13,
          color: colors.homeAvatarCircle,
          opacity: 0.85,
          textAlign: 'center',
        },
        heroDivider: {
          height: 1,
          backgroundColor: colors.balanceDivider,
          alignSelf: 'stretch',
        },
        debtRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        },
        interestPeriodCol: {
          alignItems: 'flex-end',
        },
        lowerSection: {
          paddingHorizontal: 24,
          paddingTop: 16,
          gap: 16,
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
          fontSize: 8,
          lineHeight: 20,
          color: colors.textPrimary,
          textAlign: 'center',
        },
        debitCard: {
          backgroundColor: colors.white,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 12,
          alignItems: 'center',
          gap: 4,
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
        debitPurpose: {
          fontFamily: Lexend.semiBold,
          fontSize: 12,
          lineHeight: 20,
          color: colors.primary,
        },
        debitAccount: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textTertiary,
        },
        debitCaption: {
          fontFamily: Lexend.regular,
          fontSize: 8,
          lineHeight: 20,
          color: colors.textPrimary,
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
