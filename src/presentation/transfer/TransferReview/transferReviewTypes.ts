import type {BeneficiaryOption} from '../../beneficiary/transferTypes.ts';

export type TransferReviewRouteParams = {
  amountCents: number;
  displayAmount: string;
  beneficiary: BeneficiaryOption;
  fromHolderName: string;
  fromAccountLine: string;
  accountId: string;
  concept: string;
};
