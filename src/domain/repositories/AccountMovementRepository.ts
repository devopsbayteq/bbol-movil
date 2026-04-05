import {AccountMovement} from '../entities/AccountMovement';

export type GetAccountMovementsParams = {
  accountGuid: string;
  dateFrom?: string;
  dateTo?: string;
  transactionType?: string;
  minAmount?: number;
  maxAmount?: number;
  pageNumber: number;
  pageSize: number;
};

export type AccountMovementsPage = {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  items: AccountMovement[];
};

export interface AccountMovementRepository {
  getMovements(params: GetAccountMovementsParams): Promise<AccountMovementsPage>;
}
