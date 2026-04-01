import {AuthRemoteDataSource} from '../../../src/data/datasources/auth/AuthRemoteDataSource';
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
});
