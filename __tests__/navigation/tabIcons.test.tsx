import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {
  TabHomeIcon,
  TabMovementsIcon,
  TabTransferIcon,
} from '../../src/navigation/tabIcons';

describe('tabIcons', () => {
  test('TabHomeIcon aplica color, tamaño y etiqueta de accesibilidad', async () => {
    let root: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      root = ReactTestRenderer.create(
        <TabHomeIcon color="#112233" size={28} />,
      );
    });
    const img = root!.root.findByType('Image' as never);
    expect(img.props.accessibilityLabel).toBe('Inicio');
    expect(img.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          width: 28,
          height: 28,
          tintColor: '#112233',
        }),
      ]),
    );
  });

  test('TabTransferIcon usa tamaño por defecto 24', async () => {
    let root: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      root = ReactTestRenderer.create(<TabTransferIcon color="#000" />);
    });
    const img = root!.root.findByType('Image' as never);
    expect(img.props.accessibilityLabel).toBe('Transferir');
    expect(img.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({width: 24, height: 24}),
      ]),
    );
  });

  test('TabMovementsIcon expone etiqueta Movimientos', async () => {
    let root: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      root = ReactTestRenderer.create(<TabMovementsIcon color="#fff" />);
    });
    const img = root!.root.findByType('Image' as never);
    expect(img.props.accessibilityLabel).toBe('Movimientos');
  });
});
