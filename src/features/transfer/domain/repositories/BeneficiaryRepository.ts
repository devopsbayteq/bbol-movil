import type {BeneficiaryContact} from '../entities/BeneficiaryContact';

export interface BeneficiaryRepository {
  getContacts(): Promise<BeneficiaryContact[]>;
}
