# Auditoría del repositorio · 8 de noviembre de 2026

## Alcance

Auditoría de solo lectura de `Criptobox/Forja-estudio-`, rama `main`, commit `b863d457f5a06f85caa1e128565c14fe1721653b`. La organización se prepara en `maintenance/repo-audit-2026-11`; no se modifica `main`.

## Hallazgos

1. `VERSION-ENTREGA.json` declara **15.15**, no 15.16.
2. El README mezclaba encabezado 15.15, sección de entrega 15.12 e información histórica sin jerarquía clara.
3. La raíz acumulaba previews y manifiestos históricos junto al código fuente.
4. `web/index.html` y `web/crear.html` son idénticos en el commit auditado.
5. Android terminó correctamente en el commit auditado.
6. El workflow de publicación PWA falló en el job E2E; el job de despliegue fue omitido por dependencia.
7. `tests.yml` ejecuta todos los archivos `.cjs` de `tests/`, sin clasificación entre pruebas actuales y pruebas históricas.

## CI

- Commit: `b863d457f5a06f85caa1e128565c14fe1721653b`
- Run fallido: [Publicar PWA #3](https://github.com/Criptobox/Forja-estudio-/actions/runs/42535631735)
- Android build: correcto en el mismo commit.
- Pages build/deployment independiente: correcto en el run observado.

### Tests con fallo reportado

`android-back.cjs`, `tinta-agent-1510.cjs`, `tinta-assets.cjs`, `tinta-button-style.cjs`, `tinta-card-style.cjs`, `tinta-catalog.cjs`, `tinta-editor-153.cjs`, `tinta-entry.cjs`, `tinta-history.cjs`, `tinta-library.cjs`, `tinta-motion.cjs`, `tinta-palettes.cjs`, `tinta-pantallas.cjs`, `tinta-repeat.cjs`, `tinta-sectors.cjs`, `tinta-share.cjs`, `tinta-standalone.cjs`, `tinta-states.cjs`, `tinta-workflow.cjs` y `tinta.cjs`.

Los errores incluyen conteos de catálogo que no coinciden, elementos no visibles, timeouts al esperar `.gallery-item`, lectura de `textContent` sobre un nodo inexistente y una aserción de IDs no conservados. Deben reproducirse individualmente contra la interfaz actual antes de cambiar producto o pruebas.

## Plan

1. Mantener pruebas de sintaxis y contrato que ya pasan.
2. Clasificar tests como UI actual, compatibilidad histórica o prueba obsoleta.
3. Corregir el producto cuando la conducta actual esté rota; actualizar selectores solo cuando un cambio intencional de UI esté cubierto por una prueba vigente.
4. Aislar fixtures históricos en vez de exigir que la UI actual mantenga selectores antiguos.
5. No borrar tests, elevar timeouts como sustituto de una corrección ni marcar como verde un test no ejecutado.
6. Ejecutar batería completa, Android y publicación PWA antes de integrar.

## Criterio de cierre

La auditoría no se considera resuelta hasta que la batería E2E pase en GitHub Actions, la publicación PWA se ejecute tras las pruebas, Android siga compilando y la documentación coincida con la versión integrada.
