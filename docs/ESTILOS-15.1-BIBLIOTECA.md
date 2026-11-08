# Estilos 15.1 — Biblioteca avanzada

**Estado:** implementada en la rama de trabajo; pruebas estáticas y de catálogo ejecutadas.  
**Base:** Estilos 15.0.  
**Compatibilidad:** se mantienen los IDs originales; no se borran registros ni se atribuyen licencias o certificaciones no verificadas.

## Cambios entregados

### 1. Catálogo
- Se conserva el inventario anterior de 138 registros.
- Se incorporan 20 componentes de iconografía SVG local, cada uno con familia propia, sin fuentes externas ni servicios de terceros.
- El catálogo pasa a 158 registros.
- Los iconos están en el módulo `icons` y se pueden seleccionar en la galería de Tinta.
- Cada icono usa un SVG de trazo con `viewBox` 24×24, color heredado y geometría escalable.

### 2. Filtros
- Se añade filtro por tipo de ficha: componente, recurso y plantilla.
- Se añade el tratamiento visual `solid` cuando el CSS contiene una declaración de fondo de color sólido y no se detecta degradado.
- Se conservan los filtros existentes por categoría, colección, módulo, familia, interactividad y búsqueda.
- Los filtros no deben cambiar la selección actual.

### 3. Integridad
- Los slugs ahora son únicos y deterministas. Cuando dos nombres producen el mismo slug, se añade el ID estable como sufijo.
- No se cambian IDs ni referencias de proyectos.
- Se actualiza el generador para incluir el pack SVG, de modo que `node tools/build-tinta-catalog.cjs` regenera el mismo catálogo de 158 registros.
- Se actualiza la entrada pública `web/index.html` desde `web/crear.html`.
- Se actualiza el HTML autónomo `ABRIR-TINTA-ACTUAL.html`.
- Se incrementa la caché PWA a `tinta-2026.11.3`.

## Auditoría del inventario resultante

| Métrica | Resultado |
|---|---:|
| Registros totales | 158 |
| IDs únicos | 158 |
| Slugs únicos | 158 |
| Nuevos iconos SVG | 20 |
| Familias | 149 |
| Módulos definidos | 26 |
| Módulos con registros | 14 |
| Fichas con tratamiento `solid` | 112 |
| Fichas con tratamiento `gradient` | 35 |
| Fichas con tratamiento `elevated` | 88 |
| Fichas con tratamiento `glass` | 1 |

Las cifras de estilos no son excluyentes: una ficha puede tener varios tratamientos. Diez fichas siguen sin un tratamiento especial detectado; no se les asigna uno por suposición.

Los 12 módulos sin registros siguen vacíos y marcados como no disponibles en el filtro. No se crean fichas vacías para aparentar cobertura.

## Archivos modificados

- `web/js/tinta-catalog.js`
- `web/js/crear.js`
- `web/crear.html`
- `web/index.html` (sincronizado)
- `web/sw.js`
- `tools/build-tinta-catalog.cjs`
- `design-library/catalog.json` (regenerado)
- `design-library/README.md`
- `README.md`
- `LEEME-SUBIR-A-GITHUB.md`
- `ABRIR-TINTA-ACTUAL.html` (regenerado)
- `tests/tinta-catalog.cjs`
- `tests/tinta-library-151.cjs`

## Verificación ejecutada

- `node --check` para los JS modificados y el generador: correcto.
- `node tools/build-tinta-catalog.cjs`: genera 158 registros y 149 familias.
- IDs únicos: correcto.
- Slugs únicos: correcto.
- Pack de 20 iconos: correcto.
- Filtro por tipo conectado a la galería: comprobado estáticamente.
- Filtro `solid`: conectado a la galería.
- `python tools/sync-tinta-entry.py --check`: correcto.
- `node tests/tinta-library-151.cjs`: correcto.

## Verificaciones pendientes

La suite Playwright completa no se declara aprobada: las dependencias `tests/node_modules` no están instaladas y la instalación npm se interrumpió en este entorno. Antes del release ejecutar:

```bash
cd tests
npm ci
npx playwright install chromium
node run-all.cjs
```

También queda pendiente una inspección visual real en Chrome Android/WebView. No se certifica accesibilidad WCAG de los 158 registros por haber añadido el pack.

## Próxima fase

**15.2 — Editor profesional:** conectar selección, capas e inspector con el modelo de documento compartido de 15.0, sin duplicar estado ni activar todavía una migración destructiva.
