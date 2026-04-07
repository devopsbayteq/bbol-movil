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
  ImageBackground,
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
import {HomeHeader} from './components/HomeHeader';
import {ProductFilterTabs} from './components/ProductFilterTabs';
import {HomeSectionTitle} from './components/HomeSectionTitle';
import {
  SavingsAccountCard,
  CheckingAccountCard,
  CreditCardPreview,
  LoanCard,
  InvestmentCard,
} from './components/ProductCarouselCards';
import {QuickActionsRow} from './components/QuickActionsRow';
import {PromotionalBanner} from './components/PromotionalBanner';
import {FrequentPaymentRow} from './components/FrequentPaymentRow';
import {
  PaymentLightbulbIcon,
  PaymentPersonIcon,
  PaymentSchoolIcon,
} from './components/PaymentRowIcons';
import {useHomeViewModel} from './useHomeViewModel';
import {DevelopmentNoticeModal} from '../components';

const HEADER_BG = require('../../../assets/images/home/header-container.png');

const PRODUCT_FILTERS = [
  'Todos',
  'Cuentas',
  'Tarjetas',
  'Inversiones',
  'Créditos',
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

const CARD_WIDTH = 204;
const CARD_HEIGHT = 130;
const CARD_GAP = 12;
const CARD_SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;
const CAROUSEL_OVERLAP = Math.round(CARD_HEIGHT / 2);
const MAIN_COLUMN_PADDING = 24;

/** Altura aproximada de la imagen + franja teal bajo el header (fondo decorativo). */
const HERO_IMAGE_SECTION_HEIGHT = 150;

export function HomeScreen() {
  const {user, logout} = useAuth();
  const {colors} = useTheme();
  const styles = useStyles(colors);

  const [filter, setFilter] = useState<string>('Todos');
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

    const all = filter === 'Todos';
    const showAccounts = all || filter === 'Cuentas';
    const showCards = all || filter === 'Tarjetas';
    const showInvestments = all || filter === 'Inversiones';
    const showLoans = all || filter === 'Créditos';

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
                    params: {
                      accountGuid: acc.accountGuid,
                      resetFilters: Date.now(),
                    },
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
                    params: {
                      accountGuid: acc.accountGuid,
                      resetFilters: Date.now(),
                    },
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

    if (showInvestments) {
      for (const inv of data.investments) {
        const k = `inv-${inv.investmentGuid}`;
        items.push({
          key: k,
          node: (
            <InvestmentCard
              key={k}
              style={styles.productCard}
              productName={inv.productName}
              currentValue={inv.currentValue}
              currency={inv.currency}
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

  const openDevelopmentModal = () => {
    setDevModalVisible(true);
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
        <View style={styles.stackRoot}>
          {/* Capa inferior: solo fondos (imagen + colores). No interacción. */}
          <View style={styles.heroStack} pointerEvents="none">
            <ImageBackground
              source={HEADER_BG}
              style={styles.heroImageSection}
              imageStyle={styles.headerBackgroundImage}
              resizeMode="cover"
            />
            <View
              style={[
                styles.heroTealBand,
                {backgroundColor: colors.homeHeaderBackground},
              ]}
            />
            <View
              style={[
                styles.heroBodyFill,
                {backgroundColor: colors.background},
              ]}
            />
          </View>

          {/* Capa superior: interacción desde chips hasta pagos frecuentes */}
          <View style={styles.contentLayer}>
            <SafeAreaView edges={['top']} />
            <HomeHeader
              userName={user?.name}
              onLogout={handleLogout}
              onNotifications={openDevelopmentModal}
            />

            <View style={styles.mainColumn}>
              <ProductFilterTabs
                
                filters={PRODUCT_FILTERS}
                selectedFilter={filter}
                onFilterChange={handleFilterChange}
              />
              {!isLoading && productItems.length > 0 ? (
              <View style={styles.carouselLayer} pointerEvents="box-none">
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
              </View>
            ) : null}
            </View>

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
            ) : !productItems.length ? (
              <Text style={styles.emptyProductsInline}>
                No hay productos en esta categoría.
              </Text>
            ) : null}

            

            <View style={[styles.mainColumn, styles.contentArea]}>
              <QuickActionsRow onPress={openDevelopmentModal} />
              <PromotionalBanner />

              <View style={styles.frequentPaymentsSection}>
                <HomeSectionTitle>Pagos frecuentes</HomeSectionTitle>
                {frequentPayments.length > 0 ? (
                  <View>
                    {frequentPayments.map((fp, i) => (
                      <FrequentPaymentRow
                        key={`${fp.beneficiaryName}-${i}`}
                        label={fp.beneficiaryName}
                        icon={iconForFrequentPayment(
                          fp.beneficiaryType,
                          iconColor,
                        )}
                        isFirst={i === 0}
                        isLast={i === frequentPayments.length - 1}
                        onPress={openDevelopmentModal}
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
        stackRoot: {
          position: 'relative',
          width: '100%',
          overflow: 'visible',
        },
        heroStack: {
          ...StyleSheet.absoluteFillObject,
          zIndex: 0,
          flexDirection: 'column',
        },
        heroImageSection: {
          width: '100%',
          height: HERO_IMAGE_SECTION_HEIGHT,
          backgroundColor: colors.homeHeaderBackground,
        },
        headerBackgroundImage: {
          opacity: 1,
        },
        heroTealBand: {
          width: '100%',
          height: 72,

        },
        heroBodyFill: {
          flex: 1,
          minHeight: 480,
        },
        contentLayer: {
          position: 'relative',
          zIndex: 1,
          width: '100%',
        },
        mainColumn: {
          //paddingHorizontal: MAIN_COLUMN_PADDING,
          width: '100%',
          alignSelf: 'center',
          maxWidth: '100%',
        },
        carouselLayer: {        
          zIndex: 2,
  
        },
        contentArea: {
          paddingTop: 16,
          paddingBottom: 32,
  
          backgroundColor: colors.background,
        },
        carouselRow: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 4,
          paddingHorizontal: MAIN_COLUMN_PADDING,
          paddingBottom: 4,
          gap: CARD_GAP,
        },
        carouselItem: {
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
        },
        productCard: {
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
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
          marginHorizontal: MAIN_COLUMN_PADDING,
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
        emptyProductsInline: {
          color: colors.textSecondary,
          fontSize: 14,
          paddingVertical: 16,
          paddingHorizontal: MAIN_COLUMN_PADDING,
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
