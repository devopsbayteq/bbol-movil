export interface User {
  id: string;
  email: string;
  name: string;
  token: string;
  /** Epoch ms: cuando expira la sesión absoluta (Date.now() + sessionTimeSeconds * 1000). */
  sessionExpiresAt: number;
  /** Segundos de inactividad antes del cierre automático, configurado por el servidor. */
  inactivityTimeoutSeconds: number;
}
