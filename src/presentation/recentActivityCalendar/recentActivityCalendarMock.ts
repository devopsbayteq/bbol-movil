import type {CalendarDayActivity} from './recentActivityCalendarTypes';

const DEFAULT_ACTIVITY: CalendarDayActivity = {
  hasCredit: false,
  hasDebit: false,
  icon: null,
  extraCount: null,
};

/** Patrón demo alineado al frame Figma (día del mes 1–31). */
const DEMO_BY_DAY: Partial<Record<number, CalendarDayActivity>> = {
  1: {hasCredit: true, hasDebit: true, icon: 'tv', extraCount: null},
  2: {hasCredit: true, hasDebit: false, icon: null, extraCount: null},
  3: {hasCredit: true, hasDebit: true, icon: null, extraCount: 2},
  4: {hasCredit: false, hasDebit: false, icon: null, extraCount: null},
  5: {hasCredit: false, hasDebit: true, icon: 'phone', extraCount: null},
  6: {hasCredit: true, hasDebit: true, icon: null, extraCount: null},
  7: {hasCredit: false, hasDebit: true, icon: null, extraCount: null},
  8: {hasCredit: false, hasDebit: true, icon: 'phone', extraCount: null},
  9: {hasCredit: false, hasDebit: false, icon: null, extraCount: null},
  10: {hasCredit: false, hasDebit: false, icon: 'card', extraCount: null},
  11: {hasCredit: false, hasDebit: false, icon: null, extraCount: null},
  15: {hasCredit: false, hasDebit: false, icon: 'wifi', extraCount: null},
  20: {hasCredit: false, hasDebit: false, icon: null, extraCount: 2},
  25: {hasCredit: false, hasDebit: false, icon: 'bulb', extraCount: null},
};

export function getDemoActivityForDay(dayOfMonth: number): CalendarDayActivity {
  const patch = DEMO_BY_DAY[dayOfMonth];
  if (!patch) {
    return {...DEFAULT_ACTIVITY};
  }
  return {...DEFAULT_ACTIVITY, ...patch};
}
