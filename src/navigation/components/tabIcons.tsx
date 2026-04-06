import React from 'react';
import {Image, StyleSheet} from 'react-native';

const home = require('../../../assets/images/house.png');
const transfer = require('../../../assets/images/ArrowUpArrowDown.png');
const movements = require('../../../assets/images/clock-rotate-left.png');

type TabIconProps = {
  color: string;
  size?: number;
};

export function TabHomeIcon({color, size = 24}: TabIconProps) {
  return (
    <Image
      source={home}
      style={[styles.icon, {width: size, height: size, tintColor: color}]}
      resizeMode="contain"
      accessibilityLabel="Inicio"
    />
  );
}

export function TabTransferIcon({color, size = 24}: TabIconProps) {
  return (
    <Image
      source={transfer}
      style={[styles.icon, {width: size, height: size, tintColor: color}]}
      resizeMode="contain"
      accessibilityLabel="Transferir"
    />
  );
}

export function TabMovementsIcon({color, size = 24}: TabIconProps) {
  return (
    <Image
      source={movements}
      style={[styles.icon, {width: size, height: size, tintColor: color}]}
      resizeMode="contain"
      accessibilityLabel="Movimientos"
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    resizeMode: 'contain',
  },
});
