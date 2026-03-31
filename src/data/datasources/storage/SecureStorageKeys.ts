export const SecureStorageKeys = {
  AUTH_TOKEN: '@bb_auth_token',
  USER_SESSION: '@bb_user_session',
  /** JSON: { email: string; password: string } — stored after successful manual login for biometric reuse */
  BIOMETRIC_CREDENTIALS: '@bb_biometric_credentials',
} as const;
