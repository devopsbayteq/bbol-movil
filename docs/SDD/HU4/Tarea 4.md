# 4. Habilitar/deshabilitar botón "Iniciar sesión" por estado de formulario

**Prioridad**: Alta

**Historia padre**: #29065

## Descripción
Implementar lógica de habilitación del botón: solo habilitar cuando Usuario y Contraseña cumplan validaciones. Incluir estado &quot;loading&quot; al enviar (deshabilitar inputs/botón y mostrar indicador). Evitar múltiples submits (debounce/lock mientras haya request en curso).
