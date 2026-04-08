export interface User {
  id: string;
  email: string;
  /** Nombre de pila del API (login); puede ser cadena vacía. */
  firstName: string;
  name: string;
  /** Alias ya registrado en el servidor; si falta o es `null`, tras OTP se muestra registro de alias. */
  alias?: string | null;
  token: string;
  /** Epoch ms: cuando expira la sesión absoluta (Date.now() + sessionTimeSeconds * 1000). */
  sessionExpiresAt: number;
  /** Segundos de inactividad antes del cierre automático, configurado por el servidor. */
  inactivityTimeoutSeconds: number;
}
