import {PublicKey} from '../../domain/entities/PublicKey';
import {SecurityRepository} from '../../domain/repositories/SecurityRepository';
import {SecurityRemoteDataSource} from '../datasources/security/SecurityRemoteDataSource';
import {mapPublicKeyContentToEntity} from '../mappers/PublicKeyMapper';

export class SecurityRepositoryImpl implements SecurityRepository {
  constructor(private readonly remoteDataSource: SecurityRemoteDataSource) {}

  async getPublicKey(): Promise<PublicKey> {
    const model = await this.remoteDataSource.getPublicKey();
    return mapPublicKeyContentToEntity(model);
  }
}
