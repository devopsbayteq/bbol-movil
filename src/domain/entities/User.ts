export interface User {
  id: string;
  email: string;
  /** Nombre del titular desde el login (API `firstName`). */
  firstName: string;
  /** Nombre para saludo y titular en transferencias; suele coincidir con `firstName` o el local-part del email. */
  name: string;
  token: string;
  /** Epoch ms: cuando expira la sesión absoluta (Date.now() + sessionTimeSeconds * 1000). */
  sessionExpiresAt: number;
  /** Segundos de inactividad antes del cierre automático, configurado por el servidor. */
  inactivityTimeoutSeconds: number;
}
