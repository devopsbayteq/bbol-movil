import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import {CardViewContainer} from './CardViewContainer';
import {TransactionHeaderInformation} from './TransactionHeaderInformation';
import {CardAccountItem} from './CardAccountItem';
import type {TransferDataResume} from '../transferResult/TransferModalSuccess';
import {SpacerView} from "../ui";
import {useTheme, type ThemeColors} from '../../../../providers';
import {Lexend} from '../../../../theme/lexend';

type TransferVoucherShareableCardProps = {
    transferResume: TransferDataResume;
};

export function TransferVoucherShareableCard({
                                                 transferResume,
                                             }: TransferVoucherShareableCardProps) {

    const {colors} = useTheme();
    const styles = useStyles(colors);
    const showConcept = transferResume.concept != null && transferResume.concept !== '';

    return (
        <CardViewContainer>
            <TransactionHeaderInformation transferResume={transferResume}/>
            <View style={styles.accountsBlock}>
                <CardAccountItem
                    origin="Desde"
                    accountType={transferResume.fromAccountTitle}
                    name={transferResume.fromAccountSubtitle}
                    showBottomBorder
                    icon="wallet"
                />
                <CardAccountItem
                    origin="Hacia"
                    accountType={transferResume.toAccountTitle}
                    name={transferResume.toAccountSubtitle}
                    icon="user"
                    showBottomBorder
                />
            </View>
            <SpacerView height={20}/>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Concepto</Text>
                <Text style={[styles.detailValue, styles.conceptValue]}>
                    {showConcept ? transferResume.concept : '_'}
                </Text>
            </View>

            <View style={[styles.detailRow, styles.detailRowLast]}>
                <Text style={styles.detailLabel}>Comisión</Text>
                <Text style={styles.detailValue}>$0.00</Text>
            </View>
        </CardViewContainer>
    );
}

function useStyles(colors: ThemeColors) {
    return useMemo(
        () =>
            StyleSheet.create({
                detailRowLast: {
                    borderBottomWidth: 0,
                },
                conceptValue: {
                    flexShrink: 1,
                },
                detailValue: {
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.primary,
                    textAlign: 'right',
                    flex: 1,
                },
                detailLabel: {
                    fontFamily: Lexend.regular,
                    fontSize: 14,
                    lineHeight: 20,
                    color: colors.textSecondary,
                    flexShrink: 0,
                },
                detailRow: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 4,
                    paddingTop: 12,
                    paddingBottom: 13,
                    borderBottomColor: colors.borderLight,
                    borderBottomWidth:1.5,
                    gap: 12,
                },
                accountsBlock: {
                    width: '100%',
                },
                dividerItems: {
                    marginTop: 15,
                    height: 1,
                    backgroundColor: "#E2E2E2"
                }
            }), [colors])
}

