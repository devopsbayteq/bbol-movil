import React from 'react';
import {StyleSheet, View} from 'react-native';
export function TransferWatermark() {
  return <View style={styles.wrap} pointerEvents="none" />;
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor:"#D0F0F6",
    position: 'absolute',
    left: 24,
    top: 92,
    opacity: 0.55,
  },
});
