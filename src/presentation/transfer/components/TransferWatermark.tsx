import React from 'react';
import {StyleSheet, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';

export function TransferWatermark() {
  return (
    <View style={styles.wrap} pointerEvents="none">
      <Svg width={204} height={212} viewBox="0 0 204 212" fill="none">
        <Path
          d="M42 16h56c38 0 68 30 68 68s-30 68-68 68H42V16zm0 120h48c22 0 40-18 40-40s-18-40-40-40H42v80z"
          fill="#FFFFFF"
          fillOpacity={0.08}
        />
        <Path
          d="M118 96c0-26 21-48 48-48h28v160h-32V176h-24c-26 0-48-22-48-48V96z"
          fill="#FFFFFF"
          fillOpacity={0.06}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 24,
    top: 92,
    opacity: 0.55,
  },
});
