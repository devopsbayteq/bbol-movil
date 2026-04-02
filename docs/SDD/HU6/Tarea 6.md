# 6. Frontend: Validaciones de formulario y visualización de límites/comisión

**Prioridad**: Alta

**Historia padre**: #29067

## Descripción
Implementar validación en cliente para campos obligatorios: Para, Desde, Monto &gt; 0, Concepto no vacío y longitud máxima. Al tener datos suficientes, consultar GET /transferencias/reglas y mostrar claramente comisión, mínimo y máximo antes de continuar. Deshabilitar 'Continuar' si hay inválidos o si reglas indican fuera de rango.
