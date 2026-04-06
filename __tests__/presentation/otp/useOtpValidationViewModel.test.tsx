import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {useDI} from '../../../src/di';
import {useOtpValidationViewModel} from '../../../src/presentation/otp/useOtpValidationViewModel';

jest.mock('../../../src/di', () => ({
  useDI: jest.fn(),
}));

const mockedUseDI = useDI as jest.MockedFunction<typeof useDI>;

describe('useOtpValidationViewModel', () => {
  let latest: ReturnType<typeof useOtpValidationViewModel> | undefined;

  function Harness({onSuccess}: {onSuccess: () => Promise<void>}) {
    latest = useOtpValidationViewModel(onSuccess);
    return null;
  }

  beforeEach(() => {
    latest = undefined;
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('shows an error when the code is incomplete', async () => {
    const validateOtpUseCase = {execute: jest.fn()};
    mockedUseDI.mockReturnValue({validateOtpUseCase} as never);
    const onSuccess = jest.fn().mockResolvedValue(undefined);

    await act(async () => {
      ReactTestRenderer.create(<Harness onSuccess={onSuccess} />);
    });

    await act(async () => {
      await latest?.handleValidate();
    });

    expect(latest?.error).toBe('Ingresa los 6 digitos del codigo.');
    expect(validateOtpUseCase.execute).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  test('calls validateOtp use case and onSuccess with a valid code', async () => {
    const validateOtpUseCase = {
      execute: jest.fn().mockResolvedValue({message: 'OK'}),
    };
    mockedUseDI.mockReturnValue({validateOtpUseCase} as never);
    const onSuccess = jest.fn().mockResolvedValue(undefined);

    await act(async () => {
      ReactTestRenderer.create(<Harness onSuccess={onSuccess} />);
    });

    act(() => {
      latest?.onChangeCode('123456');
    });

    await act(async () => {
      await latest?.handleValidate();
    });

    expect(validateOtpUseCase.execute).toHaveBeenCalledWith('123456');
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(latest?.error).toBeNull();
    expect(latest?.isLoading).toBe(false);
  });

  test('surfaces validation errors from the use case', async () => {
    const validateOtpUseCase = {
      execute: jest.fn().mockRejectedValue(new Error('OTP inválido')),
    };
    mockedUseDI.mockReturnValue({validateOtpUseCase} as never);

    await act(async () => {
      ReactTestRenderer.create(<Harness onSuccess={jest.fn()} />);
    });

    act(() => {
      latest?.onChangeCode('000000');
    });

    await act(async () => {
      await latest?.handleValidate();
    });

    expect(latest?.error).toBe('OTP inválido');
  });

  test('enables resend after the waiting window', async () => {
    const validateOtpUseCase = {execute: jest.fn()};
    mockedUseDI.mockReturnValue({validateOtpUseCase} as never);

    await act(async () => {
      ReactTestRenderer.create(<Harness onSuccess={jest.fn()} />);
    });

    expect(latest?.canResend).toBe(false);

    act(() => {
      jest.advanceTimersByTime(30000);
    });

    expect(latest?.canResend).toBe(true);
  });

  test('resendLabel counts down then allows plain label', async () => {
    const validateOtpUseCase = {execute: jest.fn()};
    mockedUseDI.mockReturnValue({validateOtpUseCase} as never);

    await act(async () => {
      ReactTestRenderer.create(<Harness onSuccess={jest.fn()} />);
    });

    expect(latest?.resendLabel).toContain('Reenviar codigo en');

    act(() => {
      jest.advanceTimersByTime(30000);
    });

    expect(latest?.resendLabel).toBe('Reenviar codigo');
  });
});
