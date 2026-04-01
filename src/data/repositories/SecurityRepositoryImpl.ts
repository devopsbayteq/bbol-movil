import {PublicKey} from '../../domain/entities/PublicKey';
import {SecurityRepository} from '../../domain/repositories/SecurityRepository';
import {SecurityRemoteDataSource} from '../datasources/security/SecurityRemoteDataSource';
import {mapPublicKeyContentToEntity} from '../mappers/PublicKeyMapper';
import {Otp} from "../../domain/entities/Otp.ts";
import {mapOtpContentToEntity} from "../mappers/OtpMapper.ts";

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
}
