# Estilos 15.4 — Edición de elementos internos

## Objetivo
Permitir seleccionar y personalizar un elemento dentro de un bloque sin sustituir el componente completo.

## Funciones
- Modo explícito de selección interna desde el inspector.
- Selección por ruta DOM relativa al Shadow Root (`tag:nth-of-type`).
- Edición de texto para elementos sin hijos.
- Ajustes de color, fondo, borde y radio.
- Restauración individual del elemento.
- Persistencia en borrador, historial y exportación HTML.
- Validación de identificadores, selectores y límites de valores al importar proyectos antiguos o nuevos.

## Uso
1. Activa el Editor visual.
2. Selecciona una capa.
3. Activa «Seleccionar elemento interno».
4. Toca un texto o elemento dentro del bloque en el teléfono.
5. Cambia el texto o los estilos y pulsa «Aplicar al elemento».
6. Desactiva el modo de selección para volver a seleccionar capas completas.

Los elementos con hijos internos no permiten reemplazar su texto desde este control para evitar borrar iconos, imágenes o estructura anidada. Sí permiten modificar sus estilos.

## Límites conocidos
- No incluye arrastrar y soltar, agrupación ni guías inteligentes.
- Los selectores se basan en la estructura del componente; si una futura versión cambia profundamente su HTML, un ajuste guardado puede dejar de encontrar su destino.
- No todos los componentes tienen elementos internos apropiados para editar texto.
- No se ha certificado todavía en navegador automatizado ni en Android WebView.

## Pruebas
- `node --check web/js/crear.js`
- `node tests/tinta-editor-154.cjs`
- `node tests/tinta-editor-152.cjs`
- `node tests/tinta-library-151.cjs`
