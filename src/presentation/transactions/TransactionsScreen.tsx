import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {useTransactionsViewModel} from './useTransactionsViewModel';
import {Transaction, TransactionCategory} from '../../domain/entities/Transaction';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Transactions'>;
  route: RouteProp<RootStackParamList, 'Transactions'>;
};

const CATEGORY_CONFIG: Record<TransactionCategory, {icon: string; label: string}> = {
  salary: {icon: '💰', label: 'Salario'},
  food: {icon: '🍔', label: 'Comida'},
  transport: {icon: '🚗', label: 'Transporte'},
  entertainment: {icon: '🎬', label: 'Entretenimiento'},
  shopping: {icon: '🛒', label: 'Compras'},
  transfer: {icon: '🔄', label: 'Transferencia'},
  services: {icon: '⚡', label: 'Servicios'},
  health: {icon: '🏥', label: 'Salud'},
};

const STATUS_CONFIG: Record<string, {label: string; color: string; bg: string}> = {
  completed: {label: 'Completada', color: '#059669', bg: '#ECFDF5'},
  pending: {label: 'Pendiente', color: '#D97706', bg: '#FFFBEB'},
  cancelled: {label: 'Cancelada', color: '#DC2626', bg: '#FEF2F2'},
};

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-MX', {day: 'numeric', month: 'short'});
}

function TransactionItem({item}: {item: Transaction}) {
  const category = CATEGORY_CONFIG[item.category];
  const status = STATUS_CONFIG[item.status];
  const isIncome = item.type === 'income';

  return (
    <View style={itemStyles.container}>
      <View style={itemStyles.iconContainer}>
        <Text style={itemStyles.icon}>{category.icon}</Text>
      </View>

      <View style={itemStyles.content}>
        <Text style={itemStyles.description} numberOfLines={1}>
          {item.description}
        </Text>
        <View style={itemStyles.meta}>
          <Text style={itemStyles.date}>{formatDate(item.date)}</Text>
          <View style={[itemStyles.badge, {backgroundColor: status.bg}]}>
            <Text style={[itemStyles.badgeText, {color: status.color}]}>
              {status.label}
            </Text>
          </View>
        </View>
      </View>

      <Text
        style={[
          itemStyles.amount,
          {color: isIncome ? '#059669' : '#DC2626'},
        ]}>
        {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
      </Text>
    </View>
  );
}

export function TransactionsScreen({navigation, route}: Props) {
  const {userName, userEmail} = route.params;
  const insets = useSafeAreaInsets();
  const {transactions, isLoading, error, balance, income, expenses, retry} =
    useTransactionsViewModel();

  const handleLogout = () => {
    navigation.replace('Login');
  };

  const renderHeader = () => (
    <View>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo disponible</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
        <View style={styles.balanceRow}>
          <View style={styles.balanceStat}>
            <Text style={styles.balanceStatLabel}>Ingresos</Text>
            <Text style={[styles.balanceStatValue, {color: '#059669'}]}>
              +{formatCurrency(income)}
            </Text>
          </View>
          <View style={styles.balanceDivider} />
          <View style={styles.balanceStat}>
            <Text style={styles.balanceStatLabel}>Gastos</Text>
            <Text style={[styles.balanceStatValue, {color: '#DC2626'}]}>
              -{formatCurrency(expenses)}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Movimientos recientes</Text>
    </View>
  );

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Cargando transacciones...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={retry}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No hay transacciones</Text>
      </View>
    );
  };

  return (
    <View style={[styles.root, {paddingTop: insets.top}]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, {userName}</Text>
          <Text style={styles.email}>{userEmail}</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({item}) => <TransactionItem item={item} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const itemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
  },
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  email: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  balanceCard: {
    backgroundColor: '#4F46E5',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#C7D2FE',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceStat: {
    flex: 1,
  },
  balanceStatLabel: {
    fontSize: 12,
    color: '#C7D2FE',
    marginBottom: 2,
  },
  balanceStatValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  balanceDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },
  centered: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
