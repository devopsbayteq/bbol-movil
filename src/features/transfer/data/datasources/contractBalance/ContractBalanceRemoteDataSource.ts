import type {HttpClient} from '../../../../../data/api/HttpClient';
import type {ApiResponseModel} from '../../models/ApiResponseModel';
import type {ContractBalanceContentModel} from '../../models/ContractBalanceContentModel';
import type {ContractBalanceDataSource} from './ContractBalanceDataSource';

export class ContractBalanceRemoteDataSource implements ContractBalanceDataSource {
  constructor(private readonly httpClient: HttpClient) {}

  async getHome(): Promise<ContractBalanceContentModel> {
    try {
      const response = await this.httpClient.get<
        ApiResponseModel<ContractBalanceContentModel>
      >('ContractBalance/home');

      if (response.data.responseType === 'Error' || !response.data.content) {
        throw new Error(
          response.data.message || 'No se pudo cargar el resumen de productos',
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
