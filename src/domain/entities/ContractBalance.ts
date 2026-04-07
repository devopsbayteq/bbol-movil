import {BeneficiaryContact} from "./BeneficiaryContact.ts";

export type AccountKind = 'Savings' | 'Checking' | 'other';

export interface AccountBalance {
  accountGuid: string;
  maskedAccountNumber: string;
  accountKind: string;
  accountTypeLabel:string;
  balance: number;
  beneficiary:BeneficiaryContact
}

export interface CreditCardBalance {
  maskedCardNumber: string;
  totalDue: number;
  maxPaymentDate: string;
}

export interface LoanBalance {
  loanGuid: string;
  outstandingBalance: number;
  nextInstallmentAmount: number;
  nextInstallmentDate: string;
}

export interface InvestmentBalance {
  investmentGuid: string;
  productName: string;
  currentValue: number;
  currency: string;
}

export interface FrequentPayment {
  beneficiaryName: string;
  beneficiaryType: string;
}

export interface HomeBanner {
  text: string;
  buttonText: string;
  buttonLink: string;
  landscape: string;
}

export interface HomeDashboardIcon {
  iconCode: string;
  text: string;
}

export interface ContractBalance {
  accounts: AccountBalance[];
  creditCards: CreditCardBalance[];
  loans: LoanBalance[];
  investments: InvestmentBalance[];
  frequentPayments: FrequentPayment[];
  banners: HomeBanner[];
  homeDashboardIcons: HomeDashboardIcon[];
}
