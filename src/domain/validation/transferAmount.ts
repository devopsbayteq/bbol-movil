export const MAX_TRANSFER_CENTS = 999_999_999_999;

export const transferAmountMessages = {
  requiredPositive: 'Ingresa un monto mayor a cero.',
  exceedsBalance: 'El monto supera el saldo disponible.',
  exceedsMax: 'El monto excede el máximo permitido.',
} as const;

export function balanceDollarsToCents(balance: number): number {
  if (!Number.isFinite(balance)) {
    return 0;
  }

  return Math.round(balance * 100);
}

export function validateTransferAmountForSubmit(
  amountCents: number,
  availableBalanceCents: number,
): string | null {
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    return transferAmountMessages.requiredPositive;
  }

  if (amountCents > MAX_TRANSFER_CENTS) {
    return transferAmountMessages.exceedsMax;
  }

  if (amountCents > availableBalanceCents) {
    return transferAmountMessages.exceedsBalance;
  }

  return null;
}

export function getLiveTransferAmountError(
  amountCents: number,
  availableBalanceCents: number,
): string | null {
  if (amountCents <= 0) {
    return null;
  }

  if (amountCents > MAX_TRANSFER_CENTS) {
    return transferAmountMessages.exceedsMax;
  }

  if (amountCents > availableBalanceCents) {
    return transferAmountMessages.exceedsBalance;
  }

  return null;
}
