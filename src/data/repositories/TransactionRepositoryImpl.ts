import {Transaction} from '../../domain/entities/Transaction';
import {TransactionRepository} from '../../domain/repositories/TransactionRepository';
import {MockTransactionDataSource} from '../datasources/MockTransactionDataSource';
import {mapTransactionModelsToEntities} from '../mappers/TransactionMapper';

export class TransactionRepositoryImpl implements TransactionRepository {
  constructor(private readonly dataSource: MockTransactionDataSource) {}

  async getTransactions(): Promise<Transaction[]> {
    const models = await this.dataSource.getTransactions();
    return mapTransactionModelsToEntities(models);
  }
}
