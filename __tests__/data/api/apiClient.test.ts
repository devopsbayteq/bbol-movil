import axios from 'axios';
import {AxiosHttpClient} from '../../../src/data/api/apiClient';

jest.mock('axios');

describe('AxiosHttpClient', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const axiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(),
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue(axiosInstance as never);
  });

  test('creates the axios instance with banking default headers', () => {
    const secureStorage = {get: jest.fn().mockResolvedValue(null)};

    new AxiosHttpClient(
      'https://api.bank.test',
      secureStorage,
      '@bb_auth_token',
      {Authorization: 'Bearer demo'},
    );

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://api.bank.test',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Platform': 'Android',
        'X-Timezone': 'America/Guayaquil',
        'X-RequestId': 'ea18410a-4fcb-48b7-a927-25c0161ae11a',
        'X-Time': '1775063630',
        Authorization: 'Bearer demo',
      },
      timeout: 15000,
    });
    expect(axiosInstance.interceptors.request.use).toHaveBeenCalled();
  });

  test('request interceptor sets Authorization when a token exists in secure storage', async () => {
    const secureStorage = {get: jest.fn().mockResolvedValue('session-jwt')};
    let requestInterceptor: (config: {
      headers: {set: jest.Mock};
    }) => Promise<typeof config>;

    axiosInstance.interceptors.request.use = jest.fn(fn => {
      requestInterceptor = fn as typeof requestInterceptor;
      return 0;
    });

    new AxiosHttpClient(
      'https://api.bank.test',
      secureStorage,
      '@bb_auth_token',
    );

    const headers = {set: jest.fn()};
    await requestInterceptor!({headers});

    expect(secureStorage.get).toHaveBeenCalledWith('@bb_auth_token');
    expect(headers.set).toHaveBeenCalledWith(
      'Authorization',
      'Bearer session-jwt',
    );
  });

  test('request interceptor does not set Authorization when token is absent', async () => {
    const secureStorage = {get: jest.fn().mockResolvedValue(null)};
    let requestInterceptor: (config: {
      headers: {set: jest.Mock};
    }) => Promise<typeof config>;

    axiosInstance.interceptors.request.use = jest.fn(fn => {
      requestInterceptor = fn as typeof requestInterceptor;
      return 0;
    });

    new AxiosHttpClient(
      'https://api.bank.test',
      secureStorage,
      '@bb_auth_token',
    );

    const headers = {set: jest.fn()};
    await requestInterceptor!({headers});

    expect(headers.set).not.toHaveBeenCalled();
  });

  test('wraps HTTP verbs and returns only data and status', async () => {
    const secureStorage = {get: jest.fn().mockResolvedValue(null)};
    axiosInstance.get.mockResolvedValue({data: {value: 'g'}, status: 200});
    axiosInstance.post.mockResolvedValue({data: {value: 'p'}, status: 201});
    axiosInstance.put.mockResolvedValue({data: {value: 'u'}, status: 202});
    axiosInstance.delete.mockResolvedValue({data: {value: 'd'}, status: 204});

    const client = new AxiosHttpClient(
      'https://api.bank.test',
      secureStorage,
      '@bb_auth_token',
    );

    await expect(client.get('/health')).resolves.toEqual({
      data: {value: 'g'},
      status: 200,
    });
    await expect(client.post('/login', {user: 'demo'})).resolves.toEqual({
      data: {value: 'p'},
      status: 201,
    });
    await expect(client.put('/user', {name: 'demo'})).resolves.toEqual({
      data: {value: 'u'},
      status: 202,
    });
    await expect(client.delete('/logout')).resolves.toEqual({
      data: {value: 'd'},
      status: 204,
    });
  });
});
