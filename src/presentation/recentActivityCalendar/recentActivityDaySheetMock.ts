import type {DaySheetLineItem} from './recentActivityDaySheetTypes';

/** Demo alineado al Figma (modal día). Sustituir por datos reales por fecha cuando exista API. */
export function getDemoDaySheetItems(_date: Date): DaySheetLineItem[] {
  return [
    {
      id: 'netflix',
      icon: 'tv',
      title: 'Netflix',
      subtitle: 'Programado • Servicio',
      amountLabel: '$15.99',
    },
    {
      id: 'spotify',
      icon: 'music',
      title: 'Spotify',
      subtitle: 'Programado • Servicio',
      amountLabel: '$3.99',
    },
  ];
}
