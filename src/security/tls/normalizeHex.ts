/**
 * Normaliza un digest hex (SHA-256) para comparación segura.
 */
export function normalizeSha256Hex(hex: string): string {
  return hex.replace(/\s/g, '').toLowerCase();
}
