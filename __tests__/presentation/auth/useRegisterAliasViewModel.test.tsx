import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {useDI} from '../../../src/di';
import {useRegisterAliasViewModel} from '../../../src/presentation/auth/useRegisterAliasViewModel';

jest.mock('../../../src/di', () => ({
  useDI: jest.fn(),
}));

const mockedUseDI = useDI as jest.MockedFunction<typeof useDI>;

describe('useRegisterAliasViewModel', () => {
  let latest: ReturnType<typeof useRegisterAliasViewModel> | undefined;

  function Harness() {
    latest = useRegisterAliasViewModel();
    return null;
  }

  beforeEach(() => {
    latest = undefined;
    jest.clearAllMocks();
    mockedUseDI.mockReturnValue({
      registerAliasUseCase: {execute: jest.fn().mockResolvedValue(undefined)},
    } as never);
  });

  test('submit con alias vacío deja error inline y no llama al caso de uso', async () => {
    await act(async () => {
      ReactTestRenderer.create(<Harness />);
    });

    await act(async () => {
      const ok = await latest?.submit();
      expect(ok).toBe(false);
    });

    expect(latest?.inlineError).toBe('Ingresa un alias.');
    expect(mockedUseDI().registerAliasUseCase.execute).not.toHaveBeenCalled();
  });

  test('onChangeAlias filtra caracteres no alfanuméricos', async () => {
    await act(async () => {
      ReactTestRenderer.create(<Harness />);
    });

    act(() => {
      latest?.onChangeAlias('mi@Alias#1');
    });
    expect(latest?.alias).toBe('miAlias1');
  });

  test('submit con alias válido llama execute y devuelve true', async () => {
    const execute = jest.fn().mockResolvedValue(undefined);
    mockedUseDI.mockReturnValue({
      registerAliasUseCase: {execute},
    } as never);

    await act(async () => {
      ReactTestRenderer.create(<Harness />);
    });

    act(() => {
      latest?.onChangeAlias('miAlias');
    });

    await act(async () => {
      const ok = await latest?.submit();
      expect(ok).toBe(true);
    });

    expect(execute).toHaveBeenCalledWith('miAlias');
    expect(latest?.isLoading).toBe(false);
  });

  test('submit ante error del API expone submitError y devuelve false', async () => {
    const execute = jest.fn().mockRejectedValue(new Error('Servicio no disponible'));
    mockedUseDI.mockReturnValue({
      registerAliasUseCase: {execute},
    } as never);

    await act(async () => {
      ReactTestRenderer.create(<Harness />);
    });

    act(() => {
      latest?.onChangeAlias('valido');
    });

    await act(async () => {
      const ok = await latest?.submit();
      expect(ok).toBe(false);
    });

    expect(latest?.submitError).toBe('Servicio no disponible');
  });

  test('submit ante rechazo no-Error usa mensaje genérico', async () => {
    const execute = jest.fn().mockRejectedValue('x');
    mockedUseDI.mockReturnValue({
      registerAliasUseCase: {execute},
    } as never);

    await act(async () => {
      ReactTestRenderer.create(<Harness />);
    });

    act(() => {
      latest?.onChangeAlias('okalias');
    });

    await act(async () => {
      await latest?.submit();
    });

    expect(latest?.submitError).toBe('Ocurrió un error inesperado');
  });

  test('onChangeAlias limpia inlineError tras fallo de validación', async () => {
    await act(async () => {
      ReactTestRenderer.create(<Harness />);
    });

    await act(async () => {
      await latest?.submit();
    });
    expect(latest?.inlineError).toBeTruthy();

    act(() => {
      latest?.onChangeAlias('ab');
    });
    expect(latest?.inlineError).toBeNull();
  });

  test('onChangeAlias limpia submitError tras error de API', async () => {
    const execute = jest.fn().mockRejectedValue(new Error('fail'));
    mockedUseDI.mockReturnValue({
      registerAliasUseCase: {execute},
    } as never);

    await act(async () => {
      ReactTestRenderer.create(<Harness />);
    });

    act(() => {
      latest?.onChangeAlias('validalias');
    });

    await act(async () => {
      await latest?.submit();
    });
    expect(latest?.submitError).toBeTruthy();

    act(() => {
      latest?.onChangeAlias('otro');
    });
    expect(latest?.submitError).toBeNull();
  });
});
