import { Otp } from '../entities/Otp';
import {PublicKey} from '../entities/PublicKey';
import {
  TransactionAmountValidation,
  ValidateTransactionAmountParams,
} from '../entities/TransactionAmountValidation';

export interface SecurityRepository {
  getPublicKey(): Promise<PublicKey>;
  validateOtp(otp:string):Promise<Otp>;
  validateTransactionAmount(
    input: ValidateTransactionAmountParams,
  ): Promise<TransactionAmountValidation>;
}
