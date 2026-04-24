import {dateKeyLocal} from '../../../src/presentation/recentActivityCalendar/useRecentActivityCalendarViewModel';

describe('dateKeyLocal', () => {
  test('formats local YYYY-MM-DD', () => {
    const d = new Date(2026, 3, 8);
    expect(dateKeyLocal(d)).toBe('2026-04-08');
  });
});
