# 24. Implementar logging de Request/Response con correlación

**Prioridad**: Media-Alta

**Historia padre**: #29065

## Descripción
Crear middleware para logear request/response con correlation-id, método, path, status, latencia y tamaños. Enmascarar/omit datos sensibles (PII, credenciales, tokens). Asegurar que errores incluyan stacktrace en no-prod y formato estructurado (JSON) para observabilidad.
