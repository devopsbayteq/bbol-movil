import type {ContractBalance} from '../../../../domain/entities/ContractBalance';
import type {ContractBalanceRepository} from '../repositories/ContractBalanceRepository';

export class GetHomeContractBalanceUseCase {
  constructor(
    private readonly contractBalanceRepository: ContractBalanceRepository,
  ) {}

  async execute(): Promise<ContractBalance> {
    return this.contractBalanceRepository.getHomeBalance();
  }
}
