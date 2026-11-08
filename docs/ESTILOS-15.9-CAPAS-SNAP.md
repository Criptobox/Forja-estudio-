# Estilos 15.9 — Capas inteligentes y ajuste magnético

## Cambios
- El panel de capas internas muestra un árbol jerárquico, no solo los hermanos del elemento seleccionado.
- Se puede seleccionar cualquier nodo del árbol; la selección actual queda marcada.
- El árbol está limitado a 120 nodos y 7 niveles para proteger el rendimiento en diseños grandes.
- Al mover un elemento con puntero, se comparan bordes y centros con sus elementos hermanos.
- Si la diferencia es de 7 px o menos, el elemento se ajusta a esa alineación y el hermano coincidente se resalta.
- Se guardan los cambios de posición al terminar el gesto.
- Se reutiliza el historial general del editor (`save`) para que el movimiento quede registrado junto al resto de cambios.

## Interacción móvil
- Los elementos seleccionados pueden moverse con gestos de puntero/táctiles.
- No se inicia el movimiento desde botones, enlaces, campos ni elementos editables.
- El panel de capas tiene altura limitada y botones táctiles ampliados en pantallas pequeñas.

## Límites conocidos
- El ajuste magnético compara elementos hermanos del mismo contenedor; no alinea contra elementos de otros contenedores.
- Las guías se representan resaltando el elemento coincidente, no con reglas continuas a lo largo del lienzo.
- El gesto táctil puede competir con el desplazamiento vertical de la página según el navegador y el dispositivo.
- El historial es el historial general existente; no se ha creado un historial separado exclusivo para transformaciones internas.
- Las pruebas automatizadas no sustituyen una validación visual real en Android WebView.
