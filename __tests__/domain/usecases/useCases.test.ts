import {GetBeneficiaryContactsUseCase} from '../../../src/domain/usecases/GetBeneficiaryContactsUseCase';
import {GetHomeContractBalanceUseCase} from '../../../src/domain/usecases/GetHomeContractBalanceUseCase';
import {GetPublicKeyUseCase} from '../../../src/domain/usecases/GetPublicKeyUseCase';
import {GetTransactionsUseCase} from '../../../src/domain/usecases/GetTransactionsUseCase';
import {GetUserLoggedUseCase} from '../../../src/domain/usecases/GetUserLoggedUseCase';
import {LoginUseCase} from '../../../src/domain/usecases/LoginUseCase';
import {ValidateOtpUseCase} from '../../../src/domain/usecases/ValidateOtpUseCase';

describe('domain use cases', () => {
  test('LoginUseCase trims credentials, persists session and returns user', async () => {
    const user = {
      id: 'test@gmail.com',
      email: 'test@gmail.com',
      name: 'test',
      token: 'jwt-token',
    };
    const authRepository = {
      login: jest.fn().mockResolvedValue(user),
    };
    const secureStorage = {
      save: jest.fn().mockResolvedValue(undefined),
    };
    const useCase = new LoginUseCase(
      authRepository,
      secureStorage,
      '@bb_user_session',
    );

    const result = await useCase.execute('  test@gmail.com  ', '  123456  ');

    expect(authRepository.login).toHaveBeenCalledWith(
      'test@gmail.com',
      '123456',
    );
    expect(secureStorage.save).toHaveBeenCalledWith(
      '@bb_user_session',
      JSON.stringify(user),
    );
    expect(result.token).toBe('jwt-token');
  });

  test('LoginUseCase rejects invalid email before calling repository', async () => {
    const authRepository = {
      login: jest.fn(),
    };
    const secureStorage = {save: jest.fn()};
    const useCase = new LoginUseCase(
      authRepository,
      secureStorage,
      '@bb_user_session',
    );

    await expect(useCase.execute('correo-invalido', '123456')).rejects.toThrow(
      'El formato del email no es válido',
    );
    expect(authRepository.login).not.toHaveBeenCalled();
    expect(secureStorage.save).not.toHaveBeenCalled();
  });

  test('LoginUseCase rejects invalid password before calling repository', async () => {
    const authRepository = {login: jest.fn()};
    const secureStorage = {save: jest.fn()};
    const useCase = new LoginUseCase(
      authRepository,
      secureStorage,
      '@bb_user_session',
    );

    await expect(
      useCase.execute('test@gmail.com', '12345'),
    ).rejects.toThrow('La contraseña debe tener al menos 6 caracteres');
    expect(authRepository.login).not.toHaveBeenCalled();
    expect(secureStorage.save).not.toHaveBeenCalled();
  });

  test('GetPublicKeyUseCase trims and stores the received key', async () => {
    const securityRepository = {
      getPublicKey: jest.fn().mockResolvedValue({value: '  PUBLIC_KEY  '}),
    };
    const secureStorage = {
      save: jest.fn().mockResolvedValue(undefined),
    };
    const useCase = new GetPublicKeyUseCase(
      securityRepository,
      secureStorage,
      'server-key',
    );

    const result = await useCase.execute();

    expect(securityRepository.getPublicKey).toHaveBeenCalledTimes(1);
    expect(secureStorage.save).toHaveBeenCalledWith('server-key', 'PUBLIC_KEY');
    expect(result).toEqual({value: 'PUBLIC_KEY'});
  });

  test('GetPublicKeyUseCase rejects an empty public key', async () => {
    const securityRepository = {
      getPublicKey: jest.fn().mockResolvedValue({value: '   '}),
    };
    const secureStorage = {
      save: jest.fn(),
    };
    const useCase = new GetPublicKeyUseCase(
      securityRepository,
      secureStorage,
      'server-key',
    );

    await expect(useCase.execute()).rejects.toThrow(
      'La clave pública recibida no es válida',
    );
    expect(secureStorage.save).not.toHaveBeenCalled();
  });

  test('GetTransactionsUseCase returns repository transactions', async () => {
    const transactionRepository = {
      getTransactions: jest.fn().mockResolvedValue([
        {
          id: '1',
          description: 'Depósito',
          amount: 100,
          date: '2026-03-28',
          type: 'income' as const,
          category: 'salary' as const,
          status: 'completed' as const,
        },
      ]),
    };
    const useCase = new GetTransactionsUseCase(transactionRepository);

    const result = await useCase.execute();

    expect(transactionRepository.getTransactions).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
    expect(result[0].description).toBe('Depósito');
  });

  test('ValidateOtpUseCase delegates to security repository', async () => {
    const securityRepository = {
      validateOtp: jest.fn().mockResolvedValue({message: 'OK'}),
    };
    const useCase = new ValidateOtpUseCase(securityRepository);

    await expect(useCase.execute('123456')).resolves.toEqual({message: 'OK'});
    expect(securityRepository.validateOtp).toHaveBeenCalledWith('123456');
  });

  test('GetUserLoggedUseCase parses stored JSON user', async () => {
    const user = {id: '1', email: 'a@b.com', name: 'A', token: 't'};
    const secureStorage = {
      get: jest.fn().mockResolvedValue(JSON.stringify(user)),
    };
    const useCase = new GetUserLoggedUseCase(secureStorage, '@key');

    await expect(useCase.execute()).resolves.toEqual(user);
    expect(secureStorage.get).toHaveBeenCalledWith('@key');
  });

  test('GetUserLoggedUseCase throws when no session is stored', async () => {
    const secureStorage = {get: jest.fn().mockResolvedValue(null)};
    const useCase = new GetUserLoggedUseCase(secureStorage, '@key');

    await expect(useCase.execute()).rejects.toThrow('No se encontró el usuario.');
  });

  test('GetHomeContractBalanceUseCase returns repository balance', async () => {
    const contractBalanceRepository = {
      getHomeBalance: jest.fn().mockResolvedValue({
        accounts: [],
        creditCards: [],
        loans: [],
        investments: [],
        frequentPayments: [],
      }),
    };
    const useCase = new GetHomeContractBalanceUseCase(contractBalanceRepository);

    const result = await useCase.execute();

    expect(contractBalanceRepository.getHomeBalance).toHaveBeenCalledTimes(1);
    expect(result.accounts).toEqual([]);
  });

  test('GetBeneficiaryContactsUseCase returns repository contacts', async () => {
    const beneficiaryRepository = {
      getContacts: jest.fn().mockResolvedValue([
        {
          beneficiaryGuid: 'g1',
          contactName: 'Ana',
          bankName: 'BB',
          accountType: 1,
          lastFourDigits: '1234',
        },
      ]),
    };
    const useCase = new GetBeneficiaryContactsUseCase(beneficiaryRepository);

    const result = await useCase.execute();

    expect(beneficiaryRepository.getContacts).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
    expect(result[0].contactName).toBe('Ana');
  });
});
