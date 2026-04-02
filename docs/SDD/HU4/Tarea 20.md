# 20. Implementar encripción/desencripción de campos sensibles en requests

**Prioridad**: Alta

**Historia padre**: #29065

## Descripción
Definir estrategia de cifrado para payload sensible (p.ej. AES-GCM con llave por ambiente, o JWE si aplica). Implementar interceptor/middleware para: detectar campos sensibles (por lista/atributos), desencriptar antes de llegar a controllers y encriptar respuestas si corresponde. Incluir manejo de IV/nonce, autenticación (tag) y errores de integridad.
