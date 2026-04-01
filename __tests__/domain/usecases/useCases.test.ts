import {GetPublicKeyUseCase} from '../../../src/domain/usecases/GetPublicKeyUseCase';
import {GetTransactionsUseCase} from '../../../src/domain/usecases/GetTransactionsUseCase';
import {LoginUseCase} from '../../../src/domain/usecases/LoginUseCase';

describe('domain use cases', () => {
  test('LoginUseCase trims credentials and delegates login', async () => {
    const authRepository = {
      login: jest.fn().mockResolvedValue({
        id: 'test@gmail.com',
        email: 'test@gmail.com',
        name: 'test',
        token: 'jwt-token',
      }),
    };
    const useCase = new LoginUseCase(authRepository);

    const result = await useCase.execute('  test@gmail.com  ', '  123456  ');

    expect(authRepository.login).toHaveBeenCalledWith(
      'test@gmail.com',
      '123456',
    );
    expect(result.token).toBe('jwt-token');
  });

  test('LoginUseCase rejects invalid email before calling repository', async () => {
    const authRepository = {
      login: jest.fn(),
    };
    const useCase = new LoginUseCase(authRepository);

    await expect(useCase.execute('correo-invalido', '123456')).rejects.toThrow(
      'El formato del email no es válido',
    );
    expect(authRepository.login).not.toHaveBeenCalled();
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
});
