import {
  balanceDollarsToCents,
  getLiveTransferAmountError,
  transferAmountMessages,
  validateTransferAmountForSubmit,
} from '../../../src/domain/validation';

describe('transferAmount validation', () => {
  test('converts balance dollars to cents', () => {
    expect(balanceDollarsToCents(15642.5)).toBe(1564250);
  });

  test('requires a positive amount on submit', () => {
    expect(validateTransferAmountForSubmit(0, 100)).toBe(
      transferAmountMessages.requiredPositive,
    );
  });

  test('rejects amount above balance on submit', () => {
    expect(validateTransferAmountForSubmit(10_001, 10_000)).toBe(
      transferAmountMessages.exceedsBalance,
    );
  });

  test('does not show live error while amount is zero', () => {
    expect(getLiveTransferAmountError(0, 10_000)).toBeNull();
  });

  test('shows live error when amount exceeds balance', () => {
    expect(getLiveTransferAmountError(500, 400)).toBe(
      transferAmountMessages.exceedsBalance,
    );
  });
});
