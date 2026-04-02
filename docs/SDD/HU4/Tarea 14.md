# 14. Implementar consumo de servicio de llave pública

**Prioridad**: Alta

**Historia padre**: #29065

## Descripción
Crear cliente de API para obtener la llave pública desde el backend (GET/POST según contrato). Cachear la llave con TTL/versionado en storage seguro o memoria, validar formato (PEM/JWK) y exponerla vía un servicio interno para cifrado/validaciones posteriores. Incluir manejo de errores y reintentos básicos.
