export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  primaryLight: string;
  textPrimary: string;
  textBlack: string;
  nextPayCircleBg: string;
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

  /** Home: cabecera oscura (marca; mismo valor en light/dark). */
  homeHeaderBackground: string;
  homeAvatarCircle: string;
  homeLink: string;
  /** Botón icono (logout) sobre cabecera Home. */
  homeHeaderIconButtonBg: string;
  /** Tarjeta de producto clara (cuentas). */
  homeProductCardSurface: string;
  homeProductCardBorder: string;
  /** Chip filtro seleccionado — borde acento claro. */
  homeChipSelectedBorder: string;
  /** Botón mostrar/ocultar saldo sobre tarjeta clara. */
  homeBalanceToggleBg: string;
  /** Tarjeta de crédito preview (fila productos). */
  homeCreditCardSurface: string;
  homeLoanCardBackground: string;
  homeLoanCardBorder: string;
  homeBorderSoft: string;
  homePrimaryHover: string;
  lineSeparator: string;
  /** Color de acento para gráficas (segmento terciario del donut). */
  chartAccent: string;

}

export const LightColors: ThemeColors = {
  background: '#F2F2F2',
  surface: '#FFFFFF',
  primary: '#008292',
  primaryLight: '#B3E5EC',
  textPrimary: '#1A1A1A',
  textBlack: '#000000',
  nextPayCircleBg: '#d2e4f0',
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
  homeLink: '#0167ae',
  error: '#DC2626',
  errorBg: '#FEF2F2',
  errorBorder: '#FECACA',
  success: '#059669',
  successBg: '#ECFDF5',
  warning: '#D97706',
  warningBg: '#FFFBEB',
  white: '#FFFFFF',
  balanceDivider: 'rgba(255,255,255,0.2)',
  shadowSoft: 'rgb(0, 0, 0)',
  homeHeaderBackground: '#0B515C',
  homeAvatarCircle: '#94E0ED',
  homeHeaderIconButtonBg: '#096877',
  homeProductCardSurface: '#eff6f7',
  homeProductCardBorder: '#FFFFFF',
  homeChipSelectedBorder: '#D0F0F6',
  homeBalanceToggleBg: '#d0f0f6',
  homeCreditCardSurface: '#262626',
  homeLoanCardBackground: '#0067AE',
  homeLoanCardBorder: '#E0EBFF',
  homeBorderSoft: '#EFF6F7',
  homePrimaryHover: '#06A3B6',
  lineSeparator: '#d6d6d6',
  chartAccent: '#962DFF',
};

export const DarkColors: ThemeColors = {
  background: '#111827',
  surface: '#1F2937',
  primary: '#22D3EE',
  primaryLight: '#164E63',
  textPrimary: '#F9FAFB',
  textBlack: '#000000',
  nextPayCircleBg: '#d2e4f0',
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
  homeLink: '#0167ae',
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
  homeHeaderBackground: '#0B515C',
  homeAvatarCircle: '#94E0ED',
  homeHeaderIconButtonBg: '#096877',
  homeProductCardSurface: '#D0F0F6',
  homeProductCardBorder: '#FFFFFF',
  homeChipSelectedBorder: '#D0F0F6',
  homeBalanceToggleBg: '#94E0ED',
  homeCreditCardSurface: '#262626',
  homeLoanCardBackground: '#0067AE',
  homeLoanCardBorder: '#E0EBFF',
  homeBorderSoft: '#EFF6F7',
  homePrimaryHover: '#06A3B6',
  lineSeparator: '#374151',
  chartAccent: '#B76EFF',
};
