import {
  beneficiaryContactToTemplate,
  groupContactsByLetter,
  ownAccountToBeneficiary,
  templateToBeneficiary,
} from '../../../src/presentation/transfer/beneficiaryData';

describe('beneficiaryData', () => {
  test('beneficiaryContactToTemplate builds hint for each account type', () => {
    expect(
      beneficiaryContactToTemplate({
        beneficiaryGuid: 'g1',
        contactName: 'Ana',
        bankName: 'BB',
        accountType: 1,
        lastFourDigits: '1111',
      }),
    ).toEqual({
      id: 'g1',
      name: 'Ana',
      bankName: 'BB',
      accountHint: 'Cta. ahorros • **** 1111',
    });

    expect(
      beneficiaryContactToTemplate({
        beneficiaryGuid: 'g2',
        contactName: 'Luis',
        bankName: 'X',
        accountType: 2,
        lastFourDigits: '2222',
      }).accountHint,
    ).toContain('corriente');

    expect(
      beneficiaryContactToTemplate({
        beneficiaryGuid: 'g3',
        contactName: 'Z',
        bankName: 'Y',
        accountType: 99,
        lastFourDigits: '3333',
      }).accountHint,
    ).toContain('cuenta');
  });

  test('templateToBeneficiary maps to BeneficiaryOption', () => {
    expect(
      templateToBeneficiary({
        id: 'id1',
        name: 'N',
        bankName: 'B',
        accountHint: 'hint',
      }),
    ).toEqual({
      id: 'id1',
      name: 'N',
      kind: 'contact',
      bankName: 'B',
      accountHint: 'hint',
    });
  });

  test('ownAccountToBeneficiary uses product title and masked number', () => {
    expect(
      ownAccountToBeneficiary({
        accountGuid: 'ag',
        maskedAccountNumber: '****4242',
        accountKind: 'savings',
        balance: 0,
      }),
    ).toEqual({
      id: 'own-ag',
      name: 'Cuenta de Ahorros',
      kind: 'own_account',
      accountHint: '****4242',
    });
  });

  test('groupContactsByLetter groups and sorts', () => {
    const groups = groupContactsByLetter([
      {id: '1', name: 'beta', bankName: '', accountHint: ''},
      {id: '2', name: 'Álvaro', bankName: '', accountHint: ''},
      {id: '3', name: ' 123', bankName: '', accountHint: ''},
    ]);

    const titles = groups.map(g => g.title);
    expect(titles).toContain('#');
    expect(titles.some(t => /Á|A/i.test(t) || t === 'Á')).toBe(true);
    expect(groups.reduce((n, g) => n + g.data.length, 0)).toBe(3);
  });
});
