# /feature

Implementar un feature o un cambio acotado. Antes de escribir código, asegurar que las especificaciones están claras y el plan está aprobado.

## Fase 1 — Especificación

Antes de planificar, confirmar que se tiene lo necesario:

1. **Objetivo**: qué debe hacer el feature desde la perspectiva del usuario.
2. **Criterios de aceptación**: qué condiciones deben cumplirse para darlo por terminado.
3. **Insumos**: si hay mockups, specs de API o flujos en `docs/ref/`, revisarlos. Si faltan, pedirlos.
4. **Alcance**: qué queda dentro y qué queda fuera de este cambio.

Si falta alguno de estos puntos, preguntar antes de seguir.

## Fase 2 — Plan

No escribir código todavía. Primero:

1. Investigar el código existente para entender qué se necesita tocar.
2. Proponer un plan con los archivos que se van a crear o modificar, siguiendo el flujo de nuevo feature en `docs/STANDARDS.md`.
3. Esperar confirmación explícita antes de implementar.

## Fase 3 — Implementación

Con el plan aprobado:

1. Implementar en el orden del plan. Usar el feature `transactions` como referencia cuando aplique.
2. Correr `npm run lint` y `npm test`.
3. Si el cambio afecta un recorrido de usuario, señalar si hace falta flujo Maestro.
4. Resumir qué se hizo y qué conviene validar en dispositivo o emulador.
