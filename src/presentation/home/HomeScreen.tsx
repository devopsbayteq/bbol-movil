import React, {useMemo, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
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

export function HomeScreen() {
  const {user} = useAuth();
  const {colors} = useTheme();
  const styles = useStyles(colors);
  const [filter, setFilter] = useState<string>('Todos');
  const iconColor = colors.primary;
  const {data, isLoading, error, retry} = useHomeViewModel();

  const productNodes = useMemo(() => {
    if (!data) {
      return [];
    }

    const showAccounts = filter === 'Todos' || filter === 'Cuentas';
    const showCards = filter === 'Todos' || filter === 'Tarjetas';
    const showLoans = filter === 'Todos' || filter === 'Préstamos';
    const showInvestments = filter === 'Todos' || filter === 'Inversiones';

    const nodes: React.ReactNode[] = [];
    let index = 0;

    if (showAccounts) {
      for (const acc of data.accounts) {
        const middle = index % 3 === 1;
        const cardStyle = [styles.productCard, middle && styles.productCardMiddle];
        if (acc.accountKind === 'checking') {
          nodes.push(
            <CheckingAccountCard
              key={`acc-${acc.accountGuid}`}
              style={cardStyle}
              maskedAccountNumber={acc.maskedAccountNumber}
              balance={acc.balance}
            />,
          );
        } else {
          nodes.push(
            <SavingsAccountCard
              key={`acc-${acc.accountGuid}`}
              style={cardStyle}
              title={accountTitle(acc.accountKind)}
              maskedAccountNumber={acc.maskedAccountNumber}
              balance={acc.balance}
            />,
          );
        }
        index += 1;
      }
    }

    if (showCards) {
      for (const card of data.creditCards) {
        const middle = index % 3 === 1;
        nodes.push(
          <CreditCardPreview
            key={`cc-${card.maskedCardNumber}-${card.maxPaymentDate}`}
            style={[styles.productCard, middle && styles.productCardMiddle]}
            maskedCardNumber={card.maskedCardNumber}
            totalDue={card.totalDue}
            maxPaymentDate={card.maxPaymentDate}
          />,
        );
        index += 1;
      }
    }

    if (showLoans) {
      for (const loan of data.loans) {
        const middle = index % 3 === 1;
        nodes.push(
          <LoanCard
            key={`loan-${loan.loanGuid}`}
            style={[styles.productCard, middle && styles.productCardMiddle]}
            outstandingBalance={loan.outstandingBalance}
            nextInstallmentAmount={loan.nextInstallmentAmount}
            nextInstallmentDate={loan.nextInstallmentDate}
          />,
        );
        index += 1;
      }
    }

    if (showInvestments) {
      for (const inv of data.investments) {
        const middle = index % 3 === 1;
        nodes.push(
          <InvestmentCard
            key={`inv-${inv.investmentGuid}`}
            style={[styles.productCard, middle && styles.productCardMiddle]}
            productName={inv.productName}
            currentValue={inv.currentValue}
            currency={inv.currency}
          />,
        );
        index += 1;
      }
    }

    return nodes;
  }, [data, filter, styles.productCard, styles.productCardMiddle]);

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
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselRow}>
              {productNodes.length > 0 ? (
                productNodes
              ) : (
                <Text style={styles.emptyProducts}>
                  No hay productos en esta categoría.
                </Text>
              )}
            </ScrollView>
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
          alignItems: 'flex-start',
          gap: 12,
          paddingVertical: 4,
          paddingRight: 24,
          minHeight: 120,
        },
        productCard: {
          marginRight: 0,
        },
        productCardMiddle: {
          marginTop: 10,
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
