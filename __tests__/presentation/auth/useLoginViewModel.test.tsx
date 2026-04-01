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

  test('sanitizes disallowed characters in email and exposes a field error', async () => {
    mockedUseDI.mockReturnValue({
      loginUseCase: {execute: jest.fn()},
      secureStorageService: {save: jest.fn(), get: jest.fn()},
      biometricAuthService: {getAvailability: jest.fn(), authenticate: jest.fn()},
    } as never);

    await act(async () => {
      ReactTestRenderer.create(
        <Harness onLoginSuccess={jest.fn()} />,
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
      secureStorageService: {save: jest.fn(), get: jest.fn()},
      biometricAuthService: {getAvailability: jest.fn(), authenticate: jest.fn()},
    } as never);

    await act(async () => {
      ReactTestRenderer.create(
        <Harness onLoginSuccess={jest.fn()} />,
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

  test('submits trimmed credentials and stores biometric credentials after success', async () => {
    const execute = jest.fn().mockResolvedValue({
      id: 'cliente@banco.com',
      email: 'cliente@banco.com',
      name: 'cliente',
      token: 'jwt-token',
    });
    const save = jest.fn().mockResolvedValue(undefined);
    const onLoginSuccess = jest.fn();

    mockedUseDI.mockReturnValue({
      loginUseCase: {execute},
      secureStorageService: {save, get: jest.fn()},
      biometricAuthService: {getAvailability: jest.fn(), authenticate: jest.fn()},
    } as never);

    await act(async () => {
      ReactTestRenderer.create(
        <Harness onLoginSuccess={onLoginSuccess} />,
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
    expect(save).toHaveBeenCalledWith(
      '@bb_biometric_credentials',
      JSON.stringify({
        email: 'cliente@banco.com',
        password: '123456',
      }),
    );
    expect(onLoginSuccess).toHaveBeenCalledWith({
      id: 'cliente@banco.com',
      email: 'cliente@banco.com',
      name: 'cliente',
      token: 'jwt-token',
    });
    expect(latest?.emailError).toBeNull();
    expect(latest?.passwordError).toBeNull();
  });
});
