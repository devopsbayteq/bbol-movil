export type ApiSwitchImplementation =
  | 'Mock'
  | 'Orchestrator'
  | 'Personalized'
  | 'WebApi';

/** Base URL del API (ajustar por entorno si añadís flavors). */
export const API_BASE_URL = 'https://dev4.bayteq.com:50112/api/v1';

/**
 * Selector de `X-SwitchImplementation` (paridad `UrlFactoryApp().enviromentApiSelectedSwitch`).
 */
export function getApiSwitchImplementation(): ApiSwitchImplementation {
  return 'WebApi';
}
