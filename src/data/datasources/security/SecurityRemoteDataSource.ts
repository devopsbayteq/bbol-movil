import {HttpClient} from '../../api/HttpClient';
import {ApiResponseModel} from '../../models/ApiResponseModel';
import {PublicKeyContentModel} from '../../models/PublicKeyContentModel';

export class SecurityRemoteDataSource {
  constructor(private readonly httpClient: HttpClient) {}

  async getPublicKey(): Promise<PublicKeyContentModel> {
    try {
      const response = await this.httpClient.get<
        ApiResponseModel<PublicKeyContentModel>
      >('/api/v1/Security/public-key');

      if (response.data.responseType === 'Error' || !response.data.content) {
        throw new Error(
          response.data.message || 'No se pudo obtener la clave pública',
        );
      }

      return response.data.content;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión con el servidor');
    }
  }
}
