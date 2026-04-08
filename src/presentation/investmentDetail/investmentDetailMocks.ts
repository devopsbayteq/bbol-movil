/** Ratio aproximado inversión inicial / total a recibir (referencia diseño). */
const INITIAL_TO_TOTAL_RATIO = 0.529;

const JOINT_HOLDERS = [
  'Cuenca Armijos Edwin',
  'García López María',
  'Pérez Ruiz Juan',
] as const;

function hashGuid(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (h * 31 + s.charCodeAt(i)) % 2147483647;
  }
  return Math.abs(h);
}

export interface InvestmentDetailMockSupplement {
  maskedAccountNumber: string;
  interestRatePercent: number;
  termDays: number;
  openingDateIso: string;
  maturityDateIso: string;
  irfRetentionAmount: number;
  paymentFrequencyLabel: string;
  jointHolderName: string;
}

export function getMockInvestmentDetailSupplement(
  investmentGuid: string,
): InvestmentDetailMockSupplement {
  const h = hashGuid(investmentGuid);
  let acc = h;
  let digits = '';
  for (let i = 0; i < 11; i += 1) {
    acc = (acc * 1103515245 + 12345) % 2147483647;
    digits += String(Math.abs(acc) % 10);
  }
  const maskedAccountNumber = `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7, 11)}`;

  const rateBase = 5.5 + (h % 11) / 10;

  return {
    maskedAccountNumber,
    interestRatePercent: Math.round(rateBase * 10) / 10,
    termDays: 360 + (h % 20),
    openingDateIso: '2025-05-14',
    maturityDateIso: '2027-05-14',
    irfRetentionAmount: 0,
    paymentFrequencyLabel: 'Al vencimiento',
    jointHolderName: JOINT_HOLDERS[h % JOINT_HOLDERS.length],
  };
}

export function deriveAmountsFromCurrentValue(totalToReceive: number): {
  initialAmount: number;
  interestAtMaturity: number;
} {
  const safe = Number.isFinite(totalToReceive) ? totalToReceive : 0;
  const initialAmount =
    Math.round(Math.max(safe * INITIAL_TO_TOTAL_RATIO, 0) * 100) / 100;
  const interestAtMaturity =
    Math.round(Math.max(safe - initialAmount, 0) * 100) / 100;
  return {initialAmount, interestAtMaturity};
}
