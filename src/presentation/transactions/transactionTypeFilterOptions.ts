export type MovementTransactionEnumType =
  | 'ReceivedTransfers'
  | 'SentTransfers'
  | 'Withdrawals'
  | 'ServicePayments'
  | 'Deposits'
  | 'CardPurchases'
  | 'Other';

export type TransactionTypeFilterOption = {
  enumValue: MovementTransactionEnumType;
  label: string;
};

/** Orden UI + valores enviados en query `enumType`. */
export const MOVEMENT_TRANSACTION_TYPE_OPTIONS: TransactionTypeFilterOption[] =
  [
    {
      enumValue: 'ReceivedTransfers',
      label: 'Transferencias recibidas',
    },
    {
      enumValue: 'SentTransfers',
      label: 'Transferencias realizadas',
    },
    {enumValue: 'Withdrawals', label: 'Retiros'},
    {enumValue: 'ServicePayments', label: 'Pago de servicios'},
    {enumValue: 'Deposits', label: 'Depósitos'},
    {enumValue: 'CardPurchases', label: 'Consumos con tarjeta'},
    {enumValue: 'Other', label: 'Otro'},
  ];

export function labelForMovementEnumType(
  value: MovementTransactionEnumType,
): string {
  const opt = MOVEMENT_TRANSACTION_TYPE_OPTIONS.find(
    o => o.enumValue === value,
  );
  return opt?.label ?? value;
}
