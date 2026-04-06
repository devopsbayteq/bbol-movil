# 4. Backend: Exponer endpoints de Beneficiarios

**Prioridad**: Alta

**Historia padre**: #29067

## Descripción
Implementar en servicio Beneficiario: GET /beneficiarios (listar) y GET /beneficiarios/buscar?q= para búsqueda por nombre/documento/cuenta según tipo. Retornar datos mínimos para formulario: id, nombre, banco (si otros bancos), tipoTransferencia soportado, cuentaEnmascarada, cuentaDestino (tokenizada o id). Incluir validaciones y autorización por cliente.
