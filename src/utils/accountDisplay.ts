import type {AccountBalance} from '../domain/entities/ContractBalance';

export function accountProductTitle(account: AccountBalance): string {
  if (account.accountKind === 'savings') {
    return 'Cuenta de Ahorros';
  }
  if (account.accountKind === 'checking') {
    return 'Cuenta Corriente';
  }
  return 'Cuenta';
}

export function accountTypeModalLabel(account: AccountBalance): string {
  if (account.accountKind === 'savings') {
    return 'Cuenta de ahorros';
  }
  if (account.accountKind === 'checking') {
    return 'Cuenta corriente';
  }
  return 'Cuenta';
}

export function formatAccountKindLine(account: AccountBalance): string {
  return `${account.accountTypeLabel} ${account.beneficiary.lastFourDigits}`.trim();
}
