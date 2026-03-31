# Documentación Técnica

Este directorio concentra la documentación viva del proyecto. Debe mantenerse alineado con el código y actualizarse cuando cambien decisiones de arquitectura, estándares o flujos de trabajo.

## Documentos disponibles

| Documento | Propósito |
|---|---|
| `ARCHITECTURE.md` | Describe la arquitectura actual, las capas, la DI y el flujo principal de la app. |
| `STANDARDS.md` | Define los estándares de desarrollo, naming, calidad, documentación y Definition of Done. |
| `TESTING.md` | Establece la estrategia de testing del proyecto. `Maestro` es el estándar para E2E. |
| `AI_DEVELOPMENT.md` | Explica cómo usar IA en el desarrollo de forma segura, verificable y consistente con la arquitectura. |
| `THEMING.md` | Guía para trabajar con el sistema de temas y tokens de color. |
| `SHARED_COMPONENTS.md` | Convenciones para crear, promover y mantener componentes compartidos. |

## Orden recomendado de lectura

1. `ARCHITECTURE.md`
2. `STANDARDS.md`
3. `TESTING.md`
4. `AI_DEVELOPMENT.md`

## Estado actual resumido

- El proyecto es una app React Native única, no un monorepo.
- La arquitectura base es `domain -> data -> presentation`, con DI manual en `src/di`.
- La sesión se gestiona en `AuthProvider` y la navegación depende del estado autenticado.
- El theming es transversal y se resuelve con `ThemeProvider` + Zustand.
- Hoy existe testing básico con Jest, pero el estándar a partir de ahora para flujos end-to-end es `Maestro`.

## Regla de mantenimiento

Si una tarea cambia alguno de estos puntos, la documentación relacionada en `docs/` debe actualizarse dentro del mismo cambio.
