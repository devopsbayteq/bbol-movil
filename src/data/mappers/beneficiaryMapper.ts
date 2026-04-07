import {BeneficiaryContact} from '../../domain/entities/BeneficiaryContact';
import {
  BeneficiaryContactDto,
  BeneficiaryContactsContentModel,
} from '../models/BeneficiaryContactsContentModel';

export function mapDtoToEntity(dto: BeneficiaryContactDto): BeneficiaryContact {
  return {
    beneficiaryGuid: dto.beneficiaryGuid,
    contactName: dto.contactName,
    bankName: dto.bankName,
    accountType: dto.accountType,
    accountTypeLabel:dto.accountTypeLabel,
    lastFourDigits: dto.lastFourDigits,
    beneficiaryAccountNumber:dto.beneficiaryAccountNumber
  };
}

export function mapBeneficiaryContactsContentToEntities(
  content: BeneficiaryContactsContentModel,
): BeneficiaryContact[] {
  return content.contacts.map(mapDtoToEntity);
}
