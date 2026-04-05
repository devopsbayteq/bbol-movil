import {
  formatAppVersionDisplay,
  formatAppVersionHeader,
} from '../../src/utils/appVersion';

describe('appVersion', () => {
  test('formatAppVersionDisplay uses marketing + build with space', () => {
    expect(formatAppVersionDisplay('1.0.0', '1')).toBe('1.0.0 +1');
    expect(formatAppVersionDisplay(' 1.0.0 ', ' 1 ')).toBe('1.0.0 +1');
  });

  test('formatAppVersionDisplay without build returns marketing only', () => {
    expect(formatAppVersionDisplay('1.0.0', '')).toBe('1.0.0');
    expect(formatAppVersionDisplay('1.0.0', '   ')).toBe('1.0.0');
  });

  test('formatAppVersionHeader appends build as dot segment for X-Version', () => {
    expect(formatAppVersionHeader('1.0.0', '1')).toBe('1.0.0.1');
    expect(formatAppVersionHeader(' 1.0.0 ', ' 1 ')).toBe('1.0.0.1');
  });

  test('formatAppVersionHeader without build returns marketing only', () => {
    expect(formatAppVersionHeader('1.0.0', '')).toBe('1.0.0');
  });
});
