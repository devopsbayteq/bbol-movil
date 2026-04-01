import {AuthRepositoryImpl} from '../../../src/data/repositories/AuthRepositoryImpl';
import {BeneficiaryRepositoryImpl} from '../../../src/data/repositories/BeneficiaryRepositoryImpl';
import {ContractBalanceRepositoryImpl} from '../../../src/data/repositories/ContractBalanceRepositoryImpl';
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
      validateOtp: jest.fn(),
    };
    const repository = new SecurityRepositoryImpl(remoteDataSource);

    await expect(repository.getPublicKey()).resolves.toEqual({
      value: 'PUBLIC_KEY',
    });
  });

  test('SecurityRepositoryImpl maps OTP validation response to entity', async () => {
    const remoteDataSource = {
      getPublicKey: jest.fn(),
      validateOtp: jest.fn().mockResolvedValue({userMessage: 'Validado'}),
    };
    const repository = new SecurityRepositoryImpl(remoteDataSource);

    await expect(repository.validateOtp('123456')).resolves.toEqual({
      message: 'Validado',
    });
    expect(remoteDataSource.validateOtp).toHaveBeenCalledWith({otp: '123456'});
  });

  test('BeneficiaryRepositoryImpl maps contacts content to entities', async () => {
    const dataSource = {
      getContacts: jest.fn().mockResolvedValue({
        contacts: [
          {
            beneficiaryGuid: 'g1',
            contactName: 'Ana',
            bankName: 'BB',
            accountType: 1,
            lastFourDigits: '4242',
          },
        ],
      }),
    };
    const repository = new BeneficiaryRepositoryImpl(dataSource);

    const result = await repository.getContacts();

    expect(result).toEqual([
      {
        beneficiaryGuid: 'g1',
        contactName: 'Ana',
        bankName: 'BB',
        accountType: 1,
        lastFourDigits: '4242',
      },
    ]);
  });

  test('ContractBalanceRepositoryImpl maps home content to entity', async () => {
    const dataSource = {
      getHome: jest.fn().mockResolvedValue({
        accounts: [
          {
            accountGuid: 'a1',
            maskedAccountNumber: '****1111',
            accountType: 1,
            balance: 100,
          },
        ],
        creditCards: [],
        loans: [],
        investments: [],
        frequentPayments: [],
      }),
    };
    const repository = new ContractBalanceRepositoryImpl(dataSource);

    const result = await repository.getHomeBalance();

    expect(result.accounts).toHaveLength(1);
    expect(result.accounts[0]).toMatchObject({
      accountGuid: 'a1',
      accountKind: 'savings',
      balance: 100,
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
