# 18. Crear servicio GET /security/public-key

**Prioridad**: Media-Alta

**Historia padre**: #29065

## Descripción
Implementar endpoint autenticado o público según arquitectura para entregar la llave pública (JWK o PEM). Incluir caching (ETag/Cache-Control) y rotación por kid si aplica. Validar formato y retornar metadata mínima (kid, alg, use).
