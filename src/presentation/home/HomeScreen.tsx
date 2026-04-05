import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Animated,
  RefreshControl,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {useAuth} from '../../providers';
import type {MainTabParamList} from '../../navigation/MainTabNavigator';
import {useTheme, type ThemeColors} from '../../providers';
import type {AccountKind, FrequentPayment} from '../../domain/entities/ContractBalance';
import {HOME_HEADER_BG} from './homeConstants';
import {HomeHeader} from './components/HomeHeader';
import {ProductFilterTabs} from './components/ProductFilterTabs';
import {HomeSectionTitle} from './components/HomeSectionTitle';
import {
  SavingsAccountCard,
  CheckingAccountCard,
  CreditCardPreview,
  LoanCard,
} from './components/ProductCarouselCards';
import {QuickActionsRow} from './components/QuickActionsRow';
import {PromotionalBanner} from './components/PromotionalBanner';
import {HomeAlertBanner} from './components/HomeAlertBanner';
import {FrequentPaymentRow} from './components/FrequentPaymentRow';
import {
  PaymentLightbulbIcon,
  PaymentPersonIcon,
  PaymentSchoolIcon,
} from './components/PaymentRowIcons';
import {useHomeViewModel} from './useHomeViewModel';
import {DevelopmentNoticeModal} from '../components';

const PRODUCT_FILTERS = [
  'Cuentas',
  'Tarjetas',
  'Préstamos',
] as const;

function accountTitle(kind: AccountKind): string {
  if (kind === 'savings') {
    return 'Cta. ahorros';
  }
  if (kind === 'checking') {
    return 'Cta. corriente';
  }
  return 'Cuenta';
}

function iconForFrequentPayment(
  beneficiaryType: string,
  color: string,
): React.ReactNode {
  const t = beneficiaryType.toLowerCase();
  if (t.includes('luz') || t.includes('servicio') || t.includes('light')) {
    return <PaymentLightbulbIcon color={color} />;
  }
  if (
    t.includes('edu') ||
    t.includes('matricula') ||
    t.includes('school') ||
    t.includes('colegio')
  ) {
    return <PaymentSchoolIcon color={color} />;
  }
  return <PaymentPersonIcon color={color} />;
}

const CARD_WIDTH = 205;
const CARD_GAP = 12;
const CARD_SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

export function HomeScreen() {
  const {user, logout} = useAuth();
  const {colors} = useTheme();
  const styles = useStyles(colors);

  const [filter, setFilter] = useState<string>('Cuentas');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [devModalVisible, setDevModalVisible] = useState(false);
  const iconColor = colors.textTertiary;
  const route = useRoute<RouteProp<MainTabParamList, 'Home'>>();
  const navigation =
    useNavigation<BottomTabNavigationProp<MainTabParamList, 'Home'>>();

  const {data, isLoading, isRefreshing, error, refresh, retry} =
    useHomeViewModel();

  const carouselRef = useRef<ScrollView>(null);
  const scaleAnims = useRef<Animated.Value[]>([]).current;

  useFocusEffect(
    useCallback(() => {
      const token = route.params?.refreshHome;
      if (token === undefined) {
        return;
      }
      refresh().catch();
      navigation.setParams({refreshHome: undefined});
    }, [navigation, refresh, route.params?.refreshHome]),
  );

  const handleFilterChange = useCallback(
    (newFilter: string) => {
      setFilter(newFilter);
      setSelectedIdx(0);
      carouselRef.current?.scrollTo({x: 0, animated: false});
      scaleAnims.length = 0;
    },
    [scaleAnims],
  );

  type ProductItem = {key: string; node: React.ReactNode};

  const productItems = useMemo((): ProductItem[] => {
    if (!data) {
      return [];
    }

    const showAccounts = filter === 'Cuentas';
    const showCards = filter === 'Tarjetas';
    const showLoans = filter === 'Préstamos';

    const items: ProductItem[] = [];

    if (showAccounts) {
      for (const acc of data.accounts) {
        const k = `acc-${acc.accountGuid}`;
        if (acc.accountKind === 'checking') {
          items.push({
            key: k,
            node: (
              <TouchableOpacity
                key={k}
                activeOpacity={0.92}
                style={styles.productCard}
                onPress={() =>
                  navigation.navigate('Movements', {
                    screen: 'MovementsList',
                    params: {accountGuid: acc.accountGuid},
                  })
                }
                accessibilityRole="button"
                accessibilityLabel="Ver movimientos de cuenta corriente">
                <CheckingAccountCard
                  style={styles.cardFill}
                  maskedAccountNumber={acc.maskedAccountNumber}
                  balance={acc.balance}
                />
              </TouchableOpacity>
            ),
          });
        } else {
          items.push({
            key: k,
            node: (
              <TouchableOpacity
                key={k}
                activeOpacity={0.92}
                style={styles.productCard}
                onPress={() =>
                  navigation.navigate('Movements', {
                    screen: 'MovementsList',
                    params: {accountGuid: acc.accountGuid},
                  })
                }
                accessibilityRole="button"
                accessibilityLabel={`Ver movimientos de ${accountTitle(acc.accountKind)}`}>
                <SavingsAccountCard
                  style={styles.cardFill}
                  title={accountTitle(acc.accountKind)}
                  maskedAccountNumber={acc.maskedAccountNumber}
                  balance={acc.balance}
                />
              </TouchableOpacity>
            ),
          });
        }
      }
    }

    if (showCards) {
      for (const card of data.creditCards) {
        const k = `cc-${card.maskedCardNumber}-${card.maxPaymentDate}`;
        items.push({
          key: k,
          node: (
            <CreditCardPreview
              key={k}
              style={styles.productCard}
              maskedCardNumber={card.maskedCardNumber}
              totalDue={card.totalDue}
              maxPaymentDate={card.maxPaymentDate}
            />
          ),
        });
      }
    }

    if (showLoans) {
      for (const loan of data.loans) {
        const k = `loan-${loan.loanGuid}`;
        items.push({
          key: k,
          node: (
            <LoanCard
              key={k}
              style={styles.productCard}
              outstandingBalance={loan.outstandingBalance}
              nextInstallmentAmount={loan.nextInstallmentAmount}
              nextInstallmentDate={loan.nextInstallmentDate}
            />
          ),
        });
      }
    }

    return items;
  }, [data, filter, navigation, styles.cardFill, styles.productCard]);

  if (scaleAnims.length !== productItems.length) {
    scaleAnims.length = 0;
    productItems.forEach((_, i) => {
      scaleAnims.push(new Animated.Value(i === 0 ? 1 : 0.92));
    });
  }

  const animateSelection = (idx: number) => {
    if (idx === selectedIdx) {
      return;
    }
    const animations = scaleAnims.map((anim, i) =>
      Animated.spring(anim, {
        toValue: i === idx ? 1 : 0.92,
        useNativeDriver: true,
        speed: 22,
        bounciness: 6,
      }),
    );
    setSelectedIdx(idx);
    Animated.parallel(animations).start();
  };

  const onCarouselScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / CARD_SNAP_INTERVAL);
    if (idx >= 0 && idx < productItems.length) {
      animateSelection(idx);
    }
  };

  const frequentPayments: FrequentPayment[] = data?.frequentPayments ?? [];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View testID="home-screen" style={styles.root}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor={colors.white}
            colors={[colors.primary]}
          />
        }>
        <View style={styles.darkHeaderZone}>
          <SafeAreaView edges={['top']} />
          <HomeHeader userName={user?.name} onLogout={handleLogout} />
          <HomeAlertBanner
            title="Nueva tarjeta en camino"
            subtitle="Llegará el 24 de Octubre"
            onPress={() => setDevModalVisible(true)}
          />
          <ProductFilterTabs
            filters={PRODUCT_FILTERS}
            selectedFilter={filter}
            onFilterChange={handleFilterChange}
          />

          {error ? (
            <View style={styles.inlineMessage}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={retry} accessibilityRole="button">
                <Text style={styles.retryText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {isLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color={colors.white} />
            </View>
          ) : productItems.length > 0 ? (
            <ScrollView
              ref={carouselRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_SNAP_INTERVAL}
              snapToAlignment="start"
              decelerationRate="fast"
              onMomentumScrollEnd={onCarouselScroll}
              contentContainerStyle={styles.carouselRow}>
              {productItems.map((item, i) => (
                <Animated.View
                  key={item.key}
                  style={[
                    styles.carouselItem,
                    {
                      transform: [
                        {scale: scaleAnims[i] ?? new Animated.Value(1)},
                      ],
                    },
                  ]}>
                  {item.node}
                </Animated.View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.emptyProductsDark}>
              No hay productos en esta categoría.
            </Text>
          )}
        </View>

        {/* --- Light content area --- */}
        <View style={styles.contentArea}>
          <QuickActionsRow />
          <PromotionalBanner />

          <View style={styles.frequentPaymentsSection}>
            <HomeSectionTitle>Pagos frecuentes</HomeSectionTitle>
            {frequentPayments.length > 0 ? (
              <View>
                {frequentPayments.map((fp, i) => (
                  <FrequentPaymentRow
                    key={`${fp.beneficiaryName}-${i}`}
                    label={fp.beneficiaryName}
                    icon={iconForFrequentPayment(fp.beneficiaryType, iconColor)}
                    isFirst={i === 0}
                    isLast={i === frequentPayments.length - 1}
                    onPress={() => setDevModalVisible(true)}
                  />
                ))}
              </View>
            ) : (
              <Text style={styles.emptyProducts}>
                No hay pagos frecuentes registrados.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
      <DevelopmentNoticeModal
        visible={devModalVisible}
        onClose={() => setDevModalVisible(false)}
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
        scroll: {
          flex: 1,
        },
        darkHeaderZone: {
          backgroundColor: HOME_HEADER_BG,
          paddingBottom: 24,
          gap: 24,
        },
        contentArea: {
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 32,
          gap: 16,
        },
        carouselRow: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 24,
          paddingHorizontal: 24,
          paddingRight: 24,
          gap: CARD_GAP,
        },
        carouselItem: {
          width: CARD_WIDTH,
          height: 130,
        },
        productCard: {
          width: CARD_WIDTH,
          height: 130,
        },
        cardFill: {
          flex: 1,
        },
        frequentPaymentsSection: {
          gap: 16,
        },
        loadingBox: {
          paddingVertical: 24,
          alignItems: 'center',
        },
        inlineMessage: {
          gap: 8,
          marginHorizontal: 24,
        },
        errorText: {
          color: colors.errorBg,
          fontSize: 13,
        },
        retryText: {
          color: colors.white,
          fontSize: 14,
          fontWeight: '600',
        },
        emptyProductsDark: {
          color: colors.white,
          fontSize: 14,
          paddingVertical: 16,
          paddingHorizontal: 24,
          opacity: 0.7,
        },
        emptyProducts: {
          color: colors.textSecondary,
          fontSize: 14,
          paddingVertical: 16,
        },
      }),
    [colors],
  );
}
