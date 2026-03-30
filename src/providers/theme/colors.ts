export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  primaryLight: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textLabel: string;
  border: string;
  borderLight: string;
  borderSubtle: string;
  inputBg: string;
  placeholder: string;
  error: string;
  errorBg: string;
  errorBorder: string;
  success: string;
  successBg: string;
  warning: string;
  warningBg: string;
  white: string;
  balanceDivider: string;
}

export const LightColors: ThemeColors = {
  background: '#F9FAFB',
  surface: '#FFFFFF',
  primary: '#4F46E5',
  primaryLight: '#C7D2FE',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textLabel: '#374151',
  border: '#D1D5DB',
  borderLight: '#E5E7EB',
  borderSubtle: '#F3F4F6',
  inputBg: '#FFFFFF',
  placeholder: '#9CA3AF',
  error: '#DC2626',
  errorBg: '#FEF2F2',
  errorBorder: '#FECACA',
  success: '#059669',
  successBg: '#ECFDF5',
  warning: '#D97706',
  warningBg: '#FFFBEB',
  white: '#FFFFFF',
  balanceDivider: 'rgba(255,255,255,0.2)',
};

export const DarkColors: ThemeColors = {
  background: '#111827',
  surface: '#1F2937',
  primary: '#818CF8',
  primaryLight: '#312E81',
  textPrimary: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  textLabel: '#E5E7EB',
  border: '#374151',
  borderLight: '#374151',
  borderSubtle: '#1F2937',
  inputBg: '#1F2937',
  placeholder: '#6B7280',
  error: '#F87171',
  errorBg: '#451A1A',
  errorBorder: '#7F1D1D',
  success: '#34D399',
  successBg: '#064E3B',
  warning: '#FBBF24',
  warningBg: '#451A03',
  white: '#FFFFFF',
  balanceDivider: 'rgba(255,255,255,0.15)',
};
