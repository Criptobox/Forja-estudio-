# Estilos 15.5 — Capas internas y composición

## Novedades
- Reordenación de elementos hermanos mediante controles arriba/abajo y drag-and-drop de escritorio.
- Selección múltiple interna con Ctrl/⌘.
- Duplicación de elementos.
- Agrupación y desagrupación de elementos hermanos.
- Lista de capas internas del contenedor seleccionado.
- Indicadores visuales de centrado y destino de arrastre.
- Persistencia de la estructura modificada en borradores, historial, importación/exportación y HTML autónomo.
- Normalización defensiva del HTML guardado: límite de 120 KB por bloque, elimina scripts/iframes/objetos/embeds y atributos de evento, y bloquea URLs javascript.

## Uso
1. Abre el editor visual y selecciona una capa.
2. Activa «Seleccionar elemento interno».
3. Toca un elemento. Activa «Selección múltiple interna» para añadir varios elementos con toques (también funciona Ctrl/⌘ + toque con teclado).
4. Reordena con los botones o arrastra un elemento a otro hermano en navegadores compatibles.
5. Duplica, agrupa o desagrupa desde el inspector.
6. Los cambios se guardan en el proyecto y entran en el historial.

## Restauración
«Restaurar cambios internos» elimina los cambios de estructura internos guardados para el bloque completo, ya que el editor guarda el árbol HTML actualizado como una unidad. Las personalizaciones simples guardadas por selector se restauran individualmente cuando no hay una estructura personalizada.

## Límites
- El arrastre nativo puede variar entre navegadores móviles; los botones arriba/abajo son la alternativa táctil.
- El agrupado solo acepta elementos hermanos del mismo contenedor.
- Las guías actuales son indicadores de centrado/destino, no un motor de ajuste magnético con coordenadas.
- No se ha certificado todavía en Playwright ni en Android WebView.
