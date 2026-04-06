# 1. Backend: Exponer endpoint GET /home para tarjetas, cuentas y pagos frecuentes

**Prioridad**: Alta

**Historia padre**: #29062

## Descripción
Implementar en el servicio Home un endpoint GET /home que retorne: lista de cuentas origen elegibles (id, alias, numeroEnmascarado, moneda, disponible, saldo, tipo), tarjetas (id, alias, ultimos4, disponible) y pagos frecuentes (id, nombre, tipo, metadata mínima). Incluir contrato versionado, validación de sesión/autorización y trazas (correlation-id). Mockear orígenes si aún no existen integraciones.
