import {HttpClient} from '../../api/HttpClient';
import {ApiResponseModel} from '../../models/ApiResponseModel';
import {LoginRequestModel} from '../../models/LoginRequestModel';
import {LoginResponseModel} from '../../models/LoginResponseModel';
import {AuthDataSource} from './AuthDataSource';

export class AuthRemoteDataSource implements AuthDataSource {
  constructor(private readonly httpClient: HttpClient) {}

  async login(request: LoginRequestModel): Promise<LoginResponseModel> {
    try {
      const response = await this.httpClient.post<
        ApiResponseModel<LoginResponseModel>
      >('/Auth/login', request);

      if (response.data.responseType === 'Error' || !response.data.data) {
        throw new Error(response.data.message || 'Error de autenticación');
      }

      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión con el servidor');
    }
  }
}
