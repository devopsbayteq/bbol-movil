# /pr

Preparar un pull request a partir del estado actual.

## Pasos

1. Revisar `git status` y `git diff` (staged y unstaged).
2. Verificar que pasan `npm run lint` y `npm test`.
3. Redactar título y descripción del PR: qué cambia, por qué y cómo validar.
4. Indicar si la tarea requirió actualizar `docs/` o flujos E2E.
5. Crear el PR con `gh pr create` o dejar el texto listo para pegar.
