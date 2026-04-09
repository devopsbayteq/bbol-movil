import type {BeneficiaryContact} from '../entities/BeneficiaryContact';
import type {BeneficiaryRepository} from '../repositories/BeneficiaryRepository';

export class GetBeneficiaryContactsUseCase {
  constructor(private readonly beneficiaryRepository: BeneficiaryRepository) {}

  async execute(): Promise<BeneficiaryContact[]> {
    return this.beneficiaryRepository.getContacts();
  }
}
