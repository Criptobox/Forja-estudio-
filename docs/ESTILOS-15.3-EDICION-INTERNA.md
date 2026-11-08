# Estilos 15.3 — Edición interna y tipografía

**Base:** Estilos 15.2.  
**Objetivo:** acercar al inspector visual las herramientas que modifican el contenido interno de los componentes, sin romper el Shadow DOM ni duplicar editores existentes.

## Funciones incorporadas

### Acceso contextual a subeditores
Desde el inspector de la capa activa se puede abrir directamente:
- **Editar textos:** utiliza el editor de contenido existente, que modifica nodos de texto y placeholders; no acepta HTML arbitrario.
- **Imágenes / enlaces:** abre el editor de medios ya existente.
- **Estilo de tarjeta:** abre el personalizador de superficies cuando el bloque tiene una tarjeta compatible.
- **Estilo de botón:** abre el personalizador de botones cuando el bloque contiene destinos compatibles.

Los controles de tarjeta y botón muestran un aviso si el tipo de bloque no es compatible. No se crean editores paralelos ni se altera el comportamiento de los diálogos existentes.

### Tipografía por bloque
- Selector de familia: original, Arial, Georgia, sistema, Verdana y Trebuchet.
- Escala de encabezados: 85–125 %, en pasos de 5 %.
- Vista previa inmediata en el bloque seleccionado.
- Restauración independiente de la tipografía.
- CSS generado desde una lista cerrada de familias; no se inyectan valores CSS libres.

### Persistencia y exportación
- `typeStyles` forma parte del borrador, historial, guardado local, JSON y enlaces compartidos mediante `draftSnapshot()`.
- La importación acepta solo IDs seleccionados, familias tipográficas permitidas y escala acotada.
- La tipografía se aplica tanto a la vista previa como al HTML exportado.
- Los proyectos anteriores que no tengan `typeStyles` conservan su apariencia original.

## Límites de esta fase
- La edición de texto continúa en el diálogo existente; no hay todavía edición directa al tocar una palabra dentro del preview.
- Los estilos tipográficos se aplican al bloque completo, no a un texto individual.
- Los editores de imagen, tarjeta y botón mantienen sus reglas de compatibilidad actuales.
- No se incorporan todavía drag-and-drop, guías magnéticas ni agrupación de capas.

## Archivos
- `web/crear.html`: accesos contextuales y controles de tipografía.
- `web/css/crear.css`: presentación responsive de los nuevos controles.
- `web/js/crear.js`: tipografía por bloque, normalización, persistencia y exportación.
- `tests/tinta-editor-153.cjs`: pruebas estáticas de regresión de esta fase.

## Validación
La fase debe superar los tests 15.1, 15.2 y 15.3, validación de sintaxis, sincronización de entradas y construcción del HTML autónomo. Playwright y Android WebView deben indicarse como pendientes si no pueden ejecutarse en el entorno.
