import {TransactionModel} from '../../models/TransactionModel';

export interface TransactionDataSource {
  getTransactions(): Promise<TransactionModel[]>;
}
