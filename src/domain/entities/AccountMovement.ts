/** Movimiento de cuenta devuelto por GET /Transaction */
export interface AccountMovement {
  transactionGuid: string;
  transactionIdentifier: string;
  beneficiaryName: string;
  beneficiaryAccountTypeLabel: string;
  beneficiaryAccountNumber: string;
  /** Cuenta origen (Desde): etiqueta del titular/producto */
  ownerAccountLabel: string;
  /** Cuenta origen enmascarada */
  accountNumber: string;
  /** Tipo de cuenta origen (ej. Cta. ahorros) */
  accountTypeLabel: string;
  /** Últimos dígitos del destino (Para) */
  destinationLastFourDigits: string;
  amount: number;
  transferDate: string;
  transactionTypeLabel: string;
  transactionType: number;
  balanceAfterTransaction: number;
}
