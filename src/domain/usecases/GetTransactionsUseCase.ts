import {Transaction} from '../entities/Transaction';
import {TransactionRepository} from '../repositories/TransactionRepository';

export class GetTransactionsUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(): Promise<Transaction[]> {
    return this.transactionRepository.getTransactions();
  }
}
