import type {HttpClient} from '../../../data/api/HttpClient';
import {ExecuteTransferUseCase} from '../domain/usecases/ExecuteTransferUseCase';
import {GetBeneficiaryContactsUseCase} from '../domain/usecases/GetBeneficiaryContactsUseCase';
import {GetHomeContractBalanceUseCase} from '../domain/usecases/GetHomeContractBalanceUseCase';
import {ValidateTransactionAmountUseCase} from '../domain/usecases/ValidateTransactionAmountUseCase';
import {BeneficiaryRemoteDataSource} from '../data/datasources/beneficiary/BeneficiaryRemoteDataSource';
import {ContractBalanceRemoteDataSource} from '../data/datasources/contractBalance/ContractBalanceRemoteDataSource';
import {TransferAmountValidationRemoteDataSource} from '../data/datasources/transaction/TransferAmountValidationRemoteDataSource';
import {TransferRemoteDataSource} from '../data/datasources/transaction/TransferRemoteDataSource';
import {BeneficiaryRepositoryImpl} from '../data/repositories/BeneficiaryRepositoryImpl';
import {ContractBalanceRepositoryImpl} from '../data/repositories/ContractBalanceRepositoryImpl';
import {TransactionAmountValidationRepositoryImpl} from '../data/repositories/TransactionAmountValidationRepositoryImpl';
import {TransferRepositoryImpl} from '../data/repositories/TransferRepositoryImpl';

export interface TransferFeatureModule {
  getHomeContractBalanceUseCase: GetHomeContractBalanceUseCase;
  getBeneficiaryContactsUseCase: GetBeneficiaryContactsUseCase;
  validateTransactionAmountUseCase: ValidateTransactionAmountUseCase;
  executeTransferUseCase: ExecuteTransferUseCase;
}

export function createTransferFeatureModule(
  httpClient: HttpClient,
): TransferFeatureModule {
  const contractBalanceRemoteDataSource = new ContractBalanceRemoteDataSource(
    httpClient,
  );
  const beneficiaryRemoteDataSource = new BeneficiaryRemoteDataSource(
    httpClient,
  );
  const transferRemoteDataSource = new TransferRemoteDataSource(httpClient);
  const transferAmountValidationRemoteDataSource =
    new TransferAmountValidationRemoteDataSource(httpClient);

  const contractBalanceRepository = new ContractBalanceRepositoryImpl(
    contractBalanceRemoteDataSource,
  );
  const beneficiaryRepository = new BeneficiaryRepositoryImpl(
    beneficiaryRemoteDataSource,
  );
  const transferRepository = new TransferRepositoryImpl(transferRemoteDataSource);
  const transactionAmountValidationRepository =
    new TransactionAmountValidationRepositoryImpl(
      transferAmountValidationRemoteDataSource,
    );

  const getHomeContractBalanceUseCase = new GetHomeContractBalanceUseCase(
    contractBalanceRepository,
  );
  const getBeneficiaryContactsUseCase = new GetBeneficiaryContactsUseCase(
    beneficiaryRepository,
  );
  const validateTransactionAmountUseCase = new ValidateTransactionAmountUseCase(
    transactionAmountValidationRepository,
  );
  const executeTransferUseCase = new ExecuteTransferUseCase(transferRepository);

  return {
    getHomeContractBalanceUseCase,
    getBeneficiaryContactsUseCase,
    validateTransactionAmountUseCase,
    executeTransferUseCase,
  };
}
