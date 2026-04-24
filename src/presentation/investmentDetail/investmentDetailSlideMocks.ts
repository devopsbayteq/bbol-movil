import type {InvestmentDetail} from '../../domain/entities/InvestmentDetail';

/** Datos mostrados en hero + cuerpo al deslizar el carrusel de inversiones. */
export interface InvestmentDetailSlide {
  key: string;
  productName: string;
  maskedAccountNumber: string;
  initialAmount: number;
  totalToReceive: number;
  installmentsPaid: number;
  installmentsTotal: number;
  openingDateIso: string;
  maturityDateIso: string;
  interestAtMaturity: number;
  interestRatePercent: number;
  nextPaymentDateIso: string;
  paymentFrequencyLabel: string;
  debitPurposeLabel: string;
  maskedDebitAccount: string;
}

export const INVESTMENT_DETAIL_EXTRA_SLIDES: readonly InvestmentDetailSlide[] = [
  {
    key: 'inv-mock-1',
    productName: 'Depósito a plazo fijo',
    maskedAccountNumber: '441 8820 1103',
    initialAmount: 15000,
    totalToReceive: 16875.5,
    installmentsPaid: 6,
    installmentsTotal: 24,
    openingDateIso: '2025-02-10',
    maturityDateIso: '2027-02-10',
    interestAtMaturity: 1875.5,
    interestRatePercent: 8.5,
    nextPaymentDateIso: '2026-05-10',
    paymentFrequencyLabel: 'Mensual',
    debitPurposeLabel: 'Inversión plazo',
    maskedDebitAccount: 'Cta. Corriente ******902',
  },
  {
    key: 'inv-mock-2',
    productName: 'Pagaré inmediato',
    maskedAccountNumber: '220 9931 4455',
    initialAmount: 50000,
    totalToReceive: 56200,
    installmentsPaid: 3,
    installmentsTotal: 12,
    openingDateIso: '2025-11-01',
    maturityDateIso: '2026-11-01',
    interestAtMaturity: 6200,
    interestRatePercent: 9.25,
    nextPaymentDateIso: '2026-06-01',
    paymentFrequencyLabel: 'Trimestral',
    debitPurposeLabel: 'Ahorro programado',
    maskedDebitAccount: 'Cta. Ahorros ******331',
  },
  {
    key: 'inv-mock-3',
    productName: 'Certificado negociable',
    maskedAccountNumber: '778 2001 9934',
    initialAmount: 8200,
    totalToReceive: 9010,
    installmentsPaid: 18,
    installmentsTotal: 36,
    openingDateIso: '2024-06-15',
    maturityDateIso: '2027-06-15',
    interestAtMaturity: 810,
    interestRatePercent: 7.75,
    nextPaymentDateIso: '2026-04-15',
    paymentFrequencyLabel: 'Mensual',
    debitPurposeLabel: 'Liquidez',
    maskedDebitAccount: 'Cta. Ahorros ******118',
  },
];

function slideFromInvestmentDetail(d: InvestmentDetail): InvestmentDetailSlide {
  return {
    key: d.investmentGuid,
    productName: d.productName,
    maskedAccountNumber: d.maskedAccountNumber,
    initialAmount: d.initialAmount,
    totalToReceive: d.totalToReceive,
    installmentsPaid: d.installmentsPaid,
    installmentsTotal: d.installmentsTotal,
    openingDateIso: d.openingDateIso,
    maturityDateIso: d.maturityDateIso,
    interestAtMaturity: d.interestAtMaturity,
    interestRatePercent: d.interestRatePercent,
    nextPaymentDateIso: d.nextPaymentDateIso,
    paymentFrequencyLabel: d.paymentFrequencyLabel,
    debitPurposeLabel: d.debitPurposeLabel,
    maskedDebitAccount: d.maskedDebitAccount,
  };
}

export function buildInvestmentDetailSlides(
  d: InvestmentDetail,
): InvestmentDetailSlide[] {
  return [slideFromInvestmentDetail(d), ...INVESTMENT_DETAIL_EXTRA_SLIDES];
}
