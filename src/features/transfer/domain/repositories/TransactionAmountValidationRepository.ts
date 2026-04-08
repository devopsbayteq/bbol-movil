import type {
  TransactionAmountValidation,
  ValidateTransactionAmountParams,
} from '../entities/TransactionAmountValidation';

export interface TransactionAmountValidationRepository {
  validateTransactionAmount(
    input: ValidateTransactionAmountParams,
  ): Promise<TransactionAmountValidation>;
}
