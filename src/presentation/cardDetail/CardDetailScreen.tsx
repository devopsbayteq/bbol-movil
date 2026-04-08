import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
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
import {useCardDetailViewModel} from './useCardDetailViewModel';
import type {CardSpendingCategoryMock} from './cardDetailMocks';
import {SpendingDonutChart, type DonutSegment} from './SpendingDonutChart';

const arrowBack = require('../../../assets/images/arrow-left.png');
const arrowRight = require('../../../assets/images/arrow_right_black.png');
const CARD_BANNER_BG = require('../../../assets/images/card_banner_background.png');

type Nav = NativeStackNavigationProp<HomeStackParamList, 'CardDetail'>;

function formatShortDueDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '—';
  }
  return `hasta ${d.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
  })}`;
}

function resolveCategoryColor(
  colors: ThemeColors,
  token: CardSpendingCategoryMock['colorToken'],
): string {
  if (token === 'primary') {
    return colors.primary;
  }
  if (token === 'chartAccent') {
    return colors.chartAccent;
  }
  return colors.primaryLight;
}

function CreditCardPayIcon({color}: {color: string}) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M4 9a2 2 0 012-2h12a2 2 0 012 2v1H4V9zm0 3h16v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7zm3 3.25h4v1.5H7v-1.5z"
      />
    </Svg>
  );
}

function CalendarDeferIcon({color}: {color: string}) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M7 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v2H4V6a2 2 0 012-2h1V3a1 1 0 011-1zm12 8H5v9a1 1 0 001 1h12a1 1 0 001-1v-9zm-6 2h2v2h-2v-2z"
      />
    </Svg>
  );
}

function StatementIcon({color}: {color: string}) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8.828a2 2 0 00-.586-1.414l-4.828-4.828A2 2 0 0013.172 2H6zm8 1.5L18.5 8H14a1 1 0 01-1-1V3.5zM8 12h8v1.5H8V12zm0 3h8V17H8v-2z"
      />
    </Svg>
  );
}

function CashAdvanceIcon({color}: {color: string}) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M4 4h16v4H4V4zm0 6h16v10H4V10zm3 2v6h10v-6H7zm2 2h6v2H9v-2z"
      />
    </Svg>
  );
}

function ChevronDownIcon({color}: {color: string}) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path fill={color} d="M7 10l5 5 5-5H7z" />
    </Svg>
  );
}

function EyeIcon({color}: {color: string}) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
      />
    </Svg>
  );
}

function EyeSlashIcon({color}: {color: string}) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-2.76-2.24-5-5-5l-.17.01z"
      />
    </Svg>
  );
}

export function CardDetailScreen() {
  const {colors} = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProp<HomeStackParamList, 'CardDetail'>>();
  const {maskedCardNumber} = route.params;

  const {
    resolved,
    isLoading,
    errorMessage,
    consumptions,
    spendingCategories,
  } = useCardDetailViewModel(maskedCardNumber);

  const [balanceMasked, setBalanceMasked] = useState(true);
  const [devModalVisible, setDevModalVisible] = useState(false);

  const openDev = useCallback(() => setDevModalVisible(true), []);

  const donutSegments: DonutSegment[] = useMemo(
    () =>
      spendingCategories.map(c => ({
        color: resolveCategoryColor(colors, c.colorToken),
        share: c.share,
      })),
    [colors, spendingCategories],
  );

  if (isLoading && !resolved) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']} testID="card-detail-screen">
        <View style={styles.centered}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (errorMessage || !resolved) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']} testID="card-detail-screen">
        <View style={styles.headerBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Volver">
            <Image source={arrowBack} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            BANKARD
          </Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.centered}>
          <Text style={styles.errorInline}>
            {errorMessage || 'No se encontró la información de esta tarjeta.'}
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button">
            <Text style={styles.retryLink}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const {card, approvedLimit, utilized, available, utilizationRatio} = resolved;

  return (
    <SafeAreaView style={styles.safe} edges={['top']} testID="card-detail-screen">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={CARD_BANNER_BG}
          style={styles.bannerSection}
          resizeMode="cover">
          <View style={styles.headerBarBanner}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Volver">
              <Image
                source={arrowBack}
                style={styles.backIconOnBanner}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text style={styles.headerTitleOnBanner} numberOfLines={1}>
              BANKARD
            </Text>
            <View style={styles.headerSpacer} />
          </View>
          <View style={styles.heroContentPad}>
            <View style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <View style={styles.heroTitleBlock}>
                <Text style={styles.heroLabel}>Tarjeta</Text>
                <Text style={styles.heroMasked}>{card.maskedCardNumber}</Text>
              </View>
              <View style={styles.heroBrandRow}>
                <View style={styles.mcMark} accessibilityLabel="Marca de tarjeta">
                  <View style={[styles.mcCircle, styles.mcCircleRed]} />
                  <View style={[styles.mcCircle, styles.mcCircleOrange]} />
                </View>
                <TouchableOpacity
                  onPress={openDev}
                  accessibilityRole="button"
                  accessibilityLabel="Seleccionar tarjeta">
                  <ChevronDownIcon color={colors.white} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.heroBalanceRow}>
              <View style={styles.heroAmountBlock}>
                <View style={styles.amountAndPill}>
                  <Text style={styles.heroAmount} numberOfLines={1}>
                    {balanceMasked ? '$**.**' : formatCurrency(card.totalDue)}
                  </Text>
                  <View style={styles.duePill}>
                    <Text style={styles.duePillText}>
                      {formatShortDueDate(card.maxPaymentDate)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.totalDueCaption}>Total a pagar</Text>
              </View>
              <TouchableOpacity
                style={styles.eyeWrap}
                onPress={() => setBalanceMasked(m => !m)}
                accessibilityRole="button"
                accessibilityLabel={balanceMasked ? 'Mostrar saldo' : 'Ocultar saldo'}>
                {balanceMasked ? (
                  <EyeSlashIcon color={colors.white} />
                ) : (
                  <EyeIcon color={colors.white} />
                )}
              </TouchableOpacity>
            </View>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.sectionPad}>
          <View style={styles.creditCard}>
            <Text style={styles.creditApproved}>
              Cupo aprobado: {formatCurrency(approvedLimit)}
            </Text>
            <View style={styles.creditRow}>
              <Text style={styles.creditMuted}>
                Utilizado:{' '}
                <Text style={styles.creditStrong}>{formatCurrency(utilized)}</Text>
              </Text>
              <Text style={styles.creditMuted}>
                Disponible:{' '}
                <Text style={styles.creditStrong}>{formatCurrency(available)}</Text>
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, {width: `${utilizationRatio * 100}%`}]}
              />
            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionCell}
              onPress={openDev}
              accessibilityRole="button"
              accessibilityLabel="Pagar tarjeta">
              <CreditCardPayIcon color={colors.primary} />
              <Text style={styles.actionLabel} numberOfLines={2}>
                Pagar tarjeta
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCell}
              onPress={openDev}
              accessibilityRole="button"
              accessibilityLabel="Diferir consumos">
              <CalendarDeferIcon color={colors.primary} />
              <Text style={styles.actionLabel} numberOfLines={2}>
                Diferir consumos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCell}
              onPress={openDev}
              accessibilityRole="button"
              accessibilityLabel="Estado de cuenta">
              <StatementIcon color={colors.primary} />
              <Text style={styles.actionLabel} numberOfLines={2}>
                Estado de cuenta
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCell}
              onPress={openDev}
              accessibilityRole="button"
              accessibilityLabel="Avances">
              <CashAdvanceIcon color={colors.primary} />
              <Text style={styles.actionLabel} numberOfLines={2}>
                Avances
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionHeading}>Detalle de consumos</Text>
          <View style={styles.txList}>
            {consumptions.map((row, index) => {
              const isLast = index === consumptions.length - 1;
              const isCredit = row.amount < 0;
              return (
                <TouchableOpacity
                  key={`${row.merchant}-${row.day}-${index}`}
                  style={[styles.txRow, !isLast && styles.txRowBorder]}
                  onPress={openDev}
                  activeOpacity={0.85}
                  accessibilityRole="button">
                  <View style={styles.txDate}>
                    <Text style={styles.txDay}>{row.day}</Text>
                    <Text style={styles.txMonth}>{row.monthLabel}</Text>
                  </View>
                  <View style={styles.txMid}>
                    <Text style={styles.txMerchant} numberOfLines={2}>
                      {row.merchant}
                    </Text>
                  </View>
                  <View style={styles.txRight}>
                    <Text
                      style={[
                        styles.txAmount,
                        isCredit && {color: colors.success},
                      ]}>
                      {isCredit
                        ? `+${formatCurrency(Math.abs(row.amount))}`
                        : formatCurrency(row.amount)}
                    </Text>
                    <Image
                      source={arrowRight}
                      style={styles.txArrow}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.spendingCard}>
            <Text style={styles.spendingTitle}>Tus gastos del mes</Text>
            <SpendingDonutChart segments={donutSegments} />
            <View style={styles.legend}>
              {spendingCategories.map(c => (
                <View key={c.id} style={styles.legendRow}>
                  <View style={styles.legendLeft}>
                    <View
                      style={[
                        styles.legendDot,
                        {backgroundColor: resolveCategoryColor(colors, c.colorToken)},
                      ]}
                    />
                    <Text style={styles.legendLabel}>{c.label}</Text>
                  </View>
                  <Text style={styles.legendAmount}>{formatCurrency(c.amount)}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <DevelopmentNoticeModal
        visible={devModalVisible}
        onClose={() => setDevModalVisible(false)}
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
        headerBar: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: colors.white,
        },
        bannerSection: {
          width: '100%',
          alignSelf: 'stretch',
          minHeight: 240,
        },
        headerBarBanner: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: 'transparent',
        },
        backIconOnBanner: {
          width: 20,
          height: 20,
          tintColor: colors.white,
        },
        headerTitleOnBanner: {
          flex: 1,
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.white,
          textAlign: 'center',
        },
        backIcon: {
          width: 20,
          height: 20,
          tintColor: colors.iconPrimary,
        },
        headerTitle: {
          flex: 1,
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.textPrimary,
          textAlign: 'center',
        },
        headerSpacer: {
          width: 20,
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
          color: colors.textSecondary,
          textAlign: 'center',
          marginBottom: 12,
        },
        retryLink: {
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          color: colors.linkPrimary,
        },
        heroContentPad: {
          width: '100%',
          paddingHorizontal: 24,
          paddingTop: 4,
          paddingBottom: 20,
        },
        heroCard: {
          borderRadius: 12,
          backgroundColor: 'transparent',
          paddingHorizontal: 0,
          paddingTop: 0,
          paddingBottom: 0,
        },
        heroTopRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        },
        heroTitleBlock: {
          flex: 1,
          minWidth: 0,
        },
        heroLabel: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.white,
          opacity: 0.7,
        },
        heroMasked: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.white,
          marginTop: 2,
        },
        heroBrandRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        },
        mcMark: {
          flexDirection: 'row',
          alignItems: 'center',
          width: 36,
          height: 22,
          justifyContent: 'center',
        },
        mcCircle: {
          width: 18,
          height: 18,
          borderRadius: 9,
        },
        mcCircleRed: {
          backgroundColor: colors.error,
          marginRight: -8,
          zIndex: 1,
        },
        mcCircleOrange: {
          backgroundColor: colors.warning,
          opacity: 0.95,
        },
        heroBalanceRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginTop: 20,
        },
        heroAmountBlock: {
          flex: 1,
          minWidth: 0,
        },
        amountAndPill: {
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        },
        heroAmount: {
          fontFamily: Lexend.bold,
          fontSize: 30,
          lineHeight: 40,
          color: colors.white,
        },
        duePill: {
          borderWidth: 0.8,
          borderColor: colors.textTertiary,
          borderRadius: 4,
          paddingHorizontal: 6,
          paddingVertical: 2,
        },
        duePillText: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.white,
        },
        totalDueCaption: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.white,
          opacity: 0.7,
          marginTop: 4,
        },
        eyeWrap: {
          backgroundColor: colors.textTertiary,
          borderRadius: 4,
          padding: 6,
        },
        sectionPad: {
          paddingHorizontal: 24,
          marginTop: 16,
          gap: 16,
        },
        creditCard: {
          backgroundColor: colors.white,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 8,
        },
        creditApproved: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textTertiary,
        },
        creditRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 4,
        },
        creditMuted: {
          fontFamily: Lexend.regular,
          fontSize: 10,
          lineHeight: 20,
          color: colors.textTertiary,
        },
        creditStrong: {
          fontFamily: Lexend.semiBold,
          fontSize: 10,
          color: colors.textPrimary,
        },
        progressTrack: {
          height: 6,
          borderRadius: 4,
          backgroundColor: colors.borderSubtle,
          marginTop: 8,
          overflow: 'hidden',
        },
        progressFill: {
          height: '100%',
          borderRadius: 4,
          backgroundColor: colors.primary,
        },
        actionsRow: {
          flexDirection: 'row',
          gap: 8,
        },
        actionCell: {
          flex: 1,
          minWidth: 0,
          backgroundColor: colors.white,
          borderRadius: 8,
          alignItems: 'center',
          paddingTop: 8,
          paddingBottom: 4,
          paddingHorizontal: 4,
          minHeight: 54,
          justifyContent: 'flex-start',
        },
        actionLabel: {
          fontFamily: Lexend.regular,
          fontSize: 9,
          lineHeight: 14,
          color: colors.textPrimary,
          textAlign: 'center',
          marginTop: 4,
        },
        sectionHeading: {
          fontFamily: Lexend.regular,
          fontSize: 16,
          lineHeight: 24,
          color: colors.textPrimary,
        },
        txList: {
          borderRadius: 8,
          overflow: 'hidden',
          backgroundColor: colors.white,
        },
        txRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
          paddingHorizontal: 16,
          paddingVertical: 12,
          minHeight: 56,
        },
        txRowBorder: {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.borderSubtle,
        },
        txDate: {
          alignItems: 'center',
          width: 36,
        },
        txDay: {
          fontFamily: Lexend.semiBold,
          fontSize: 16,
          lineHeight: 24,
          color: colors.primary,
        },
        txMonth: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textTertiary,
        },
        txMid: {
          flex: 1,
          minWidth: 0,
        },
        txMerchant: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textTertiary,
        },
        txRight: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        },
        txAmount: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textSecondary,
        },
        txArrow: {
          width: 16,
          height: 16,
          tintColor: colors.textTertiary,
        },
        spendingCard: {
          backgroundColor: colors.white,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 20,
          alignItems: 'center',
        },
        spendingTitle: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.textPrimary,
          alignSelf: 'flex-start',
          marginBottom: 12,
        },
        legend: {
          alignSelf: 'stretch',
          marginTop: 16,
          gap: 12,
        },
        legendRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        legendLeft: {
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
          minWidth: 0,
          gap: 8,
          flexWrap: 'wrap',
        },
        legendDot: {
          width: 9,
          height: 9,
          borderRadius: 5,
        },
        legendLabel: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textSecondary,
          flex: 1,
        },
        legendAmount: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textSecondary,
        },
      }),
    [colors],
  );
}
