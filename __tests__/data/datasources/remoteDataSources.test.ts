import {AuthRemoteDataSource} from '../../../src/data/datasources/auth/AuthRemoteDataSource';
import {BeneficiaryRemoteDataSource} from '../../../src/data/datasources/beneficiary/BeneficiaryRemoteDataSource';
import {ContractBalanceRemoteDataSource} from '../../../src/data/datasources/contractBalance/ContractBalanceRemoteDataSource';
import {SecurityRemoteDataSource} from '../../../src/data/datasources/security/SecurityRemoteDataSource';

describe('remote data sources', () => {
  test('AuthRemoteDataSource returns login content on successful response', async () => {
    const httpClient = {
      post: jest.fn().mockResolvedValue({
        data: {
          code: 200,
          responseType: 'Success',
          message: 'OK',
          content: {accessToken: 'jwt-token'},
        },
      }),
    };
    const dataSource = new AuthRemoteDataSource(httpClient);

    await expect(
      dataSource.login({username: 'cliente@banco.com', password: '123456'}),
    ).resolves.toEqual({accessToken: 'jwt-token'});
    expect(httpClient.post).toHaveBeenCalledWith('Authentication/login', {
      username: 'cliente@banco.com',
      password: '123456',
    });
  });

  test('AuthRemoteDataSource propagates API business errors', async () => {
    const httpClient = {
      post: jest.fn().mockResolvedValue({
        data: {
          code: 401,
          responseType: 'Error',
          message: 'Credenciales inválidas',
          content: undefined,
        },
      }),
    };
    const dataSource = new AuthRemoteDataSource(httpClient);

    await expect(
      dataSource.login({username: 'cliente@banco.com', password: 'bad-pass'}),
    ).rejects.toThrow('Credenciales inválidas');
  });

  test('AuthRemoteDataSource normalizes non-Error failures', async () => {
    const httpClient = {
      post: jest.fn().mockRejectedValue('network-down'),
    };
    const dataSource = new AuthRemoteDataSource(httpClient);

    await expect(
      dataSource.login({username: 'cliente@banco.com', password: '123456'}),
    ).rejects.toThrow('Error de conexión con el servidor');
  });

  test('SecurityRemoteDataSource returns public key content on success', async () => {
    const httpClient = {
      get: jest.fn().mockResolvedValue({
        data: {
          code: 200,
          responseType: 'Success',
          message: 'OK',
          content: {publicKey: 'PUBLIC_KEY'},
        },
      }),
    };
    const dataSource = new SecurityRemoteDataSource(httpClient);

    await expect(dataSource.getPublicKey()).resolves.toEqual({
      publicKey: 'PUBLIC_KEY',
    });
  });

  test('SecurityRemoteDataSource propagates API business errors', async () => {
    const httpClient = {
      get: jest.fn().mockResolvedValue({
        data: {
          code: 500,
          responseType: 'Error',
          message: 'No se pudo obtener la clave pública',
          content: undefined,
        },
      }),
    };
    const dataSource = new SecurityRemoteDataSource(httpClient);

    await expect(dataSource.getPublicKey()).rejects.toThrow(
      'No se pudo obtener la clave pública',
    );
  });

  test('SecurityRemoteDataSource normalizes non-Error failures', async () => {
    const httpClient = {
      get: jest.fn().mockRejectedValue({status: 503}),
    };
    const dataSource = new SecurityRemoteDataSource(httpClient);

    await expect(dataSource.getPublicKey()).rejects.toThrow(
      'Error de conexión con el servidor',
    );
  });

  test('SecurityRemoteDataSource validateOtp returns content on success', async () => {
    const httpClient = {
      post: jest.fn().mockResolvedValue({
        data: {
          code: 200,
          responseType: 'Success',
          message: 'OK',
          content: {userMessage: 'OTP validado'},
        },
      }),
    };
    const dataSource = new SecurityRemoteDataSource(httpClient);

    await expect(dataSource.validateOtp({otp: '123456'})).resolves.toEqual({
      userMessage: 'OTP validado',
    });
    expect(httpClient.post).toHaveBeenCalledWith('Security/validate-otp', {
      otp: '123456',
    });
  });

  test('SecurityRemoteDataSource validateOtp normalizes non-Error failures', async () => {
    const httpClient = {
      post: jest.fn().mockRejectedValue(undefined),
    };
    const dataSource = new SecurityRemoteDataSource(httpClient);

    await expect(dataSource.validateOtp({otp: '111111'})).rejects.toThrow(
      'Error de conexión con el servidor',
    );
  });

  test('SecurityRemoteDataSource validateOtp propagates API errors', async () => {
    const httpClient = {
      post: jest.fn().mockResolvedValue({
        data: {
          code: 400,
          responseType: 'Error',
          message: 'Código incorrecto',
          content: undefined,
        },
      }),
    };
    const dataSource = new SecurityRemoteDataSource(httpClient);

    await expect(dataSource.validateOtp({otp: '000000'})).rejects.toThrow(
      'Código incorrecto',
    );
  });

  test('BeneficiaryRemoteDataSource normalizes non-Error failures', async () => {
    const httpClient = {
      get: jest.fn().mockRejectedValue('timeout'),
    };
    const dataSource = new BeneficiaryRemoteDataSource(httpClient);

    await expect(dataSource.getContacts()).rejects.toThrow(
      'Error de conexión con el servidor',
    );
  });

  test('BeneficiaryRemoteDataSource returns contacts on success', async () => {
    const httpClient = {
      get: jest.fn().mockResolvedValue({
        data: {
          responseType: 'Success',
          message: 'OK',
          content: {contacts: []},
        },
      }),
    };
    const dataSource = new BeneficiaryRemoteDataSource(httpClient);

    await expect(dataSource.getContacts()).resolves.toEqual({contacts: []});
    expect(httpClient.get).toHaveBeenCalledWith('Beneficiary/contacts');
  });

  test('ContractBalanceRemoteDataSource normalizes non-Error failures', async () => {
    const httpClient = {
      get: jest.fn().mockRejectedValue(null),
    };
    const dataSource = new ContractBalanceRemoteDataSource(httpClient);

    await expect(dataSource.getHome()).rejects.toThrow(
      'Error de conexión con el servidor',
    );
  });

  test('ContractBalanceRemoteDataSource returns home balance on success', async () => {
    const httpClient = {
      get: jest.fn().mockResolvedValue({
        data: {
          responseType: 'Success',
          message: 'OK',
          content: {
            accounts: [],
            creditCards: [],
            loans: [],
            investments: [],
            frequentPayments: [],
          },
        },
      }),
    };
    const dataSource = new ContractBalanceRemoteDataSource(httpClient);

    const result = await dataSource.getHome();

    expect(result.accounts).toEqual([]);
    expect(httpClient.get).toHaveBeenCalledWith('ContractBalance/home');
  });
});
