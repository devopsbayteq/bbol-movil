import {DIProvider, useDI} from '../../src/di';

describe('src/di index (barrel)', () => {
  it('reexporta DIProvider y useDI', () => {
    expect(typeof DIProvider).toBe('function');
    expect(typeof useDI).toBe('function');
  });
});
