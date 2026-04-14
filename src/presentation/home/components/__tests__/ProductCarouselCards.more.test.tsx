import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {Platform, Text} from 'react-native';
import {
  CheckingAccountCard,
  InvestmentCard,
  LoanCard,
} from '../ProductCarouselCards';

jest.mock('../../../../providers/theme', () => ({
  useTheme: () => ({
    colors: require('../../../../providers/theme/colors').LightColors,
  }),
}));

jest.mock('react-native-linear-gradient', () => {
  const R = require('react');
  const {View} = require('react-native');
  return {
    __esModule: true,
    default: ({children, style}: {children?: R.ReactNode; style?: object}) =>
      R.createElement(View, {testID: 'linear-gradient', style}, children),
  };
});

jest.mock('react-native-svg', () => {
  const R = require('react');
  const {View} = require('react-native');
  const Svg = ({children}: {children?: R.ReactNode}) =>
    R.createElement(View, {testID: 'svg'}, children);
  const Path = () => null;
  return {__esModule: true, default: Svg, Svg, Path};
});

describe('ProductCarouselCards — CheckingAccountCard', () => {
  test('delega en SavingsAccountCard con título por defecto corriente', () => {
    let root: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      root = ReactTestRenderer.create(
        <CheckingAccountCard
          maskedAccountNumber="****1111"
          balance={50}
          balanceMasked={false}
        />,
      );
    });
    const json = JSON.stringify(root!.toJSON());
    expect(json).toContain('Cta. corriente');
    act(() => root!.unmount());
  });

  test('balanceMasked controla saldo (no hay ojo en tarjeta)', () => {
    let rootMasked: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      rootMasked = ReactTestRenderer.create(
        <CheckingAccountCard
          maskedAccountNumber="****2222"
          balance={75}
          balanceMasked
        />,
      );
    });
    expect(JSON.stringify(rootMasked!.toJSON())).toContain('$**.**');

    let rootVisible: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      rootVisible = ReactTestRenderer.create(
        <CheckingAccountCard
          maskedAccountNumber="****2222"
          balance={75}
          balanceMasked={false}
        />,
      );
    });
    expect(JSON.stringify(rootVisible!.toJSON())).not.toContain('$**.**');
    act(() => rootVisible!.unmount());
  });

  test('Platform.select ios/android en flujo checking', () => {
    const spy = jest
      .spyOn(Platform, 'select')
      .mockImplementation(spec => (spec as {ios?: unknown}).ios as never);
    act(() => {
      ReactTestRenderer.create(
        <CheckingAccountCard
          maskedAccountNumber="*"
          balance={1}
          balanceMasked={false}
        />,
      );
    });
    spy.mockRestore();
    const spy2 = jest
      .spyOn(Platform, 'select')
      .mockImplementation(
        spec => (spec as {android?: unknown}).android as never,
      );
    act(() => {
      ReactTestRenderer.create(
        <CheckingAccountCard
          maskedAccountNumber="*"
          balance={1}
          balanceMasked={false}
        />,
      );
    });
    spy2.mockRestore();
  });
});

describe('ProductCarouselCards — LoanCard', () => {
  test('fecha inválida muestra guión en pill', () => {
    let root: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      root = ReactTestRenderer.create(
        <LoanCard
          loanGuid="loan-guid-1"
          nextInstallmentAmount={120}
          nextInstallmentDate="no-fecha"
          balanceMasked={false}
        />,
      );
    });
    const texts = root!.root.findAllByType(Text as never).map(
      (n: {props: {children?: unknown}}) => String(n.props.children ?? ''),
    );
    expect(texts.some(t => t.includes('—'))).toBe(true);
    act(() => root!.unmount());
  });

  test('balanceMasked controla cuota (no hay ojo en tarjeta)', () => {
    let rootMasked: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      rootMasked = ReactTestRenderer.create(
        <LoanCard
          loanGuid="abc"
          nextInstallmentAmount={200}
          nextInstallmentDate="2026-06-15"
          balanceMasked
        />,
      );
    });
    expect(JSON.stringify(rootMasked!.toJSON())).toContain('$**.**');

    let rootVisible: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      rootVisible = ReactTestRenderer.create(
        <LoanCard
          loanGuid="abc"
          nextInstallmentAmount={200}
          nextInstallmentDate="2026-06-15"
          balanceMasked={false}
        />,
      );
    });
    expect(JSON.stringify(rootVisible!.toJSON())).not.toContain('$**.**');
    act(() => rootVisible!.unmount());
  });
});

describe('ProductCarouselCards — InvestmentCard', () => {
  test('balanceMasked controla valor (no hay ojo en tarjeta)', () => {
    let rootMasked: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      rootMasked = ReactTestRenderer.create(
        <InvestmentCard
          investmentGuid="inv-1"
          productName="Fondo mixto"
          currentValue={1500.5}
          currency="USD"
          balanceMasked
        />,
      );
    });
    expect(JSON.stringify(rootMasked!.toJSON())).toContain('$**.**');

    let rootVisible: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      rootVisible = ReactTestRenderer.create(
        <InvestmentCard
          investmentGuid="inv-1"
          productName="Fondo mixto"
          currentValue={1500.5}
          currency="USD"
          balanceMasked={false}
        />,
      );
    });
    const flat = JSON.stringify(rootVisible!.toJSON());
    expect(flat).toContain('USD');
    expect(flat).not.toContain('$**.**');
    act(() => rootVisible!.unmount());
  });
});
