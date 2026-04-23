import type {CreditCardBalance} from '../../domain/entities/ContractBalance';

/** Línea de consumo en tarjeta (API no expone movimientos de tarjeta en este proyecto). */
export interface CardConsumptionRow {
  day: string;
  monthLabel: string;
  merchant: string;
  /** Positivo = cargo; negativo = abono (se muestra con + y color éxito). */
  amount: number;
}

/** Categoría para el resumen “Tus gastos del mes” (mock). */
export interface CardSpendingCategoryMock {
  id: string;
  label: string;
  amount: number;
  /** 0–1 para dibujar el arco del donut. */
  share: number;
  colorToken: 'primary' | 'chartAccent' | 'primaryLight';
}

export const MOCK_CARD_CONSUMPTIONS: CardConsumptionRow[] = [
  {day: '20', monthLabel: 'ABR', merchant: 'Ricardo Gomez', amount: 91.02},
  {day: '19', monthLabel: 'ABR', merchant: 'Edesur S.A.', amount: 9.06},
  {day: '06', monthLabel: 'ABR', merchant: 'Ricardo Gomez', amount: 91.02},
  {day: '06', monthLabel: 'ABR', merchant: 'Mavesa S.A.', amount: 1245.89},
  {day: '01', monthLabel: 'ABR', merchant: 'Reverso Uber', amount: -2.46},
];

/** Porcentajes mostrados en leyenda (la suma puede ser menor que 100% como en diseño). */
export const MOCK_SPENDING_CATEGORIES: CardSpendingCategoryMock[] = [
  {
    id: '1',
    label: 'Servicio de luz',
    amount: 50,
    share: 0.24,
    colorToken: 'primary',
  },
  {
    id: '2',
    label: 'Celular',
    amount: 20,
    share: 0.26,
    colorToken: 'primaryLight',
  },
  {
    id: '3',
    label: 'Transferencias interbancarias',
    amount: 10,
    share: 0.39,
    colorToken: 'chartAccent',
  },
];

/** Cupo base de referencia cuando el API no envía límite (solo totalDue y fechas). */
export const MOCK_APPROVED_CREDIT_FLOOR = 3000;

/**
 * Heurística de cupo aprobado: coherente con total a pagar y cercana al mock de Figma.
 */
export function resolveApprovedCreditLimit(totalDue: number): number {
  const scaled = Math.ceil(Math.max(totalDue * 2.5, MOCK_APPROVED_CREDIT_FLOOR));
  return scaled;
}

/**
 * Tarjetas demo solo para el carrusel en `CardDetailScreen` (no se muestran en Home).
 */
export const EXTRA_DEMO_CREDIT_CARDS_FOR_DETAIL: readonly CreditCardBalance[] = [
  {
    maskedCardNumber: '4454**** 8912',
    totalDue: 890.12,
    maxPaymentDate: '2026-06-10',
  },
  {
    maskedCardNumber: '4454**** 7733',
    totalDue: 2100,
    maxPaymentDate: '2026-04-22',
  },
];
