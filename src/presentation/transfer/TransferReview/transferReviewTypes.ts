import type {BeneficiaryOption} from '../../beneficiary/transferTypes.ts';

export type TransferReviewRouteParams = {
  amountCents: number;
  displayAmount: string;
  beneficiary: BeneficiaryOption;
  fromHolderName: string;
  fromAccountLine: string;
  fromAccountTitle: string;
  fromAccountSubtitle: string;
  toAccountTitle: string;
  toAccountSubtitle: string;
  fromBalanceDisplay: string;
  toBalanceDisplay: string;
  accountId: string;
  concept: string;
  resultFromOtp?:{
    otpValidated:boolean
  }
};
