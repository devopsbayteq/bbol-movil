import {
  AccountBalance,
  ContractBalance,
  CreditCardBalance,
  FrequentPayment,
  InvestmentBalance,
  LoanBalance,
} from '../../domain/entities/ContractBalance';
import {
  AccountBalanceModel,
  ContractBalanceContentModel,
  CreditCardBalanceModel,
  FrequentPaymentModel,
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

export function mapContractBalanceContentToEntity(
  model: ContractBalanceContentModel,
): ContractBalance {
  return {
    accounts: (model.accounts ?? []).map(mapAccount),
    creditCards: (model.creditCards ?? []).map(mapCreditCard),
    loans: (model.loans ?? []).map(mapLoan),
    investments: (model.investments ?? []).map(mapInvestment),
    frequentPayments: (model.frequentPayments ?? []).map(mapFrequentPayment),
  };
}
