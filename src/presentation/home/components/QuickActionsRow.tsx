import React from 'react';
import {View, StyleSheet} from 'react-native';
import {HOME_PRIMARY_PRESSED} from '../homeConstants';
import {
  TransferArrowsIcon,
  LightbulbServiceIcon,
  QrCodeIcon,
  CalendarIcon,
} from './HomeIcons';
import {QuickActionButton} from './QuickActionButton';

const ICON_COLOR = HOME_PRIMARY_PRESSED;

export function QuickActionsRow() {
  return (
    <View style={styles.row}>
      <QuickActionButton
        icon={<TransferArrowsIcon color={ICON_COLOR} size={20} />}
        label="Transferir"
      />
      <QuickActionButton
        icon={<LightbulbServiceIcon color={ICON_COLOR} size={20} />}
        label="Pagar servicios"
      />
      <QuickActionButton
        icon={<QrCodeIcon color={ICON_COLOR} size={20} />}
        label="Cobrar QR"
      />
      <QuickActionButton
        icon={<CalendarIcon color={ICON_COLOR} size={20} />}
        label="Programadas"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
});
