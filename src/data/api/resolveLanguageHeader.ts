import type {SecureStorageService} from '../../domain/services/SecureStorageService';
import {SecureStorageKeys} from '../datasources/storage/SecureStorageKeys';

export type ApiLanguageHeader = 'Spanish' | 'English';

/**
 * `es` → Spanish; otro valor o ausencia → English (Flutter default del método: Spanish si no hay clave — aquí sin clave usamos Spanish).
 */
export async function resolveLanguageHeader(
  storage: SecureStorageService,
): Promise<ApiLanguageHeader> {
  const raw = await storage.get(SecureStorageKeys.LANGUAGE);
  if (raw === 'es') {
    return 'Spanish';
  }
  if (raw == null || raw === '') {
    return 'Spanish';
  }
  return 'English';
}
