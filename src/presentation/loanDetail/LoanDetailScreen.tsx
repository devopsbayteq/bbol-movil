import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
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

function formatNextPaymentLine(iso: string): string {
  const d = new Date(iso.includes('T') ? iso : `${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) {
    return 'Próximo pago —';
  }
  const formatted = d.toLocaleDateString('es-EC', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return `Próximo pago ${formatted}`;
}

function formatPercent(value: number): string {
  return `${value.toLocaleString('es-MX', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;
}

function HistoryPaymentsIcon({color}: {color: string}) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
      />
    </Svg>
  );
}

export function LoanDetailScreen() {
  const {colors} = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProp<HomeStackParamList, 'LoanDetail'>>();
  const {loanGuid} = route.params;

  const {detail, isLoading, errorMessage} = useLoanDetailViewModel(loanGuid);

  const [devModalVisible, setDevModalVisible] = useState(false);
  const openHistoryDev = useCallback(() => setDevModalVisible(true), []);

  const headerTitle = useMemo(() => 'PRÉSTAMOS', []);

  if (isLoading && !detail) {
    return (
      <SafeAreaView
        style={styles.safe}
        edges={['top']}
        testID="loan-detail-screen">
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
  const barPct = Math.round(d.paidProgress * 1000) / 10;

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
        <View style={styles.summaryCard}>
          <Text style={styles.summaryProductLine}>
            <Text style={styles.summaryProductName}>{d.productLabel}: </Text>
            <Text style={styles.summaryMuted}>Nº {d.maskedAccountNumber}</Text>
          </Text>
          <View style={styles.hairline} />

          <View style={styles.paymentBlock}>
            <Text style={styles.nextPaymentHint}>
              {formatNextPaymentLine(d.nextInstallmentDate)}
            </Text>
            <Text style={styles.heroAmount}>
              {formatCurrency(d.nextInstallmentAmount)}
            </Text>
          </View>
          <View style={styles.installmentPill}>
            <Text style={styles.installmentPillText}>
              Cuota: {d.installmentIndex}/{d.installmentTotal}
            </Text>
          </View>

          <View style={styles.capitalRow}>
            <View>
              <Text style={styles.capitalLabel}>Capital pagado:</Text>
              <Text style={styles.capitalValueAccent}>
                {formatCurrency(d.capitalPaid)}
              </Text>
            </View>
            <View style={styles.alignEnd}>
              <Text style={styles.capitalLabel}>Por pagar:</Text>
              <Text style={styles.capitalValueDark}>
                {formatCurrency(d.outstandingBalance)}
              </Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, {width: `${barPct}%`}]}
              accessibilityRole="progressbar"
              accessibilityValue={{now: barPct, min: 0, max: 100}}
            />
          </View>

          <View style={styles.hairline} />

          <View style={styles.footerMeta}>
            <Text style={styles.interestTiny}>
              <Text style={styles.interestTinyMuted}>
                interés ganado al vencimiento:{' '}
              </Text>
              <Text style={styles.interestTinyMuted}>
                {formatCurrency(d.interestAtMaturity)}
              </Text>
            </Text>
          </View>
          <View style={styles.hairline} />
          <View style={styles.metaRow}>
            <Text style={styles.metaTiny}>
              <Text style={styles.metaTinyMuted}>Tasa de interes: </Text>
              <Text style={styles.metaTinyValue}>
                {formatPercent(d.interestRatePercent)}
              </Text>
            </Text>
            <Text style={styles.metaTiny}>
              <Text style={styles.metaTinyMuted}>Plazo: </Text>
              <Text style={styles.metaTinyValue}>{d.termDays} días</Text>
            </Text>
          </View>
        </View>

        <View style={styles.dateRow}>
          <View style={styles.dateCard}>
            <Text style={styles.dateLabel}>Monto otorgado</Text>
            <Text style={styles.dateValue}>
              {formatCurrency(d.amountGranted)}
            </Text>
          </View>
          <View style={styles.dateCard}>
            <Text style={styles.dateLabel}>Fecha de vencimiento</Text>
            <Text style={styles.dateValue}>
              {formatLoanDateShort(d.maturityDateIso)}
            </Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Agencia</Text>
            <Text style={styles.detailValue}>{d.agencyName}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRowTall}>
            <Text style={styles.detailLabel}>Oficial de crédito</Text>
            <Text style={[styles.detailValue, styles.detailValueShrink]}>
              {d.creditOfficerName}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={openHistoryDev}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="Historial de pagos">
          <Text style={styles.primaryBtnText}>Historial de pagos</Text>
          <HistoryPaymentsIcon color={colors.white} />
        </TouchableOpacity>
      </ScrollView>

      <DevelopmentNoticeModal
        visible={devModalVisible}
        onClose={() => setDevModalVisible(false)}
        title="En desarrollo"
        message="El historial de pagos estará disponible próximamente."
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
          paddingHorizontal: 24,
          paddingBottom: 32,
          gap: 16,
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
          width: 20,
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
        summaryCard: {
          backgroundColor: colors.white,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.homeAvatarCircle,
          paddingHorizontal: 12,
          paddingVertical: 8,
          gap: 10,
        },
        summaryProductLine: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
        },
        summaryProductName: {
          color: colors.textPrimary,
        },
        summaryMuted: {
          color: colors.textTertiary,
        },
        hairline: {
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.borderLight,
        },
        paymentBlock: {
          alignItems: 'center',
          gap: 4,
        },
        nextPaymentHint: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.textTertiary,
          textAlign: 'center',
        },
        heroAmount: {
          fontFamily: Lexend.regular,
          fontSize: 20,
          lineHeight: 30,
          color: colors.textPrimary,
          textAlign: 'center',
        },
        installmentPill: {
          alignSelf: 'center',
          backgroundColor: colors.homeLoanCardBorder,
          borderRadius: 12,
          paddingHorizontal: 4,
          paddingVertical: 2,
          minWidth: 108,
          alignItems: 'center',
        },
        installmentPillText: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textSecondary,
        },
        capitalRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
        },
        capitalLabel: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textTertiary,
        },
        capitalValueAccent: {
          fontFamily: Lexend.semiBold,
          fontSize: 12,
          lineHeight: 20,
          color: colors.primary,
        },
        capitalValueDark: {
          fontFamily: Lexend.semiBold,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textPrimary,
        },
        alignEnd: {
          alignItems: 'flex-end',
        },
        progressTrack: {
          height: 6,
          borderRadius: 4,
          backgroundColor: colors.border,
          overflow: 'hidden',
        },
        progressFill: {
          height: 6,
          borderRadius: 4,
          backgroundColor: colors.primary,
        },
        footerMeta: {
          width: '100%',
        },
        interestTiny: {
          fontFamily: Lexend.regular,
          fontSize: 10,
          lineHeight: 20,
        },
        interestTinyMuted: {
          color: colors.textTertiary,
        },
        metaRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        metaTiny: {
          fontFamily: Lexend.regular,
          fontSize: 10,
          lineHeight: 20,
        },
        metaTinyMuted: {
          color: colors.textTertiary,
        },
        metaTinyValue: {
          color: colors.textTertiary,
        },
        dateRow: {
          flexDirection: 'row',
          gap: 16,
        },
        dateCard: {
          flex: 1,
          backgroundColor: colors.white,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 4,
          alignItems: 'center',
        },
        dateLabel: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textSecondary,
        },
        dateValue: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.primary,
          textAlign: 'center',
        },
        detailsCard: {
          backgroundColor: colors.white,
          borderRadius: 12,
          paddingHorizontal: 12,
          overflow: 'hidden',
        },
        detailRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 40,
          paddingHorizontal: 4,
          paddingVertical: 8,
          gap: 8,
        },
        detailRowTall: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 55,
          paddingHorizontal: 4,
          paddingVertical: 8,
          gap: 8,
        },
        detailLabel: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textSecondary,
          flexShrink: 0,
        },
        detailValue: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.primary,
          textAlign: 'right',
          maxWidth: '65%',
        },
        detailValueShrink: {
          flex: 1,
        },
        detailDivider: {
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.borderLight,
          marginHorizontal: 4,
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
      }),
    [colors],
  );
}
