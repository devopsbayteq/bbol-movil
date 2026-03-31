import {LoginUseCase} from '../domain/usecases/LoginUseCase';
import {GetTransactionsUseCase} from '../domain/usecases/GetTransactionsUseCase';
import {SecureStorageService} from '../domain/services/SecureStorageService';
import {BiometricAuthService} from '../domain/services/BiometricAuthService';

import {AxiosHttpClient} from '../data/api/apiClient';
import {AuthRepositoryImpl} from '../data/repositories/AuthRepositoryImpl';
import {TransactionRepositoryImpl} from '../data/repositories/TransactionRepositoryImpl';
import {MockAuthDataSource} from '../data/datasources/auth/MockAuthDataSource';
import {AuthRemoteDataSource} from '../data/datasources/auth/AuthRemoteDataSource';
import {MockTransactionDataSource} from '../data/datasources/transaction/MockTransactionDataSource';
import {SecureStorageServiceImpl} from '../data/services/SecureStorageServiceImpl';
import {BiometricAuthServiceImpl} from '../data/services/BiometricAuthServiceImpl';

export interface AppContainer {
  loginUseCase: LoginUseCase;
  getTransactionsUseCase: GetTransactionsUseCase;
  secureStorageService: SecureStorageService;
  biometricAuthService: BiometricAuthService;
  authRemoteDataSource: AuthRemoteDataSource;
}

export function createContainer(): AppContainer {
  const httpClient = new AxiosHttpClient(
    'https://dev4.bayteq.com:50110/api/v1',
    {'X-Platform': 'VALOR_A_DEFINIR'},
  );
  const secureStorageService = new SecureStorageServiceImpl();
  const biometricAuthService = new BiometricAuthServiceImpl();

  const authDataSource = new MockAuthDataSource();
  const authRemoteDataSource = new AuthRemoteDataSource(httpClient);
  const transactionDataSource = new MockTransactionDataSource();

  const authRepository = new AuthRepositoryImpl(authDataSource);
  const transactionRepository = new TransactionRepositoryImpl(
    transactionDataSource,
  );

  const loginUseCase = new LoginUseCase(authRepository);
  const getTransactionsUseCase = new GetTransactionsUseCase(
    transactionRepository,
  );

  return {
    loginUseCase,
    getTransactionsUseCase,
    secureStorageService,
    biometricAuthService,
    authRemoteDataSource,
  };
}
