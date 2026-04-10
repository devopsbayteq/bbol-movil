import type {HttpClient} from '../../../../../data/api/HttpClient';
import type {ApiResponseModel} from '../../../../../data/models/ApiResponseModel';
import type {TransferContentModel} from '../../../../../data/models/TransferContentModel';
import type {TransferRequest} from '../../../../../data/models/TransferRequest';

export class TransferRemoteDataSource {
  constructor(private readonly httpClient: HttpClient) {}

  async transfer(request: TransferRequest): Promise<TransferContentModel> {
    try {
      const response = await this.httpClient.post<
        ApiResponseModel<TransferContentModel>
      >('Transaction/transfer', request);

      if (response.data.responseType === 'Error' || !response.data.content) {
        throw new Error(
          response.data.message ||
            'No se pudo completar la transferencia. Por favor intente nuevamente.',
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
