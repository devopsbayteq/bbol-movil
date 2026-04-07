import type {
  HomeBanner,
  HomeDashboardIcon,
} from '../../domain/entities/ContractBalance';

/** Datos de ejemplo cuando el API aún no envía banners. */
export const FALLBACK_HOME_BANNERS: HomeBanner[] = [
  {
    text: 'Tienes un préstamo\npreaprobado de **$15,000**',
    buttonText: 'Ver más',
    buttonLink: '',
    landscape: 'car',
  },
];

/** Datos de ejemplo cuando el API aún no envía iconos del dashboard. */
export const FALLBACK_HOME_DASHBOARD_ICONS: HomeDashboardIcon[] = [
  {iconCode: 'user', text: 'Andrea Briceño'},
  {iconCode: 'bulb', text: 'Pago luz'},
  {iconCode: 'user', text: 'Jannet Ruiz'},
  {iconCode: 'school', text: 'Centro Educativo'},
];

export interface UpcomingPaymentsSummary {
  summaryLine: string;
  linkLabel: string;
  amountLabel: string;
}

export const MOCK_UPCOMING_PAYMENTS_SUMMARY: UpcomingPaymentsSummary = {
  summaryLine: '3 pagos próximos',
  linkLabel: 'Ver pagos',
  amountLabel: '$47.50',
};

export interface RecentActivityItem {
  day: string;
  monthLabel: string;
  description: string;
  amountLabel: string;
}

export const MOCK_RECENT_ACTIVITY: RecentActivityItem[] = [
  {
    day: '20',
    monthLabel: 'ABR',
    description: 'Transferencia interbancaria',
    amountLabel: '-$91.02',
  },
  {
    day: '12',
    monthLabel: 'ABR',
    description: 'Retiro de cajero',
    amountLabel: '-$20.00',
  },
];
