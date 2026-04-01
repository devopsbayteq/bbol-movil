import {v4 as uuidv4} from 'uuid';
import {LoginUseCase} from '../domain/usecases/LoginUseCase';
import {GetTransactionsUseCase} from '../domain/usecases/GetTransactionsUseCase';
import {RunCertificateHandshakeUseCase} from '../domain/usecases/RunCertificateHandshakeUseCase';
import {SecureStorageService} from '../domain/services/SecureStorageService';

import {API_BASE_URL, getApiSwitchImplementation} from '../config/apiEnvironment';
import {AxiosHttpClient} from '../data/api/apiClient';
import {AuthRepositoryImpl} from '../data/repositories/AuthRepositoryImpl';
import {TransactionRepositoryImpl} from '../data/repositories/TransactionRepositoryImpl';
import {MockAuthDataSource} from '../data/datasources/auth/MockAuthDataSource';
import {AuthRemoteDataSource} from '../data/datasources/auth/AuthRemoteDataSource';
import {MockTransactionDataSource} from '../data/datasources/transaction/MockTransactionDataSource';
import {SecurityRemoteDataSource} from '../data/datasources/security/SecurityRemoteDataSource';
import {SecureStorageServiceImpl} from '../data/services/SecureStorageServiceImpl';
import {createApiSecretKey} from '../security/http/apiSecretKey';
import {SERVER_PUBLIC_KEY_PEM_BASE64} from '../security/certificate/keys.constants';

export interface AppContainer {
  loginUseCase: LoginUseCase;
  getTransactionsUseCase: GetTransactionsUseCase;
  runCertificateHandshakeUseCase: RunCertificateHandshakeUseCase;
  secureStorageService: SecureStorageService;
  authRemoteDataSource: AuthRemoteDataSource;
  securityRemoteDataSource: SecurityRemoteDataSource;
}

export function createContainer(): AppContainer {
  const secureStorageService = new SecureStorageServiceImpl();
  const secretKey = createApiSecretKey();
  const requestId = uuidv4();

  const httpClient = new AxiosHttpClient({
    baseURL: API_BASE_URL,
    secretKey,
    requestId,
    secureStorage: secureStorageService,
    serverPublicPemBase64: SERVER_PUBLIC_KEY_PEM_BASE64,
    getApiSwitchImplementation,
    getDeviceState: () => 'unknown',
  });

  const authDataSource = new MockAuthDataSource();
  const authRemoteDataSource = new AuthRemoteDataSource(httpClient);
  const securityRemoteDataSource = new SecurityRemoteDataSource(httpClient);
  const transactionDataSource = new MockTransactionDataSource();

  const authRepository = new AuthRepositoryImpl(authDataSource);
  const transactionRepository = new TransactionRepositoryImpl(
    transactionDataSource,
  );

  const loginUseCase = new LoginUseCase(authRepository);
  const getTransactionsUseCase = new GetTransactionsUseCase(
    transactionRepository,
  );
  const runCertificateHandshakeUseCase = new RunCertificateHandshakeUseCase(
    securityRemoteDataSource,
  );

  return {
    loginUseCase,
    getTransactionsUseCase,
    runCertificateHandshakeUseCase,
    secureStorageService,
    authRemoteDataSource,
    securityRemoteDataSource,
  };
}
