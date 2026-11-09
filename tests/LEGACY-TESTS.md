# Pruebas históricas pendientes de adaptación

Estos 15 archivos se conservan íntegros como referencia de regresión de etapas anteriores de Tinta. Se excluyen del conjunto obligatorio porque sus expectativas ya no coinciden con el flujo web 15.15: algunas abren directamente `#bloques` aunque el flujo actual usa Idea → Pantalla; otras esperan que la propuesta automática abra la galería, conteos antiguos del catálogo, identificadores o versiones de caché anteriores.

**No se han borrado ni se declara que pasen.** Requieren adaptación individual a la UI y a los contratos vigentes.

## Ejecutar

```sh
cd tests
npm run test:legacy
```

Los fallos que permanezcan se deben resolver uno por uno, verificando primero si el problema está en el producto o en la expectativa antigua. No aumentar timeouts ni cambiar conteos a ciegas.

## Pruebas reactivadas

- `tinta-assets.cjs` — recuperada tras adaptar la navegación al flujo actual Idea → Bloques → Pantalla. Conserva las comprobaciones de compresión, accesibilidad, destinos seguros, persistencia, importación/exportación y diseño responsive.


- `tinta-editor-153.cjs` — recuperada tras alinear la comprobación de restauración tipográfica con el formato actual del snapshot (`typeStyles`, `innerStyles`, `innerHtml`, `layout`, `layerOrder`). Se mantienen las comprobaciones de controles, eventos, guardado, restauración, escala y salida.

- `tinta-button-style.cjs` — reactivada tras adaptar el inicio al flujo Idea → Bloques y actualizar el inventario de 158 registros. Conserva las comprobaciones del inspector, estilos tipados, persistencia, proyectos, exportación y responsive.

- `tinta-card-style.cjs` — reactivada tras adaptar navegación Idea → Bloques, catálogo de 158 piezas y apertura del panel manual. Mantiene las comprobaciones del inspector, gradientes, contraste, variantes, exportaciones, accesibilidad y 25 diseños de tarjeta.

- `tinta-catalog.cjs` — reactivada tras adaptar la entrada al flujo Idea → Bloques. Mantiene las comprobaciones del catálogo de 158 registros, sus 26 módulos, filtros, búsqueda, familias, variantes, procedencia/licencias, exportación JSON y de componentes, proyectos y responsive.

## Inventario conservado

- `legacy-android-back.cjs`
- `tinta-agent-1510.cjs` — reactivada tras actualizar solo las dos expectativas de versión/caché obsoletas.
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
