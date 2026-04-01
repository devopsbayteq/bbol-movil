import {HttpClient} from '../../api/HttpClient';
import {ApiResponseModel} from '../../models/ApiResponseModel';
import { OtpValidationRequest } from '../../models/OtpValidationRequest';
import { OtpValidationResponse } from '../../models/OtpValidationResponse';
import {PublicKeyContentModel} from '../../models/PublicKeyContentModel';

export class SecurityRemoteDataSource {
  constructor(private readonly httpClient: HttpClient) {}

  async getPublicKey(): Promise<PublicKeyContentModel> {
    try {
      const response = await this.httpClient.get<
        ApiResponseModel<PublicKeyContentModel>
      >('Security/public-key');

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
  async validateOtp(request: OtpValidationRequest): Promise<OtpValidationResponse> {
    try {
      const response = await this.httpClient.post<
        ApiResponseModel<OtpValidationResponse>
      >('Security/validate-otp', request);

      if (response.data.responseType === 'Error' || !response.data.content) {
        throw new Error(
          response.data.message || 'Error al validar el OTP. Por favor intente nuevamente.',
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
