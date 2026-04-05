import type {AccountApiAccountKind} from '../../domain/entities/AccountMovement';
import type {AccountMovementTransactionType} from '../../domain/entities/AccountMovementTransactionType';

/** Item en la respuesta paginada de GET /Transaction */
export interface TransactionListItemApiModel {
  transactionGuid: string;
  transactionIdentifier: string | null;
  beneficiaryName: string | null;
  beneficiaryAccountType: AccountApiAccountKind | string;
  beneficiaryAccountTypeLabel: string | null;
  beneficiaryAccountNumber: string | null;
  ownerAccountType: AccountApiAccountKind | string;
  ownerAccountLabel: string | null;
  accountNumber: string | null;
  accountType: AccountApiAccountKind | string;
  accountTypeLabel: string | null;
  amount: number;
  transferDate: string;
  transactionTypeLabel: string | null;
  transactionType: AccountMovementTransactionType | string;
  concept: string | null;
  balanceAfterTransaction: number | null;
  allowedShared?: boolean;
}

export interface TransactionListContentApiModel {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  items: TransactionListItemApiModel[];
}
