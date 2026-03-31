import {LoginUseCase} from '../domain/usecases/LoginUseCase';
import {GetTransactionsUseCase} from '../domain/usecases/GetTransactionsUseCase';
import {SecureStorageService} from '../domain/services/SecureStorageService';

import {AuthRepositoryImpl} from '../data/repositories/AuthRepositoryImpl';
import {TransactionRepositoryImpl} from '../data/repositories/TransactionRepositoryImpl';
import {MockAuthDataSource} from '../data/datasources/auth/MockAuthDataSource';
import {AuthRemoteDataSource} from '../data/datasources/auth/AuthRemoteDataSource';
import {MockTransactionDataSource} from '../data/datasources/transaction/MockTransactionDataSource';
import {SecureStorageServiceImpl} from '../data/services/SecureStorageServiceImpl';

export interface AppContainer {
  loginUseCase: LoginUseCase;
  getTransactionsUseCase: GetTransactionsUseCase;
  secureStorageService: SecureStorageService;
  authRemoteDataSource: AuthRemoteDataSource;
}

export function createContainer(): AppContainer {
  const secureStorageService = new SecureStorageServiceImpl();

  const authDataSource = new MockAuthDataSource();
  const authRemoteDataSource = new AuthRemoteDataSource();
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
    authRemoteDataSource,
  };
}
