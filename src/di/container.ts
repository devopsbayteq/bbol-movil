import {v4 as uuidv4} from 'uuid';
import {LoginUseCase} from '../domain/usecases/LoginUseCase';
import {GetAccountMovementsUseCase} from '../domain/usecases/GetAccountMovementsUseCase';
import {RunCertificateHandshakeUseCase} from '../domain/usecases/RunCertificateHandshakeUseCase';
import {GetPublicKeyUseCase} from '../domain/usecases/GetPublicKeyUseCase';
import {SecureStorageService} from '../domain/services/SecureStorageService';
import {BiometricAuthService} from '../domain/services/BiometricAuthService';
import type {DeviceSecurityService} from '../domain/services/DeviceSecurityService';

import {API_BASE_URL} from '../config/apiEnvironment';
import {AxiosHttpClient} from '../data/api/apiClient';
import {AuthRepositoryImpl} from '../data/repositories/AuthRepositoryImpl';
import {AccountMovementRepositoryImpl} from '../data/repositories/AccountMovementRepositoryImpl';
import {TransferRepositoryImpl} from '../data/repositories/TransferRepositoryImpl';
import {SecurityRepositoryImpl} from '../data/repositories/SecurityRepositoryImpl';
import {AuthRemoteDataSource} from '../data/datasources/auth';
import {SecurityRemoteDataSource} from '../data/datasources/security/SecurityRemoteDataSource';
import {TransferRemoteDataSource} from '../data/datasources/transaction';
import {TransactionListRemoteDataSource} from '../data/datasources/transaction/TransactionListRemoteDataSource';
import {SecureStorageKeys} from '../data/datasources/storage';
import {SecureStorageServiceImpl} from '../data/services/SecureStorageServiceImpl';
import {BiometricAuthServiceImpl} from '../data/services/BiometricAuthServiceImpl';
import {DeviceSecurityServiceImpl} from '../data/services/DeviceSecurityServiceImpl';
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
import {BiometricRemoteDataSource} from '../data/datasources/biometric';
import {
  BiometricRSAAuthOrchestrator,
  BiometricEnrollmentBinding,
  CryptoService,
  BiometricKeyStorageService,
} from '../security/biometric';

export interface AppContainer {
  loginUseCase: LoginUseCase;
  getAccountMovementsUseCase: GetAccountMovementsUseCase;
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
  biometricRSAAuthOrchestrator: BiometricRSAAuthOrchestrator;
  deviceSecurityService: DeviceSecurityService;
}

export function createContainer(): AppContainer {
  const secureStorageService = new SecureStorageServiceImpl();
  const deviceSecurityService = new DeviceSecurityServiceImpl();
  const secretKey = createApiSecretKey();
  const requestId = uuidv4();

  const httpClient = new AxiosHttpClient({
    baseURL: API_BASE_URL,
    secretKey,
    requestId,
    secureStorage: secureStorageService,
    serverPublicPemBase64: SERVER_PUBLIC_KEY_PEM_BASE64,
    deviceSecurityService,
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
  const transactionListRemoteDataSource = new TransactionListRemoteDataSource(
    httpClient,
  );
  const biometricRemoteDataSource = new BiometricRemoteDataSource(httpClient);

  const authRepository = new AuthRepositoryImpl(authRemoteDataSource);
  const securityRepository = new SecurityRepositoryImpl(securityRemoteDataSource);
  const contractBalanceRepository = new ContractBalanceRepositoryImpl(
    contractBalanceRemoteDataSource,
  );
  const beneficiaryRepository = new BeneficiaryRepositoryImpl(
    beneficiaryRemoteDataSource,
  );
  const accountMovementRepository = new AccountMovementRepositoryImpl(
    transactionListRemoteDataSource,
  );
  const transferRepository = new TransferRepositoryImpl(transferRemoteDataSource);

  const getPublicKeyUseCase = new GetPublicKeyUseCase(
    securityRepository,
    secureStorageService,
    SecureStorageKeys.SERVER_PUBLIC_KEY,
  );

  const loginUseCase = new LoginUseCase(
    authRepository,
    secureStorageService,
    SecureStorageKeys.USER_LOGIN_DATA,
    getPublicKeyUseCase,
    SecureStorageKeys.AUTH_TOKEN,
  );

  const getUserLoggedUseCase = new GetUserLoggedUseCase(
    secureStorageService,
    SecureStorageKeys.USER_LOGIN_DATA,
  );

  const getAccountMovementsUseCase = new GetAccountMovementsUseCase(
    accountMovementRepository,
  );

  const cryptoService = new CryptoService();
  const biometricKeyStorageService = new BiometricKeyStorageService(
    secureStorageService,
    biometricAuthService,
  );
  const biometricEnrollmentBinding = new BiometricEnrollmentBinding(
    secureStorageService,
  );
  const biometricRSAAuthOrchestrator = new BiometricRSAAuthOrchestrator(
    biometricRemoteDataSource,
    cryptoService,
    biometricKeyStorageService,
    secureStorageService,
    getPublicKeyUseCase,
    SecureStorageKeys.SERVER_PUBLIC_KEY,
    biometricAuthService,
    biometricEnrollmentBinding,
  );

  const validateOtpUseCase = new ValidateOtpUseCase(
    securityRepository,
    getPublicKeyUseCase,
  );

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
    getAccountMovementsUseCase,
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
    biometricRSAAuthOrchestrator,
    deviceSecurityService,
  };
}
