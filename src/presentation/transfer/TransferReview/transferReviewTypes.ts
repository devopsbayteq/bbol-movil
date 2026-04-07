import type {BeneficiaryOption} from '../../beneficiary/transferTypes.ts';

export type TransferReviewRouteParams = {
  amountCents: number;
  displayAmount: string;
  beneficiary: BeneficiaryOption;
  fromHolderName: string;
  fromAccountLine: string;
  /** Título de cuenta origen (p. ej. label de producto), alineado con TransferScreen. */
  fromAccountTitle: string;
  /** Subtítulo: producto + número enmascarado. */
  fromAccountSubtitle: string;
  fromBalanceDisplay: string;
  toBalanceDisplay: string;
  accountId: string;
  concept: string;
  resultFromOtp?:{
    otpValidated:boolean
  }
};
