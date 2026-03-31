import axios, {AxiosInstance} from 'axios';
import {HttpClient, HttpResponse, RequestConfig} from './HttpClient';

export class AxiosHttpClient implements HttpClient {
  private readonly client: AxiosInstance;

  constructor(
    baseURL: string,
    defaultHeaders?: Record<string, string>,
    timeout = 15000,
  ) {
    this.client = axios.create({
      baseURL,
      headers: {'Content-Type': 'application/json', ...defaultHeaders},
      timeout,
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
