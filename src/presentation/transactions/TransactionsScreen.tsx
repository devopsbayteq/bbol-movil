import React, {useMemo} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTransactionsViewModel} from './useTransactionsViewModel';
import {useAuth} from '../../providers';
import {Transaction, TransactionCategory} from '../../domain/entities/Transaction';
import {useTheme, type ThemeColors} from '../../providers/theme';

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

function TransactionItem({item, colors}: {item: Transaction; colors: ThemeColors}) {
  const category = CATEGORY_CONFIG[item.category];
  const status = STATUS_CONFIG[item.status];
  const isIncome = item.type === 'income';
  const iStyles = useItemStyles(colors);

  return (
    <View style={iStyles.container}>
      <View style={iStyles.iconContainer}>
        <Text style={iStyles.icon}>{category.icon}</Text>
      </View>

      <View style={iStyles.content}>
        <Text style={iStyles.description} numberOfLines={1}>
          {item.description}
        </Text>
        <View style={iStyles.meta}>
          <Text style={iStyles.date}>{formatDate(item.date)}</Text>
          <View style={[iStyles.badge, {backgroundColor: status.bg}]}>
            <Text style={[iStyles.badgeText, {color: status.color}]}>
              {status.label}
            </Text>
          </View>
        </View>
      </View>

      <Text
        style={[
          iStyles.amount,
          {color: isIncome ? colors.success : colors.error},
        ]}>
        {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
      </Text>
    </View>
  );
}

export function TransactionsScreen() {
  const {user, logout} = useAuth();
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useStyles(colors);

  const {transactions, isLoading, error, balance, income, expenses, retry} =
    useTransactionsViewModel();

  const handleLogout = async () => {
    await logout();
  };

  const renderHeader = () => (
    <View>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo disponible</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
        <View style={styles.balanceRow}>
          <View style={styles.balanceStat}>
            <Text style={styles.balanceStatLabel}>Ingresos</Text>
            <Text style={[styles.balanceStatValue, {color: colors.success}]}>
              +{formatCurrency(income)}
            </Text>
          </View>
          <View style={styles.balanceDivider} />
          <View style={styles.balanceStat}>
            <Text style={styles.balanceStatLabel}>Gastos</Text>
            <Text style={[styles.balanceStatValue, {color: colors.error}]}>
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
          <ActivityIndicator size="large" color={colors.primary} />
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
          <Text style={styles.greeting}>Hola, {user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
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
        renderItem={({item}) => <TransactionItem item={item} colors={colors} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function useItemStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderRadius: 14,
          padding: 14,
          marginBottom: 10,
          borderWidth: 1,
          borderColor: colors.borderSubtle,
        },
        iconContainer: {
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: colors.borderSubtle,
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
          color: colors.textPrimary,
          marginBottom: 4,
        },
        meta: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        },
        date: {
          fontSize: 13,
          color: colors.textTertiary,
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
      }),
    [colors],
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
          color: colors.textPrimary,
        },
        email: {
          fontSize: 13,
          color: colors.textTertiary,
          marginTop: 2,
        },
        logoutButton: {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.borderLight,
          borderRadius: 10,
          paddingHorizontal: 16,
          paddingVertical: 8,
        },
        logoutText: {
          color: colors.error,
          fontSize: 14,
          fontWeight: '600',
        },
        listContent: {
          paddingHorizontal: 20,
          paddingBottom: 32,
        },
        balanceCard: {
          backgroundColor: colors.primary,
          borderRadius: 20,
          padding: 24,
          marginBottom: 24,
        },
        balanceLabel: {
          fontSize: 14,
          color: colors.primaryLight,
          marginBottom: 4,
        },
        balanceAmount: {
          fontSize: 34,
          fontWeight: '800',
          color: colors.white,
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
          color: colors.primaryLight,
          marginBottom: 2,
        },
        balanceStatValue: {
          fontSize: 16,
          fontWeight: '700',
        },
        balanceDivider: {
          width: 1,
          height: 32,
          backgroundColor: colors.balanceDivider,
          marginHorizontal: 16,
        },
        sectionTitle: {
          fontSize: 17,
          fontWeight: '700',
          color: colors.textPrimary,
          marginBottom: 14,
        },
        centered: {
          alignItems: 'center',
          paddingVertical: 48,
        },
        loadingText: {
          fontSize: 14,
          color: colors.textSecondary,
          marginTop: 12,
        },
        errorText: {
          fontSize: 14,
          color: colors.error,
          marginBottom: 12,
          textAlign: 'center',
        },
        retryButton: {
          backgroundColor: colors.primary,
          borderRadius: 10,
          paddingHorizontal: 24,
          paddingVertical: 10,
        },
        retryText: {
          color: colors.white,
          fontSize: 14,
          fontWeight: '600',
        },
        emptyText: {
          fontSize: 14,
          color: colors.textTertiary,
        },
      }),
    [colors],
  );
}
