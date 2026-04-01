import React from 'react';
import {Image, StyleSheet} from 'react-native';

const homeActive = require('../../assets/images/Home.png');
const homeInactive = require('../../assets/images/house.png');
const transferActive = require('../../assets/images/ArrowUpArrowDownSelected.png');
const transferInactive = require('../../assets/images/ArrowUpArrowDown.png');
const movementsActive = require('../../assets/images/clock-rotate-left-selected.png');
const movementsInactive = require('../../assets/images/clock-rotate-left.png');

type TabIconProps = {
  focused: boolean;
  color: string;
  size?: number;
};

export function TabHomeIcon({focused, size = 24}: TabIconProps) {
  return (
    <Image
      source={focused ? homeActive : homeInactive}
      style={[styles.icon, {width: size, height: size}]}
      resizeMode="contain"
      accessibilityLabel="Inicio"
    />
  );
}

export function TabTransferIcon({focused, size = 24}: TabIconProps) {
  return (
    <Image
      source={focused ? transferActive : transferInactive}
      style={[styles.icon, {width: size, height: size}]}
      resizeMode="contain"
      accessibilityLabel="Transferir"
    />
  );
}

export function TabMovementsIcon({focused, size = 24}: TabIconProps) {
  return (
    <Image
      source={focused ? movementsActive : movementsInactive}
      style={[styles.icon, {width: size, height: size}]}
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
