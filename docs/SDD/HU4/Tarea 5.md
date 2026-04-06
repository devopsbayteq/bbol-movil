# 5. Integrar navegación a pantalla de OTP tras login exitoso

**Prioridad**: Alta

**Historia padre**: #29065

## Descripción
Al presionar &quot;Iniciar sesión&quot;, ejecutar flujo: llamar caso de uso/servicio de autenticación; si la respuesta indica que se requiere OTP, navegar a la pantalla de ingreso de OTP (6 dígitos/caracteres). Pasar el contexto necesario de la transacción (p.ej. transactionId/challengeId/username) sin exponer datos sensibles.
