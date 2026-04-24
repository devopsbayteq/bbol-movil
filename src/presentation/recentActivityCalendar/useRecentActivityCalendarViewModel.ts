import {useCallback, useMemo, useState} from 'react';
import {getDemoActivityForDay} from './recentActivityCalendarMock';
import type {
  CalendarCell,
  CalendarMode,
} from './recentActivityCalendarTypes';

export const WEEKDAY_LABELS_ES = [
  'Dom',
  'Lun',
  'Mar',
  'Mié',
  'Jue',
  'Vie',
  'Sáb',
] as const;

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function dateKeyLocal(d: Date): string {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function startOfWeekSunday(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = x.getDay();
  x.setDate(x.getDate() - dow);
  x.setHours(12, 0, 0, 0);
  return x;
}

function buildMonthRows(
  year: number,
  monthIndex: number,
  selected: Date,
): CalendarCell[][] {
  const first = new Date(year, monthIndex, 1);
  const leading = first.getDay();
  const dim = daysInMonth(year, monthIndex);
  const selectedKey = dateKeyLocal(selected);

  const cells: CalendarCell[] = [];
  for (let i = 0; i < leading; i += 1) {
    cells.push({kind: 'empty'});
  }
  for (let day = 1; day <= dim; day += 1) {
    const date = new Date(year, monthIndex, day);
    const activity = getDemoActivityForDay(day);
    cells.push({
      kind: 'day',
      date,
      dayOfMonth: day,
      activity,
      isSelected: dateKeyLocal(date) === selectedKey,
    });
  }
  while (cells.length % 7 !== 0) {
    cells.push({kind: 'empty'});
  }

  const rows: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }
  return rows;
}

function buildWeekRow(weekContaining: Date, selected: Date): CalendarCell[] {
  const start = startOfWeekSunday(weekContaining);
  const selectedKey = dateKeyLocal(selected);
  const row: CalendarCell[] = [];

  for (let i = 0; i < 7; i += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const dom = date.getDate();
    const activity = getDemoActivityForDay(dom);
    row.push({
      kind: 'day',
      date,
      dayOfMonth: dom,
      activity,
      isSelected: dateKeyLocal(date) === selectedKey,
    });
  }
  return row;
}

export function useRecentActivityCalendarViewModel() {
  const [mode, setMode] = useState<CalendarMode>('month');
  const [baseMonth, setBaseMonth] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    const n = new Date();
    const y = n.getFullYear();
    const m = n.getMonth();
    const last = daysInMonth(y, m);
    const day = Math.min(8, last);
    return new Date(y, m, day);
  });

  const selectDay = useCallback((date: Date) => {
    setSelectedDate(date);
    setBaseMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  }, []);

  const gridRows = useMemo(() => {
    if (mode === 'month') {
      return buildMonthRows(
        baseMonth.getFullYear(),
        baseMonth.getMonth(),
        selectedDate,
      );
    }
    return [buildWeekRow(selectedDate, selectedDate)];
  }, [baseMonth, mode, selectedDate]);

  return {
    mode,
    setMode,
    gridRows,
    weekdayLabels: WEEKDAY_LABELS_ES,
    selectedDate,
    selectDay,
  };
}
