import {LoginUseCase} from '../domain/usecases/LoginUseCase';
import {GetTransactionsUseCase} from '../domain/usecases/GetTransactionsUseCase';
import {GetPublicKeyUseCase} from '../domain/usecases/GetPublicKeyUseCase';
import {SecureStorageService} from '../domain/services/SecureStorageService';
import {BiometricAuthService} from '../domain/services/BiometricAuthService';

import {AxiosHttpClient} from '../data/api/apiClient';
import {AuthRepositoryImpl} from '../data/repositories/AuthRepositoryImpl';
import {TransactionRepositoryImpl} from '../data/repositories/TransactionRepositoryImpl';
import {SecurityRepositoryImpl} from '../data/repositories/SecurityRepositoryImpl';
import {MockAuthDataSource} from '../data/datasources/auth/MockAuthDataSource';
import {AuthRemoteDataSource} from '../data/datasources/auth/AuthRemoteDataSource';
import {SecurityRemoteDataSource} from '../data/datasources/security/SecurityRemoteDataSource';
import {MockTransactionDataSource} from '../data/datasources/transaction/MockTransactionDataSource';
import {SecureStorageKeys} from '../data/datasources/storage/SecureStorageKeys';
import {SecureStorageServiceImpl} from '../data/services/SecureStorageServiceImpl';
import {BiometricAuthServiceImpl} from '../data/services/BiometricAuthServiceImpl';
import { GetUserLoggedUseCase } from '../domain/usecases/GetUserLoggedUseCase';

export interface AppContainer {
  loginUseCase: LoginUseCase;
  getTransactionsUseCase: GetTransactionsUseCase;
  getPublicKeyUseCase: GetPublicKeyUseCase;
  secureStorageService: SecureStorageService;
  biometricAuthService: BiometricAuthService;
  authRemoteDataSource: AuthRemoteDataSource;
  getUserLoggedUseCase: GetUserLoggedUseCase;
}

export function createContainer(): AppContainer {
  const httpClient = new AxiosHttpClient(
    'https://dev4.bayteq.com:50112/api/v1/'
  );
  const secureStorageService = new SecureStorageServiceImpl();
  const biometricAuthService = new BiometricAuthServiceImpl();

  const mockAuthDataSource = new MockAuthDataSource();
  const authRemoteDataSource = new AuthRemoteDataSource(httpClient);
  const securityRemoteDataSource = new SecurityRemoteDataSource(httpClient);
  const transactionDataSource = new MockTransactionDataSource();

  const authRepository = new AuthRepositoryImpl(authRemoteDataSource);
  const securityRepository = new SecurityRepositoryImpl(securityRemoteDataSource);
  const transactionRepository = new TransactionRepositoryImpl(
    transactionDataSource,
  );

  const loginUseCase = new LoginUseCase(
    authRepository,
    secureStorageService,
    SecureStorageKeys.USER_LOGIN_DATA,
  );

  const getUserLoggedUseCase = new GetUserLoggedUseCase(
    secureStorageService,
    SecureStorageKeys.USER_LOGIN_DATA,
  );

  const getTransactionsUseCase = new GetTransactionsUseCase(
    transactionRepository,
  );
  const getPublicKeyUseCase = new GetPublicKeyUseCase(
    securityRepository,
    secureStorageService,
    SecureStorageKeys.SERVER_PUBLIC_KEY,
  );

  return {
    loginUseCase,
    getTransactionsUseCase,
    getPublicKeyUseCase,
    secureStorageService,
    biometricAuthService,
    authRemoteDataSource,
    getUserLoggedUseCase
  };
}
