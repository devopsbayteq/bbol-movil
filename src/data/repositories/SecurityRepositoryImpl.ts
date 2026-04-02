import {PublicKey} from '../../domain/entities/PublicKey';
import {SecurityRepository} from '../../domain/repositories/SecurityRepository';
import {SecurityRemoteDataSource} from '../datasources/security/SecurityRemoteDataSource';
import {mapPublicKeyContentToEntity} from '../mappers/PublicKeyMapper';
import {Otp} from "../../domain/entities/Otp.ts";
import {mapOtpContentToEntity} from "../mappers/OtpMapper.ts";
import {
  TransactionAmountValidation,
  ValidateTransactionAmountParams,
} from '../../domain/entities/TransactionAmountValidation';

export class SecurityRepositoryImpl implements SecurityRepository {
    constructor(private readonly remoteDataSource: SecurityRemoteDataSource) {
    }

    async getPublicKey(): Promise<PublicKey> {
        const model = await this.remoteDataSource.getPublicKey();
        return mapPublicKeyContentToEntity(model);
    }

    async validateOtp(otp: string): Promise<Otp> {
        const response = await this.remoteDataSource.validateOtp({otp})
        return mapOtpContentToEntity(response)
    }

    async validateTransactionAmount(
        input: ValidateTransactionAmountParams,
    ): Promise<TransactionAmountValidation> {
        const content = await this.remoteDataSource.validateTransactionAmount({
            amount: input.amount,
            beneficiaryContactGuid: input.beneficiaryGuid,
            accountGuid: input.accountGuid,
            concept: input.concept,
        });
        return {isValid: content.isValid};
    }
}
