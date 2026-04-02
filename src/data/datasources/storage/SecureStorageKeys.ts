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
  /** @deprecated No guardar contraseña para biometría; usar flujo RSA + BIOMETRIC_USERNAME */
  BIOMETRIC_CREDENTIALS: '@bb_biometric_credentials',
  /** Email/usuario para cifrado en challenge/login biométrico (sin contraseña) */
  BIOMETRIC_USERNAME: '@bb_biometric_username',
  USER_LOGIN_DATA: '@bb_user_login_data',
} as const;
