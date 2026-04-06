# 9. Crear cliente/servicio de Auth en Front (API layer) con manejo de errores

**Prioridad**: Alta

**Historia padre**: #29065

## Descripción
Implementar módulo de red para autenticación: método login(user, password) y verifyOtp(challengeId, otp) (y resendOtp si aplica). Incluir timeouts, parseo de errores, mapeo de códigos (credenciales inválidas, usuario bloqueado, OTP requerido, OTP inválido/expirado), y retorno de modelos tipados. Centralizar headers, baseURL y logging seguro (sin credenciales).
