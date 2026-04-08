export interface AccountBalanceModel {
  accountGuid: string;
  maskedAccountNumber: string;
  accountType: number;
  balance: number;
}

export interface CreditCardBalanceModel {
  maskedCardNumber: string;
  totalDue: number;
  maxPaymentDate: string;
}

export interface LoanBalanceModel {
  loanGuid: string;
  outstandingBalance: number;
  nextInstallmentAmount: number;
  nextInstallmentDate: string;
}

export interface InvestmentBalanceModel {
  investmentGuid: string;
  productName: string;
  currentValue: number;
  currency: string;
}

export interface FrequentPaymentModel {
  beneficiaryName: string;
  beneficiaryType: string;
}

export interface HomeBannerModel {
  text: string;
  buttonText: string;
  buttonLink: string;
  landscape: string;
}

export interface HomeDashboardIconModel {
  iconCode: string;
  text: string;
}

export interface ContractBalanceContentModel {
  accounts: AccountBalanceModel[];
  creditCards: CreditCardBalanceModel[];
  loans: LoanBalanceModel[];
  investments: InvestmentBalanceModel[];
  frequentPayments: FrequentPaymentModel[];
  banners?: HomeBannerModel[];
  homeDashboardIcons?: HomeDashboardIconModel[];
}
