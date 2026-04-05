import {mapPublicKeyContentToEntity} from '../../../src/data/mappers/PublicKeyMapper';
import {
  mapTransactionListItemToEntity,
  mapTransactionListItemsToEntities,
} from '../../../src/data/mappers/accountMovementMapper';
import {mapLoginResponseToUser} from '../../../src/data/mappers/UserMapper';

describe('data mappers', () => {
  test('mapLoginResponseToUser maps token and derives name from email', () => {
    const result = mapLoginResponseToUser(
      {accessToken: 'token-123', sessionTimeSeconds: 3600, inactivityTimeoutSeconds: 300},
      'cliente@banco.com',
    );

    expect(result).toMatchObject({
      id: 'cliente@banco.com',
      email: 'cliente@banco.com',
      name: 'cliente',
      token: 'token-123',
      inactivityTimeoutSeconds: 300,
    });
    expect(typeof result.sessionExpiresAt).toBe('number');
  });

  test('mapPublicKeyContentToEntity maps the public key value', () => {
    expect(
      mapPublicKeyContentToEntity({publicKey: '-----BEGIN PUBLIC KEY-----'}),
    ).toEqual({value: '-----BEGIN PUBLIC KEY-----'});
  });

  test('mapTransactionListItemToEntity maps API fields to AccountMovement', () => {
    const model = {
      transactionGuid: 'g1',
      transactionIdentifier: 'id-1',
      beneficiaryName: 'Juan',
      beneficiaryAccountType: 1,
      beneficiaryAccountTypeLabel: 'Ahorros',
      beneficiaryAccountNumber: '****1111',
      ownerAccountType: 1,
      ownerAccountLabel: 'Propia',
      accountNumber: '****2222',
      accountType: 1,
      accountTypeLabel: 'Ahorros',
      destinationLastFourDigits: '1111',
      amount: -25,
      transferDate: '2026-03-25T11:00:00Z',
      transactionTypeLabel: 'Transferencia',
      transactionType: 2,
      balanceAfterTransaction: 100,
    };

    expect(mapTransactionListItemToEntity(model)).toEqual({
      transactionGuid: 'g1',
      transactionIdentifier: 'id-1',
      beneficiaryName: 'Juan',
      beneficiaryAccountTypeLabel: 'Ahorros',
      beneficiaryAccountNumber: '****1111',
      amount: -25,
      transferDate: '2026-03-25T11:00:00Z',
      transactionTypeLabel: 'Transferencia',
      transactionType: 2,
      balanceAfterTransaction: 100,
    });
  });

  test('mapTransactionListItemsToEntities maps every item', () => {
    const result = mapTransactionListItemsToEntities([
      {
        transactionGuid: 'a',
        transactionIdentifier: '',
        beneficiaryName: 'A',
        beneficiaryAccountType: 1,
        beneficiaryAccountTypeLabel: '',
        beneficiaryAccountNumber: '',
        ownerAccountType: 1,
        ownerAccountLabel: '',
        accountNumber: '',
        accountType: 1,
        accountTypeLabel: '',
        destinationLastFourDigits: '',
        amount: 1,
        transferDate: '2026-03-25T11:00:00Z',
        transactionTypeLabel: '',
        transactionType: 0,
        balanceAfterTransaction: 0,
      },
      {
        transactionGuid: 'b',
        transactionIdentifier: '',
        beneficiaryName: 'B',
        beneficiaryAccountType: 1,
        beneficiaryAccountTypeLabel: '',
        beneficiaryAccountNumber: '',
        ownerAccountType: 1,
        ownerAccountLabel: '',
        accountNumber: '',
        accountType: 1,
        accountTypeLabel: '',
        destinationLastFourDigits: '',
        amount: 2,
        transferDate: '2026-03-24T11:00:00Z',
        transactionTypeLabel: '',
        transactionType: 0,
        balanceAfterTransaction: 0,
      },
    ]);

    expect(result).toHaveLength(2);
    expect(result[1].beneficiaryName).toBe('B');
  });
});
