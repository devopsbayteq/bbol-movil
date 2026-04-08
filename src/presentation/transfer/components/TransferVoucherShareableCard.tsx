import {StyleSheet, View} from 'react-native';
import React from 'react';
import {CardViewContainer} from './CardViewContainer';
import {TransactionHeaderInformation} from './TransactionHeaderInformation';
import {CardAccountItem} from './CardAccountItem';
import {VoucherConceptRow, VoucherTaxRow} from './VoucherConceptRow';
import type {TransferDataResume} from '../transferResult/TransferModalSuccess';
import {SpacerView} from "../../components/SpacerView.tsx";

type TransferVoucherShareableCardProps = {
    transferResume: TransferDataResume;
};

export function TransferVoucherShareableCard({
                                                 transferResume,
                                             }: TransferVoucherShareableCardProps) {
    const showConcept =
        transferResume.concept != null && transferResume.concept !== '';

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
                />
            </View>
            {showConcept ? (
                <View>
                    <VoucherConceptRow concept={transferResume.concept}/>
                    <View style={styles.dividerItems}/>
                </View>
            ) : null}

            <VoucherTaxRow concept={"$0.00"}/>
        </CardViewContainer>
    );
}

const styles = StyleSheet.create({
    accountsBlock: {
        width: '100%',
    },
    dividerItems: {
        marginTop: 15,
        height: 1,
        backgroundColor: "#E2E2E2"
    }
});
