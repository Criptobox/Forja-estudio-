# Estilos 15.7 — Inspector avanzado de elementos

## Implementado
- Inspector interno ampliado con grosor de borde, opacidad, relleno interior, ancho predefinido y sombras.
- Radio configurable hasta 48 px.
- Personalización SVG de relleno, trazo y grosor de trazo.
- Los cambios de relleno y trazo SVG requieren activar sus casillas para evitar modificar gráficos accidentalmente al editar otra propiedad.
- Las propiedades se escriben en el elemento seleccionado y se guardan como HTML interno del bloque, por lo que sobreviven a recargas y exportación.
- La lista de capas internas añade un fragmento de texto, aria-label, alt o clase para ayudar a distinguir elementos.
- Controles de formulario adaptados al tema claro/oscuro y a pantallas estrechas.

## Alcance y límites
- Las sombras disponibles son presets, no un editor libre de sombras.
- Ancho usa presets o conserva el original; no se ofrece todavía altura libre ni posicionamiento absoluto.
- SVG se modifica mediante atributos fill, stroke y stroke-width del gráfico seleccionado o de su primer descendiente SVG/path.
- No se añade carga de SVG externo ni edición del código fuente SVG.
- Restaurar la estructura interna puede borrar todos los cambios internos de ese bloque; la acción se mantiene identificada como restauración global.

## Validación
Ejecutar `node tests/tinta-editor-157.cjs` y las pruebas de regresión 15.6, 15.5, 15.4, 15.2 y 15.1.
La interacción real en navegador/Android debe probarse en un entorno con Playwright o WebView.
