/**
 * Detalle de préstamo: datos del contrato (`LoanBalance`) más campos
 * enriquecidos cuando el API no los expone.
 */
export interface LoanDetail {
  loanGuid: string;
  productLabel: string;
  maskedAccountNumber: string;
  nextInstallmentAmount: number;
  nextInstallmentDate: string;
  outstandingBalance: number;
  capitalPaid: number;
  amountGranted: number;
  /** 0–1 para la barra de progreso (capital pagado / monto otorgado). */
  paidProgress: number;
  installmentIndex: number;
  installmentTotal: number;
  interestAtMaturity: number;
  interestRatePercent: number;
  termDays: number;
  maturityDateIso: string;
  agencyName: string;
  creditOfficerName: string;
}
