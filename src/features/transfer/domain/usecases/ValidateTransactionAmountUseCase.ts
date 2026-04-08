import type {TransactionAmountValidationRepository} from '../repositories/TransactionAmountValidationRepository';
import type {
  TransactionAmountValidation,
  ValidateTransactionAmountParams,
} from '../entities/TransactionAmountValidation';

export class ValidateTransactionAmountUseCase {
  constructor(
    private readonly validationRepository: TransactionAmountValidationRepository,
  ) {}

  execute(
    input: ValidateTransactionAmountParams,
  ): Promise<TransactionAmountValidation> {
    return this.validationRepository.validateTransactionAmount(input);
  }
}
