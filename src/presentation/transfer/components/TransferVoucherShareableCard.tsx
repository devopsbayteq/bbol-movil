import {StyleSheet, View} from 'react-native';
import React from 'react';
import {CardViewContainer} from './CardViewContainer';
import {TransactionHeaderInformation} from './TransactionHeaderInformation';
import {CardAccountItem} from './CardAccountItem';
import {VoucherConceptRow} from './VoucherConceptRow';
import type {TransferDataResume} from '../transferResult/TransferModalSuccess';

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
      <TransactionHeaderInformation transferResume={transferResume} />
      <View style={styles.accountsBlock}>
        <CardAccountItem
          origin="Desde"
          accountType={transferResume.fromHolderName}
          name={transferResume.fromAccountLine}
          showBottomBorder
          icon="wallet"
        />
        <CardAccountItem
          origin="Hacia"
          accountType={transferResume.beneficiary.name}
          name={transferResume.beneficiary.accountHint??""}
          icon="user"
        />
      </View>
      {showConcept ? (
        <VoucherConceptRow concept={transferResume.concept} />
      ) : null}
    </CardViewContainer>
  );
}

const styles = StyleSheet.create({
  accountsBlock: {
    width: '100%',
  },
});
