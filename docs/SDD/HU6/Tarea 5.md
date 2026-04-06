# 5. Backend: Exponer endpoint GET /transferencias/reglas para límites y comisión

**Prioridad**: Alta

**Historia padre**: #29067

## Descripción
En servicio Transferencia, crear endpoint GET /transferencias/reglas que reciba tipoTransferencia, cuentaOrigenId y beneficiarioId (o datos destino) y retorne: montoMin, montoMax, moneda, comision (monto o 0) y texto 'Sin cargo' cuando aplique, además de condiciones relevantes. Implementar lógica inicial (aunque sea configurable) y contrato estable.
