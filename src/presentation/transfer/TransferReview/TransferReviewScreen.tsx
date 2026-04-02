import React, {useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {TransferStackParamList} from '../../../navigation/TransferStackNavigator';
import type {MainTabParamList} from '../../../navigation/MainTabNavigator';
import {useTheme, type ThemeColors} from '../../../providers';
import {Lexend} from '../../../theme/lexend';
import {ErrorMessage} from '../../components';
import {
  TransferIconArrowLeft,
  TransferIconArrowRight,
  TransferIconArrowRightWhite,
  TransferIconUser,
  TransferIconWallet,
} from '../transferIcons';
import {useTransferReviewViewModel} from './useTransferReviewViewModel';
import {ToolbarApp} from "../../components/ToolbarApp.tsx";

const HERO_ICON = '#0B515C';
const ICON_CHIP_BG = '#D0F0F6';
const LABEL_MUTED = '#3E494B';

export function TransferReviewScreen() {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useStyles(colors);

  const navigation = useNavigation<
      NativeStackNavigationProp<TransferStackParamList, 'TransferReview'>
    >();

  const onTransferSuccess = useCallback(
    (transactionIdentifier: string) => {
      Alert.alert(
        'Transferencia exitosa',
        `Identificador de transacción: ${transactionIdentifier}`,
        [
          {
            text: 'Aceptar',
            onPress: () => {
              navigation.popToTop();
              const tabNav =
                navigation.getParent<BottomTabNavigationProp<MainTabParamList>>();
              tabNav?.navigate('Home');
            },
          },
        ],
      );
    },
    [navigation],
  );

  const {
    displayAmount,
    beneficiary,
    fromHolderName,
    fromAccountLine,
    commission,
    commissionLoading,
    confirmLoading,
    confirmError,
    setConfirmError,
    paraSubline,
    conceptDisplay,
    transferDateLabel,
    onConfirm,
  } = useTransferReviewViewModel(() => {
      navigation.navigate('OtpValidationTransfer',{mode:'transfer',email:""})
  },{onTransferSuccess});

  return (
    <View style={styles.root} testID="transfer-review-screen">
      <ToolbarApp
          title={"REVISAR TRANSFERENCIA"}
          backPress={()=> {
          navigation.goBack()
      }
      }/>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: Math.max(insets.bottom, 24) + 16},
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.amountLabel}>Monto a enviar</Text>
          <Text style={styles.amountValue} numberOfLines={1}>
            {displayAmount}
          </Text>

          <View style={styles.paraRow}>
            <View style={styles.iconChip}>
              <TransferIconUser color={HERO_ICON} size={16} />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.paraLabel}>Para</Text>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {beneficiary.name}
              </Text>
              {paraSubline ? (
                <Text style={styles.cardSub} numberOfLines={2}>
                  {paraSubline}
                </Text>
              ) : null}
            </View>
            <View style={styles.cardChevronSpacer} />
          </View>

          <TouchableOpacity
            style={styles.desdeRow}
            onPress={()=>{navigation.goBack()}}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel="Volver para cambiar cuenta de origen">
            <View style={styles.iconChip}>
              <TransferIconWallet color={HERO_ICON} size={16} />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.desdeLabel}>Desde</Text>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {fromHolderName}
              </Text>
              <Text style={styles.cardSub} numberOfLines={1}>
                {fromAccountLine}
              </Text>
            </View>
            <TransferIconArrowRight color={colors.iconPrimary} size={16} />
          </TouchableOpacity>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Comisión</Text>
            {commissionLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.detailValue}>
                {commission?? '—'}
              </Text>
            )}
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fecha</Text>
            <Text style={styles.detailValue}>{transferDateLabel}</Text>
          </View>
          <View style={[styles.detailRow, styles.detailRowLast]}>
            <Text style={styles.detailLabel}>Concepto</Text>
            <Text style={[styles.detailValue, styles.conceptValue]}>
              {conceptDisplay}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          {confirmError ? (
            <ErrorMessage
              message={confirmError}
              style={styles.confirmError}
            />
          ) : null}
          <TouchableOpacity
            style={[
              styles.primaryCta,
              confirmLoading && styles.primaryCtaDisabled,
            ]}
            onPress={() => {
              setConfirmError(null);
              void onConfirm();
            }}
            disabled={confirmLoading}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="Confirmar transferencia">
            {confirmLoading ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <TransferIconArrowRightWhite color={colors.white} size={20} />
            )}
            <Text style={styles.primaryCtaText}>Confirmar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryCta}
            onPress={()=>{navigation.goBack()}}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel="Modificar transferencia">
            <Text style={styles.secondaryCtaText}>Modificar</Text>
          </TouchableOpacity>
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
        scroll: {
          flex: 1,
        },
        scrollContent: {
          paddingHorizontal: 24,
          paddingTop: 32,
          alignItems: 'center',
          gap: 24,
        },
        card: {
          width: '100%',
          maxWidth: 672,
          backgroundColor: colors.white,
          borderRadius: 12,
          padding: 12,
          gap: 12,
        },
        amountLabel: {
          fontFamily: Lexend.semiBold,
          fontSize: 12,
          lineHeight: 20,
          color: LABEL_MUTED,
        },
        amountValue: {
          fontFamily: Lexend.bold,
          fontSize: 26,
          lineHeight: 36,
          color: colors.textPrimary,
        },
        paraRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
          paddingHorizontal: 12,
          paddingVertical: 16,
          borderRadius: 12,
        },
        iconChip: {
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: ICON_CHIP_BG,
          alignItems: 'center',
          justifyContent: 'center',
        },
        cardBody: {
          flex: 1,
          minWidth: 0,
        },
        paraLabel: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textPrimary,
        },
        desdeLabel: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textTertiary,
        },
        cardTitle: {
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          lineHeight: 22,
          color: colors.textPrimary,
        },
        cardSub: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textTertiary,
          marginTop: 2,
        },
        cardChevronSpacer: {
          width: 16,
          height: 16,
        },
        desdeRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
          paddingHorizontal: 13,
          paddingVertical: 17,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
        },
        detailRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 4,
          paddingTop: 12,
          paddingBottom: 13,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.borderLight,
          gap: 12,
        },
        detailRowLast: {
          borderBottomWidth: 0,
        },
        detailLabel: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          lineHeight: 20,
          color: colors.textSecondary,
          flexShrink: 0,
        },
        detailValue: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.primary,
          textAlign: 'right',
          flex: 1,
        },
        conceptValue: {
          flexShrink: 1,
        },
        actions: {
          width: '100%',
          maxWidth: 672,
          gap: 12,
          alignItems: 'center',
        },
        confirmError: {
          alignSelf: 'stretch',
        },
        primaryCta: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          backgroundColor: colors.primary,
          borderRadius: 8,
          paddingVertical: 16,
          width: '100%',
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.08,
              shadowRadius: 4,
            },
            android: {elevation: 2},
            default: {},
          }),
        },
        primaryCtaDisabled: {
          opacity: 0.7,
        },
        primaryCtaText: {
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          lineHeight: 22,
          color: colors.white,
        },
        secondaryCta: {
          paddingVertical: 8,
          paddingHorizontal: 4,
          minWidth: 164,
          alignItems: 'center',
        },
        secondaryCtaText: {
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          lineHeight: 22,
          color: colors.primary,
        },
      }),
    [colors],
  );
}
