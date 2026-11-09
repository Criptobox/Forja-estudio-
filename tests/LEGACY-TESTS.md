# Pruebas históricas pendientes de adaptación

Estos 20 archivos se conservan íntegros como referencia de regresión de etapas anteriores de Tinta. Se excluyen del conjunto obligatorio porque sus expectativas ya no coinciden con el flujo web 15.15: algunas abren directamente `#bloques` aunque el flujo actual usa Idea → Pantalla; otras esperan que la propuesta automática abra la galería, conteos antiguos del catálogo, identificadores o versiones de caché anteriores.

**No se han borrado ni se declara que pasen.** Requieren adaptación individual a la UI y a los contratos vigentes.

## Ejecutar

```sh
cd tests
npm run test:legacy
```

Los fallos que permanezcan se deben resolver uno por uno, verificando primero si el problema está en el producto o en la expectativa antigua. No aumentar timeouts ni cambiar conteos a ciegas.

## Inventario conservado

- `legacy-android-back.cjs`
- `legacy-tinta-agent-1510.cjs`
- `legacy-tinta-assets.cjs`
- `legacy-tinta-button-style.cjs`
- `legacy-tinta-card-style.cjs`
- `legacy-tinta-catalog.cjs`
- `legacy-tinta-editor-153.cjs`
- `legacy-tinta-entry.cjs`
- `legacy-tinta-history.cjs`
- `legacy-tinta-library.cjs`
- `legacy-tinta-motion.cjs`
- `legacy-tinta-palettes.cjs`
- `legacy-tinta-pantallas.cjs`
- `legacy-tinta-repeat.cjs`
- `legacy-tinta-sectors.cjs`
- `legacy-tinta-share.cjs`
- `legacy-tinta-standalone.cjs`
- `legacy-tinta-states.cjs`
- `legacy-tinta-workflow.cjs`
- `legacy-tinta.cjs`

El conjunto principal ejecutado por `npm test` sigue incluyendo las pruebas de navegador y contrato que pasaban en la auditoría previa. Consulta `README.md` para las dos órdenes.
