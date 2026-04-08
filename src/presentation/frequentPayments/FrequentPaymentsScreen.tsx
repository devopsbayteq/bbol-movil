import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Svg, {Circle, Path, Polyline} from 'react-native-svg';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../../navigation/HomeStackNavigator';
import {useTheme, type ThemeColors} from '../../providers/theme';
import {Lexend} from '../../theme/lexend';
import {renderHomeDashboardIcon} from '../home/components/homeDashboardIconMap';
import {DevelopmentNoticeModal} from '../components';
import {getFrequentPaymentScreenMock} from './frequentPaymentsMocks';

const arrowBack = require('../../../assets/images/arrow-left.png');

type Nav = NativeStackNavigationProp<HomeStackParamList, 'FrequentPayments'>;

function CoinsIcon({color}: {color: string}) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Circle cx="9" cy="13" r="6" fill={color} />
      <Circle cx="15" cy="11" r="6" fill={color} opacity={0.92} />
    </Svg>
  );
}

function SearchIcon({color}: {color: string}) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
      />
    </Svg>
  );
}

function RepeatClockIcon({color}: {color: string}) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
      />
    </Svg>
  );
}

function buildChartPolylinePoints(
  values: number[],
  width: number,
  height: number,
): string {
  if (values.length === 0) {
    return '';
  }
  const minV = Math.min(...values) * 0.9;
  const maxV = Math.max(...values) * 1.05;
  const padY = 8;
  const innerH = height - padY * 2;
  const step = values.length > 1 ? width / (values.length - 1) : width;
  return values
    .map((v, i) => {
      const x = i * step;
      const t = maxV > minV ? (v - minV) / (maxV - minV) : 0.5;
      const y = padY + innerH * (1 - t);
      return `${x},${y}`;
    })
    .join(' ');
}

export function FrequentPaymentsScreen() {
  const {colors} = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProp<HomeStackParamList, 'FrequentPayments'>>();
  const {items, initialIndex} = route.params;

  const [selectedIndex, setSelectedIndex] = useState(() =>
    Math.min(Math.max(0, initialIndex), Math.max(0, items.length - 1)),
  );
  const [devVisible, setDevVisible] = useState(false);

  const selected = items[selectedIndex] ?? items[0];
  const mock = useMemo(
    () => (selected ? getFrequentPaymentScreenMock(selected) : null),
    [selected],
  );

  const chartW = 260;
  const chartH = 88;
  const linePoints = useMemo(() => {
    if (!mock) {
      return '';
    }
    const vals = mock.chartPoints.map(p => p.value);
    return buildChartPolylinePoints(vals, chartW, chartH);
  }, [mock]);

  const openDev = useCallback(() => setDevVisible(true), []);
  const closeDev = useCallback(() => setDevVisible(false), []);

  if (!mock || items.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
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
            ACCIONES FRECUENTES
          </Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No hay acciones para mostrar.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top']}
      testID="frequent-payments-screen">
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
          ACCIONES FRECUENTES
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
          nestedScrollEnabled>
          {items.map((item, index) => {
            const isSelected = index === selectedIndex;
            return (
              <TouchableOpacity
                key={`${item.beneficiaryName}-${item.beneficiaryType}-${index}`}
                style={[styles.chipOuter, isSelected && styles.chipOuterSelected]}
                onPress={() => setSelectedIndex(index)}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityState={{selected: isSelected}}
                accessibilityLabel={item.beneficiaryName}>
                <View
                  style={[styles.chipCircle, isSelected && styles.chipCircleLarge]}>
                  {renderHomeDashboardIcon(
                    item.beneficiaryType,
                    colors.primary,
                    isSelected ? 28 : 24,
                  )}
                </View>
                <Text style={styles.chipCaption} numberOfLines={2}>
                  {item.beneficiaryName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.detailCard}>
          <View style={styles.detailInner}>
            <Text style={styles.detailName}>{mock.beneficiaryDisplayName}</Text>
            <View style={styles.detailMeta}>
              <Text style={styles.detailMetaSecondary}>{mock.serviceProvider}</Text>
              <Text style={styles.detailMetaMuted}>{mock.identifierLine}</Text>
              <Text style={styles.detailMetaMuted}>{mock.ciLine}</Text>
            </View>
          </View>
          <View style={styles.payBlock}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={openDev}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel="Pagar">
              <Text style={styles.primaryBtnText}>Pagar</Text>
              <CoinsIcon color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.nextPayHint}>{mock.nextPaymentLine}</Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>{mock.historyTitle}</Text>
          <View style={styles.chartArea}>
            <Svg width={chartW} height={chartH} viewBox={`0 0 ${chartW} ${chartH}`}>
              <Polyline
                points={linePoints}
                fill="none"
                stroke={colors.chartAccent}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {mock.chartPoints.map((pt, i) => {
                const vals = mock.chartPoints.map(p => p.value);
                const step = chartW / Math.max(1, mock.chartPoints.length - 1);
                const x = i * step;
                const minV = Math.min(...vals) * 0.9;
                const maxV = Math.max(...vals) * 1.05;
                const padY = 8;
                const innerH = chartH - padY * 2;
                const t =
                  maxV > minV ? (pt.value - minV) / (maxV - minV) : 0.5;
                const cy = padY + innerH * (1 - t);
                return (
                  <Circle
                    key={`${pt.monthLabel}-${i}`}
                    cx={x}
                    cy={cy}
                    r={4}
                    fill={colors.white}
                    stroke={colors.chartAccent}
                    strokeWidth={2}
                  />
                );
              })}
            </Svg>
            <View style={styles.chartLabelsRow}>
              {mock.chartPoints.map(pt => (
                <Text key={pt.monthLabel} style={styles.chartMonth}>
                  {pt.monthLabel}
                </Text>
              ))}
            </View>
            <View style={styles.chartAmountsRow}>
              {mock.chartPoints.map(pt => (
                <Text key={pt.monthLabel} style={styles.chartAmount}>
                  {pt.amountLabel}
                </Text>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>Actividades recientes</Text>
            <TouchableOpacity
              style={styles.searchRow}
              onPress={openDev}
              accessibilityRole="button"
              accessibilityLabel="Buscar">
              <Text style={styles.searchLabel}>Buscar</Text>
              <SearchIcon color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          {mock.recentActivities.map((row, idx) => (
            <View
              key={`${row.monthLabel}-${row.day}-${idx}`}
              style={[
                styles.activityRow,
                idx === 0 && styles.activityRowFirst,
              ]}>
              <View style={styles.activityLeft}>
                <View style={styles.activityDate}>
                  <Text style={styles.activityDay}>{row.day}</Text>
                  <Text style={styles.activityMonth}>{row.monthLabel}</Text>
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityAmount}>{row.amountLabel}</Text>
                  <Text style={styles.activityRef}>{row.referenceLabel}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.repeatBtn}
                onPress={openDev}
                activeOpacity={0.88}
                accessibilityRole="button"
                accessibilityLabel="Repetir pago">
                <Text style={styles.repeatLabel}>Repetir</Text>
                <RepeatClockIcon color={colors.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <DevelopmentNoticeModal
        visible={devVisible}
        onClose={closeDev}
        title="En desarrollo"
        message="Esta función estará disponible próximamente."
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
          paddingHorizontal: 19,
          gap: 16,
          paddingTop: 8,
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
        emptyBox: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
        },
        emptyText: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.textTertiary,
          textAlign: 'center',
        },
        chipsRow: {
          gap: 12,
          paddingVertical: 4,
          alignItems: 'flex-start',
        },
        chipOuter: {
          width: 72,
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 4,
          paddingTop: 6,
          paddingBottom: 8,
        },
        chipOuterSelected: {
          width: 86,
          paddingHorizontal: 10,
          paddingTop: 8,
          backgroundColor: colors.homeBalanceToggleBg,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          borderWidth: 1,
          borderColor: colors.homeAvatarCircle,
          borderBottomWidth: 0,
          ...Platform.select({
            ios: {
              shadowColor: colors.shadowSoft,
              shadowOffset: {width: 0, height: 8},
              shadowOpacity: 0.06,
              shadowRadius: 16,
            },
            android: {
              elevation: 2,
            },
          }),
        },
        chipCircle: {
          width: 46,
          height: 46,
          borderRadius: 23,
          backgroundColor: colors.white,
          alignItems: 'center',
          justifyContent: 'center',
        },
        chipCircleLarge: {
          width: 52,
          height: 52,
          borderRadius: 26,
        },
        chipCaption: {
          fontFamily: Lexend.regular,
          fontSize: 10,
          lineHeight: 18,
          color: colors.textPrimary,
          textAlign: 'center',
        },
        detailCard: {
          backgroundColor: colors.homeBalanceToggleBg,
          borderWidth: 1,
          borderColor: colors.homeAvatarCircle,
          borderRadius: 0,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          padding: 12,
          marginTop: -1,
        },
        detailInner: {
          alignItems: 'center',
          gap: 8,
          paddingVertical: 8,
        },
        detailName: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.textPrimary,
          textAlign: 'center',
        },
        detailMeta: {
          alignItems: 'center',
          gap: 0,
        },
        detailMetaSecondary: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textSecondary,
        },
        detailMetaMuted: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textTertiary,
        },
        payBlock: {
          gap: 12,
          alignItems: 'center',
          width: '100%',
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
          width: '100%',
          maxWidth: 288,
        },
        primaryBtnText: {
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          lineHeight: 22,
          color: colors.white,
        },
        nextPayHint: {
          fontFamily: Lexend.regular,
          fontSize: 10,
          lineHeight: 20,
          color: colors.textSecondary,
          textAlign: 'center',
          maxWidth: 288,
        },
        chartCard: {
          backgroundColor: colors.white,
          borderRadius: 8,
          padding: 12,
          gap: 10,
          ...Platform.select({
            ios: {
              shadowColor: colors.shadowSoft,
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.08,
              shadowRadius: 4,
            },
            android: {
              elevation: 2,
            },
          }),
        },
        chartTitle: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.textPrimary,
        },
        chartArea: {
          gap: 8,
        },
        chartLabelsRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 8,
        },
        chartMonth: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textSecondary,
        },
        chartAmountsRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 4,
        },
        chartAmount: {
          fontFamily: Lexend.regular,
          fontSize: 8,
          lineHeight: 20,
          color: colors.textTertiary,
        },
        activityCard: {
          backgroundColor: colors.white,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          paddingHorizontal: 12,
          paddingTop: 24,
          paddingBottom: 12,
          gap: 0,
          ...Platform.select({
            ios: {
              shadowColor: colors.shadowSoft,
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.06,
              shadowRadius: 3,
            },
            android: {
              elevation: 1,
            },
          }),
        },
        activityHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        },
        activityTitle: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.textPrimary,
        },
        searchRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        },
        searchLabel: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.textPrimary,
        },
        activityRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.lineSeparator,
        },
        activityRowFirst: {
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.lineSeparator,
        },
        activityLeft: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
          flex: 1,
        },
        activityDate: {
          alignItems: 'center',
        },
        activityDay: {
          fontFamily: Lexend.semiBold,
          fontSize: 16,
          lineHeight: 24,
          color: colors.primary,
        },
        activityMonth: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textTertiary,
        },
        activityInfo: {
          flex: 1,
          maxWidth: '55%',
        },
        activityAmount: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textSecondary,
        },
        activityRef: {
          fontFamily: Lexend.regular,
          fontSize: 10,
          lineHeight: 20,
          color: colors.textTertiary,
        },
        repeatBtn: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          borderWidth: 1,
          borderColor: colors.primary,
          borderRadius: 8,
          paddingVertical: 6,
          paddingHorizontal: 10,
          minWidth: 92,
          minHeight: 32,
        },
        repeatLabel: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.primary,
        },
      }),
    [colors],
  );
}
