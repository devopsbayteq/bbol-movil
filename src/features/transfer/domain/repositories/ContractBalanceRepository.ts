import type {ContractBalance} from '../entities/ContractBalance';

export interface ContractBalanceRepository {
  getHomeBalance(): Promise<ContractBalance>;
}
