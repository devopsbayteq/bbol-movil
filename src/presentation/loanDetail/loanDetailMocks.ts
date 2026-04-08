function hashGuid(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (h * 31 + s.charCodeAt(i)) % 2147483647;
  }
  return Math.abs(h);
}

const PRODUCT_LABELS = [
  'Credimax online',
  'Crédito de consumo',
  'Préstamo personal',
] as const;

const AGENCIES = ['Agencia 1', 'Agencia Centro', 'Matriz Quito'] as const;

const OFFICERS = [
  'Ramirez Piedra Jonathan Alexander',
  'Torres Vega Ana Lucía',
  'Mendoza Pérez Carlos',
] as const;

export interface LoanDetailMockSupplement {
  productLabel: string;
  maskedAccountNumber: string;
  amountGrantedBase: number;
  installmentIndex: number;
  installmentTotal: number;
  interestAtMaturity: number;
  interestRatePercent: number;
  termDays: number;
  maturityDateIso: string;
  agencyName: string;
  creditOfficerName: string;
}

export function getMockLoanDetailSupplement(loanGuid: string): LoanDetailMockSupplement {
  const h = hashGuid(loanGuid);
  let acc = h;
  let digits = '';
  for (let i = 0; i < 11; i += 1) {
    acc = (acc * 1103515245 + 12345) % 2147483647;
    digits += String(Math.abs(acc) % 10);
  }
  const maskedAccountNumber = `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7, 11)}`;

  const installmentTotal = Math.max(2, 36 + (h % 48));
  const installmentIndex = 1 + (h % (installmentTotal - 1));

  return {
    productLabel: PRODUCT_LABELS[h % PRODUCT_LABELS.length],
    maskedAccountNumber,
    amountGrantedBase: 2000 + (h % 8000),
    installmentIndex,
    installmentTotal,
    interestAtMaturity: Math.round((150 + (h % 500)) * 100) / 100,
    interestRatePercent: Math.round((5 + (h % 15) / 10) * 10) / 10,
    termDays: 300 + (h % 120),
    maturityDateIso: '2026-05-14',
    agencyName: AGENCIES[h % AGENCIES.length],
    creditOfficerName: OFFICERS[h % OFFICERS.length],
  };
}
