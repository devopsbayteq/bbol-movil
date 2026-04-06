# 19. Crear servicio POST /auth/login para autenticación

**Prioridad**: Alta

**Historia padre**: #29065

## Descripción
Implementar endpoint de autenticación que valide credenciales/2FA según reglas del proyecto, genere JWT con claims estándar (sub, aud, iss, iat, exp) y claims de negocio (roles/scopes). Integrar manejo de errores (credenciales inválidas, usuario bloqueado) y respuesta estandarizada.
