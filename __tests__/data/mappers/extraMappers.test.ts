import {mapOtpContentToEntity} from '../../../src/data/mappers/OtpMapper';
import {mapBeneficiaryContactsContentToEntities} from '../../../src/data/mappers/beneficiaryMapper';
import {mapContractBalanceContentToEntity} from '../../../src/data/mappers/contractBalanceMapper';

describe('OtpMapper', () => {
  test('mapOtpContentToEntity maps userMessage to entity message', () => {
    expect(mapOtpContentToEntity({userMessage: 'Listo'})).toEqual({
      message: 'Listo',
    });
  });
});

describe('beneficiaryMapper', () => {
  test('mapBeneficiaryContactsContentToEntities maps every contact', () => {
    const result = mapBeneficiaryContactsContentToEntities({
      contacts: [
        {
          beneficiaryGuid: 'g1',
          contactName: 'Luis',
          bankName: 'BB',
          accountType: 'checking',
          accountTypeLabel: 'Corriente',
          beneficiaryAccountNumber: '0000000000',
          lastFourDigits: '9999',
        },
      ],
    });

    expect(result).toEqual([
      {
        beneficiaryGuid: 'g1',
        contactName: 'Luis',
        bankName: 'BB',
        accountType: 'checking',
        accountTypeLabel: 'Corriente',
        beneficiaryAccountNumber: '0000000000',
        lastFourDigits: '9999',
      },
    ]);
  });
});

describe('contractBalanceMapper', () => {
  test('maps all product kinds and account types', () => {
    const entity = mapContractBalanceContentToEntity({
      accounts: [
        {
          accountGuid: 'a1',
          maskedAccountNumber: '****1111',
          accountType: 'savings',
          accountTypeLabel: 'Ahorros',
          balance: 10,
          beneficiary: {
            beneficiaryGuid: 'b1',
            contactName: 'X',
            bankName: 'BB',
            accountType: 'savings',
            accountTypeLabel: 'Ahorros',
            beneficiaryAccountNumber: '0000000000',
            lastFourDigits: '1111',
          },
        },
        {
          accountGuid: 'a2',
          maskedAccountNumber: '****2222',
          accountType: 'checking',
          accountTypeLabel: 'Corriente',
          balance: 20,
          beneficiary: {
            beneficiaryGuid: 'b2',
            contactName: 'X',
            bankName: 'BB',
            accountType: 'checking',
            accountTypeLabel: 'Corriente',
            beneficiaryAccountNumber: '0000000000',
            lastFourDigits: '2222',
          },
        },
        {
          accountGuid: 'a3',
          maskedAccountNumber: '****3333',
          accountType: 'other',
          accountTypeLabel: 'Otra',
          balance: 30,
          beneficiary: {
            beneficiaryGuid: 'b3',
            contactName: 'X',
            bankName: 'BB',
            accountType: 'other',
            accountTypeLabel: 'Otra',
            beneficiaryAccountNumber: '0000000000',
            lastFourDigits: '3333',
          },
        },
      ],
      creditCards: [
        {
          maskedCardNumber: '****9999',
          totalDue: 50,
          maxPaymentDate: '2026-04-01',
        },
      ],
      loans: [
        {
          loanGuid: 'l1',
          outstandingBalance: 1000,
          nextInstallmentAmount: 100,
          nextInstallmentDate: '2026-04-05',
        },
      ],
      investments: [
        {
          investmentGuid: 'i1',
          productName: 'Fondo',
          currentValue: 5000,
          currency: 'USD',
        },
      ],
      frequentPayments: [
        {
          beneficiaryName: 'Servicio',
          beneficiaryType: 'service',
        },
      ],
    });

    expect(entity.accounts.map(a => a.accountKind)).toEqual([
      'savings',
      'checking',
      'other',
    ]);
    expect(entity.creditCards[0].maskedCardNumber).toBe('****9999');
    expect(entity.loans[0].loanGuid).toBe('l1');
    expect(entity.investments[0].currency).toBe('USD');
    expect(entity.frequentPayments[0].beneficiaryName).toBe('Servicio');
  });
});
