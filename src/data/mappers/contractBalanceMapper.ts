import {
  AccountBalance,
  ContractBalance,
  CreditCardBalance,
  FrequentPayment,
  HomeBanner,
  HomeDashboardIcon,
  InvestmentBalance,
  LoanBalance,
} from '../../domain/entities/ContractBalance';
import {
  AccountBalanceModel,
  ContractBalanceContentModel,
  CreditCardBalanceModel,
  FrequentPaymentModel,
  HomeBannerModel,
  HomeDashboardIconModel,
  InvestmentBalanceModel,
  LoanBalanceModel,
} from '../models/ContractBalanceContentModel';
import { mapDtoToEntity} from "./beneficiaryMapper.ts";


function mapAccount(model: AccountBalanceModel): AccountBalance {
  return {
    accountGuid: model.accountGuid,
    maskedAccountNumber: model.maskedAccountNumber,
    accountKind: model.accountType,
    accountTypeLabel:model.accountTypeLabel,
    balance: model.balance,
    beneficiary: mapDtoToEntity(model.beneficiary)
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

function mapHomeDashboardIcon(model: HomeDashboardIconModel): HomeDashboardIcon {
  return {
    iconCode: model.iconCode,
    text: model.text,
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
  };
}
