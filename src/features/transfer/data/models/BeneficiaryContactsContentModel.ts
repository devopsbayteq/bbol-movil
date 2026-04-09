export interface BeneficiaryContactDto {
  beneficiaryGuid: string;
  contactName: string;
  bankName: string;
  accountType: string;
  accountTypeLabel: string;
  beneficiaryAccountNumber: string;
  lastFourDigits: string;
}

export interface BeneficiaryContactsContentModel {
  contacts: BeneficiaryContactDto[];
}
