export const SecureStorageKeys = {
  AUTH_TOKEN: '@bb_auth_token',
  USER_SESSION: '@bb_user_session',
  /** Id de dispositivo estable (paridad Flutter `keyDeviceId`) */
  KEY_DEVICE_ID: '@bb_key_device_id',
  /** Preferencia de idioma: `es` u otro (mapeo a Spanish/English en headers) */
  LANGUAGE: '@bb_language',
  /** Hash SHA-256 del certificado en DER (hex) tras handshake exitoso */
  CERTIFICATE_HASH: '@bb_certificate_hash',
  /** `validateHash` del API: activar pinning TLS estricto (doCertValidation) */
  CERTIFICATE_PINNING_ENABLED: '@bb_certificate_pinning_enabled',
  SERVER_PUBLIC_KEY: '@bb_server_public_key',
  BIOMETRIC_CREDENTIALS: '@bb_biometric_credentials',
  USER_LOGIN_DATA: '@bb_user_login_data',
} as const;
