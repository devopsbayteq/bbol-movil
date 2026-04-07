export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  primaryLight: string;
  primaryIconContainerBg: string;
  /** Fondo del bloque superior en pantalla de transferencia (Figma blue-50). */
  transferSectionBg: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textLabel: string;
  border: string;
  borderLight: string;
  borderSubtle: string;
  inputBg: string;
  placeholder: string;
  buttonSecondaryBg: string;
  iconPrimary: string;
  linkPrimary: string;
  error: string;
  errorBg: string;
  errorBorder: string;
  success: string;
  successBg: string;
  warning: string;
  warningBg: string;
  white: string;
  balanceDivider: string;
  /** Sombra suave (p. ej. celdas OTP en iOS). */
  shadowSoft: string;
}

export const LightColors: ThemeColors = {
  background: '#F2F2F2',
  surface: '#FFFFFF',
  primary: '#008292',
  primaryLight: '#B3E5EC',
  primaryIconContainerBg: '#D0F0F6',
  transferSectionBg: '#EBF3F9',
  textPrimary: '#1A1A1A',
  textSecondary: '#474747',
  textTertiary: '#757575',
  textLabel: '#1A1A1A',
  border: '#E0E0E0',
  borderLight: '#EEEEEE',
  borderSubtle: '#F2F2F2',
  inputBg: '#FFFFFF',
  placeholder: '#757575',
  buttonSecondaryBg: '#E2E2E2',
  iconPrimary: '#000000',
  linkPrimary: '#008292',
  error: '#DC2626',
  errorBg: '#FEF2F2',
  errorBorder: '#FECACA',
  success: '#059669',
  successBg: '#ECFDF5',
  warning: '#D97706',
  warningBg: '#FFFBEB',
  white: '#FFFFFF',
  balanceDivider: 'rgba(255,255,255,0.2)',
  shadowSoft: 'rgba(0,0,0,0.08)',
};

export const DarkColors: ThemeColors = {
  background: '#111827',
  surface: '#1F2937',
  primary: '#22D3EE',
  primaryLight: '#164E63',
  primaryIconContainerBg: '#1E3A4A',
  transferSectionBg: '#1E293B',
  textPrimary: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  textLabel: '#E5E7EB',
  border: '#374151',
  borderLight: '#4B5563',
  borderSubtle: '#1F2937',
  inputBg: '#1F2937',
  placeholder: '#6B7280',
  buttonSecondaryBg: '#374151',
  iconPrimary: '#F9FAFB',
  linkPrimary: '#22D3EE',
  error: '#F87171',
  errorBg: '#451A1A',
  errorBorder: '#7F1D1D',
  success: '#34D399',
  successBg: '#064E3B',
  warning: '#FBBF24',
  warningBg: '#451A03',
  white: '#FFFFFF',
  balanceDivider: 'rgba(255,255,255,0.15)',
  shadowSoft: 'rgba(0,0,0,0.35)',
};
