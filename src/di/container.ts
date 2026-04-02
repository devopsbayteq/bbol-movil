import {v4 as uuidv4} from 'uuid';
import {LoginUseCase} from '../domain/usecases/LoginUseCase';
import {GetTransactionsUseCase} from '../domain/usecases/GetTransactionsUseCase';
import {RunCertificateHandshakeUseCase} from '../domain/usecases/RunCertificateHandshakeUseCase';
import {GetPublicKeyUseCase} from '../domain/usecases/GetPublicKeyUseCase';
import {SecureStorageService} from '../domain/services/SecureStorageService';
import {BiometricAuthService} from '../domain/services/BiometricAuthService';

import {API_BASE_URL} from '../config/apiEnvironment';
import {AxiosHttpClient} from '../data/api/apiClient';
import {AuthRepositoryImpl} from '../data/repositories/AuthRepositoryImpl';
import {TransactionRepositoryImpl} from '../data/repositories/TransactionRepositoryImpl';
import {TransferRepositoryImpl} from '../data/repositories/TransferRepositoryImpl';
import {SecurityRepositoryImpl} from '../data/repositories/SecurityRepositoryImpl';
import {AuthRemoteDataSource} from '../data/datasources/auth';
import {SecurityRemoteDataSource} from '../data/datasources/security/SecurityRemoteDataSource';
import {
  MockTransactionDataSource,
  TransferRemoteDataSource,
} from '../data/datasources/transaction';
import {SecureStorageKeys} from '../data/datasources/storage';
import {SecureStorageServiceImpl} from '../data/services/SecureStorageServiceImpl';
import {BiometricAuthServiceImpl} from '../data/services/BiometricAuthServiceImpl';
import {createApiSecretKey} from '../security/http/apiSecretKey';
import {SERVER_PUBLIC_KEY_PEM_BASE64} from '../security/certificate/keys.constants';
import {GetUserLoggedUseCase} from '../domain/usecases/GetUserLoggedUseCase';
import {ValidateOtpUseCase} from '../domain/usecases/ValidateOtpUseCase';
import {GetHomeContractBalanceUseCase} from '../domain/usecases/GetHomeContractBalanceUseCase';
import {GetBeneficiaryContactsUseCase} from '../domain/usecases/GetBeneficiaryContactsUseCase';
import {ValidateTransactionAmountUseCase} from '../domain/usecases/ValidateTransactionAmountUseCase';
import {ExecuteTransferUseCase} from '../domain/usecases/ExecuteTransferUseCase';
import {ContractBalanceRemoteDataSource} from '../data/datasources/contractBalance';
import {BeneficiaryRemoteDataSource} from '../data/datasources/beneficiary';
import {ContractBalanceRepositoryImpl} from '../data/repositories/ContractBalanceRepositoryImpl';
import {BeneficiaryRepositoryImpl} from '../data/repositories/BeneficiaryRepositoryImpl';

export interface AppContainer {
  loginUseCase: LoginUseCase;
  getTransactionsUseCase: GetTransactionsUseCase;
  runCertificateHandshakeUseCase: RunCertificateHandshakeUseCase;
  getPublicKeyUseCase: GetPublicKeyUseCase;
  secureStorageService: SecureStorageService;
  biometricAuthService: BiometricAuthService;
  authRemoteDataSource: AuthRemoteDataSource;
  getUserLoggedUseCase: GetUserLoggedUseCase;
  validateOtpUseCase: ValidateOtpUseCase;
  getHomeContractBalanceUseCase: GetHomeContractBalanceUseCase;
  getBeneficiaryContactsUseCase: GetBeneficiaryContactsUseCase;
  validateTransactionAmountUseCase: ValidateTransactionAmountUseCase;
  executeTransferUseCase: ExecuteTransferUseCase;
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
    getDeviceState: () => 'unknown',
  });

  const biometricAuthService = new BiometricAuthServiceImpl();
  const authRemoteDataSource = new AuthRemoteDataSource(httpClient);
  const securityRemoteDataSource = new SecurityRemoteDataSource(httpClient);
  const contractBalanceRemoteDataSource = new ContractBalanceRemoteDataSource(
    httpClient,
  );
  const beneficiaryRemoteDataSource = new BeneficiaryRemoteDataSource(
    httpClient,
  );
  const transferRemoteDataSource = new TransferRemoteDataSource(httpClient);
  const transactionDataSource = new MockTransactionDataSource();

  const authRepository = new AuthRepositoryImpl(authRemoteDataSource);
  const securityRepository = new SecurityRepositoryImpl(securityRemoteDataSource);
  const contractBalanceRepository = new ContractBalanceRepositoryImpl(
    contractBalanceRemoteDataSource,
  );
  const beneficiaryRepository = new BeneficiaryRepositoryImpl(
    beneficiaryRemoteDataSource,
  );
  const transactionRepository = new TransactionRepositoryImpl(
    transactionDataSource,
  );
  const transferRepository = new TransferRepositoryImpl(transferRemoteDataSource);

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

  const validateOtpUseCase = new ValidateOtpUseCase(securityRepository);

  const getHomeContractBalanceUseCase = new GetHomeContractBalanceUseCase(
    contractBalanceRepository,
  );

  const getBeneficiaryContactsUseCase = new GetBeneficiaryContactsUseCase(
    beneficiaryRepository,
  );

  const runCertificateHandshakeUseCase = new RunCertificateHandshakeUseCase(
    securityRemoteDataSource,
  );

  const validateTransactionAmountUseCase = new ValidateTransactionAmountUseCase(
    securityRepository,
  );

  const executeTransferUseCase = new ExecuteTransferUseCase(transferRepository);

  return {
    loginUseCase,
    getTransactionsUseCase,
    runCertificateHandshakeUseCase,
    getPublicKeyUseCase,
    secureStorageService,
    biometricAuthService,
    authRemoteDataSource,
    getUserLoggedUseCase,
    validateOtpUseCase,
    getHomeContractBalanceUseCase,
    getBeneficiaryContactsUseCase,
    validateTransactionAmountUseCase,
    executeTransferUseCase,
  };
}
