# 13. Implementar consumo de servicio de hash de certificado

**Prioridad**: Alta

**Historia padre**: #29065

## Descripción
Crear cliente de API para obtener el hash de certificado desde el backend. Persistir el valor recibido para validaciones futuras (pinning/attestation según diseño). Validar estructura del response, agregar timeouts, manejo de errores y fallback a último valor cacheado si aplica.
