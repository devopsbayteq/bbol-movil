import React, {useMemo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SectionList,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
  SectionListData,
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
import Svg, {Path} from 'react-native-svg';
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

const QUICK_ACTION_BG = '#D0F0F6';

function accountKindLabel(kind: AccountKind): string {
  if (kind === 'savings') {
    return 'Cuenta de ahorros';
  }
  if (kind === 'checking') {
    return 'Cuenta corriente';
  }
  return 'Cuenta';
}

function sectionTitleForDate(d: Date, now: Date): string {
  const t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const t1 = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((t0 - t1) / 864e5);
  if (diffDays === 0) {
    return 'HOY';
  }
  if (diffDays === 1) {
    return 'AYER';
  }
  return d.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function buildSections(
  movements: AccountMovement[],
): SectionListData<AccountMovement>[] {
  const now = new Date();
  const map = new Map<string, AccountMovement[]>();
  const order: string[] = [];
  for (const item of movements) {
    const d = new Date(item.transferDate);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key)!.push(item);
  }
  return order.map(key => {
    const list = map.get(key)!;
    const d = new Date(list[0].transferDate);
    return {
      title: sectionTitleForDate(d, now),
      data: list,
    };
  });
}

function BackIcon({color}: {color: string}) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
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
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
      />
    </Svg>
  );
}

function EyeSlashIcon({color}: {color: string}) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-2.76-2.24-5-5-5l-.17.01z"
      />
    </Svg>
  );
}

function ChevronRightIcon({color}: {color: string}) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
      />
    </Svg>
  );
}

function ArrowOutIcon({color}: {color: string}) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z"
      />
    </Svg>
  );
}

function ArrowInIcon({color}: {color: string}) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M19 9h-2v6.59L5.41 4 4 5.41 15.59 17H9v2h10z"
      />
    </Svg>
  );
}

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

  const [balanceVisible, setBalanceVisible] = React.useState(true);
  const [devModalVisible, setDevModalVisible] = React.useState(false);
  const [dateFilterModalVisible, setDateFilterModalVisible] =
    React.useState(false);
  const [amountFilterModalVisible, setAmountFilterModalVisible] =
    React.useState(false);
  const [typeFilterModalVisible, setTypeFilterModalVisible] =
    React.useState(false);

  const vm = useAccountMovementsViewModel(accountGuid);
  const {refresh: refreshMovements} = vm;

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
  const width = Dimensions.get('window').width;

  const sections = useMemo(
    () => buildSections(vm.items),
    [vm.items],
  );

  const onBack = useCallback(() => {
    tabNavigation?.navigate('Home', {});
  }, [tabNavigation]);

  const renderMovementRow = useCallback(
    ({item}: {item: AccountMovement}) => {
      const incoming = item.amount > 0;
      const amountColor = incoming ? colors.success : colors.textPrimary;
      const amountPrefix = incoming ? '' : '-';
      const displayAbs = formatCurrency(Math.abs(item.amount));
      return (
        <Pressable
          testID="movement-row"
          style={({pressed}) => [
            styles.movementCard,
            pressed && styles.movementCardPressed,
          ]}
          onPress={() =>
            navigation.navigate('MovementDetail', {movement: item})
          }
          accessibilityRole="button"
          accessibilityLabel={`Movimiento ${item.beneficiaryName}`}>
          <View style={styles.movementIconWrap}>
            {incoming ? (
              <ArrowInIcon color={colors.success} />
            ) : (
              <ArrowOutIcon color={colors.textPrimary} />
            )}
          </View>
          <View style={styles.movementCenter}>
            <Text style={styles.movementName} numberOfLines={1}>
              {item.beneficiaryName}
            </Text>
            <Text style={styles.movementSub} numberOfLines={1}>
              {item.transactionTypeLabel}
            </Text>
          </View>
          <View style={styles.movementRight}>
            <Text style={[styles.movementAmount, {color: amountColor}]}>
              {amountPrefix}
              {displayAbs}
            </Text>
            <Text style={styles.movementBalance}>
              {formatCurrency(item.balanceAfterTransaction)}
            </Text>
          </View>
          <ChevronRightIcon color={colors.textTertiary} />
        </Pressable>
      );
    },
    [colors, styles, navigation],
  );

  const listHeader = (
    <View>
      <View style={[styles.hero, {paddingTop: insets.top + 8}]}>
        <View style={styles.heroTop}>
          <TouchableOpacity
            onPress={onBack}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Volver al inicio">
            <BackIcon color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.heroTitle}>MOVIMIENTOS</Text>
          <View style={styles.heroTopSpacer} />
        </View>

        {vm.selectedAccount ? (
          <View style={styles.accountBlock}>
            <View style={styles.accountRow}>
              <View>
                <Text style={styles.accountKind}>
                  {accountKindLabel(vm.selectedAccount.accountKind)}
                </Text>
                <Text style={styles.accountMask}>
                  {vm.selectedAccount.maskedAccountNumber}
                </Text>
              </View>
              <View style={styles.accountActions}>
                <TouchableOpacity
                  onPress={() => setDevModalVisible(true)}
                  accessibilityLabel="Compartir">
                  <ShareIcon color={colors.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.eyeBox}
                  onPress={() => setBalanceVisible(v => !v)}
                  accessibilityLabel={
                    balanceVisible ? 'Ocultar saldo' : 'Mostrar saldo'
                  }>
                  {balanceVisible ? (
                    <EyeIcon color={colors.white} />
                  ) : (
                    <EyeSlashIcon color={colors.white} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.balanceBig}>
              {balanceVisible
                ? formatCurrency(vm.selectedAccount.balance)
                : '$**.**'}
            </Text>
            <Text style={styles.balanceLbl}>Saldo</Text>
          </View>
        ) : null}

        <Svg
          width={width}
          height={20}
          style={styles.wave}
          viewBox={`0 0 ${width} 20`}
          preserveAspectRatio="none">
          <Path
            d={`M0,10 Q${width * 0.25},20 ${width * 0.5},10 T${width},10 L${width},0 L0,0 Z`}
            fill={colors.background}
          />
        </Svg>
      </View>

      <View style={styles.quickRow}>
        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => tabNavigation?.navigate('Transfer')}
          accessibilityRole="button"
          accessibilityLabel="Transferir">
          <Text style={styles.quickIcon}>⇅</Text>
          <Text style={styles.quickLabel}>Transferir</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => setDevModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Pagar servicio">
          <Text style={styles.quickIcon}>💡</Text>
          <Text style={styles.quickLabel}>Pagar servicio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => setDevModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Cobrar con QR">
          <Text style={styles.quickIcon}>▦</Text>
          <Text style={styles.quickLabel}>Cobrar con QR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => setDevModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Programadas">
          <Text style={styles.quickIcon}>📅</Text>
          <Text style={styles.quickLabel}>Programadas</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionHeading}>Movimientos</Text>
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          testID="movements-search-input"
          style={styles.searchInput}
          placeholder="Buscar por nombre"
          placeholderTextColor={colors.textTertiary}
          value={vm.searchQuery}
          onChangeText={vm.setSearchQuery}
        />
      </View>
      <View style={styles.chipsRow}>
        <TouchableOpacity
          testID="movements-date-filter-chip"
          style={styles.chip}
          onPress={() => setDateFilterModalVisible(true)}
          accessibilityRole="button">
          <Text style={styles.chipText} numberOfLines={1}>
            {vm.dateFilterLabel}
          </Text>
          <Text style={styles.chipChevron}>▼</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="movements-type-filter-chip"
          style={styles.chip}
          onPress={() => setTypeFilterModalVisible(true)}
          accessibilityRole="button">
          <Text style={styles.chipText} numberOfLines={1}>
            {vm.typeFilterLabel}
          </Text>
          <Text style={styles.chipChevron}>▼</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="movements-amount-filter-chip"
          style={styles.chip}
          onPress={() => setAmountFilterModalVisible(true)}
          accessibilityRole="button">
          <Text style={styles.chipText} numberOfLines={1}>
            {vm.amountFilterLabel}
          </Text>
          <Text style={styles.chipChevron}>▼</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (vm.isLoadingAccount) {
    return (
      <View
        testID="transactions-screen"
        style={[styles.root, {paddingTop: insets.top}]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (vm.accountError) {
    return (
      <View
        testID="transactions-screen"
        style={[styles.root, {paddingTop: insets.top}]}>
        <ErrorMessage message={vm.accountError} />
        <Button title="Reintentar" onPress={() => void vm.refresh()} />
      </View>
    );
  }

  return (
    <View testID="transactions-screen" style={styles.root}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => {
          const id =
            item.transactionGuid?.trim() ||
            `${item.transactionIdentifier}|${item.transferDate}`;
          return `${id}|${index}`;
        }}
        renderItem={renderMovementRow}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.groupHeader}>{title}</Text>
        )}
        ListHeaderComponent={listHeader}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
        onEndReachedThreshold={0.4}
        onEndReached={() => void vm.loadMore()}
        refreshControl={
          <RefreshControl
            refreshing={vm.isRefreshing}
            onRefresh={() => void vm.refresh()}
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
                onPress={() => void vm.refresh()}
                style={styles.retryBtn}
              />
            </View>
          ) : (
            <EmptyState message="No hay movimientos" />
          )
        }
        ListFooterComponent={
          vm.isLoadingMore ? (
            <ActivityIndicator style={styles.footerLoader} color={colors.primary} />
          ) : null
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
        onClear={() => {
          vm.clearDateRange();
        }}
      />
      <MovementsAmountFilterModal
        visible={amountFilterModalVisible}
        onClose={() => setAmountFilterModalVisible(false)}
        initialRange={vm.appliedAmountRange}
        onApply={(min, max) => {
          vm.applyAmountRange(min, max);
        }}
        onClear={() => {
          vm.clearAmountRange();
        }}
      />
      <MovementsTypeFilterModal
        visible={typeFilterModalVisible}
        onClose={() => setTypeFilterModalVisible(false)}
        initialEnumType={vm.appliedEnumType}
        onApply={value => {
          vm.applyTransactionEnumType(value);
        }}
        onClear={() => {
          vm.clearTransactionEnumType();
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
        hero: {
          backgroundColor: colors.primary,
          paddingHorizontal: 20,
          paddingBottom: 0,
        },
        heroTop: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        },
        heroTitle: {
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          letterSpacing: 1,
          color: colors.white,
        },
        heroTopSpacer: {
          width: 24,
        },
        accountBlock: {
          marginBottom: 4,
        },
        accountRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        },
        accountKind: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.white,
        },
        accountMask: {
          fontFamily: Lexend.semiBold,
          fontSize: 16,
          color: colors.white,
          marginTop: 4,
        },
        accountActions: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        },
        eyeBox: {
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: 8,
          padding: 6,
        },
        balanceBig: {
          fontFamily: Lexend.semiBold,
          fontSize: 32,
          color: colors.white,
          marginTop: 16,
        },
        balanceLbl: {
          fontFamily: Lexend.regular,
          fontSize: 13,
          color: colors.white,
          opacity: 0.9,
          marginTop: 4,
          marginBottom: 8,
        },
        wave: {
          marginHorizontal: -20,
        },
        quickRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          marginTop: -4,
          marginBottom: 20,
          gap: 8,
        },
        quickCard: {
          flex: 1,
          backgroundColor: QUICK_ACTION_BG,
          borderRadius: 12,
          paddingVertical: 12,
          paddingHorizontal: 4,
          alignItems: 'center',
          minHeight: 72,
          justifyContent: 'center',
        },
        quickIcon: {
          fontSize: 18,
          marginBottom: 4,
          color: colors.primary,
        },
        quickLabel: {
          fontFamily: Lexend.semiBold,
          fontSize: 10,
          color: colors.primary,
          textAlign: 'center',
        },
        sectionHeading: {
          fontFamily: Lexend.semiBold,
          fontSize: 18,
          color: colors.textPrimary,
          paddingHorizontal: 20,
          marginBottom: 12,
        },
        searchWrap: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.white,
          marginHorizontal: 20,
          borderRadius: 24,
          paddingHorizontal: 16,
          paddingVertical: 10,
          marginBottom: 12,
        },
        searchIcon: {
          marginRight: 8,
          opacity: 0.5,
        },
        searchInput: {
          flex: 1,
          fontFamily: Lexend.regular,
          fontSize: 15,
          color: colors.textPrimary,
          paddingVertical: 0,
        },
        chipsRow: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          paddingHorizontal: 20,
          marginBottom: 16,
        },
        chip: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.white,
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 20,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.borderLight,
        },
        chipText: {
          flexShrink: 1,
          fontFamily: Lexend.semiBold,
          fontSize: 13,
          color: colors.textPrimary,
        },
        chipChevron: {
          fontSize: 10,
          color: colors.textTertiary,
          marginLeft: 4,
        },
        listContent: {
          paddingBottom: 32,
        },
        groupHeader: {
          fontFamily: Lexend.semiBold,
          fontSize: 12,
          letterSpacing: 0.8,
          color: colors.textTertiary,
          paddingHorizontal: 20,
          marginTop: 8,
          marginBottom: 8,
        },
        movementCard: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.white,
          marginHorizontal: 20,
          marginBottom: 8,
          padding: 14,
          borderRadius: 12,
          gap: 10,
        },
        movementCardPressed: {
          opacity: 0.92,
        },
        movementIconWrap: {
          width: 28,
          alignItems: 'center',
        },
        movementCenter: {
          flex: 1,
          minWidth: 0,
        },
        movementName: {
          fontFamily: Lexend.semiBold,
          fontSize: 15,
          color: colors.textPrimary,
        },
        movementSub: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          color: colors.textTertiary,
          marginTop: 2,
        },
        movementRight: {
          alignItems: 'flex-end',
        },
        movementAmount: {
          fontFamily: Lexend.semiBold,
          fontSize: 15,
        },
        movementBalance: {
          fontFamily: Lexend.regular,
          fontSize: 11,
          color: colors.textTertiary,
          marginTop: 2,
        },
        emptyPad: {
          paddingVertical: 40,
          paddingHorizontal: 20,
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
