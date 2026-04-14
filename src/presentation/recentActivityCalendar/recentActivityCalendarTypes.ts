export type CalendarMode = 'month' | 'week';

export type CalendarActivityIcon = 'tv' | 'phone' | 'card' | 'wifi' | 'bulb';

export interface CalendarDayActivity {
  hasCredit: boolean;
  hasDebit: boolean;
  icon: CalendarActivityIcon | null;
  extraCount: number | null;
}

export type CalendarCell =
  | {kind: 'empty'}
  | {
      kind: 'day';
      date: Date;
      dayOfMonth: number;
      activity: CalendarDayActivity;
      isSelected: boolean;
    };
