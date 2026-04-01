import React from 'react';
import Svg, {Path} from 'react-native-svg';

type TabIconProps = {
  color: string;
  size?: number;
};

export function TabHomeIcon({color, size = 24}: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityRole="image">
      <Path
        fill={color}
        d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
      />
    </Svg>
  );
}

export function TabTransferIcon({color, size = 24}: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityRole="image">
      <Path
        fill={color}
        d="M16 17.01V11h-2v7.01h-3L15 22l4-4.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"
      />
    </Svg>
  );
}

export function TabMovementsIcon({color, size = 24}: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityRole="image">
      <Path
        fill={color}
        d="M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6a7 7 0 017-7 7 7 0 016.92 6h2.02A9 9 0 0013 3zm-1 18a9 9 0 009-9h-3l3.89-3.89L21 12h-3a7 7 0 01-7 7 7 7 0 01-6.92-6H2.08A9 9 0 0012 21z"
      />
    </Svg>
  );
}
