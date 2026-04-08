/**
 * Vista de detalle de inversión: combina datos del API (`ContractBalance.investments`)
 * con campos enriquecidos en presentación cuando el servicio no los expone.
 */
export interface InvestmentDetail {
  investmentGuid: string;
  productName: string;
  currency: string;
  currentValue: number;
  maskedAccountNumber: string;
  initialAmount: number;
  totalToReceive: number;
  interestAtMaturity: number;
  interestRatePercent: number;
  termDays: number;
  openingDateIso: string;
  maturityDateIso: string;
  irfRetentionAmount: number;
  paymentFrequencyLabel: string;
  jointHolderName: string;
}
