import type {
  TransactionAmountValidation,
  ValidateTransactionAmountParams,
} from '../../../../domain/entities/TransactionAmountValidation';

export interface TransactionAmountValidationRepository {
  validateTransactionAmount(
    input: ValidateTransactionAmountParams,
  ): Promise<TransactionAmountValidation>;
}
