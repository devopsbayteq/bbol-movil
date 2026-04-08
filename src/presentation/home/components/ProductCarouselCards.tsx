import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Path} from 'react-native-svg';
import {useTheme, type ThemeColors} from '../../../providers/theme';
import {Lexend} from '../../../theme/lexend';
import {formatCurrency} from '../../transactions/TransactionItem';

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

/** Máscara tipo Figma (`137*****`) determinista por guid. */
function formatLoanMaskedLine(loanGuid: string): string {
  let h = 0;
  for (let i = 0; i < loanGuid.length; i += 1) {
    h = (h * 31 + loanGuid.charCodeAt(i)) % 2147483647;
  }
  const n = 100 + (Math.abs(h) % 900);
  return `${String(n).padStart(3, '0').slice(0, 3)}*****`;
}

/** Máscara tipo Figma (`**** *678`) determinista por guid. */
function formatInvestmentMaskedLine(investmentGuid: string): string {
  let h = 0;
  for (let i = 0; i < investmentGuid.length; i += 1) {
    h = (h * 31 + investmentGuid.charCodeAt(i)) % 2147483647;
  }
  const n = 100 + (Math.abs(h) % 900);
  return `**** *${n}`;
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
  title,
  maskedAccountNumber,
  balance,
}: SavingsCardProps) {
  const {colors} = useTheme();
  const styles = useSavingsStyles(colors);
  const [masked, setMasked] = useState(true);
  const iconTint = colors.primary;

  return (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        <View style={styles.titleCol}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{maskedAccountNumber}</Text>
        </View>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Compartir">
          <ShareIcon color={colors.textSecondary} size={18} />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.balanceCol}>
          <Text style={styles.balanceValue} numberOfLines={1}>
            {masked ? '$**.**' : formatCurrency(balance)}
          </Text>
          <Text style={styles.balanceLabel}>Saldo</Text>
        </View>
        <TouchableOpacity
          style={styles.eyeBtn}
          onPress={() => setMasked(m => !m)}
          accessibilityRole="button"
          accessibilityLabel={masked ? 'Mostrar saldo' : 'Ocultar saldo'}>
          {masked ? (
            <EyeSlashIcon color={iconTint} size={18} />
          ) : (
            <EyeIcon color={iconTint} size={18} />
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
          flex: 1,
          padding: 12,
          borderRadius: 8,
          backgroundColor: colors.homeProductCardSurface,
          borderWidth: 1,
          borderColor: colors.homeProductCardBorder,
          ...Platform.select({
            ios: {
              shadowColor: colors.shadowSoft,
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.08,
              shadowRadius: 8,
            },
            android: {
              elevation: 12,

            },
          }),

        },
        topRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        },
        titleCol: {
          flex: 1,
          minWidth: 0,
          paddingRight: 8,
        },
        title: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          lineHeight: 22,
          color: colors.primary,
        },
        subtitle: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textSecondary,
          marginTop: 2,
        },
        bottomRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginTop: 8,
        },
        balanceCol: {
          flex: 1,
          minWidth: 0,
        },
        balanceLabel: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          lineHeight: 16,
          color: colors.primary,
          marginTop: 2,
        },
        balanceValue: {
          fontFamily: Lexend.semiBold,
          fontSize: 22,
          lineHeight: 28,
          color: colors.textPrimary,
        },
        eyeBtn: {
          backgroundColor: colors.homeBalanceToggleBg,
          borderRadius: 4,
          padding: 6,
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
  return (
    <SavingsAccountCard
      style={style}
      title={title}
      maskedAccountNumber={maskedAccountNumber}
      balance={balance}
    />
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
  const [masked, setMasked] = useState(true);

  return (
    <View style={[styles.cardOuter, style]} accessibilityLabel="Tarjeta de crédito">
      <LinearGradient
        colors={[
          colors.homeCreditCardGradientTop,
          colors.homeCreditCardGradientBottom,
        ]}
        style={styles.cardGradientFill}
      />
      <View style={styles.cardInner} pointerEvents="box-none">
        <View style={styles.cardTop}>
          <View style={styles.headerRow}>
            <Text style={styles.cardTitle}>Tarjeta</Text>
            <View style={styles.mastercardBadge}>
              <View style={[styles.mcDot, styles.mcDotBack]} />
              <View style={[styles.mcDot, styles.mcDotFront]} />
            </View>
          </View>
          <Text style={styles.cardNumber}>{maskedCardNumber}</Text>
        </View>

        <View style={styles.cardBottom}>
          <View style={styles.balanceTextCol}>
            <View style={styles.amountAndDateRow}>
              <Text style={styles.amountMain} numberOfLines={1}>
                {masked ? '$**.**' : formatCurrency(totalDue)}
              </Text>
              <View style={styles.datePill}>
                <Text style={styles.datePillText}>
                  {formatShortDueDate(maxPaymentDate)}
                </Text>
              </View>
            </View>
            <Text style={styles.totalLabel}>Total a pagar</Text>
          </View>
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setMasked(m => !m)}
            accessibilityRole="button"
            accessibilityLabel={masked ? 'Mostrar total' : 'Ocultar total'}>
            {masked ? (
              <EyeSlashIcon color={colors.white} size={16} />
            ) : (
              <EyeIcon color={colors.white} size={16} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function useCreditStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        cardOuter: {
          flex: 1,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.homeCreditCardBorder,
          overflow: 'hidden',
          ...Platform.select({
            ios: {
              shadowColor: colors.shadowSoft,
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.08,
              shadowRadius: 8,
            },
            android: {
              elevation: 12,
            },
          }),
        },
        cardGradientFill: {
          ...StyleSheet.absoluteFillObject,
        },
        cardInner: {
          flex: 1,
          padding: 12,
          justifyContent: 'space-between',
        },
        cardTop: {
          gap: 0,
        },
        headerRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        cardTitle: {
          fontFamily: Lexend.semiBold,
          fontSize: 12,
          lineHeight: 20,
          color: colors.white,
        },
        mastercardBadge: {
          flexDirection: 'row',
          alignItems: 'center',
          height: 18,
          paddingLeft: 2,
          paddingRight: 8,
          paddingVertical: 2,
          borderRadius: 3,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: 'rgba(255,255,255,0.05)',
          backgroundColor: 'rgba(255,255,255,0.1)',
        },
        mcDot: {
          width: 10,
          height: 10,
          borderRadius: 5,
        },
        mcDotBack: {
          backgroundColor: 'rgba(255,255,255,0.2)',
        },
        mcDotFront: {
          marginLeft: -5,
          backgroundColor: 'rgba(255,255,255,0.1)',
        },
        cardNumber: {
          marginTop: 4,
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.white,
        },
        cardBottom: {
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: 10,
        },
        balanceTextCol: {
          flex: 1,
          minWidth: 0,
        },
        amountAndDateRow: {
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 4,
        },
        amountMain: {
          fontFamily: Lexend.semiBold,
          fontSize: 16,
          lineHeight: 24,
          color: colors.white,
        },
        datePill: {
          borderWidth: 1,
          borderColor: colors.textTertiary,
          borderRadius: 3,
          paddingHorizontal: 3,
          paddingVertical: 1,
        },
        datePillText: {
          fontFamily: Lexend.regular,
          fontSize: 9,
          lineHeight: 16,
          color: colors.white,
        },
        totalLabel: {
          marginTop: 0,
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.white,
        },
        eyeBtn: {
          backgroundColor: colors.textTertiary,
          borderRadius: 4,
          padding: 4,
        },
      }),
    [colors],
  );
}

type LoanCardProps = {
  style?: StyleProp<ViewStyle>;
  loanGuid: string;
  nextInstallmentAmount: number;
  nextInstallmentDate: string;
};

export function LoanCard({
  style,
  loanGuid,
  nextInstallmentAmount,
  nextInstallmentDate,
}: LoanCardProps) {
  const {colors} = useTheme();
  const styles = useLoanStyles(colors);
  const [masked, setMasked] = useState(true);

  const maskedLine = useMemo(
    () => formatLoanMaskedLine(loanGuid),
    [loanGuid],
  );

  return (
    <View style={[styles.cardOuter, style]} accessibilityLabel="Préstamo">
      <LinearGradient
        colors={[
          colors.homeLoanCardGradientStart,
          colors.homeLoanCardGradientEnd,
        ]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.cardGradientFill}
      />
      <View style={styles.cardInner} pointerEvents="box-none">
        <View>
          <Text style={styles.productTitle}>Préstamo</Text>
          <Text style={styles.maskedAccount}>{maskedLine}</Text>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.balanceCol}>
            <View style={styles.amountRow}>
              <Text style={styles.amountValue} numberOfLines={1}>
                {masked ? '$**.**' : formatCurrency(nextInstallmentAmount)}
              </Text>
              <View style={styles.datePill}>
                <Text style={styles.datePillText}>
                  {formatShortDueDate(nextInstallmentDate)}
                </Text>
              </View>
            </View>
            <Text style={styles.cuotaLabel}>Cuota</Text>
          </View>
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setMasked(m => !m)}
            accessibilityRole="button"
            accessibilityLabel={masked ? 'Mostrar cuota' : 'Ocultar cuota'}>
            {masked ? (
              <EyeSlashIcon color={colors.primary} size={16} />
            ) : (
              <EyeIcon color={colors.primary} size={16} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function useLoanStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        cardOuter: {
          flex: 1,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.homeLoanCarouselBorder,
          overflow: 'hidden',
          ...Platform.select({
            ios: {
              shadowColor: colors.shadowSoft,
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.08,
              shadowRadius: 8,
            },
            android: {
              elevation: 12,
            },
          }),
        },
        cardGradientFill: {
          ...StyleSheet.absoluteFillObject,
        },
        cardInner: {
          flex: 1,
          padding: 12,
          justifyContent: 'space-between',
        },
        productTitle: {
          fontFamily: Lexend.semiBold,
          fontSize: 12,
          lineHeight: 20,
          color: colors.homeAvatarCircle,
        },
        maskedAccount: {
          marginTop: 4,
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.white,
        },
        bottomRow: {
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: 10,
        },
        balanceCol: {
          flex: 1,
          minWidth: 0,
        },
        amountRow: {
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 4,
        },
        amountValue: {
          fontFamily: Lexend.semiBold,
          fontSize: 16,
          lineHeight: 24,
          color: colors.white,
        },
        datePill: {
          borderWidth: 1,
          borderColor: colors.homeAvatarCircle,
          borderRadius: 3,
          paddingHorizontal: 3,
          paddingVertical: 1,
        },
        datePillText: {
          fontFamily: Lexend.regular,
          fontSize: 9,
          lineHeight: 16,
          color: colors.white,
        },
        cuotaLabel: {
          marginTop: 0,
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.homeAvatarCircle,
        },
        eyeBtn: {
          backgroundColor: colors.homeAvatarCircle,
          borderRadius: 4,
          padding: 4,
        },
      }),
    [colors],
  );
}

type InvestmentCardProps = {
  style?: StyleProp<ViewStyle>;
  investmentGuid: string;
  productName: string;
  currentValue: number;
  currency: string;
};

export function InvestmentCard({
  style,
  investmentGuid,
  productName,
  currentValue,
  currency,
}: InvestmentCardProps) {
  const {colors} = useTheme();
  const styles = useInvestmentStyles(colors);
  const [masked, setMasked] = useState(true);

 

  return (
    <View style={[styles.cardOuter, style]} accessibilityLabel="Inversión">
      <LinearGradient
        colors={[
          colors.homeInvestmentCardGradientStart,
          colors.homeInvestmentCardGradientEnd,
        ]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.cardGradientFill}
      />
      <View style={styles.cardInner} pointerEvents="box-none">
        <View style={styles.topBlock}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {productName}
          </Text>
          <Text style={styles.maskedAccount}>{investmentGuid}</Text>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.balanceCol}>
            <Text style={styles.amountValue} numberOfLines={1}>
              {masked
                ? '$**.**'
                : `${formatCurrency(currentValue)} ${currency}`}
            </Text>
            <Text style={styles.saldoLabel}>Saldo</Text>
          </View>
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setMasked(m => !m)}
            accessibilityRole="button"
            accessibilityLabel={masked ? 'Mostrar valor' : 'Ocultar valor'}>
            {masked ? (
              <EyeSlashIcon color={colors.primary} size={16} />
            ) : (
              <EyeIcon color={colors.primary} size={16} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function useInvestmentStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        cardOuter: {
          flex: 1,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.homeInvestmentCardBorder,
          overflow: 'hidden',
          ...Platform.select({
            ios: {
              shadowColor: colors.shadowSoft,
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.08,
              shadowRadius: 8,
            },
            android: {
              elevation: 12,
            },
          }),
        },
        cardGradientFill: {
          ...StyleSheet.absoluteFillObject,
        },
        cardInner: {
          flex: 1,
          padding: 12,
          justifyContent: 'space-between',
        },
        topBlock: {
          gap: 0,
        },
        productTitle: {
          fontFamily: Lexend.semiBold,
          fontSize: 12,
          lineHeight: 20,
          color: colors.homeAvatarCircle,
        },
        maskedAccount: {
          marginTop: 4,
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.white,
        },
        bottomRow: {
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: 10,
        },
        balanceCol: {
          flex: 1,
          minWidth: 0,
        },
        amountValue: {
          fontFamily: Lexend.semiBold,
          fontSize: 16,
          lineHeight: 24,
          color: colors.white,
        },
        saldoLabel: {
          marginTop: 0,
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.homeAvatarCircle,
        },
        eyeBtn: {
          backgroundColor: colors.nextPayCircleBg,
          borderRadius: 4,
          padding: 4,
        },
      }),
    [colors],
  );
}
