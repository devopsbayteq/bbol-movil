import type {AccountBalance} from '../../domain/entities/ContractBalance';
import type {BeneficiaryContact} from '../../domain/entities/BeneficiaryContact';
import {accountProductTitle} from '../../utils/accountDisplay';
import type {BeneficiaryOption} from './transferTypes';

export function templateToBeneficiary(b: BeneficiaryContact): BeneficiaryOption {
  return {
    id: b.beneficiaryGuid,
    name: b.contactName,
    kind: 'contact',
    bankName: b.bankName,
    accountHint: `Cta. ${b.accountType} • **** ${b.lastFourDigits}`,
  };
}

export function ownAccountToBeneficiary(account: AccountBalance): BeneficiaryOption {
  return {
    id: account.accountGuid,
    name: accountProductTitle(account),
    kind: 'own_account',
    accountHint: account.maskedAccountNumber,
  };
}

export function groupContactsByLetter(
  contacts: BeneficiaryContact[],
): {title: string; data: BeneficiaryContact[]}[] {
  const map = new Map<string, BeneficiaryContact[]>();
  for (const c of contacts) {
    const letter = c.contactName.trim().charAt(0).toLocaleUpperCase('es-EC');
    const key = /[A-ZÁÉÍÓÚÑ]/i.test(letter) ? letter : '#';
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(c);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b, 'es'))
    .map(([title, data]) => ({title, data}));
}
