# 17. Configurar autenticación JWT (issuer, audience, firmas)

**Prioridad**: Alta

**Historia padre**: #29065

## Descripción
Agregar soporte JWT al backend: configuración de issuer/audience, algoritmo (RS256 recomendado), validación de exp/nbf, clockSkew, y validación de firma con llave pública. Incluir configuración por ambiente (dev/qa/prod) vía variables de entorno/secret manager. Exponer parámetros en archivo de config y registrar el esquema de autenticación en el framework.
