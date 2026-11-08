# Estilos 15.6 — Editor visual de imágenes y medios

## Alcance implementado
- Conserva la sustitución de imágenes por URL HTTPS o archivos PNG, JPEG y WebP locales comprimidos.
- Cada imagen admite `cover` (recorte para llenar), `contain` (foto completa) y `fill` (estirar).
- Ajuste independiente de posición horizontal y vertical entre 0 y 100%.
- Redondeo adicional de 0 a 48 px; 0 conserva el radio que ya tuviera el diseño original.
- Texto alternativo editable.
- Los ajustes se normalizan, persisten en el borrador/proyecto y se incluyen al exportar el HTML.
- Los proyectos anteriores sin estos campos siguen usando `cover`, posición centrada y radio original.

## Límites
- No se ha añadido recorte destructivo de píxeles ni un editor de capas SVG.
- `contain` puede dejar espacio libre dentro del marco; el color de ese espacio depende del diseño original.
- Los archivos locales siguen sujetos a los límites de compresión y tamaño del proyecto.
- Las URL externas necesitan conexión a Internet al visualizar el HTML exportado.

## Validación
Ejecutar `node tests/tinta-editor-156.cjs` y las pruebas de regresión disponibles.
La prueba de navegador `tests/tinta-assets.cjs` requiere Playwright y un servidor local; no se considera superada si esas dependencias no están disponibles.
