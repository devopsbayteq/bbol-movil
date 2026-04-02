# 28. Implementar control de duplicidad de peticiones (idempotency/replay)

**Prioridad**: Alta

**Historia padre**: #29065

## Descripción
Implementar mecanismo anti-replay/idempotencia usando nonce o idempotency-key: almacenar claves recientes en cache/DB con TTL, detectar duplicados y responder según política (409 o respuesta previa). Integrar con correlation-id y con validación de timestamp/firma.
