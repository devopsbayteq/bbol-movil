/** Item en la respuesta paginada de GET /Transaction */
export interface TransactionListItemApiModel {
  transactionGuid: string;
  transactionIdentifier: string;
  beneficiaryName: string;
  beneficiaryAccountType: number;
  beneficiaryAccountTypeLabel: string;
  beneficiaryAccountNumber: string;
  ownerAccountType: number;
  ownerAccountLabel: string;
  accountNumber: string;
  accountType: number;
  accountTypeLabel: string;
  destinationLastFourDigits: string;
  amount: number;
  transferDate: string;
  transactionTypeLabel: string;
  transactionType: number;
  balanceAfterTransaction: number;
}

export interface TransactionListContentApiModel {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  items: TransactionListItemApiModel[];
}
