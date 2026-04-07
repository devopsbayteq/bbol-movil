import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  TransferIconArrowRight,
  TransferIconArrowUp,
  TransferIconUser,
  TransferIconWallet,
} from './transferIcons.tsx';
import React, {useMemo} from 'react';
import type {AccountBalance} from '../../../domain/entities/ContractBalance.ts';
import {ThemeColors, useTheme} from '../../../providers';
import {Lexend} from '../../../theme/lexend.ts';

export type AccountSelectorVariant = 'from' | 'to';

interface AccountSelectorButtonProps {
  variant: AccountSelectorVariant;
  onPress: () => void;
  accounts: AccountBalance[];
  selectedAccount: AccountBalance | null;
  origin: string;
  name: string;
  description: string;
  balanceLabel?: string;
}

export function AccountSelectorButton({
  variant,
  origin,
  name,
  description,
  balanceLabel,
  onPress,
  accounts,
  selectedAccount,
}: AccountSelectorButtonProps) {
  const {colors} = useTheme();
  const styles = useStyles(colors);

  const showDescription =
    variant === 'from' ? Boolean(selectedAccount && description) : Boolean(description);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        onPress();
      }}
      activeOpacity={accounts.length > 1 ? 0.9 : 1}
      disabled={accounts.length <= 1}>
      <View style={styles.iconChip}>
        {variant === 'from' ? (
          <TransferIconWallet color={colors.primary} size={16} />
        ) : (
          <TransferIconUser color={colors.primary} size={16} />
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardLabel}>{origin}</Text>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {name}
        </Text>
        {showDescription ? (
          <Text style={styles.cardSub} numberOfLines={1}>
            {description}
          </Text>
        ) : null}
      </View>
      {variant === 'from' ? (
        <View style={styles.trailingFrom}>
          <Text style={styles.balanceText}>{balanceLabel ?? ''}</Text>
          {accounts.length > 1 ? (
            <View style={styles.chevronRotated}>
              <TransferIconArrowUp color={colors.iconPrimary} size={16} />
            </View>
          ) : (
            <View style={styles.cardChevronSpacer} />
          )}
        </View>
      ) : (
        <View style={styles.trailingTo}>
          <Text style={styles.balanceText}>{balanceLabel ?? ''}</Text>
          {accounts.length > 1 ? (
            <TransferIconArrowRight color={colors.iconPrimary} size={16} />
          ) : (
            <View style={styles.cardChevronSpacer} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

function useStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
          backgroundColor: colors.white,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 16,
          minHeight: 74,
        },
        iconChip: {
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: colors.primaryIconContainerBg,
          alignItems: 'center',
          justifyContent: 'center',
        },
        cardBody: {
          flex: 1,
          minWidth: 0,
        },
        cardLabel: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textTertiary,
        },
        cardTitle: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          lineHeight: 22,
          color: colors.textSecondary,
        },
        cardSub: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textTertiary,
          marginTop: 2,
        },
        trailingFrom: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
        },
        balanceText: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textSecondary,
        },
        chevronRotated: {
          transform: [{rotate: '90deg'}],
        },
        trailingTo: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
        },
        cardChevronSpacer: {
          width: 16,
          height: 16,
        },
      }),
    [colors],
  );
}
