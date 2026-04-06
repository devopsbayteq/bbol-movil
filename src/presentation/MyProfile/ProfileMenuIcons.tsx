import Svg, {Path} from 'react-native-svg';

type IconProps = {
  color: string;
  size?: number;
};

export function ProfileBankIcon({color, size = 22}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M4 10h3v7H4zm6.5 0h3v7h-3zM2 19h20v3H2zm2.5-11h15v9H4.5zM9.5 5h5v5h-5zM7 3h10v2H7z"
      />
    </Svg>
  );
}

export function ProfileLockIcon({color, size = 22}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
      />
    </Svg>
  );
}

export function ProfileGaugeIcon({color, size = 22}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M20.38 8.57l-1.23 1.85a8 8 0 01-.22 7.58H5.07A8 8 0 0115.58 6.85l1.85-1.23A10 10 0 003.35 19h2.1a8 8 0 0113.1 0h2.1a10 10 0 00-1.27-10.43z"
      />
    </Svg>
  );
}

export function ProfileSmartphoneCheckIcon({color, size = 22}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z"
      />
      <Path
        fill={color}
        d="M10.59 14.59L8.83 12.83a.996.996 0 10-1.41 1.41l2.47 2.47c.39.39 1.02.39 1.41 0l4.24-4.24a.996.996 0 10-1.41-1.41l-3.54 3.53z"
      />
    </Svg>
  );
}
