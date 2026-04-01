import {mapPublicKeyContentToEntity} from '../../../src/data/mappers/PublicKeyMapper';
import {
  mapTransactionModelToEntity,
  mapTransactionModelsToEntities,
} from '../../../src/data/mappers/TransactionMapper';
import {mapLoginResponseToUser} from '../../../src/data/mappers/UserMapper';

describe('data mappers', () => {
  test('mapLoginResponseToUser maps token and derives name from email', () => {
    const result = mapLoginResponseToUser(
      {accessToken: 'token-123'},
      'cliente@banco.com',
    );

    expect(result).toEqual({
      id: 'cliente@banco.com',
      email: 'cliente@banco.com',
      name: 'cliente',
      token: 'token-123',
    });
  });

  test('mapPublicKeyContentToEntity maps the public key value', () => {
    expect(
      mapPublicKeyContentToEntity({publicKey: '-----BEGIN PUBLIC KEY-----'}),
    ).toEqual({value: '-----BEGIN PUBLIC KEY-----'});
  });

  test('mapTransactionModelToEntity keeps transaction business fields', () => {
    const model = {
      id: 'tx-1',
      description: 'Transferencia recibida',
      amount: 250.5,
      date: '2026-03-25',
      type: 'income' as const,
      category: 'transfer',
      status: 'completed' as const,
      createdAt: '2026-03-25T11:00:00Z',
      updatedAt: '2026-03-25T11:05:00Z',
      userId: 'usr-1',
      reference: 'SPEI-123',
      metadata: {channel: 'mobile'},
    };

    expect(mapTransactionModelToEntity(model)).toEqual({
      id: 'tx-1',
      description: 'Transferencia recibida',
      amount: 250.5,
      date: '2026-03-25',
      type: 'income',
      category: 'transfer',
      status: 'completed',
    });
  });

  test('mapTransactionModelsToEntities maps every transaction in the collection', () => {
    const result = mapTransactionModelsToEntities([
      {
        id: 'tx-1',
        description: 'Ingreso',
        amount: 10,
        date: '2026-03-25',
        type: 'income',
        category: 'salary',
        status: 'completed',
        createdAt: '2026-03-25T11:00:00Z',
        updatedAt: '2026-03-25T11:05:00Z',
        userId: 'usr-1',
        reference: 'ref-1',
        metadata: null,
      },
      {
        id: 'tx-2',
        description: 'Compra',
        amount: 5,
        date: '2026-03-24',
        type: 'expense',
        category: 'shopping',
        status: 'pending',
        createdAt: '2026-03-24T11:00:00Z',
        updatedAt: '2026-03-24T11:05:00Z',
        userId: 'usr-1',
        reference: 'ref-2',
        metadata: null,
      },
    ]);

    expect(result).toHaveLength(2);
    expect(result[1]).toMatchObject({
      id: 'tx-2',
      type: 'expense',
      category: 'shopping',
      status: 'pending',
    });
  });
});
