import {BeneficiaryContact} from '../../domain/entities/BeneficiaryContact';
import {
  BeneficiaryContactDto,
  BeneficiaryContactsContentModel,
} from '../models/BeneficiaryContactsContentModel';

function mapDtoToEntity(dto: BeneficiaryContactDto): BeneficiaryContact {
  return {
    beneficiaryGuid: dto.beneficiaryGuid,
    contactName: dto.contactName,
    bankName: dto.bankName,
    accountType: dto.accountType,
    lastFourDigits: dto.lastFourDigits,
  };
}

export function mapBeneficiaryContactsContentToEntities(
  content: BeneficiaryContactsContentModel,
): BeneficiaryContact[] {
  return content.contacts.map(mapDtoToEntity);
}
