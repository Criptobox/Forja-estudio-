# Estilos 15.12 · Constructor de paletas HSL

## Objetivo
Permitir que el usuario parta de un color principal y construya una paleta coherente sin editar seis colores por separado.

## Implementado
- Conversión HSL ↔ HEX (`hslToHex`, `hexToHsl`).
- Constructor visual con selector de color y controles de matiz (H), saturación (S) y luminosidad (L).
- Derivación automática de roles: fondo, superficie, acento, acento secundario, texto y borde.
- Vista previa de las cinco muestras principales antes de guardar.
- Persistencia de paletas personalizadas en `localStorage`, independiente del borrador de diseño.
- Aplicar, sustituir y eliminar paletas personalizadas.
- Las paletas siguen funcionando como capa: los estilos particulares de cada bloque tienen prioridad.
- Exportación y renderizado continúan consumiendo HEX, evitando romper proyectos anteriores.
- El texto sobre el acento elige blanco o negro por contraste. Se muestra la relación de contraste calculada.

## Decisiones técnicas
HSL se utiliza como modelo de edición, no como formato obligatorio de salida. Los tokens derivados se almacenan como HEX para mantener compatibilidad con CSS, proyectos y estilos existentes. HSL no es perceptualmente uniforme; una futura fase puede añadir OKLCH como modo avanzado para escalas tonales más homogéneas.

## Límites
- El constructor genera una paleta clara; no crea automáticamente una variante completa de tema oscuro.
- La indicación WCAG mostrada corresponde al contraste entre el acento y el texto elegido sobre ese acento. No certifica todos los componentes de la pantalla.
- No se ha realizado todavía una prueba visual automatizada con Playwright ni una prueba en Android WebView en esta sesión.
