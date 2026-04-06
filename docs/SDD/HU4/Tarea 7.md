# 7. Implementar acceso Biométrico desde Login (gateado por disponibilidad)

**Prioridad**: Media-Alta

**Historia padre**: #29065

## Descripción
Integrar autenticación biométrica del dispositivo (FaceID/TouchID/Android BiometricPrompt) como método alternativo desde Login. Validar disponibilidad y enrolamiento. Al éxito biométrico, obtener/usar credenciales seguras (token/refresh o credencial cifrada) desde almacenamiento seguro y ejecutar login silencioso contra backend. Mostrar fallback a usuario/contraseña si falla/cancela.
