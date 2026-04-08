import type {LoanBalance} from '../../../src/domain/entities/ContractBalance';
import {buildLoanDetail} from '../../../src/presentation/loanDetail/buildLoanDetail';

describe('buildLoanDetail', () => {
  const base: LoanBalance = {
    loanGuid: 'loan-test-1',
    outstandingBalance: 2536.54,
    nextInstallmentAmount: 531.58,
    nextInstallmentDate: '2026-05-26',
  };

  it('usa montos y fechas del servicio', () => {
    const d = buildLoanDetail(base);
    expect(d.outstandingBalance).toBe(2536.54);
    expect(d.nextInstallmentAmount).toBe(531.58);
    expect(d.nextInstallmentDate).toBe('2026-05-26');
    expect(d.capitalPaid + d.outstandingBalance).toBeCloseTo(d.amountGranted, 2);
    expect(d.paidProgress).toBeGreaterThanOrEqual(0);
    expect(d.paidProgress).toBeLessThanOrEqual(1);
  });

  it('es determinista para el mismo guid', () => {
    const a = buildLoanDetail(base);
    const b = buildLoanDetail(base);
    expect(a.maskedAccountNumber).toBe(b.maskedAccountNumber);
    expect(a.productLabel).toBe(b.productLabel);
  });
});
