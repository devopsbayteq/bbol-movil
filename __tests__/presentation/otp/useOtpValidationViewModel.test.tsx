import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {useOtpValidationViewModel} from '../../../src/presentation/otp/useOtpValidationViewModel';

describe('useOtpValidationViewModel', () => {
  let latest:
    | ReturnType<typeof useOtpValidationViewModel>
    | undefined;

  function Harness({
    onSuccess,
  }: {
    onSuccess: () => Promise<void>;
  }) {
    latest = useOtpValidationViewModel(onSuccess);
    return null;
  }

  beforeEach(() => {
    latest = undefined;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('shows an error when the code is incomplete', async () => {
    const onSuccess = jest.fn().mockResolvedValue(undefined);

    await act(async () => {
      ReactTestRenderer.create(<Harness onSuccess={onSuccess} />);
    });

    await act(async () => {
      await latest?.handleValidate();
    });

    expect(latest?.error).toBe('Ingresa los 6 dígitos del código.');
    expect(onSuccess).not.toHaveBeenCalled();
  });

  test('validates the demo otp and calls onSuccess', async () => {
    const onSuccess = jest.fn().mockResolvedValue(undefined);

    await act(async () => {
      ReactTestRenderer.create(<Harness onSuccess={onSuccess} />);
    });

    act(() => {
      latest?.onChangeCode('123456');
    });

    await act(async () => {
      const pendingValidation = latest?.handleValidate();
      jest.advanceTimersByTime(900);
      await pendingValidation;
    });

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(latest?.error).toBeNull();
    expect(latest?.isLoading).toBe(false);
  });

  test('enables resend after the waiting window', async () => {
    const onSuccess = jest.fn().mockResolvedValue(undefined);

    await act(async () => {
      ReactTestRenderer.create(<Harness onSuccess={onSuccess} />);
    });

    expect(latest?.canResend).toBe(false);

    act(() => {
      jest.advanceTimersByTime(30000);
    });

    expect(latest?.canResend).toBe(true);
  });
});
