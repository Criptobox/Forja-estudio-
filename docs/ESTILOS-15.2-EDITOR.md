# Estilos 15.2 — Editor visual profesional

**Base:** Estilos 15.1.  
**Alcance:** edición de composición de los bloques ya seleccionados, sin sustituir el motor de componentes ni alterar su HTML/CSS interno.

## Funciones implementadas

### Selección de capas
- Cada bloque renderizado en el teléfono se identifica como una capa.
- Se puede seleccionar tocándolo directamente en la vista previa o desde el panel Capas.
- La capa activa queda resaltada en el teléfono y en la lista.
- Selección múltiple con un control explícito apto para móvil; también admite Mayús/Ctrl/⌘ desde la vista previa o la lista.
- Los controles interactivos internos mantienen su comportamiento: tocar un botón, enlace o campo no selecciona accidentalmente la capa.

### Inspector contextual
Propiedades de composición editables en tiempo real:
- Ancho relativo: 60–100 %.
- Espaciado vertical adicional: 0–32 px.
- Opacidad: 40–100 %.
- Radio exterior: 0–36 px.
- Alineación: izquierda, centro o derecha.

El inspector aplica estas propiedades al contenedor del bloque. No reescribe su estructura interna, textos, enlaces ni controles. Los ajustes se aplican a todas las capas seleccionadas; si hay varias copias del mismo bloque, comparten el mismo ajuste porque la identidad de estilo sigue asociada al ID del recurso.

### Organización de capas
- Subir y bajar la capa activa.
- El orden se conserva en la pantalla y en el borrador.
- En proyectos multipantalla se conserva el orden de las capas que no pertenecen a la pantalla que se está reordenando.
- La barra inferior permanece separada del contenido, como antes.

### Reutilización de estilos
- Copiar los ajustes de composición de la capa activa.
- Pegarlos en una o varias capas seleccionadas.
- Restablecer los ajustes de composición seleccionados.
- Los cambios confirmados pasan por el historial existente de Deshacer/Rehacer.

### Persistencia y compatibilidad
- `layout` y `layerOrder` se incluyen en el borrador, guardado local, exportación JSON, enlace compartido y proyectos que usan `draftSnapshot()`.
- Los datos importados se normalizan: solo se aceptan IDs seleccionados, rangos válidos y alineaciones conocidas.
- Los proyectos antiguos que no contienen estos campos se abren con valores predeterminados.
- Los componentes siguen siendo hijos directos de `#phoneContent`, conservando los selectores usados por las pruebas y herramientas existentes.
- La exportación HTML final conserva los bloques originales y reproduce los ajustes de composición aplicados; no añade herramientas de edición al producto exportado.

## Archivos principales

- `web/crear.html`: panel visual, capas e inspector.
- `web/css/crear.css`: interfaz responsive y estados de selección.
- `web/js/crear.js`: modelo persistente, renderizado, selección, inspector, orden y reutilización de estilos.
- `web/sw.js`: versión de caché PWA `tinta-2026.11.4`.
- `web/index.html`: sincronizado con la entrada Tinta.
- `tests/tinta-editor-152.cjs`: regresión estática del editor.

## Pruebas ejecutadas

- `node --check web/js/crear.js`: correcto.
- `node --check` del catálogo y generador: correcto.
- `node tests/tinta-editor-152.cjs`: 20 comprobaciones correctas.
- `node tests/tinta-library-151.cjs`: 11 comprobaciones correctas.
- `python tools/sync-tinta-entry.py --check`: correcto.
- Se conserva la estructura `#phoneContent > .component-host` requerida por los tests preexistentes.

La suite Playwright integral y la comprobación visual real en Chrome Android/WebView siguen pendientes en este entorno. No se declara certificación de gestos táctiles, rendimiento ni accesibilidad completa.

## Limitaciones deliberadas de 15.2

- El inspector cambia composición exterior, no edita nodos arbitrarios dentro del Shadow DOM.
- Las copias del mismo ID comparten los ajustes de composición.
- No se incorpora todavía arrastrar y soltar, guías de alineación, agrupación persistente ni edición libre de capas internas.
- No se modifica el motor de exportación ni se introducen dependencias externas.

## Próxima fase propuesta: 15.3

Edición de contenido dentro de cada bloque: selección de subelementos, texto inline, controles de imagen, enlaces, estilos tipográficos por elemento y guías de alineación; manteniendo los límites de seguridad del Shadow DOM y la integridad del modelo de documento.
