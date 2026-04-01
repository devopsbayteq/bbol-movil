import type {AccountBalance, FrequentPayment} from '../../domain/entities/ContractBalance';
import {accountProductTitle} from '../../utils/accountDisplay';
import type {BeneficiaryOption} from './useTransferViewModel';

export type ContactTemplate = {
  id: string;
  name: string;
  bankName: string;
  accountHint: string;
};

/** Demo contacts (Figma 124:950) when API list is sparse. */
export const MOCK_BENEFICIARY_CONTACTS: ContactTemplate[] = [
  {
    id: 'mock-andres',
    name: 'Andrés Juan Delgado',
    bankName: 'Banco Pichincha',
    accountHint: 'Cta. ahorros • **** 8291',
  },
  {
    id: 'mock-ana',
    name: 'Ana María Luz López',
    bankName: 'Banco Bolivariano',
    accountHint: 'Cta. ahorros • **** 8291',
  },
  {
    id: 'mock-alberto',
    name: 'Alberto Roberto Sánchez',
    bankName: 'Banco Guayaquil',
    accountHint: 'Cta. ahorros • **** 8291',
  },
  {
    id: 'mock-barbara',
    name: 'Barbara Ana  Casares',
    bankName: 'Banco Bolivariano',
    accountHint: 'Cta. ahorros • **** 8291',
  },
  {
    id: 'mock-cesar',
    name: 'Cesar Esteban Janez',
    bankName: 'Banco Bolivariano',
    accountHint: 'Cta. ahorros • **** 8291',
  },
  {
    id: 'mock-carla',
    name: 'Carla Johanna Ramos',
    bankName: 'Banco Pacífico',
    accountHint: 'Cta. ahorros • **** 8291',
  },
  {
    id: 'mock-roberto',
    name: 'Roberto Almeida',
    bankName: 'Banco Bolivariano',
    accountHint: 'Cta. ahorros • **** 8291',
  },
];

function bankLabelFromFrequentType(t: string): string {
  const s = t.toLowerCase();
  if (s.includes('luz') || s.includes('servicio') || s.includes('light')) {
    return 'Servicios';
  }
  if (
    s.includes('edu') ||
    s.includes('matricula') ||
    s.includes('school') ||
    s.includes('colegio')
  ) {
    return 'Educación';
  }
  return 'Banco Bolivariano';
}

export function frequentPaymentToContact(
  fp: FrequentPayment,
  index: number,
): ContactTemplate {
  const lastDigits = String(index + 1000).slice(-4);
  return {
    id: `fp-${index}-${fp.beneficiaryName}`,
    name: fp.beneficiaryName,
    bankName: bankLabelFromFrequentType(fp.beneficiaryType),
    accountHint: `Cta. ahorros • **** ${lastDigits}`,
  };
}

export function templateToBeneficiary(t: ContactTemplate): BeneficiaryOption {
  return {
    id: t.id,
    name: t.name,
    kind: 'contact',
    bankName: t.bankName,
    accountHint: t.accountHint,
  };
}

export function ownAccountToBeneficiary(account: AccountBalance): BeneficiaryOption {
  return {
    id: `own-${account.accountGuid}`,
    name: accountProductTitle(account),
    kind: 'own_account',
    accountHint: account.maskedAccountNumber,
  };
}

export function buildContactList(
  frequent: FrequentPayment[],
): ContactTemplate[] {
  const fromApi = frequent.map((fp, i) => frequentPaymentToContact(fp, i));
  const names = new Set(fromApi.map(c => c.name.toLowerCase()));
  const extras = MOCK_BENEFICIARY_CONTACTS.filter(
    m => !names.has(m.name.toLowerCase()),
  );
  return [...fromApi, ...extras].sort((a, b) =>
    a.name.localeCompare(b.name, 'es', {sensitivity: 'base'}),
  );
}

export function groupContactsByLetter(
  contacts: ContactTemplate[],
): {title: string; data: ContactTemplate[]}[] {
  const map = new Map<string, ContactTemplate[]>();
  for (const c of contacts) {
    const letter = c.name.trim().charAt(0).toLocaleUpperCase('es-EC');
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
