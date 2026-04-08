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
import {useInvestmentDetailViewModel} from './useInvestmentDetailViewModel';

const arrowBack = require('../../../assets/images/arrow-left.png');

type Nav = NativeStackNavigationProp<HomeStackParamList, 'InvestmentDetail'>;

function formatInvestmentDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
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
    maximumFractionDigits: 1,
  })}%`;
}

function RenewClockIcon({color}: {color: string}) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
      />
    </Svg>
  );
}

export function InvestmentDetailScreen() {
  const {colors} = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProp<HomeStackParamList, 'InvestmentDetail'>>();
  const {investmentGuid} = route.params;

  const {detail, isLoading, errorMessage} =
    useInvestmentDetailViewModel(investmentGuid);

  const [devModalVisible, setDevModalVisible] = useState(false);
  const openRenewDev = useCallback(() => setDevModalVisible(true), []);

  const headerTitle = useMemo(() => 'INVERSIONES', []);

  if (isLoading && !detail) {
    return (
      <SafeAreaView
        style={styles.safe}
        edges={['top']}
        testID="investment-detail-screen">
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
        testID="investment-detail-screen">
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
            {errorMessage || 'No se encontró la información de esta inversión.'}
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

  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top']}
      testID="investment-detail-screen">
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
            <Text style={styles.summaryProductName}>{d.productName}: </Text>
            <Text style={styles.summaryMuted}>Nº {d.maskedAccountNumber}</Text>
          </Text>
          <View style={styles.hairline} />
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.mutedLabel}>Inversión inicial: </Text>
              <Text style={styles.amountDark}>
                {formatCurrency(d.initialAmount)} {d.currency}
              </Text>
            </View>
            <View style={styles.alignEnd}>
              <Text style={styles.mutedLabel}>Total a recibir:</Text>
              <Text style={styles.amountAccent}>
                {formatCurrency(d.totalToReceive)} {d.currency}
              </Text>
            </View>
          </View>
          <View style={styles.hairline} />
          <View style={styles.interestBlock}>
            <Text style={styles.interestLine}>
              <Text style={styles.mutedLabel}>
                Interés ganado al vencimiento:{' '}
              </Text>
              <Text style={styles.interestStrong}>
                {formatCurrency(d.interestAtMaturity)}
              </Text>
            </Text>
          </View>
          <View style={styles.hairline} />
          <View style={styles.metaRow}>
            <Text style={styles.metaTiny}>
              <Text style={styles.metaTinyMuted}>Tasa de interés: </Text>
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
            <Text style={styles.dateLabel}>Fecha de apertura</Text>
            <Text style={styles.dateValue}>
              {formatInvestmentDate(d.openingDateIso)}
            </Text>
          </View>
          <View style={styles.dateCard}>
            <Text style={styles.dateLabel}>Fecha de vencimiento</Text>
            <Text style={styles.dateValue}>
              {formatInvestmentDate(d.maturityDateIso)}
            </Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>IRF (Retención 2%)</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(d.irfRetentionAmount)}
            </Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Frecuencia de pago</Text>
            <Text style={styles.detailValue}>{d.paymentFrequencyLabel}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Cotitular</Text>
            <Text style={[styles.detailValue, styles.detailValueShrink]}>
              {d.jointHolderName}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={openRenewDev}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="Renovar inversión">
          <Text style={styles.primaryBtnText}>Renovar</Text>
          <RenewClockIcon color={colors.white} />
        </TouchableOpacity>
      </ScrollView>

      <DevelopmentNoticeModal
        visible={devModalVisible}
        onClose={() => setDevModalVisible(false)}
        title="En desarrollo"
        message="La renovación de inversiones estará disponible próximamente."
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
          paddingTop: 16,
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
          fontFamily: Lexend.semiBold,
          letterSpacing: 1,
          color: colors.textPrimary,
          textAlign: 'center',
          textTransform: 'uppercase',
        },
        headerSpacer: {
          width: 22,
          height:12
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
        summaryRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
        },
        mutedLabel: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.textTertiary,
        },
        amountDark: {
          fontFamily: Lexend.regular,
          fontSize: 16,
          lineHeight: 24,
          color: colors.textPrimary,
        },
        amountAccent: {
          fontFamily: Lexend.semiBold,
          fontSize: 16,
          lineHeight: 24,
          color: colors.primary,
        },
        alignEnd: {
          alignItems: 'flex-end',
        },
        interestBlock: {
          width: '100%',
        },
        interestLine: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.textTertiary,
          
        },
        interestStrong: {
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          lineHeight: 22,
          color: colors.primary,          
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
