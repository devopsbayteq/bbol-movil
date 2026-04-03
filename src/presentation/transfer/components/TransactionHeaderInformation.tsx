import {Image, Platform, StyleSheet, Text, View} from "react-native";
import React, {useMemo} from "react";
import {ThemeColors, useTheme} from "../../../providers";
import {Lexend} from "../../../theme/lexend.ts";
import {TransferDataResume} from "../transferResult/TransferModalSuccess.tsx";
interface TransactionHeaderInformationProps{
    transferResume:TransferDataResume
}
export const TransactionHeaderInformation = ({transferResume}:TransactionHeaderInformationProps) => {
    const formattedDate = useMemo(
        () =>
            new Date().toLocaleDateString('es-EC', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }),
        [],
    );
    const {colors} = useTheme();
    const styles = useStyles(colors);
    return (
        <View style={styles.successHeader}>
            <View style={styles.iconOuter}>
                <Image
                    source={require('../../../../assets/images/circle-check.png')}
                    style={styles.checkImage}
                    resizeMode="contain"
                    accessibilityLabel="Transferencia exitosa"
                />
            </View>
            <View style={styles.titleBlock}>
                <Text style={styles.title}>¡Transferencia exitosa!</Text>
                <Text style={styles.amount}>{transferResume.displayAmount}</Text>
                <Text style={styles.comprobante}>
                    Comprobante: {transferResume.transactionIdentifier}
                </Text>
                <Text style={styles.dateLine}>{formattedDate}</Text>
            </View>
        </View>
    )
}

function useStyles(colors: ThemeColors) {
    return useMemo(
        () =>
            StyleSheet.create({
                successHeader: {
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                },

                iconOuter: {
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: colors.white,
                    borderWidth: 1,
                    borderColor: colors.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 0,
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 1},
                            shadowOpacity: 0.05,
                            shadowRadius: 1,
                        },
                        android: {
                            elevation: 2,
                        },
                        default: {},
                    }),
                },
                checkImage: {
                    width: 26,
                    height: 26,
                },
                titleBlock: {
                    alignItems: 'center',
                    gap: 4,
                    width: '100%',
                },
                title: {
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.primary,
                    textAlign: 'center',
                },
                amount: {
                    fontFamily: Lexend.semiBold,
                    fontSize: 18,
                    lineHeight: 28,
                    color: colors.textPrimary,
                    textAlign: 'center',
                },
                comprobante: {
                    fontFamily: Lexend.regular,
                    fontSize: 10,
                    lineHeight: 20,
                    color: colors.textTertiary,
                    textAlign: 'center',
                },
                dateLine: {
                    fontFamily: Lexend.regular,
                    fontSize: 10,
                    lineHeight: 20,
                    color: colors.textTertiary,
                    textAlign: 'center',
                },
            }), [])
}
