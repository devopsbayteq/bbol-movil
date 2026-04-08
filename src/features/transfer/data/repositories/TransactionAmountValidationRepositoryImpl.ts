import type {
  TransactionAmountValidation,
  ValidateTransactionAmountParams,
} from '../../domain/entities/TransactionAmountValidation';
import type {TransactionAmountValidationRepository} from '../../domain/repositories/TransactionAmountValidationRepository';
import type {TransferAmountValidationRemoteDataSource} from '../datasources/transaction/TransferAmountValidationRemoteDataSource';

export class TransactionAmountValidationRepositoryImpl
  implements TransactionAmountValidationRepository
{
  constructor(
    private readonly remoteDataSource: TransferAmountValidationRemoteDataSource,
  ) {}

  async validateTransactionAmount(
    input: ValidateTransactionAmountParams,
  ): Promise<TransactionAmountValidation> {
    const content = await this.remoteDataSource.validateTransactionAmount({
      amount: input.amount,
      beneficiaryContactGuid: input.beneficiaryGuid,
      accountGuid: input.accountGuid,
      concept: input.concept,
    });
    return {isValid: content.isValid};
  }
}
