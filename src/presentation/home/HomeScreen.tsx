import React, {useMemo, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Animated,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../../providers';
import {useTheme, type ThemeColors} from '../../providers/theme';
import type {AccountKind} from '../../domain/entities/ContractBalance';
import {HomeHeader} from './components/HomeHeader';
import {HomeAlertBanner} from './components/HomeAlertBanner';
import {HomeSectionTitle} from './components/HomeSectionTitle';
import {FilterChip} from './components/FilterChip';
import {
  SavingsAccountCard,
  CheckingAccountCard,
  CreditCardPreview,
  LoanCard,
  InvestmentCard,
} from './components/ProductCarouselCards';
import {FrequentPaymentCard} from './components/FrequentPaymentCard';
import {
  PaymentLightbulbIcon,
  PaymentPersonIcon,
  PaymentSchoolIcon,
} from './components/PaymentRowIcons';
import {useHomeViewModel} from './useHomeViewModel';

const PRODUCT_FILTERS = [
  'Todos',
  'Cuentas',
  'Tarjetas',
  'Préstamos',
  'Inversiones',
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

const CARD_WIDTH = 164;
const CARD_GAP = 12;
const CARD_SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

export function HomeScreen() {
  const {user} = useAuth();
  const {colors} = useTheme();
  const styles = useStyles(colors);
  const [filter, setFilter] = useState<string>('Todos');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const iconColor = colors.primary;
  const {data, isLoading, error, retry} = useHomeViewModel();
  const scaleAnims = useRef<Animated.Value[]>([]).current;

  type ProductItem = {key: string; node: React.ReactNode};

  const productItems = useMemo((): ProductItem[] => {
    if (!data) {
      return [];
    }

    const showAccounts = filter === 'Todos' || filter === 'Cuentas';
    const showCards = filter === 'Todos' || filter === 'Tarjetas';
    const showLoans = filter === 'Todos' || filter === 'Préstamos';
    const showInvestments = filter === 'Todos' || filter === 'Inversiones';

    const items: ProductItem[] = [];

    if (showAccounts) {
      for (const acc of data.accounts) {
        const k = `acc-${acc.accountGuid}`;
        if (acc.accountKind === 'checking') {
          items.push({
            key: k,
            node: (
              <CheckingAccountCard
                key={k}
                style={styles.productCard}
                maskedAccountNumber={acc.maskedAccountNumber}
                balance={acc.balance}
              />
            ),
          });
        } else {
          items.push({
            key: k,
            node: (
              <SavingsAccountCard
                key={k}
                style={styles.productCard}
                title={accountTitle(acc.accountKind)}
                maskedAccountNumber={acc.maskedAccountNumber}
                balance={acc.balance}
              />
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

    return items;
  }, [data, filter, styles.productCard]);

  // Ensure one Animated.Value per card, resetting when list changes.
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

  const frequentPayments = data?.frequentPayments ?? [];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <HomeHeader userName={user?.name} />
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <HomeAlertBanner
          title="Nueva tarjeta en camino"
          subtitle="Llegará el 24 de Octubre"
        />

        <View style={styles.section}>
          <HomeSectionTitle>Mis Productos</HomeSectionTitle>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}>
            {PRODUCT_FILTERS.map(label => (
              <FilterChip
                key={label}
                label={label}
                selected={filter === label}
                onPress={() => setFilter(label)}
              />
            ))}
          </ScrollView>

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
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : productItems.length > 0 ? (
            <ScrollView
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
                    {transform: [{scale: scaleAnims[i] ?? new Animated.Value(1)}]},
                  ]}>
                  {item.node}
                </Animated.View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.emptyProducts}>
              No hay productos en esta categoría.
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <HomeSectionTitle>Pagos frecuentes</HomeSectionTitle>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.paymentsRow}>
            {frequentPayments.length > 0 ? (
              frequentPayments.map((fp, i) => (
                <FrequentPaymentCard
                  key={`${fp.beneficiaryName}-${i}`}
                  label={fp.beneficiaryName}
                  icon={iconForFrequentPayment(fp.beneficiaryType, iconColor)}
                />
              ))
            ) : (
              <Text style={styles.emptyProducts}>
                No hay pagos frecuentes registrados.
              </Text>
            )}
          </ScrollView>
        </View>
      </ScrollView>
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
        headerSafe: {
          backgroundColor: colors.surface,
        },
        scroll: {
          flex: 1,
        },
        scrollContent: {
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 32,
          gap: 24,
        },
        section: {
          gap: 16,
        },
        chipsRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingRight: 8,
        },
        carouselRow: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
          paddingRight: 24,
          gap: CARD_GAP,
        },
        carouselItem: {
          width: CARD_WIDTH,
          height: 160,
        },
        productCard: {
          width: CARD_WIDTH,
          height: 160,
        },
        paymentsRow: {
          flexDirection: 'row',
          gap: 12,
          paddingRight: 8,
        },
        loadingBox: {
          paddingVertical: 24,
          alignItems: 'center',
        },
        inlineMessage: {
          gap: 8,
          marginBottom: 4,
        },
        errorText: {
          color: colors.error,
          fontSize: 13,
        },
        retryText: {
          color: colors.primary,
          fontSize: 14,
          fontWeight: '600',
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
