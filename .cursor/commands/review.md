# /review

Revisar los cambios locales antes de commit o PR.

## Pasos

1. Correr `npm run lint` y corregir lo que salga.
2. Correr `npm test` si el cambio afecta lógica testeable.
3. Revisar el diff buscando violaciones a las reglas del proyecto (las restricciones concretas ya están en `.cursor/rules/`).
4. Si se tocó `src/di` o `domain`, verificar que la DI y los contratos sigan coherentes.
5. Resumir: riesgos, qué probar en la app y si hace falta actualizar `docs/` o flujos Maestro.
