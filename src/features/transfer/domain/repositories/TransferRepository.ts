import type {
  ExecuteTransferParams,
  TransferExecution,
} from '../../../../domain/entities/TransferExecution';

export interface TransferRepository {
  executeTransfer(params: ExecuteTransferParams): Promise<TransferExecution>;
}
