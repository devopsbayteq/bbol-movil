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
    expect(d.maskedAccountNumber.replaceAll(/\s/g, '').length).toBe(11);
    expect(d.paidAmount + d.remainingToPayAmount).toBeCloseTo(d.totalDebtAmount, 2);
    expect(d.installmentsPaid).toBeGreaterThanOrEqual(1);
    expect(d.installmentsPaid).toBeLessThan(d.installmentsTotal);
    expect(d.paidProgressRatio).toBeGreaterThanOrEqual(0);
    expect(d.paidProgressRatio).toBeLessThanOrEqual(1);
    expect(d.secondaryProgressRatio).toBeLessThanOrEqual(d.paidProgressRatio);
  });

  it('es determinista para el mismo guid', () => {
    const a = buildInvestmentDetail(base);
    const b = buildInvestmentDetail(base);
    expect(a.maskedAccountNumber).toBe(b.maskedAccountNumber);
    expect(a.jointHolderName).toBe(b.jointHolderName);
    expect(a.totalDebtAmount).toBe(b.totalDebtAmount);
    expect(a.maskedDebitAccount).toBe(b.maskedDebitAccount);
  });

  it('con total 10 750 aplica el suplemento demo alineado al diseño Figma', () => {
    const figmaLike: InvestmentBalance = {
      investmentGuid: 'any-guid',
      productName: 'Plazo fijo',
      currentValue: 10_750,
      currency: 'USD',
    };
    const d = buildInvestmentDetail(figmaLike);
    expect(d.totalToReceive).toBe(10_750);
    expect(d.initialAmount).toBe(10_000);
    expect(d.interestAtMaturity).toBe(750);
    expect(d.maskedAccountNumber).toBe('324 2343 2678');
    expect(d.installmentsPaid).toBe(5);
    expect(d.installmentsTotal).toBe(12);
    expect(d.interestRatePercent).toBe(7.5);
    expect(d.paymentFrequencyLabel).toBe('Mensual');
    expect(d.debitPurposeLabel).toBe('Gastos');
    expect(d.maskedDebitAccount).toBe('Cta. Ahorros ****829');
  });
});
