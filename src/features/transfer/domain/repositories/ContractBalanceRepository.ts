import type {ContractBalance} from '../../../../domain/entities/ContractBalance';

export interface ContractBalanceRepository {
  getHomeBalance(): Promise<ContractBalance>;
}
