import React from 'react';
import Svg, {Path} from 'react-native-svg';
import type {CalendarActivityIcon} from './recentActivityCalendarTypes';

function TvIcon({color, size}: {color: string; size: number}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"
      />
    </Svg>
  );
}

function PhoneIcon({color, size}: {color: string; size: number}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14z"
      />
    </Svg>
  );
}

function CardIcon({color, size}: {color: string; size: number}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"
      />
    </Svg>
  );
}

function WifiIcon({color, size}: {color: string; size: number}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M12 18c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-5.27-4.73L12 8l5.27 5.27c.78.78 2.05.78 2.83 0 .78-.78.78-2.05 0-2.83L12 4.73 4.9 11.44c-.78.78-.78 2.05 0 2.83.78.78 2.05.78 2.83 0z"
      />
    </Svg>
  );
}

function BulbIcon({color, size}: {color: string; size: number}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"
      />
    </Svg>
  );
}

export function CalendarActivityGlyph({
  icon,
  color,
  size = 16,
}: Readonly<{
  icon: CalendarActivityIcon;
  color: string;
  size?: number;
}>) {
  switch (icon) {
    case 'tv':
      return <TvIcon color={color} size={size} />;
    case 'phone':
      return <PhoneIcon color={color} size={size} />;
    case 'card':
      return <CardIcon color={color} size={size} />;
    case 'wifi':
      return <WifiIcon color={color} size={size} />;
    case 'bulb':
      return <BulbIcon color={color} size={size} />;
    default:
      return null;
  }
}
