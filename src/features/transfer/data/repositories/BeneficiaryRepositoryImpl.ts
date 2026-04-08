import type {BeneficiaryContact} from '../../domain/entities/BeneficiaryContact';
import type {BeneficiaryRepository} from '../../domain/repositories/BeneficiaryRepository';
import type {BeneficiaryDataSource} from '../datasources/beneficiary/BeneficiaryDataSource';
import {mapBeneficiaryContactsContentToEntities} from '../mappers/beneficiaryMapper';

export class BeneficiaryRepositoryImpl implements BeneficiaryRepository {
  constructor(private readonly dataSource: BeneficiaryDataSource) {}

  async getContacts(): Promise<BeneficiaryContact[]> {
    const content = await this.dataSource.getContacts();
    return mapBeneficiaryContactsContentToEntities(content);
  }
}
