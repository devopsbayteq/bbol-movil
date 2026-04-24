export type DaySheetLineIcon = 'tv' | 'music';

export interface DaySheetLineItem {
  id: string;
  icon: DaySheetLineIcon;
  title: string;
  subtitle: string;
  amountLabel: string;
}
