import type {
  AccountBalance,
  AccountKind,
  ContractBalance,
  CreditCardBalance,
  FrequentPayment,
  HomeBanner,
  HomeDashboardIcon,
  HomeRecentTransaction,
  InvestmentBalance,
  LoanBalance,
} from '../../../../domain/entities/ContractBalance';
import type {
  AccountBalanceModel,
  ContractBalanceContentModel,
  CreditCardBalanceModel,
  FrequentPaymentModel,
  HomeBannerModel,
  HomeDashboardIconModel,
  HomeRecentTransactionModel,
  InvestmentBalanceModel,
  LoanBalanceModel,
} from '../models/ContractBalanceContentModel';
import {mapDtoToEntity} from './beneficiaryMapper';

function mapAccount(model: AccountBalanceModel): AccountBalance {
  const normalizedKind = model.accountType.toLowerCase();
  const accountKind: AccountKind =
    normalizedKind === 'savings' || normalizedKind === 'checking'
      ? normalizedKind
      : 'other';

  return {
    accountGuid: model.accountGuid,
    maskedAccountNumber: model.maskedAccountNumber,
    accountKind,
    accountTypeLabel: model.accountTypeLabel,
    balance: model.balance,
    beneficiary: mapDtoToEntity(model.beneficiary),
  };
}

function mapCreditCard(model: CreditCardBalanceModel): CreditCardBalance {
  return {
    maskedCardNumber: model.maskedCardNumber,
    totalDue: model.totalDue,
    maxPaymentDate: model.maxPaymentDate,
  };
}

function mapLoan(model: LoanBalanceModel): LoanBalance {
  return {
    loanGuid: model.loanGuid,
    outstandingBalance: model.outstandingBalance,
    nextInstallmentAmount: model.nextInstallmentAmount,
    nextInstallmentDate: model.nextInstallmentDate,
  };
}

function mapInvestment(model: InvestmentBalanceModel): InvestmentBalance {
  return {
    investmentGuid: model.investmentGuid,
    productName: model.productName,
    currentValue: model.currentValue,
    currency: model.currency,
  };
}

function mapFrequentPayment(model: FrequentPaymentModel): FrequentPayment {
  return {
    beneficiaryName: model.beneficiaryName,
    beneficiaryType: model.beneficiaryType,
  };
}

function mapHomeBanner(model: HomeBannerModel): HomeBanner {
  return {
    text: model.text,
    buttonText: model.buttonText,
    buttonLink: model.buttonLink,
    landscape: model.landscape,
  };
}

function mapHomeDashboardIcon(
  model: HomeDashboardIconModel,
): HomeDashboardIcon {
  return {
    iconCode: model.iconCode,
    text: model.text,
  };
}

function mapHomeRecentTransaction(
  model: HomeRecentTransactionModel,
): HomeRecentTransaction {
  return {
    transactionGuid: model.transactionGuid,
    transactionIdentifier: model.transactionIdentifier,
    beneficiaryName: model.beneficiaryName,
    beneficiaryAccountType: model.beneficiaryAccountType,
    beneficiaryAccountTypeLabel: model.beneficiaryAccountTypeLabel,
    beneficiaryAccountNumber: model.beneficiaryAccountNumber,
    ownerAccountType: model.ownerAccountType,
    ownerAccountLabel: model.ownerAccountLabel,
    accountNumber: model.accountNumber,
    accountType: model.accountType,
    accountTypeLabel: model.accountTypeLabel,
    amount: model.amount,
    transferDate: model.transferDate,
    transactionTypeLabel: model.transactionTypeLabel,
    transactionType: model.transactionType,
    concept: model.concept,
    balanceAfterTransaction: model.balanceAfterTransaction,
    allowedShared: model.allowedShared,
  };
}

export function mapContractBalanceContentToEntity(
  model: ContractBalanceContentModel,
): ContractBalance {
  return {
    accounts: (model.accounts ?? []).map(mapAccount),
    creditCards: (model.creditCards ?? []).map(mapCreditCard),
    loans: (model.loans ?? []).map(mapLoan),
    investments: (model.investments ?? []).map(mapInvestment),
    frequentPayments: (model.frequentPayments ?? []).map(mapFrequentPayment),
    banners: (model.banners ?? []).map(mapHomeBanner),
    homeDashboardIcons: (model.homeDashboardIcons ?? []).map(
      mapHomeDashboardIcon,
    ),
    recentTransactions: (model.recentTransactions ?? []).map(
      mapHomeRecentTransaction,
    ),
  };
}
