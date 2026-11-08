# Estilos 15.8 — Posicionamiento, alineación e iconos

## Implementado
- Desplazamiento visual horizontal y vertical del elemento seleccionado, con `translate` para no sobrescribir transformaciones CSS existentes.
- Ajuste magnético configurable de 1, 4, 8, 16 o 24 px aplicado al confirmar la posición.
- Alineación al borde izquierdo/derecho/superior/inferior del contenedor y centrado horizontal/vertical.
- Restablecimiento de la posición sin borrar otros estilos.
- Ajuste de separación entre hijos cuando el elemento seleccionado es un contenedor.
- Inspector de iconos SVG: tamaño, rotación, relleno, trazo, grosor, extremos y uniones del trazo.
- Cambios persistidos dentro del HTML del bloque y exportados con el diseño.
- Controles organizados en tres columnas de acciones y rejilla adaptable para móvil.

## Límites
- El movimiento es visual mediante CSS translate, no un editor de coordenadas absolutas ni de restricciones responsive.
- La alineación usa el rectángulo del contenedor inmediato; no implementa guías magnéticas continuas mientras se arrastra.
- El ajuste magnético cuantiza los valores al aplicar, no durante el gesto.
- El inspector SVG trabaja con el SVG seleccionado o su primer SVG/path descendiente; no edita nodos ni paths.
- La separación entre hijos se aplica a row-gap y column-gap del elemento seleccionado cuando contiene hijos.

## Validación
Ejecutar `node tests/tinta-editor-158.cjs` y pruebas de regresión 15.7 a 15.1.
La interacción real debe probarse en navegador y Android WebView; la validación estática no equivale a certificación visual.
