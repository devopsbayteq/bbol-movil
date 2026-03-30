import {Transaction} from '../entities/Transaction';

export interface TransactionRepository {
  getTransactions(): Promise<Transaction[]>;
}
