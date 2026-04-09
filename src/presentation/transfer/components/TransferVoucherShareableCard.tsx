import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import {ThemeColors, useTheme} from '../../../providers';
import {Lexend} from '../../../theme/lexend';
import {CardViewContainer} from './CardViewContainer';
import {TransactionHeaderInformation} from './TransactionHeaderInformation';
import {CardAccountItem} from './CardAccountItem';
import {SpacerView} from '../../components/SpacerView';
import type {TransferDataResume} from '../transferResult/TransferModalSuccess';

type TransferVoucherShareableCardProps = {
  transferResume: TransferDataResume;
};

export function TransferVoucherShareableCard({
  transferResume,
}: TransferVoucherShareableCardProps) {
  const {colors} = useTheme();
  const styles = useStyles(colors);
  const showConcept =
    transferResume.concept != null && transferResume.concept !== '';

  return (
    <CardViewContainer>
      <View>
        <TransactionHeaderInformation transferResume={transferResume} />
        {showConcept ? (
          <View style={styles.contentConcept}>
            <Text style={styles.conceptTitle}>Concepto</Text>
            <Text>{transferResume.concept}</Text>
          </View>
        ) : null}
        <CardAccountItem
          origin="Desde"
          accountType={transferResume.fromAccountLine}
          name={transferResume.fromHolderName}
          showBottomBorder
        />
        <CardAccountItem
          origin="Para"
          accountType={transferResume.beneficiary.accountHint}
          name={transferResume.beneficiary.name}
          showBottomBorder
        />
        <SpacerView />
        <View style={styles.containerQR}>
          <QRCode
            value={transferResume.transactionIdentifier}
            size={100}
          />
          <SpacerView />
          <Text style={styles.qrDescription}>
            QR de verificación{'\n'}de transacción
          </Text>
        </View>
      </View>
    </CardViewContainer>
  );
}

function useStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        contentConcept: {
          alignItems: 'flex-start',
        },
        conceptTitle: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.primary,
          textAlign: 'center',
        },
        containerQR: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        qrDescription: {
          fontSize: 14,
          fontWeight: '400',
          color: colors.primary,
          fontFamily: Lexend.bold,
        },
      }),
    [colors],
  );
}
