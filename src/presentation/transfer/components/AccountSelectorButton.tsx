import {Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {TransferIconArrowUp, TransferIconWallet} from "./transferIcons.tsx";
import React, {useMemo} from "react";
import {AccountBalance} from "../../../domain/entities/ContractBalance.ts";
import {ThemeColors, useTheme} from "../../../providers";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Lexend} from "../../../theme/lexend.ts";

interface AccountSelectorButtonProps {
    onPress: () => void;
    accounts: AccountBalance[];
    selectedAccount: AccountBalance;
    origin: string;
    name: string;
    description: string;


}

export const AccountSelectorButton = ({
                                          origin,
                                          name,
                                          description,
                                          onPress,
                                          accounts,
                                          selectedAccount,


                                      }: AccountSelectorButtonProps) => {


    const {colors} = useTheme();
    const styles = useStyles(colors);


    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => {
                onPress()
            }
            }
            activeOpacity={accounts.length > 1 ? 0.9 : 1}
            disabled={accounts.length <= 1}>
            <View style={styles.iconChip}>
                <TransferIconWallet color={colors.primary} size={16}/>
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.cardLabel}>{origin}</Text>
                <Text style={styles.cardTitle} numberOfLines={1}>
                    {name}
                </Text>
                {selectedAccount ? (
                    <Text style={styles.cardSub} numberOfLines={1}>
                        {description}
                    </Text>
                ) : (
                    <Text style={styles.cardSub}>Sin cuenta disponible</Text>
                )}
            </View>
            {accounts.length > 1 ? (
                <TransferIconArrowUp color={colors.iconPrimary} size={16}/>
            ) : (
                <View style={styles.cardChevronSpacer}/>
            )}
        </TouchableOpacity>
    )
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
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: 64,
                    paddingHorizontal: 16,
                    backgroundColor: colors.white,
                },
                backBtn: {
                    width: 44,
                    height: 44,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                },
                headerTitle: {
                    flex: 1,
                    textAlign: 'center',
                    fontFamily: Lexend.semiBold,
                    fontSize: 14,
                    lineHeight: 22,
                    color: colors.textPrimary,
                },
                headerRightSpacer: {
                    width: 44,
                },

                loadingWrap: {
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                scroll: {
                    flex: 1,
                },
                scrollContent: {
                    flexGrow: 1,
                },
                heroHint: {
                    fontFamily: Lexend.regular,
                    fontSize: 16,
                    lineHeight: 24,
                    textAlign: 'center',
                    marginBottom: 8,
                },
                amountWrap: {
                    alignSelf: 'center',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.white,
                    marginBottom: 24,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    minWidth: 200,
                },
                amountFieldError: {
                    marginTop: 8,
                    fontFamily: Lexend.regular,
                    fontSize: 13,
                    lineHeight: 18,
                    color: '#FFB8B8',
                    textAlign: 'center',
                    alignSelf: 'center',
                    maxWidth: 280,
                },
                amountInput: {
                    fontFamily: Lexend.bold,
                    fontSize: 50,
                    lineHeight: 60,
                    textAlign: 'center',
                    paddingVertical: 0,
                    minHeight: 70,
                    ...(Platform.OS === 'android' ? {textAlignVertical: 'center'} : null),
                },
                card: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 16,
                    backgroundColor: colors.white,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 16,
                    marginBottom: 16,
                },
                iconChip: {
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: colors.buttonSecondaryBg,
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
                    fontFamily: Lexend.semiBold,
                    fontSize: 14,
                    lineHeight: 22,
                    color: colors.textPrimary,
                },
                cardSub: {
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 20,
                    color: '#3E494B',
                    marginTop: 2,
                },
                cardChevronSpacer: {
                    width: 16,
                    height: 16,
                },
                bottomSection: {
                    paddingHorizontal: 24,
                    paddingTop: 24,
                    gap: 16,
                    backgroundColor: colors.background,
                },
                conceptBlock: {
                    gap: 8,
                },
                conceptLabel: {
                    fontSize: 12,
                    lineHeight: 20,
                },
                conceptLabelStrong: {
                    fontFamily: Lexend.semiBold,
                    color: '#3E494B',
                },
                conceptLabelMuted: {
                    fontFamily: Lexend.regular,
                    color: colors.textTertiary,
                },
                conceptInputError: {
                    borderColor: colors.error,
                },
                validationText: {
                    fontFamily: Lexend.regular,
                    fontSize: 13,
                    color: colors.error,
                },
                primaryCta: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    backgroundColor: colors.primary,
                    borderRadius: 8,
                    paddingVertical: 16,
                },
                primaryCtaText: {
                    fontFamily: Lexend.semiBold,
                    fontSize: 14,
                    lineHeight: 22,
                    color: colors.white,
                },
                modalRoot: {
                    flex: 1,
                    justifyContent: 'flex-end',
                    backgroundColor: 'rgba(0,0,0,0.45)',
                },
                modalSheet: {
                    backgroundColor: colors.background,
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    maxHeight: '78%',
                    width: '100%',
                    zIndex: 1,
                    ...Platform.select({
                        android: {elevation: 24},
                        default: {},
                    }),
                },
                modalHeader: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    minHeight: 64,
                    backgroundColor: colors.surface,
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    paddingHorizontal: 8,
                },
                modalHeaderSide: {
                    width: 44,
                    height: 44,
                },
                modalHeaderTitle: {
                    flex: 1,
                    fontFamily: Lexend.semiBold,
                    fontSize: 14,
                    lineHeight: 22,
                    color: colors.iconPrimary,
                    textAlign: 'center',
                },
                modalCloseBtn: {
                    width: 44,
                    height: 44,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                modalListContent: {
                    paddingHorizontal: 24,
                    paddingTop: 24,
                    paddingBottom: 12,
                    gap: 12,
                },
                accountPickCard: {
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                },
                accountPickCardDisabled: {
                    backgroundColor: colors.buttonSecondaryBg,
                },
                accountPickRow: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                },
                accountPickRowDisabled: {
                    opacity: 0.4,
                },
                accountPickLeft: {
                    flex: 1,
                    minWidth: 0,
                    marginRight: 12,
                },
                accountPickType: {
                    fontFamily: Lexend.semiBold,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.textPrimary,
                },
                accountPickNumber: {
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.textTertiary,
                },
                accountPickRight: {
                    alignItems: 'flex-end',
                },
                accountPickBalance: {
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.textPrimary,
                    textAlign: 'right',
                },
                accountPickSaldoLabel: {
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.textTertiary,
                    textAlign: 'right',
                },
            }),
        [colors],
    );
}
