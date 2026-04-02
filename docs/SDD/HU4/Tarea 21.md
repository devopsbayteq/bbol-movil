# 21. Crear capa de conexión a servicios Core (HTTP client + contrato)

**Prioridad**: Alta

**Historia padre**: #29065

## Descripción
Implementar un módulo/SDK interno para consumir servicios Core: cliente HTTP con timeouts, retries con backoff, circuit breaker opcional, headers estándar (correlation-id, auth), serialización/deserialización, manejo unificado de errores y mapeo a excepciones de dominio. Definir interfaces/DTOs base.
