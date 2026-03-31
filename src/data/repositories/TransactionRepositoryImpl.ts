import {Transaction} from '../../domain/entities/Transaction';
import {TransactionRepository} from '../../domain/repositories/TransactionRepository';
import {TransactionDataSource} from '../datasources/transaction/TransactionDataSource';
import {mapTransactionModelsToEntities} from '../mappers/TransactionMapper';

export class TransactionRepositoryImpl implements TransactionRepository {
  constructor(private readonly dataSource: TransactionDataSource) {}

  async getTransactions(): Promise<Transaction[]> {
    const models = await this.dataSource.getTransactions();
    return mapTransactionModelsToEntities(models);
  }
}
