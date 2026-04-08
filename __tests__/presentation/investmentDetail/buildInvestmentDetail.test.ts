import type {InvestmentBalance} from '../../../src/domain/entities/ContractBalance';
import {buildInvestmentDetail} from '../../../src/presentation/investmentDetail/buildInvestmentDetail';

describe('buildInvestmentDetail', () => {
  const base: InvestmentBalance = {
    investmentGuid: 'test-guid-1',
    productName: 'Depósito a plazo fijo',
    currentValue: 3780.6,
    currency: 'USD',
  };

  it('usa datos del servicio y deriva montos coherentes', () => {
    const d = buildInvestmentDetail(base);
    expect(d.productName).toBe('Depósito a plazo fijo');
    expect(d.currency).toBe('USD');
    expect(d.totalToReceive).toBe(3780.6);
    expect(d.initialAmount + d.interestAtMaturity).toBeCloseTo(3780.6, 2);
    expect(d.maskedAccountNumber.replace(/\s/g, '').length).toBe(11);
  });

  it('es determinista para el mismo guid', () => {
    const a = buildInvestmentDetail(base);
    const b = buildInvestmentDetail(base);
    expect(a.maskedAccountNumber).toBe(b.maskedAccountNumber);
    expect(a.jointHolderName).toBe(b.jointHolderName);
  });
});
