import type {HttpClient} from '../../../../../data/api/HttpClient';
import type {ApiResponseModel} from '../../../../../data/models/ApiResponseModel';
import type {ValidateTransactionAmountContentModel} from '../../../../../data/models/ValidateTransactionAmountContentModel';
import type {ValidateTransactionAmountRequest} from '../../../../../data/models/ValidateTransactionAmountRequest';

export class TransferAmountValidationRemoteDataSource {
  constructor(private readonly httpClient: HttpClient) {}

  async validateTransactionAmount(
    request: ValidateTransactionAmountRequest,
  ): Promise<ValidateTransactionAmountContentModel> {
    try {
      const response = await this.httpClient.post<
        ApiResponseModel<ValidateTransactionAmountContentModel>
      >('Security/validate-transaction-amount', request);

      if (response.data.responseType === 'Error' || !response.data.content) {
        throw new Error(
          response.data.message ||
            'No se pudo validar el monto. Por favor intente nuevamente.',
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
