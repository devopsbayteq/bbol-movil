import type {TransferRepository} from '../repositories/TransferRepository';
import type {
  ExecuteTransferParams,
  TransferExecution,
} from '../entities/TransferExecution';

export class ExecuteTransferUseCase {
  constructor(private readonly transferRepository: TransferRepository) {}

  execute(params: ExecuteTransferParams): Promise<TransferExecution> {
    return this.transferRepository.executeTransfer(params);
  }
}
