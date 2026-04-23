import {formatDaySheetTitleEs} from '../../../src/presentation/recentActivityCalendar/recentActivityDaySheetTitle';

describe('formatDaySheetTitleEs', () => {
  test('formats uppercase month in Spanish', () => {
    expect(formatDaySheetTitleEs(new Date(2026, 3, 20))).toBe('20 DE ABRIL');
  });
});
