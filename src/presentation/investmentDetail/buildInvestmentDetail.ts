import type {InvestmentBalance} from '../../domain/entities/ContractBalance';
import type {InvestmentDetail} from '../../domain/entities/InvestmentDetail';
import {
  deriveAmountsFromCurrentValue,
  getMockInvestmentDetailSupplement,
} from './investmentDetailMocks';

export function buildInvestmentDetail(balance: InvestmentBalance): InvestmentDetail {
  const mock = getMockInvestmentDetailSupplement(balance.investmentGuid);
  const totalToReceive = balance.currentValue;
  const {initialAmount, interestAtMaturity} =
    deriveAmountsFromCurrentValue(totalToReceive);

  return {
    investmentGuid: balance.investmentGuid,
    productName: balance.productName,
    currency: balance.currency,
    currentValue: balance.currentValue,
    maskedAccountNumber: mock.maskedAccountNumber,
    initialAmount,
    totalToReceive,
    interestAtMaturity,
    interestRatePercent: mock.interestRatePercent,
    termDays: mock.termDays,
    openingDateIso: mock.openingDateIso,
    maturityDateIso: mock.maturityDateIso,
    irfRetentionAmount: mock.irfRetentionAmount,
    paymentFrequencyLabel: mock.paymentFrequencyLabel,
    jointHolderName: mock.jointHolderName,
  };
}
