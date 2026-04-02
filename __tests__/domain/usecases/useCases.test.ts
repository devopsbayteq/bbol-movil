import {GetBeneficiaryContactsUseCase} from '../../../src/domain/usecases/GetBeneficiaryContactsUseCase';
import {GetHomeContractBalanceUseCase} from '../../../src/domain/usecases/GetHomeContractBalanceUseCase';
import {GetPublicKeyUseCase} from '../../../src/domain/usecases/GetPublicKeyUseCase';
import {GetTransactionsUseCase} from '../../../src/domain/usecases/GetTransactionsUseCase';
import {GetUserLoggedUseCase} from '../../../src/domain/usecases/GetUserLoggedUseCase';
import {LoginUseCase} from '../../../src/domain/usecases/LoginUseCase';
import {ValidateOtpUseCase} from '../../../src/domain/usecases/ValidateOtpUseCase';
import * as rsaUtils from '../../../src/security/certificate/rsaUtils';

describe('domain use cases', () => {
  test('LoginUseCase trims credentials, persists session and returns user', async () => {
    const user = {
      id: 'usuario01',
      email: 'usuario01',
      name: 'Usuario Demo',
      token: 'jwt-token',
    };
    const authRepository = {
      login: jest.fn().mockResolvedValue(user),
    };
    const secureStorage = {
      save: jest.fn().mockResolvedValue(undefined),
    };
    const getPublicKeyUseCase = {
      execute: jest.fn().mockResolvedValue({value: 'server-public-key-material'}),
    };
    const encryptSpy = jest
      .spyOn(rsaUtils, 'rsaOaepEncryptUtf8MaterialPemBase64ToDoubleBase64')
      .mockReturnValue('enc-blob');
    const useCase = new LoginUseCase(
      authRepository,
      secureStorage as never,
      '@bb_user_session',
      getPublicKeyUseCase as never,
      '@auth_token',
    );

    const result = await useCase.execute('  usuario01  ', '  123456  ');

    expect(getPublicKeyUseCase.execute).toHaveBeenCalledTimes(1);
    expect(encryptSpy).toHaveBeenCalledTimes(2);
    expect(authRepository.login).toHaveBeenCalledWith(
      'usuario01',
      '123456',
    );
    expect(secureStorage.save).toHaveBeenCalledWith(
      '@bb_user_session',
      JSON.stringify(user),
    );
    expect(secureStorage.save).toHaveBeenCalledWith('@auth_token', 'jwt-token');
    expect(result.token).toBe('jwt-token');
    encryptSpy.mockRestore();
  });

  test('LoginUseCase rejects usuario vacío before calling repository', async () => {
    const authRepository = {
      login: jest.fn(),
    };
    const secureStorage = {save: jest.fn()};
    const getPublicKeyUseCase = {execute: jest.fn()};
    const useCase = new LoginUseCase(
      authRepository,
      secureStorage as never,
      '@bb_user_session',
      getPublicKeyUseCase as never,
      '@auth_token',
    );

    await expect(useCase.execute('', '123456')).rejects.toThrow(
      'El usuario es requerido',
    );
    expect(authRepository.login).not.toHaveBeenCalled();
    expect(secureStorage.save).not.toHaveBeenCalled();
  });

  test('LoginUseCase rejects invalid password before calling repository', async () => {
    const authRepository = {login: jest.fn()};
    const secureStorage = {save: jest.fn()};
    const getPublicKeyUseCase = {execute: jest.fn()};
    const useCase = new LoginUseCase(
      authRepository,
      secureStorage as never,
      '@bb_user_session',
      getPublicKeyUseCase as never,
      '@auth_token',
    );

    await expect(
      useCase.execute('usuario01', '12345'),
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
      securityRepository as never,
      secureStorage as never,
      'server-key',
    );

    const result = await useCase.execute();

    expect(securityRepository.getPublicKey).toHaveBeenCalledTimes(1);
    expect(secureStorage.save).toHaveBeenCalledWith('server-key', 'PUBLIC/KEY');
    expect(result).toEqual({value: 'PUBLIC/KEY'});
  });

  test('GetPublicKeyUseCase rejects an empty public key', async () => {
    const securityRepository = {
      getPublicKey: jest.fn().mockResolvedValue({value: '   '}),
    };
    const secureStorage = {
      save: jest.fn(),
    };
    const useCase = new GetPublicKeyUseCase(
      securityRepository as never,
      secureStorage as never,
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

  test('ValidateOtpUseCase encrypts OTP with server public key then delegates to repository', async () => {
    const securityRepository = {
      validateOtp: jest.fn().mockResolvedValue({message: 'OK'}),
    };
    const getPublicKeyUseCase = {
      execute: jest.fn().mockResolvedValue({value: 'server-public-key-material'}),
    };
    const encryptSpy = jest
      .spyOn(rsaUtils, 'rsaOaepEncryptUtf8MaterialPemBase64ToDoubleBase64')
      .mockReturnValue('enc-otp');
    const useCase = new ValidateOtpUseCase(
      securityRepository as never,
      getPublicKeyUseCase as never,
    );

    await expect(useCase.execute('123456')).resolves.toEqual({message: 'OK'});
    expect(getPublicKeyUseCase.execute).toHaveBeenCalledTimes(1);
    expect(encryptSpy).toHaveBeenCalledWith(
      'server-public-key-material',
      '123456',
    );
    expect(securityRepository.validateOtp).toHaveBeenCalledWith('enc-otp');
    encryptSpy.mockRestore();
  });

  test('GetUserLoggedUseCase parses stored JSON user', async () => {
    const user = {id: '1', email: 'a@b.com', name: 'A', token: 't'};
    const secureStorage = {
      get: jest.fn().mockResolvedValue(JSON.stringify(user)),
    };
    const useCase = new GetUserLoggedUseCase(secureStorage as never, '@key');

    await expect(useCase.execute()).resolves.toEqual(user);
    expect(secureStorage.get).toHaveBeenCalledWith('@key');
  });

  test('GetUserLoggedUseCase throws when no session is stored', async () => {
    const secureStorage = {get: jest.fn().mockResolvedValue(null)};
    const useCase = new GetUserLoggedUseCase(secureStorage as never, '@key');

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
