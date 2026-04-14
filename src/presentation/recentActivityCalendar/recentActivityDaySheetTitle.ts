const MONTHS_ES_UPPER = [
  'ENERO',
  'FEBRERO',
  'MARZO',
  'ABRIL',
  'MAYO',
  'JUNIO',
  'JULIO',
  'AGOSTO',
  'SEPTIEMBRE',
  'OCTUBRE',
  'NOVIEMBRE',
  'DICIEMBRE',
] as const;

/** Ej. `20 DE ABRIL` (formato Figma). */
export function formatDaySheetTitleEs(d: Date): string {
  const day = d.getDate();
  const month = MONTHS_ES_UPPER[d.getMonth()];
  return `${day} DE ${month}`;
}
