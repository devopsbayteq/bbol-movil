# 25. Crear middleware de seguridad para Hash de Integridad (request signing)

**Prioridad**: Alta

**Historia padre**: #29065

## Descripción
Implementar validación de integridad mediante hash/HMAC: leer headers requeridos (timestamp, nonce, signature), canonicalizar request (path, query, body), calcular HMAC con secreto/cert y comparar en tiempo constante. Rechazar si falta header o firma inválida con códigos consistentes.
