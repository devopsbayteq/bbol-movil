import type {AccountBalance} from '../domain/entities/ContractBalance';

/** Product label aligned with transfer / Figma (e.g. "Cuenta de Ahorros"). */
export function accountProductTitle(account: AccountBalance): string {
  if (account.accountKind === 'savings') {
    return 'Cuenta de Ahorros';
  }
  if (account.accountKind === 'checking') {
    return 'Cuenta Corriente';
  }
  return 'Cuenta';
}

export function formatAccountKindLine(account: AccountBalance): string {
  const kind =
    account.accountKind === 'savings'
      ? 'Cta. Ahorros'
      : account.accountKind === 'checking'
        ? 'Cta. corriente'
        : 'Cuenta';
  return `${kind} ${account.maskedAccountNumber}`.trim();
}
