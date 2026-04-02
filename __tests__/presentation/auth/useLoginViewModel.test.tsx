import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {useDI} from '../../../src/di';
import {useLoginViewModel} from '../../../src/presentation/auth/useLoginViewModel';

jest.mock('../../../src/di', () => ({
  useDI: jest.fn(),
}));

const mockedUseDI = useDI as jest.MockedFunction<typeof useDI>;

const defaultOrchestrator = {
  loginWithBiometric: jest.fn(),
  registerBiometricForUser: jest.fn(),
  hasBiometricRegistration: jest.fn(),
};

describe('useLoginViewModel', () => {
  let latest: ReturnType<typeof useLoginViewModel> | undefined;

  function Harness({
    onCredentialLoginSuccess,
    onBiometricLoginSuccess,
  }: {
    onCredentialLoginSuccess: (user: {
      id: string;
      email: string;
      name: string;
      token: string;
    }) => void;
    onBiometricLoginSuccess: (user: {
      id: string;
      email: string;
      name: string;
      token: string;
    }) => void;
  }) {
    latest = useLoginViewModel(
      onCredentialLoginSuccess,
      onBiometricLoginSuccess,
    );
    return null;
  }

  beforeEach(() => {
    latest = undefined;
    jest.clearAllMocks();
  });

  test('sanitizes disallowed characters in email and exposes a field error', async () => {
    mockedUseDI.mockReturnValue({
      loginUseCase: {execute: jest.fn()},
      biometricRSAAuthOrchestrator: defaultOrchestrator,
    } as never);

    await act(async () => {
      ReactTestRenderer.create(
        <Harness
          onCredentialLoginSuccess={jest.fn()}
          onBiometricLoginSuccess={jest.fn()}
        />,
      );
    });

    act(() => {
      latest?.setEmail(' cli\u200Bente @banco.com ');
    });

    expect(latest?.email).toBe('cliente@banco.com');
    expect(latest?.emailError).toBe(
      'El email contiene caracteres no permitidos',
    );
  });

  test('blocks submit when fields are invalid and does not call login use case', async () => {
    const execute = jest.fn();

    mockedUseDI.mockReturnValue({
      loginUseCase: {execute},
      biometricRSAAuthOrchestrator: defaultOrchestrator,
    } as never);

    await act(async () => {
      ReactTestRenderer.create(
        <Harness
          onCredentialLoginSuccess={jest.fn()}
          onBiometricLoginSuccess={jest.fn()}
        />,
      );
    });

    act(() => {
      latest?.setEmail('cliente@banco.com');
      latest?.setPassword('123');
    });

    await act(async () => {
      await latest?.handleLogin();
    });

    expect(latest?.passwordError).toBe(
      'La contraseña debe tener al menos 6 caracteres',
    );
    expect(execute).not.toHaveBeenCalled();
  });

  test('submits trimmed credentials and invokes credential success callback', async () => {
    const execute = jest.fn().mockResolvedValue({
      id: 'cliente@banco.com',
      email: 'cliente@banco.com',
      name: 'cliente',
      token: 'jwt-token',
    });
    const onCredentialLoginSuccess = jest.fn();
    const onBiometricLoginSuccess = jest.fn();

    mockedUseDI.mockReturnValue({
      loginUseCase: {execute},
      biometricRSAAuthOrchestrator: defaultOrchestrator,
    } as never);

    await act(async () => {
      ReactTestRenderer.create(
        <Harness
          onCredentialLoginSuccess={onCredentialLoginSuccess}
          onBiometricLoginSuccess={onBiometricLoginSuccess}
        />,
      );
    });

    act(() => {
      latest?.setEmail('  cliente@banco.com  ');
      latest?.setPassword('  123456  ');
    });

    await act(async () => {
      await latest?.handleLogin();
    });

    expect(execute).toHaveBeenCalledWith('cliente@banco.com', '123456');
    expect(onCredentialLoginSuccess).toHaveBeenCalledWith({
      id: 'cliente@banco.com',
      email: 'cliente@banco.com',
      name: 'cliente',
      token: 'jwt-token',
    });
    expect(onBiometricLoginSuccess).not.toHaveBeenCalled();
    expect(latest?.emailError).toBeNull();
    expect(latest?.passwordError).toBeNull();
  });

  test('biometric login invokes biometric success callback', async () => {
    const loginWithBiometric = jest.fn().mockResolvedValue({
      accessToken: 'bio-token',
      email: 'cliente@banco.com',
    });
    const onCredentialLoginSuccess = jest.fn();
    const onBiometricLoginSuccess = jest.fn();

    mockedUseDI.mockReturnValue({
      loginUseCase: {execute: jest.fn()},
      biometricRSAAuthOrchestrator: {
        ...defaultOrchestrator,
        loginWithBiometric,
      },
    } as never);

    await act(async () => {
      ReactTestRenderer.create(
        <Harness
          onCredentialLoginSuccess={onCredentialLoginSuccess}
          onBiometricLoginSuccess={onBiometricLoginSuccess}
        />,
      );
    });

    await act(async () => {
      await latest?.handleBiometricLogin();
    });

    expect(loginWithBiometric).toHaveBeenCalled();
    expect(onBiometricLoginSuccess).toHaveBeenCalledWith({
      id: 'cliente@banco.com',
      email: 'cliente@banco.com',
      name: 'cliente',
      token: 'bio-token',
    });
    expect(onCredentialLoginSuccess).not.toHaveBeenCalled();
  });
});
