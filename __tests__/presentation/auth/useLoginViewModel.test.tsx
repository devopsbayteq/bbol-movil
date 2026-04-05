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

  test('sanitizes caracteres no permitidos en usuario y muestra error de campo', async () => {
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
      latest?.setEmail('usuario\u200B01');
    });

    expect(latest?.email).toBe('usuario01');
    expect(latest?.emailError).toBe(
      'El usuario contiene caracteres no permitidos',
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
      latest?.setEmail('usuario01');
      latest?.setPassword('123');
    });

    await act(async () => {
      await latest?.handleLogin();
    });

    expect(latest?.passwordError).toBe(
      'La contraseña debe tener al menos 8 caracteres',
    );
    expect(execute).not.toHaveBeenCalled();
  });

  test('submits trimmed credentials and invokes credential success callback', async () => {
    const execute = jest.fn().mockResolvedValue({
      id: 'usuario01',
      email: 'usuario01',
      name: 'Usuario Demo',
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
      latest?.setEmail('  usuario01  ');
      latest?.setPassword('  12345678  ');
    });

    await act(async () => {
      await latest?.handleLogin();
    });

    expect(execute).toHaveBeenCalledWith('usuario01', '12345678');
    expect(onCredentialLoginSuccess).toHaveBeenCalledWith({
      id: 'usuario01',
      email: 'usuario01',
      name: 'Usuario Demo',
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
