import React, {useMemo} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTransactionsViewModel} from './useTransactionsViewModel';
import {useAuth} from '../../providers';
import {useTheme, type ThemeColors} from '../../providers/theme';
import {TransactionItem, formatCurrency} from './TransactionItem';
import {Button, LoadingState, EmptyState, ErrorMessage} from '../components';

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
      return <LoadingState message="Cargando transacciones..." />;
    }

    if (error) {
      return (
        <View style={styles.errorBlock}>
          <ErrorMessage message={error} />
          <Button title="Reintentar" onPress={retry} style={styles.retryButton} />
        </View>
      );
    }

    return <EmptyState message="No hay transacciones" />;
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
        renderItem={({item}) => <TransactionItem item={item} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
        errorBlock: {
          alignItems: 'center',
          paddingVertical: 48,
          gap: 12,
        },
        retryButton: {
          marginTop: 4,
        },
      }),
    [colors],
  );
}
