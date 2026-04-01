import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {useTheme, type ThemeColors} from '../../../providers/theme';
import {Lexend} from '../../../theme/lexend';
import {formatCurrency} from '../../transactions/TransactionItem';
import {
  HOME_CARD_DARK,
  HOME_INFO_BLUE,
  HOME_INFO_BORDER,
  HOME_PRIMARY_LAYER,
} from '../homeConstants';

function formatShortDueDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '—';
  }
  return `hasta ${d.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
  })}`;
}

function formatInstallmentDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '—';
  }
  return d.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function ShareIcon({color, size = 16}: {color: string; size?: number}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"
      />
    </Svg>
  );
}

function EyeIcon({color, size = 16}: {color: string; size?: number}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
      />
    </Svg>
  );
}

function EyeSlashIcon({color, size = 16}: {color: string; size?: number}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-2.76-2.24-5-5-5l-.17.01z"
      />
    </Svg>
  );
}

type SavingsCardProps = {
  style?: StyleProp<ViewStyle>;
  title?: string;
  maskedAccountNumber: string;
  balance: number;
};

export function SavingsAccountCard({
  style,
  title = 'Cta. ahorros',
  maskedAccountNumber,
  balance,
}: SavingsCardProps) {
  const {colors} = useTheme();
  const styles = useSavingsStyles(colors);
  const [masked, setMasked] = useState(true);

  return (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{maskedAccountNumber}</Text>
        </View>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Compartir">
          <ShareIcon color={colors.white} />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.balanceLabel}>Saldo</Text>
          <Text style={styles.balanceValue}>
            {masked ? '$**.**' : formatCurrency(balance)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.eyeBtn}
          onPress={() => setMasked(m => !m)}
          accessibilityRole="button"
          accessibilityLabel={masked ? 'Mostrar saldo' : 'Ocultar saldo'}>
          {masked ? (
            <EyeSlashIcon color={colors.primary} />
          ) : (
            <EyeIcon color={colors.primary} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function useSavingsStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          width: 148,
          padding: 12,
          borderRadius: 8,
          backgroundColor: colors.primary,
          borderWidth: 1,
          borderColor: colors.primary,
        },
        topRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        },
        title: {
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          lineHeight: 22,
          color: colors.white,
        },
        subtitle: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.white,
          opacity: 0.95,
        },
        bottomRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginTop: 24,
        },
        balanceLabel: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.white,
        },
        balanceValue: {
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          lineHeight: 22,
          color: colors.white,
        },
        eyeBtn: {
          backgroundColor: HOME_PRIMARY_LAYER,
          borderRadius: 4,
          padding: 4,
        },
      }),
    [colors],
  );
}

type CheckingCardProps = {
  style?: StyleProp<ViewStyle>;
  title?: string;
  maskedAccountNumber: string;
  balance: number;
};

export function CheckingAccountCard({
  style,
  title = 'Cta. corriente',
  maskedAccountNumber,
  balance,
}: CheckingCardProps) {
  const {colors} = useTheme();
  const styles = useCheckingStyles(colors);
  const [visible, setVisible] = useState(true);

  return (
    <View style={[styles.card, style]} accessibilityLabel={title}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{maskedAccountNumber}</Text>
        </View>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Compartir">
          <ShareIcon color={colors.white} size={13} />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.balanceLabel}>Saldo</Text>
          <Text style={styles.balanceValue}>
            {visible ? formatCurrency(balance) : '$**.**'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.eyeBtn}
          onPress={() => setVisible(v => !v)}
          accessibilityRole="button">
          {visible ? (
            <EyeIcon color={colors.primary} size={13} />
          ) : (
            <EyeSlashIcon color={colors.primary} size={13} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function useCheckingStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          width: 122,
          padding: 10,
          borderRadius: 7,
          backgroundColor: HOME_INFO_BLUE,
          borderWidth: 0.8,
          borderColor: HOME_INFO_BORDER,
          opacity: 0.92,
        },
        topRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        },
        title: {
          fontFamily: Lexend.semiBold,
          fontSize: 11.5,
          lineHeight: 18,
          color: colors.white,
        },
        subtitle: {
          fontFamily: Lexend.regular,
          fontSize: 9.9,
          lineHeight: 16,
          color: colors.white,
          opacity: 0.95,
        },
        bottomRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginTop: 12,
        },
        balanceLabel: {
          fontFamily: Lexend.regular,
          fontSize: 9.9,
          lineHeight: 16,
          color: colors.white,
        },
        balanceValue: {
          fontFamily: Lexend.semiBold,
          fontSize: 11.5,
          lineHeight: 18,
          color: colors.white,
        },
        eyeBtn: {
          backgroundColor: HOME_PRIMARY_LAYER,
          borderRadius: 3,
          padding: 3,
        },
      }),
    [colors],
  );
}

type CreditCardPreviewProps = {
  style?: StyleProp<ViewStyle>;
  maskedCardNumber: string;
  totalDue: number;
  maxPaymentDate: string;
};

export function CreditCardPreview({
  style,
  maskedCardNumber,
  totalDue,
  maxPaymentDate,
}: CreditCardPreviewProps) {
  const {colors} = useTheme();
  const styles = useCreditStyles(colors);

  return (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.title}>Tarjeta</Text>
          <Text style={styles.subtitle}>{maskedCardNumber}</Text>
        </View>
        <View style={styles.chipPill}>
          <View style={styles.chipDot} />
          <View style={[styles.chipDot, styles.chipDotMuted]} />
        </View>
      </View>
      <View style={styles.bottomRow}>
        <View>
          <View style={styles.payRow}>
            <Text style={styles.mutedLabel}>Total a pagar</Text>
            <View style={styles.datePill}>
              <Text style={styles.dateText}>
                {formatShortDueDate(maxPaymentDate)}
              </Text>
            </View>
          </View>
          <Text style={styles.amount}>{formatCurrency(totalDue)}</Text>
        </View>
        <TouchableOpacity style={styles.eyeBtn} accessibilityRole="button">
          <EyeIcon color={colors.primary} size={13} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function useCreditStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          width: 184,
          padding: 10,
          borderRadius: 7,
          backgroundColor: HOME_CARD_DARK,
          borderWidth: 0.8,
          borderColor: colors.textTertiary,
          opacity: 0.92,
        },
        topRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        },
        title: {
          fontFamily: Lexend.semiBold,
          fontSize: 11.7,
          lineHeight: 18,
          color: colors.white,
        },
        subtitle: {
          fontFamily: Lexend.regular,
          fontSize: 10,
          lineHeight: 17,
          color: colors.white,
          opacity: 0.9,
        },
        chipPill: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: 3,
          borderWidth: 0.4,
          borderColor: 'rgba(255,255,255,0.05)',
          paddingHorizontal: 6,
          paddingVertical: 2,
          gap: 4,
        },
        chipDot: {
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: 'rgba(255,255,255,0.2)',
        },
        chipDotMuted: {
          backgroundColor: 'rgba(255,255,255,0.1)',
        },
        bottomRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginTop: 16,
        },
        payRow: {
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 6,
        },
        mutedLabel: {
          fontFamily: Lexend.regular,
          fontSize: 10,
          lineHeight: 17,
          color: colors.white,
        },
        datePill: {
          borderWidth: 0.8,
          borderColor: colors.textTertiary,
          borderRadius: 3,
          paddingHorizontal: 3,
        },
        dateText: {
          fontFamily: Lexend.regular,
          fontSize: 8.4,
          color: colors.white,
        },
        amount: {
          fontFamily: Lexend.semiBold,
          fontSize: 11.7,
          lineHeight: 18,
          color: colors.white,
          marginTop: 4,
        },
        eyeBtn: {
          backgroundColor: HOME_PRIMARY_LAYER,
          borderRadius: 3,
          padding: 3,
        },
      }),
    [colors],
  );
}

type LoanCardProps = {
  style?: StyleProp<ViewStyle>;
  outstandingBalance: number;
  nextInstallmentAmount: number;
  nextInstallmentDate: string;
};

export function LoanCard({
  style,
  outstandingBalance,
  nextInstallmentAmount,
  nextInstallmentDate,
}: LoanCardProps) {
  const {colors} = useTheme();
  const styles = useLoanStyles(colors);

  return (
    <View style={[styles.card, style]} accessibilityLabel="Préstamo">
      <Text style={styles.title}>Préstamo</Text>
      <Text style={styles.label}>Saldo pendiente</Text>
      <Text style={styles.amount}>{formatCurrency(outstandingBalance)}</Text>
      <Text style={styles.label}>Próxima cuota</Text>
      <Text style={styles.subAmount}>{formatCurrency(nextInstallmentAmount)}</Text>
      <Text style={styles.date}>{formatInstallmentDate(nextInstallmentDate)}</Text>
    </View>
  );
}

function useLoanStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          width: 160,
          padding: 10,
          borderRadius: 7,
          backgroundColor: HOME_INFO_BLUE,
          borderWidth: 0.8,
          borderColor: HOME_INFO_BORDER,
          opacity: 0.95,
        },
        title: {
          fontFamily: Lexend.semiBold,
          fontSize: 12,
          lineHeight: 18,
          color: colors.white,
          marginBottom: 8,
        },
        label: {
          fontFamily: Lexend.regular,
          fontSize: 9,
          lineHeight: 14,
          color: colors.white,
          opacity: 0.9,
        },
        amount: {
          fontFamily: Lexend.semiBold,
          fontSize: 13,
          lineHeight: 18,
          color: colors.white,
          marginBottom: 8,
        },
        subAmount: {
          fontFamily: Lexend.semiBold,
          fontSize: 11,
          lineHeight: 16,
          color: colors.white,
          marginTop: 2,
        },
        date: {
          fontFamily: Lexend.regular,
          fontSize: 9,
          lineHeight: 14,
          color: colors.white,
          opacity: 0.85,
          marginTop: 4,
        },
      }),
    [colors],
  );
}

type InvestmentCardProps = {
  style?: StyleProp<ViewStyle>;
  productName: string;
  currentValue: number;
  currency: string;
};

export function InvestmentCard({
  style,
  productName,
  currentValue,
  currency,
}: InvestmentCardProps) {
  const {colors} = useTheme();
  const styles = useInvestmentStyles(colors);

  return (
    <View style={[styles.card, style]} accessibilityLabel="Inversión">
      <Text style={styles.title} numberOfLines={2}>
        {productName}
      </Text>
      <Text style={styles.label}>Valor actual</Text>
      <Text style={styles.amount}>
        {formatCurrency(currentValue)} {currency}
      </Text>
    </View>
  );
}

function useInvestmentStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          width: 148,
          padding: 10,
          borderRadius: 7,
          backgroundColor: HOME_CARD_DARK,
          borderWidth: 0.8,
          borderColor: colors.textTertiary,
          opacity: 0.92,
        },
        title: {
          fontFamily: Lexend.semiBold,
          fontSize: 11,
          lineHeight: 16,
          color: colors.white,
          marginBottom: 10,
          minHeight: 32,
        },
        label: {
          fontFamily: Lexend.regular,
          fontSize: 9,
          lineHeight: 14,
          color: colors.white,
          opacity: 0.85,
        },
        amount: {
          fontFamily: Lexend.semiBold,
          fontSize: 12,
          lineHeight: 18,
          color: colors.white,
          marginTop: 4,
        },
      }),
    [colors],
  );
}
