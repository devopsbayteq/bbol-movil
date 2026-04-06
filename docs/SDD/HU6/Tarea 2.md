# 2. Backend: Exponer endpoint GET /transferencias/frecuentes (historial/favoritos)

**Prioridad**: Alta

**Historia padre**: #29067

## Descripción
Implementar en servicio de historial de transferencias un endpoint GET /transferencias/frecuentes para devolver lista de contactos favoritos/recientes (id, nombre, banco, tipoTransferencia, cuentaEnmascarada, cuentaId si aplica, metadata). Soportar paginación simple (limit/offset) y orden por más usado/reciente. Proteger por cliente autenticado.
