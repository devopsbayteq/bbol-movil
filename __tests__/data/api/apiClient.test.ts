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
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue(axiosInstance as never);
    jest.spyOn(Date.prototype, 'getTime').mockReturnValue(123456789);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('creates the axios instance with banking default headers', () => {
    new AxiosHttpClient('https://api.bank.test', {Authorization: 'Bearer demo'});

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://api.bank.test',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer demo',
        'X-Platform': 'Android',
        'X-Time': 123456789,
      },
      timeout: 15000,
    });
  });

  test('wraps HTTP verbs and returns only data and status', async () => {
    axiosInstance.get.mockResolvedValue({data: {value: 'g'}, status: 200});
    axiosInstance.post.mockResolvedValue({data: {value: 'p'}, status: 201});
    axiosInstance.put.mockResolvedValue({data: {value: 'u'}, status: 202});
    axiosInstance.delete.mockResolvedValue({data: {value: 'd'}, status: 204});

    const client = new AxiosHttpClient('https://api.bank.test');

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
