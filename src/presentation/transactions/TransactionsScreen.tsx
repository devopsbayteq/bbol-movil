import React, {useMemo, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Svg, {Path, Circle, G, Text as SvgText} from 'react-native-svg';
import type {MainTabParamList} from '../../navigation/MainTabNavigator';
import type {MovementsStackParamList} from '../../navigation/MovementsStackNavigator';
import {useTheme, type ThemeColors} from '../../providers/theme';
import {Lexend} from '../../theme/lexend';
import type {AccountKind} from '../../domain/entities/ContractBalance';
import type {AccountMovement} from '../../domain/entities/AccountMovement';
import {useAccountMovementsViewModel} from './useAccountMovementsViewModel';
import {formatCurrency} from './TransactionItem';
import {MovementsDateFilterModal} from './components/MovementsDateFilterModal';
import {MovementsAmountFilterModal} from './components/MovementsAmountFilterModal';
import {MovementsTypeFilterModal} from './components/MovementsTypeFilterModal';
import {Button, EmptyState, ErrorMessage, DevelopmentNoticeModal} from '../components';

// ─── helpers ────────────────────────────────────────────────────────────────

function accountShortLabel(kind: AccountKind): string {
  if (kind === 'savings') return 'Ahorros';
  if (kind === 'checking') return 'Corriente';
  return 'Cuenta';
}

function accountKindText(kind: AccountKind): string {
  if (kind === 'savings') return 'ahorros';
  if (kind === 'checking') return 'corriente';
  return 'cuenta';
}

function monthAbbr(date: Date): string {
  return date
    .toLocaleDateString('es-EC', {month: 'short'})
    .toUpperCase()
    .replace('.', '')
    .slice(0, 3);
}

// ─── SVG icons ───────────────────────────────────────────────────────────────

function BackIcon({color}: {color: string}) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
      />
    </Svg>
  );
}

function ShareIcon({color}: {color: string}) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"
      />
    </Svg>
  );
}

function EyeIcon({color}: {color: string}) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
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

function ChevronDownIcon({color}: {color: string}) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
      />
    </Svg>
  );
}

function ChevronRightIcon({color}: {color: string}) {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24">
      <Path fill={color} d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </Svg>
  );
}

function TransferIcon({color}: {color: string}) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M9 3L5 7h3v4h2V7h3zm7 11h-3v-4h-2v4H8l4 4z"
      />
    </Svg>
  );
}

function LightbulbIcon({color}: {color: string}) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z"
      />
    </Svg>
  );
}

function FileIcon({color}: {color: string}) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
      />
    </Svg>
  );
}

function CreditCardIcon({color}: {color: string}) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"
      />
    </Svg>
  );
}

function SearchIcon({color}: {color: string}) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
      />
    </Svg>
  );
}

// ─── Donut chart ─────────────────────────────────────────────────────────────

interface ExpenseSegment {
  label: string;
  amount: number;
  percentage: number;
  color: string;
}

function DonutChart({segments}: {segments: ExpenseSegment[]}) {
  const size = 186;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 88;
  const innerR = 54;
  const strokeWidth = outerR - innerR;
  const r = innerR + strokeWidth / 2;
  const circumference = 2 * Math.PI * r;

  let cumFraction = 0;
  const arcs = segments.map(seg => {
    const fraction = seg.percentage / 100;
    const dashLength = fraction * circumference;
    const gap = circumference - dashLength;
    const dashOffset = -cumFraction * circumference;
    const midFraction = cumFraction + fraction / 2;
    const svgAngle = midFraction * 360 - 90;
    const rad = (svgAngle * Math.PI) / 180;
    const labelX = cx + r * Math.cos(rad);
    const labelY = cy + r * Math.sin(rad);
    cumFraction += fraction;
    return {color: seg.color, percentage: seg.percentage, dashLength, gap, dashOffset, labelX, labelY};
  });

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#E8E8E8"
        strokeWidth={strokeWidth}
      />
      <G rotation="-90" origin={`${cx},${cy}`}>
        {arcs.map((arc, i) => (
          <Circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arc.dashLength} ${arc.gap}`}
            strokeDashoffset={arc.dashOffset}
          />
        ))}
      </G>
      {arcs.map((arc, i) =>
        arc.percentage >= 8 ? (
          <SvgText
            key={i}
            x={arc.labelX}
            y={arc.labelY}
            textAnchor="middle"
            alignmentBaseline="middle"
            fill="white"
            fontSize={10}
            fontWeight="600">
            {`${arc.percentage}%`}
          </SvgText>
        ) : null,
      )}
    </Svg>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export function TransactionsScreen() {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<
      NativeStackNavigationProp<MovementsStackParamList, 'MovementsList'>
    >();
  const tabNavigation =
    navigation.getParent<BottomTabNavigationProp<MainTabParamList>>();
  const route = useRoute<RouteProp<MovementsStackParamList, 'MovementsList'>>();
  const accountGuid = route.params?.accountGuid;
  const resetFiltersToken = route.params?.resetFilters;

  const [balanceVisible, setBalanceVisible] = React.useState(true);
  const [devModalVisible, setDevModalVisible] = React.useState(false);
  const [dateFilterModalVisible, setDateFilterModalVisible] =
    React.useState(false);
  const [amountFilterModalVisible, setAmountFilterModalVisible] =
    React.useState(false);
  const [typeFilterModalVisible, setTypeFilterModalVisible] =
    React.useState(false);

  const vm = useAccountMovementsViewModel(accountGuid);
  const {refresh: refreshMovements, clearAllFilters, hasActiveFilters} = vm;

  const prevAccountGuidRef = React.useRef<string | undefined>(undefined);
  useEffect(() => {
    if (resetFiltersToken === undefined) return;
    clearAllFilters();
  }, [resetFiltersToken, clearAllFilters]);

  useEffect(() => {
    if (
      prevAccountGuidRef.current !== undefined &&
      prevAccountGuidRef.current !== accountGuid
    ) {
      clearAllFilters();
    }
    prevAccountGuidRef.current = accountGuid;
  }, [accountGuid, clearAllFilters]);

  const isFirstListFocus = React.useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (isFirstListFocus.current) {
        isFirstListFocus.current = false;
        return;
      }
      refreshMovements().catch(() => {});
    }, [refreshMovements]),
  );

  const styles = useStyles(colors);

  // Compute expense categories from current month's outgoing transactions
  const chartSegments: ExpenseSegment[] = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const outgoing = vm.items.filter(item => {
      const d = new Date(item.transferDate);
      return (
        item.amount < 0 &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    });
    const totals = new Map<string, number>();
    for (const item of outgoing) {
      const label = item.transactionTypeLabel || 'Otros';
      totals.set(label, (totals.get(label) ?? 0) + Math.abs(item.amount));
    }
    const totalAmount = [...totals.values()].reduce((a, b) => a + b, 0);
    if (totalAmount === 0) return [];
    const segColors = [
      colors.homePrimaryHover,
      colors.homeAvatarCircle,
      colors.chartAccent,
    ];
    return [...totals.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([label, amount], i) => ({
        label,
        amount,
        percentage: Math.round((amount / totalAmount) * 100),
        color: segColors[i % segColors.length],
      }));
  }, [vm.items, colors]);

  const onBack = useCallback(() => {
    tabNavigation?.navigate('Home', {screen: 'HomeMain'});
  }, [tabNavigation]);

  const totalItems = vm.items.length;

  const renderItem = useCallback(
    ({item, index}: {item: AccountMovement; index: number}) => {
      const d = new Date(item.transferDate);
      const day = d.getDate().toString();
      const month = monthAbbr(d);
      const isFirst = index === 0;
      const isLast = index === totalItems - 1;
      const incoming = item.amount > 0;
      const amountColor = incoming ? colors.success : colors.textSecondary;
      const displayAbs = formatCurrency(Math.abs(item.amount));
      const prefix = incoming ? '' : '-';

      return (
        <Pressable
          testID="movement-row"
          style={({pressed}) => [
            styles.movRow,
            isFirst && styles.movRowFirst,
            isLast && styles.movRowLast,
            !isLast && styles.movRowDivider,
            pressed && styles.movRowPressed,
          ]}
          onPress={() =>
            navigation.navigate('MovementDetail', {movement: item})
          }
          accessibilityRole="button"
          accessibilityLabel={`Movimiento ${item.beneficiaryName}`}>
          <View style={styles.movDateCol}>
            <Text style={styles.movDay}>{day}</Text>
            <Text style={styles.movMonth}>{month}</Text>
          </View>
          <View style={styles.movCenter}>
            <Text style={styles.movName} numberOfLines={1}>
              {item.beneficiaryName}
            </Text>
            <Text style={styles.movSub} numberOfLines={1}>
              {item.transactionTypeLabel}
            </Text>
          </View>
          <View style={styles.movRight}>
            <Text style={[styles.movAmount, {color: amountColor}]}>
              {prefix}
              {displayAbs}
            </Text>
            <Text style={styles.movBalance}>
              {formatCurrency(item.balanceAfterTransaction)}
            </Text>
          </View>
          <ChevronRightIcon color={colors.textTertiary} />
        </Pressable>
      );
    },
    [totalItems, colors, styles, navigation],
  );

  const listHeader = useMemo(() => {
    if (!vm.selectedAccount) return null;
    const acc = vm.selectedAccount;
    const maskedLabel = `Cta. ${accountKindText(acc.accountKind)} ${acc.maskedAccountNumber}`;

    return (
      <View>
        {/* Account overview card */}
        <View style={styles.accountCard}>
          <View style={styles.accountCardRow}>
            <View style={styles.accountInfoBlock}>
              <View style={styles.accountLabelRow}>
                <Text style={styles.accountShortLabel}>
                  {accountShortLabel(acc.accountKind)}
                </Text>
                <TouchableOpacity
                  onPress={() => setDevModalVisible(true)}
                  hitSlop={8}
                  accessibilityLabel="Compartir">
                  <ShareIcon color={colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.accountMaskText}>{maskedLabel}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {}}
              hitSlop={8}
              accessibilityLabel="Cambiar cuenta">
              <ChevronDownIcon color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.accountBalanceRow}>
            <View>
              <Text style={styles.balanceBig}>
                {balanceVisible
                  ? formatCurrency(acc.balance)
                  : '$**.**'}
              </Text>
              <Text style={styles.balanceSubLabel}>
                {`Saldo contable: ${balanceVisible ? formatCurrency(acc.balance) : '$**.**'}`}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setBalanceVisible(v => !v)}
              accessibilityLabel={
                balanceVisible ? 'Ocultar saldo' : 'Mostrar saldo'
              }>
              {balanceVisible ? (
                <EyeIcon color={colors.primary} />
              ) : (
                <EyeSlashIcon color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick actions */}
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => tabNavigation?.navigate('Transfer')}
            accessibilityRole="button"
            accessibilityLabel="Transferir">
            <TransferIcon color={colors.primary} />
            <Text style={styles.quickLabel}>Transferir</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => setDevModalVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Pagar servicios">
            <LightbulbIcon color={colors.primary} />
            <Text style={styles.quickLabel}>Pagar servicios</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => setDevModalVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Estado de cuenta">
            <FileIcon color={colors.primary} />
            <Text style={styles.quickLabel}>Estado de cuenta</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => setDevModalVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Retirar sin tarjeta">
            <CreditCardIcon color={colors.primary} />
            <Text style={styles.quickLabel}>Retirar sin tarjeta</Text>
          </TouchableOpacity>
        </View>

        {/* Movements section header */}
        <Text style={styles.sectionHeading}>Movimientos</Text>

        {/* Search */}
        <View style={styles.searchWrap}>
          <SearchIcon color={colors.textTertiary} />
          <TextInput
            testID="movements-search-input"
            style={styles.searchInput}
            placeholder="Buscar por nombre"
            placeholderTextColor={colors.textTertiary}
            value={vm.searchQuery}
            onChangeText={vm.setSearchQuery}
          />
        </View>

        {/* Filter chips — single row */}
        <View style={styles.filtersRow}>
          <TouchableOpacity
            testID="movements-date-filter-chip"
            style={styles.chip}
            onPress={() => setDateFilterModalVisible(true)}
            accessibilityRole="button">
            <Text style={styles.chipText} numberOfLines={1}>
              {vm.dateFilterLabel}
            </Text>
            <ChevronDownIcon color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            testID="movements-type-filter-chip"
            style={styles.chip}
            onPress={() => setTypeFilterModalVisible(true)}
            accessibilityRole="button">
            <Text style={styles.chipText} numberOfLines={1}>
              {vm.typeFilterLabel}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="movements-amount-filter-chip"
            style={styles.chip}
            onPress={() => setAmountFilterModalVisible(true)}
            accessibilityRole="button">
            <Text style={styles.chipText} numberOfLines={1}>
              {vm.amountFilterLabel}
            </Text>
          </TouchableOpacity>
          {hasActiveFilters ? (
            <Pressable
              testID="movements-clear-all-filters"
              onPress={clearAllFilters}
              accessibilityRole="button"
              accessibilityLabel="Limpiar filtros"
              style={styles.clearFiltersBtn}>
              <Text style={styles.clearFiltersText}>✕</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    );
  }, [
    vm.selectedAccount,
    vm.searchQuery,
    vm.setSearchQuery,
    vm.dateFilterLabel,
    vm.typeFilterLabel,
    vm.amountFilterLabel,
    balanceVisible,
    hasActiveFilters,
    clearAllFilters,
    colors,
    styles,
    tabNavigation,
  ]);

  const listFooter = useMemo(() => {
    if (vm.isLoadingMore) {
      return (
        <ActivityIndicator
          style={styles.footerLoader}
          color={colors.primary}
        />
      );
    }
    if (chartSegments.length === 0) return null;
    return (
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Tus gastos del mes</Text>
        <View style={styles.chartDivider} />
        <View style={styles.chartCenter}>
          <DonutChart segments={chartSegments} />
        </View>
        <View style={styles.chartLegend}>
          {chartSegments.map((seg, i) => (
            <View key={i} style={styles.legendRow}>
              <View
                style={[styles.legendDot, {backgroundColor: seg.color}]}
              />
              <Text style={styles.legendLabel} numberOfLines={1}>
                {seg.label}
              </Text>
              <Text style={styles.legendAmount}>
                {formatCurrency(seg.amount)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  }, [vm.isLoadingMore, chartSegments, colors, styles]);

  if (vm.isLoadingAccount) {
    return (
      <View
        testID="transactions-screen"
        style={[styles.root, {paddingTop: insets.top + 64}]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (vm.accountError) {
    return (
      <View
        testID="transactions-screen"
        style={[styles.root, {paddingTop: insets.top + 64}]}>
        <ErrorMessage message={vm.accountError} />
        <Button
          title="Reintentar"
          onPress={() => {
            vm.refresh().catch(() => {});
          }}
        />
      </View>
    );
  }

  return (
    <View testID="transactions-screen" style={styles.root}>
      {/* Fixed white top bar */}
      <View style={[styles.topBar, {paddingTop: insets.top, height: insets.top + 64}]}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Volver al inicio">
          <BackIcon color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>MOVIMIENTOS</Text>
        <View style={styles.topBarSpacer} />
      </View>

      <FlatList
        data={vm.items}
        keyExtractor={(item, index) => {
          const id =
            item.transactionGuid?.trim() ||
            `${item.transactionIdentifier}|${item.transferDate}`;
          return `${id}|${index}`;
        }}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListFooterComponent={listFooter}
        contentContainerStyle={styles.listContent}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          vm.loadMore().catch(() => {});
        }}
        refreshControl={
          <RefreshControl
            refreshing={vm.isRefreshing}
            onRefresh={() => {
              vm.refresh().catch(() => {});
            }}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          vm.isLoadingMovements ? (
            <View style={styles.emptyPad}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : vm.movementsError ? (
            <View style={styles.emptyPad}>
              <ErrorMessage message={vm.movementsError} />
              <Button
                title="Reintentar"
                onPress={() => {
                  vm.refresh().catch(() => {});
                }}
                style={styles.retryBtn}
              />
            </View>
          ) : (
            <EmptyState message="No hay movimientos" />
          )
        }
      />

      <DevelopmentNoticeModal
        visible={devModalVisible}
        onClose={() => setDevModalVisible(false)}
      />
      <MovementsDateFilterModal
        visible={dateFilterModalVisible}
        onClose={() => setDateFilterModalVisible(false)}
        initialRange={vm.appliedDateRange}
        onApply={(from, to) => {
          vm.applyDateRange(from, to);
        }}
      />
      <MovementsAmountFilterModal
        visible={amountFilterModalVisible}
        onClose={() => setAmountFilterModalVisible(false)}
        initialRange={vm.appliedAmountRange}
        onApply={(min, max) => {
          vm.applyAmountRange(min, max);
        }}
      />
      <MovementsTypeFilterModal
        visible={typeFilterModalVisible}
        onClose={() => setTypeFilterModalVisible(false)}
        initialEnumType={vm.appliedEnumType}
        onApply={value => {
          vm.applyTransactionEnumType(value);
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
        // ─── Top bar ───────────────────────────────
        topBar: {
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          backgroundColor: colors.white,
          paddingHorizontal: 24,
          paddingBottom: 16,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.borderLight,
        },
        topBarTitle: {
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          letterSpacing: 1,
          color: colors.textPrimary,
        },
        topBarSpacer: {
          width: 22,
        },
        // ─── Account card ──────────────────────────
        accountCard: {
          backgroundColor: colors.homeProductCardSurface,
          paddingHorizontal: 24,
          paddingVertical: 20,
          gap: 16,
        },
        accountCardRow: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        },
        accountInfoBlock: {
          gap: 4,
        },
        accountLabelRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        },
        accountShortLabel: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.primary,
          opacity: 0.85,
        },
        accountMaskText: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.textSecondary,
        },
        accountBalanceRow: {
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        },
        balanceBig: {
          fontFamily: Lexend.bold,
          fontSize: 30,
          lineHeight: 40,
          color: colors.textPrimary,
        },
        balanceSubLabel: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.primary,
          opacity: 0.85,
          marginTop: 2,
        },
        eyeBtn: {
          backgroundColor: colors.homeBalanceToggleBg,
          borderRadius: 6,
          padding: 6,
        },
        // ─── Quick actions ─────────────────────────
        quickRow: {
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingVertical: 12,
          gap: 8,
          backgroundColor: colors.background,
        },
        quickCard: {
          flex: 1,
          backgroundColor: colors.white,
          borderRadius: 8,
          paddingVertical: 10,
          paddingHorizontal: 4,
          alignItems: 'center',
          gap: 4,
        },
        quickLabel: {
          fontFamily: Lexend.regular,
          fontSize: 8,
          color: colors.textPrimary,
          textAlign: 'center',
        },
        // ─── Movements heading & search ────────────
        sectionHeading: {
          fontFamily: Lexend.regular,
          fontSize: 16,
          lineHeight: 24,
          color: colors.textPrimary,
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 8,
        },
        searchWrap: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.white,
          marginHorizontal: 24,
          borderRadius: 48,
          paddingHorizontal: 16,
          paddingVertical: 12,
          gap: 8,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: colors.white,
        },
        searchInput: {
          flex: 1,
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.textPrimary,
          paddingVertical: 0,
        },
        // ─── Filter chips ──────────────────────────
        filtersRow: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingBottom: 16,
          gap: 8,
          flexWrap: 'nowrap',
        },
        chip: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.buttonSecondaryBg,
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 12,
          gap: 4,
        },
        chipText: {
          flexShrink: 1,
          fontFamily: Lexend.semiBold,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textSecondary,
        },
        clearFiltersBtn: {
          backgroundColor: colors.buttonSecondaryBg,
          borderRadius: 12,
          paddingHorizontal: 10,
          paddingVertical: 4,
        },
        clearFiltersText: {
          fontFamily: Lexend.semiBold,
          fontSize: 12,
          color: colors.textSecondary,
        },
        // ─── Transaction rows ──────────────────────
        movRow: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.white,
          marginHorizontal: 24,
          paddingHorizontal: 8,
          paddingVertical: 12,
          gap: 8,
        },
        movRowFirst: {
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        },
        movRowLast: {
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          marginBottom: 8,
        },
        movRowDivider: {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.borderLight,
        },
        movRowPressed: {
          opacity: 0.88,
        },
        movDateCol: {
          width: 34,
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 4,
        },
        movDay: {
          fontFamily: Lexend.semiBold,
          fontSize: 16,
          lineHeight: 24,
          color: colors.primary,
          textAlign: 'right',
        },
        movMonth: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textTertiary,
          textAlign: 'center',
        },
        movCenter: {
          flex: 1,
          minWidth: 0,
          gap: 2,
        },
        movName: {
          fontFamily: Lexend.semiBold,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textTertiary,
        },
        movSub: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textTertiary,
        },
        movRight: {
          alignItems: 'flex-end',
          gap: 2,
        },
        movAmount: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          textAlign: 'right',
        },
        movBalance: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textTertiary,
        },
        // ─── Chart footer card ─────────────────────
        chartCard: {
          backgroundColor: colors.white,
          marginHorizontal: 24,
          marginTop: 16,
          marginBottom: 8,
          borderRadius: 12,
          paddingHorizontal: 20,
          paddingVertical: 16,
        },
        chartTitle: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          lineHeight: 20,
          color: colors.textPrimary,
        },
        chartDivider: {
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.borderLight,
          marginTop: 12,
          marginBottom: 16,
        },
        chartCenter: {
          alignItems: 'center',
          marginBottom: 16,
        },
        chartLegend: {
          gap: 10,
        },
        legendRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        },
        legendDot: {
          width: 9,
          height: 9,
          borderRadius: 5,
          flexShrink: 0,
        },
        legendLabel: {
          flex: 1,
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textSecondary,
        },
        legendAmount: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textSecondary,
          textAlign: 'right',
        },
        // ─── Misc ──────────────────────────────────
        listContent: {
          paddingBottom: 32,
        },
        emptyPad: {
          paddingVertical: 40,
          paddingHorizontal: 24,
        },
        retryBtn: {
          marginTop: 12,
        },
        footerLoader: {
          paddingVertical: 16,
        },
      }),
    [colors],
  );
}
