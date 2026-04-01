import {AuthRepositoryImpl} from '../../../src/data/repositories/AuthRepositoryImpl';
import {SecurityRepositoryImpl} from '../../../src/data/repositories/SecurityRepositoryImpl';
import {TransactionRepositoryImpl} from '../../../src/data/repositories/TransactionRepositoryImpl';

describe('data repositories', () => {
  test('AuthRepositoryImpl maps datasource login response to a user entity', async () => {
    const dataSource = {
      login: jest.fn().mockResolvedValue({accessToken: 'access-token'}),
    };
    const repository = new AuthRepositoryImpl(dataSource);

    const result = await repository.login('cliente@banco.com', '123456');

    expect(dataSource.login).toHaveBeenCalledWith({
      username: 'cliente@banco.com',
      password: '123456',
    });
    expect(result).toMatchObject({
      id: 'cliente@banco.com',
      email: 'cliente@banco.com',
      name: 'cliente',
      token: 'access-token',
    });
  });

  test('SecurityRepositoryImpl maps remote public key content', async () => {
    const remoteDataSource = {
      getPublicKey: jest.fn().mockResolvedValue({publicKey: 'PUBLIC_KEY'}),
    };
    const repository = new SecurityRepositoryImpl(remoteDataSource);

    await expect(repository.getPublicKey()).resolves.toEqual({
      value: 'PUBLIC_KEY',
    });
  });

  test('TransactionRepositoryImpl maps datasource transactions to entities', async () => {
    const dataSource = {
      getTransactions: jest.fn().mockResolvedValue([
        {
          id: 'tx-1',
          description: 'Pago de servicio',
          amount: 42,
          date: '2026-03-24',
          type: 'expense',
          category: 'services',
          status: 'completed',
          createdAt: '2026-03-24T09:30:00Z',
          updatedAt: '2026-03-24T09:35:00Z',
          userId: 'usr-1',
          reference: 'CFE-001',
          metadata: null,
        },
      ]),
    };
    const repository = new TransactionRepositoryImpl(dataSource);

    const result = await repository.getTransactions();

    expect(result).toEqual([
      {
        id: 'tx-1',
        description: 'Pago de servicio',
        amount: 42,
        date: '2026-03-24',
        type: 'expense',
        category: 'services',
        status: 'completed',
      },
    ]);
  });
});
