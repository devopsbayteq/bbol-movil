import type {BeneficiaryContact} from './BeneficiaryContact';

export type AccountKind = 'savings' | 'checking' | 'other';

export interface AccountBalance {
  accountGuid: string;
  maskedAccountNumber: string;
  accountKind: string;
  accountTypeLabel: string;
  balance: number;
  beneficiary: BeneficiaryContact;
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

export interface HomeRecentTransaction {
  transactionGuid: string;
  transactionIdentifier: string;
  beneficiaryName: string;
  beneficiaryAccountType: string;
  beneficiaryAccountTypeLabel: string;
  beneficiaryAccountNumber: string;
  ownerAccountType: string;
  ownerAccountLabel: string;
  accountNumber: string;
  accountType: string;
  accountTypeLabel: string;
  amount: number;
  transferDate: string;
  transactionTypeLabel: string;
  transactionType: string;
  concept: string;
  balanceAfterTransaction: number;
  allowedShared: boolean;
}

export interface ContractBalance {
  accounts: AccountBalance[];
  creditCards: CreditCardBalance[];
  loans: LoanBalance[];
  investments: InvestmentBalance[];
  frequentPayments: FrequentPayment[];
  banners: HomeBanner[];
  homeDashboardIcons: HomeDashboardIcon[];
  recentTransactions: HomeRecentTransaction[];
}