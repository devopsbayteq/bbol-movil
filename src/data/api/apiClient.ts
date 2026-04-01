import axios, {AxiosInstance} from 'axios';
import {SecureStorageService} from '../../domain/services/SecureStorageService';
import {HttpClient, HttpResponse, RequestConfig} from './HttpClient';

export class AxiosHttpClient implements HttpClient {
  private readonly client: AxiosInstance;

  constructor(
    baseURL: string,
    secureStorageService: SecureStorageService,
    authTokenStorageKey: string,
    defaultHeaders?: Record<string, string>,
    timeout = 15000,
  ) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Platform': 'Android',
        'X-Timezone': 'America/Guayaquil',
        'X-RequestId': 'ea18410a-4fcb-48b7-a927-25c0161ae11a',
        'X-Time': '1775063630',
        ...defaultHeaders},
      timeout,
    });

    this.client.interceptors.request.use(async config => {
      const token = await secureStorageService.get(authTokenStorageKey);
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
      return config;
    });
  }

  async get<T>(
    url: string,
    config?: RequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.client.get<T>(url, config);
    return {data: response.data, status: response.status};
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.client.post<T>(url, data, config);
    return {data: response.data, status: response.status};
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.client.put<T>(url, data, config);
    return {data: response.data, status: response.status};
  }

  async delete<T>(
    url: string,
    config?: RequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.client.delete<T>(url, config);
    return {data: response.data, status: response.status};
  }
}
