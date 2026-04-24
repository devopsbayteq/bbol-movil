import type {LoanDetail} from '../../domain/entities/LoanDetail';

/** Datos mostrados en hero + cuerpo al deslizar el carrusel de préstamos. */
export interface LoanDetailSlide {
  key: string;
  productLabel: string;
  maskedAccountNumber: string;
  outstandingBalance: number;
  nextInstallmentDate: string;
  installmentIndex: number;
  installmentTotal: number;
  capitalPaid: number;
  paidProgress: number;
  amountGranted: number;
  totalToReceiveAmount: number;
  openingDateIso: string;
  interestRatePercent: number;
  maturityDateIso: string;
  creditPurposeLabel: string;
  maskedCreditAccount: string;
}

export const LOAN_DETAIL_EXTRA_SLIDES: readonly LoanDetailSlide[] = [
  {
    key: 'hero-mock-1',
    productLabel: 'Credimax online',
    maskedAccountNumber: '012 3456 7890',
    outstandingBalance: 4250.75,
    nextInstallmentDate: '2026-05-15',
    installmentIndex: 14,
    installmentTotal: 36,
    capitalPaid: 5749.25,
    paidProgress: 0.575,
    amountGranted: 10000,
    totalToReceiveAmount: 11850.5,
    openingDateIso: '2024-03-12',
    interestRatePercent: 11.25,
    maturityDateIso: '2027-03-12',
    creditPurposeLabel: 'Consumo',
    maskedCreditAccount: 'Cta. Ahorros ******421',
  },
  {
    key: 'hero-mock-2',
    productLabel: 'Crédito de consumo',
    maskedAccountNumber: '998 7654 3210',
    outstandingBalance: 12890,
    nextInstallmentDate: '2026-06-01',
    installmentIndex: 8,
    installmentTotal: 48,
    capitalPaid: 22100,
    paidProgress: 0.632,
    amountGranted: 35000,
    totalToReceiveAmount: 40250,
    openingDateIso: '2025-01-08',
    interestRatePercent: 13.5,
    maturityDateIso: '2029-01-08',
    creditPurposeLabel: 'Servicios',
    maskedCreditAccount: 'Cta. Ahorros ******883',
  },
  {
    key: 'hero-mock-3',
    productLabel: 'Préstamo personal',
    maskedAccountNumber: '555 1234 6789',
    outstandingBalance: 3100.5,
    nextInstallmentDate: '2026-04-28',
    installmentIndex: 22,
    installmentTotal: 24,
    capitalPaid: 6899.5,
    paidProgress: 0.69,
    amountGranted: 10000,
    totalToReceiveAmount: 11200,
    openingDateIso: '2024-08-20',
    interestRatePercent: 10.75,
    maturityDateIso: '2026-08-20',
    creditPurposeLabel: 'Gastos',
    maskedCreditAccount: 'Cta. Ahorros ******105',
  },
];

function slideFromLoanDetail(d: LoanDetail): LoanDetailSlide {
  return {
    key: d.loanGuid,
    productLabel: d.productLabel,
    maskedAccountNumber: d.maskedAccountNumber,
    outstandingBalance: d.outstandingBalance,
    nextInstallmentDate: d.nextInstallmentDate,
    installmentIndex: d.installmentIndex,
    installmentTotal: d.installmentTotal,
    capitalPaid: d.capitalPaid,
    paidProgress: d.paidProgress,
    amountGranted: d.amountGranted,
    totalToReceiveAmount: d.totalToReceiveAmount,
    openingDateIso: d.openingDateIso,
    interestRatePercent: d.interestRatePercent,
    maturityDateIso: d.maturityDateIso,
    creditPurposeLabel: d.creditPurposeLabel,
    maskedCreditAccount: d.maskedCreditAccount,
  };
}

export function buildLoanDetailSlides(d: LoanDetail): LoanDetailSlide[] {
  return [slideFromLoanDetail(d), ...LOAN_DETAIL_EXTRA_SLIDES];
}
