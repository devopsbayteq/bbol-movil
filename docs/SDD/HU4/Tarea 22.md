# 22. Implementar consumo de servicio externo de Login

**Prioridad**: Alta

**Historia padre**: #29065

## Descripción
Integrar el proveedor/servicio de Login externo en la capa de conexión: construir request, firmar/encriptar si aplica, mapear respuesta a modelo interno, contemplar códigos de error del proveedor y timeouts. Agregar feature flag para habilitar/deshabilitar el proveedor por ambiente.
