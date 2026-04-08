export interface BeneficiaryContactDto {
  beneficiaryGuid: string;
  contactName: string;
  bankName: string;
  accountType: number;
  lastFourDigits: string;
}

export interface BeneficiaryContactsContentModel {
  contacts: BeneficiaryContactDto[];
}
