/** Movimiento de cuenta devuelto por GET /Transaction */
export interface AccountMovement {
  transactionGuid: string;
  transactionIdentifier: string;
  beneficiaryName: string;
  beneficiaryAccountTypeLabel: string;
  beneficiaryAccountNumber: string;
  amount: number;
  transferDate: string;
  transactionTypeLabel: string;
  transactionType: number;
  balanceAfterTransaction: number;
}
