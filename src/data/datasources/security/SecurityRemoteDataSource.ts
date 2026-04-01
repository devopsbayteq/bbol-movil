import axios from 'axios';
import {devLog, devWarn} from '../../api/devLog';
import {HttpClient} from '../../api/HttpClient';
import type {
  CertificateEnvelopeResponse,
  CertificateRequest,
} from '../../models/CertificateModels';

const LOG_AREA = 'Security/certificate';

export class SecurityRemoteDataSource {
  constructor(private readonly httpClient: HttpClient) {}

  async postCertificate(
    body: CertificateRequest,
  ): Promise<CertificateEnvelopeResponse> {
    const path = 'security/certificate';
    devLog(LOG_AREA, 'POST iniciado', {
      path,
      // Solo metadatos; no se registran los Base64 del body
      bodyFieldsPresent: {
        secretEncryptBase64: body.secretEncryptBase64,
        secretEncryptSignBase64: body.secretEncryptSignBase64,
        secretIvEncryptBase64: body.secretIvEncryptBase64,
      },
    });

    try {
      const response = await this.httpClient.post<CertificateEnvelopeResponse>(
        path,
        body,
      );
      const envelope = response.data;
      devLog(LOG_AREA, 'POST respuesta OK', {
        httpStatus: response.status,
        code: envelope.code,
        responseType: envelope.responseType,
        message: envelope.message,
        hasContent: Boolean(envelope.content ?? envelope.data),
        validateHash: envelope.content?.validateHash ?? envelope.data?.validateHash,
      });
      return envelope;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        devWarn(LOG_AREA, 'POST error HTTP', {
          message: error.message,
          httpStatus: error.response?.status,
          responseType:
            typeof error.response?.data === 'object' &&
            error.response?.data !== null &&
            'responseType' in error.response.data
              ? (error.response.data as {responseType?: string}).responseType
              : undefined,
          serverMessage:
            typeof error.response?.data === 'object' &&
            error.response?.data !== null &&
            'message' in error.response.data
              ? String((error.response.data as {message?: unknown}).message)
              : undefined,
        });
      } else {
        devWarn(LOG_AREA, 'POST error', {
          message: error instanceof Error ? error.message : String(error),
        });
      }
      throw error;
    }
  }
}
