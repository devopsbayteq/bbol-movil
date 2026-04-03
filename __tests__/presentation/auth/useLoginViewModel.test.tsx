import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {useDI} from '../../../src/di';
import {useLoginViewModel} from '../../../src/presentation/auth/useLoginViewModel';

jest.mock('../../../src/di', () => ({
  useDI: jest.fn(),
}));

const mockedUseDI = useDI as jest.MockedFunction<typeof useDI>;

describe('useLoginViewModel', () => {
  let latest:
    | ReturnType<typeof useLoginViewModel>
    | undefined;

  function Harness({
    onLoginSuccess,
  }: {
    onLoginSuccess: (user: {
      id: string;
      email: string;
      name: string;
      token: string;
    }) => void;
  }) {
    latest = useLoginViewModel(onLoginSuccess);
    return null;
  }

  beforeEach(() => {
    latest = undefined;
    jest.clearAllMocks();
  });

  test('sanitizes caracteres no permitidos en usuario y muestra error de campo', async () => {
    mockedUseDI.mockReturnValue({
      loginUseCase: {execute: jest.fn()},
      secureStorageService: {save: jest.fn(), get: jest.fn()},
      biometricRSAAuthOrchestrator: {registerBiometricForUser: jest.fn().mockResolvedValue(undefined)},
    } as never);

    await act(async () => {
      ReactTestRenderer.create(
        <Harness onLoginSuccess={jest.fn()} />,
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
      secureStorageService: {save: jest.fn(), get: jest.fn()},
      biometricAuthService: {getAvailability: jest.fn(), authenticate: jest.fn()},
    } as never);

    await act(async () => {
      ReactTestRenderer.create(
        <Harness onLoginSuccess={jest.fn()} />,
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

  test('submits trimmed credentials and calls onLoginSuccess after success', async () => {
    const execute = jest.fn().mockResolvedValue({
      id: 'usuario01',
      email: 'usuario01',
      name: 'Usuario Demo',
      token: 'jwt-token',
    });
    const registerBiometricForUser = jest.fn().mockResolvedValue(undefined);
    const onLoginSuccess = jest.fn();

    mockedUseDI.mockReturnValue({
      loginUseCase: {execute},
      secureStorageService: {save: jest.fn(), get: jest.fn()},
      biometricRSAAuthOrchestrator: {registerBiometricForUser},
    } as never);

    await act(async () => {
      ReactTestRenderer.create(
        <Harness onLoginSuccess={onLoginSuccess} />,
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
    expect(registerBiometricForUser).toHaveBeenCalledWith('usuario01');
    expect(onLoginSuccess).toHaveBeenCalledWith({
      id: 'usuario01',
      email: 'usuario01',
      name: 'Usuario Demo',
      token: 'jwt-token',
    });
    expect(latest?.emailError).toBeNull();
    expect(latest?.passwordError).toBeNull();
  });
});
