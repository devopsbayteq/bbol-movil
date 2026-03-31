# Desarrollo Asistido por IA

Este documento define cómo usar IA en el desarrollo del proyecto para acelerar entregas sin comprometer arquitectura, calidad ni seguridad.

## 1. Objetivo

La IA se debe usar como acelerador de análisis, documentación, scaffolding y validación, no como reemplazo del criterio técnico del equipo.

## 2. Cuándo sí usar IA

La IA es útil para:

- resumir arquitectura y código existente
- proponer refactors pequeños o medianos
- generar esqueletos de features alineados a la arquitectura
- redactar documentación técnica
- sugerir mejoras de naming, legibilidad y consistencia
- proponer casos de prueba y flujos `Maestro`
- detectar posibles violaciones de capas o duplicación de lógica

## 3. Cuándo no confiar ciegamente en IA

La salida de IA no debe aceptarse sin revisión cuando:

- inventa endpoints, contratos o payloads
- propone saltarse capas (`presentation -> data`, por ejemplo)
- introduce dependencias nuevas sin justificación
- genera tests que validan detalles internos en lugar de comportamiento
- altera seguridad, autenticación o persistencia sin validación humana

## 4. Contexto mínimo antes de pedir cambios a IA

Antes de solicitar código o refactors, compartir como contexto:

1. `docs/ARCHITECTURE.md`
2. `docs/STANDARDS.md`
3. `docs/TESTING.md`
4. los archivos concretos que la tarea afectará

## 5. Prompt recomendado

Usar prompts con esta estructura:

```text
Contexto:
- App React Native con arquitectura domain/data/presentation
- DI manual en src/di
- Pantallas del feature en src/presentation/<feature>

Objetivo:
- [describir el cambio]

Restricciones:
- No romper capas
- No usar any
- Mantener theming con useTheme()
- Si cambia un flujo de usuario, considerar Maestro

Salida esperada:
- Cambios mínimos
- Explicación breve
- Archivos a tocar
- Riesgos o validaciones necesarias
```

## 6. Reglas para aceptar código generado por IA

Antes de integrar una propuesta, validar que:

1. respeta la arquitectura del proyecto
2. no mueve lógica de negocio a pantallas o componentes visuales
3. mantiene la DI y los contratos del dominio
4. usa tipos consistentes
5. no hardcodea secretos ni datos reales
6. no introduce complejidad innecesaria
7. incluye o propone validación adecuada

## 7. Uso de IA por tipo de tarea

### Documentación

Permitido usar IA para:

- resumir comportamiento existente
- convertir decisiones en docs accionables
- mantener checklists y guías técnicas

Requisito:

- la documentación debe reflejar el código real, no un estado idealizado

### Features nuevas

Permitido usar IA para:

- generar estructura base de entidad, repositorio, caso de uso y view model
- proponer wiring en DI
- sugerir componentes locales o compartidos

Requisitos:

- revisar manualmente imports, naming y límites entre capas
- confirmar que la feature siga el patrón de `presentation` actual

### Refactors

La IA puede ayudar a:

- extraer funciones
- mover lógica a casos de uso o view models
- simplificar componentes extensos

Requisito:

- el refactor debe reducir complejidad sin cambiar comportamiento accidentalmente

### Testing

La IA puede:

- proponer escenarios de prueba
- convertir criterios de aceptación en flujos `Maestro`
- sugerir tests unitarios cuando haya lógica pura

Requisito:

- toda prueba generada debe revisarse para evitar falsos positivos o validaciones irrelevantes

## 8. Reglas específicas del proyecto

En este repositorio, la IA debe seguir estas reglas:

- consultar la arquitectura y estándares antes de proponer cambios amplios
- preferir cambios pequeños y auditables
- si crea una convención nueva, también debe proponer actualización documental
- si toca un journey de usuario, debe señalar impacto en `Maestro`
- si detecta deuda técnica, debe marcarla como recomendación y no esconderla dentro del cambio

## 9. Checklist de revisión humana

Antes de dar por bueno un cambio asistido por IA:

- ¿el cambio hace exactamente lo pedido?
- ¿la solución sigue `domain -> data -> presentation`?
- ¿los nombres son consistentes con el resto del repo?
- ¿la documentación quedó al día?
- ¿el cambio requiere o afecta un flujo `Maestro`?
- ¿se verificó lint, test o validación manual razonable?

## 10. Ejemplos de buenos pedidos a IA

- "Crea un nuevo feature siguiendo la arquitectura existente, con entidad, repositorio, caso de uso, view model y screen."
- "Propón un refactor para mover lógica de autenticación desde la pantalla al view model sin romper la DI."
- "Documenta la arquitectura real del proyecto y crea estándares de desarrollo alineados al código actual."
- "A partir de este flujo de usuario, sugiere un escenario E2E en Maestro y qué validaciones debe cubrir."

## 11. Ejemplos de malos pedidos a IA

- "Haz la mejor arquitectura posible" sin contexto del proyecto.
- "Conecta la API como creas conveniente" sin contrato real.
- "Agrega tests" sin definir qué comportamiento debe protegerse.
- "Optimiza todo" sin alcance ni métricas.

## 12. Regla final

La IA acelera el trabajo, pero la responsabilidad de arquitectura, calidad y coherencia sigue siendo del equipo.
