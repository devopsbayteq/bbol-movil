import React, {useMemo, useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../../providers';
import {useTheme, type ThemeColors} from '../../providers/theme';
import {HomeHeader} from './components/HomeHeader';
import {HomeAlertBanner} from './components/HomeAlertBanner';
import {HomeSectionTitle} from './components/HomeSectionTitle';
import {FilterChip} from './components/FilterChip';
import {
  SavingsAccountCard,
  CheckingAccountCard,
  CreditCardPreview,
} from './components/ProductCarouselCards';
import {FrequentPaymentCard} from './components/FrequentPaymentCard';
import {
  PaymentLightbulbIcon,
  PaymentPersonIcon,
  PaymentSchoolIcon,
} from './components/PaymentRowIcons';

const PRODUCT_FILTERS = [
  'Todos',
  'Cuentas',
  'Tarjetas',
  'Préstamos',
  'Inversiones',
] as const;

const FREQUENT_PAYMENTS: {label: string; key: 'person' | 'light' | 'school'}[] =
  [
    {label: 'Andrea Briceño', key: 'person'},
    {label: 'Pago luz', key: 'light'},
    {label: 'Jeanet Odoñez', key: 'person'},
    {label: 'Matrícula ene 2026', key: 'school'},
  ];

export function HomeScreen() {
  const {user} = useAuth();
  const {colors} = useTheme();
  const styles = useStyles(colors);
  const [filter, setFilter] = useState<string>('Todos');
  const iconColor = colors.primary;

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

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselRow}>
            <SavingsAccountCard style={styles.productCard} />
            <CheckingAccountCard
              style={[styles.productCard, styles.productCardMiddle]}
            />
            <CreditCardPreview style={styles.productCard} />
          </ScrollView>
        </View>

        <View style={styles.section}>
          <HomeSectionTitle>Pagos frecuentes</HomeSectionTitle>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.paymentsRow}>
            {FREQUENT_PAYMENTS.map(item => (
              <FrequentPaymentCard
                key={item.label}
                label={item.label}
                icon={
                  item.key === 'light' ? (
                    <PaymentLightbulbIcon color={iconColor} />
                  ) : item.key === 'school' ? (
                    <PaymentSchoolIcon color={iconColor} />
                  ) : (
                    <PaymentPersonIcon color={iconColor} />
                  )
                }
              />
            ))}
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
      }),
    [colors],
  );
}
