import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Lexend} from '../../../theme/lexend';
import {HOME_PRIMARY_LAYER, HOME_PRIMARY_PRESSED} from '../homeConstants';

type Props = {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
};

export function QuickActionButton({icon, label, onPress}: Props) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={!onPress}>
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: HOME_PRIMARY_LAYER,
    borderRadius: 8,
    paddingTop: 8,
    paddingBottom: 4,
    paddingHorizontal: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  iconWrap: {
    marginBottom: 2,
  },
  label: {
    fontFamily: Lexend.regular,
    fontSize: 8,
    lineHeight: 20,
    color: HOME_PRIMARY_PRESSED,
    textAlign: 'center',
  },
});
