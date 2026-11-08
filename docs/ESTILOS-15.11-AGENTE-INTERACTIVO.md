# Estilos 15.11 — Agente interactivo

## Objetivo
Permitir que la persona modifique el diseño existente escribiendo instrucciones en lenguaje natural, sin tener que abrir primero todos los paneles manuales.

## Capacidades implementadas
- Cambiar la paleta mediante palabras como azul, verde, café, violeta, rosa, naranja, gris u original.
- Añadir componentes por categoría (botones, tarjetas, entradas, datos, avatares, etc.) desde el catálogo ya instalado.
- Quitar componentes por categoría.
- Sustituir cabecera o barra inferior cuando se puede identificar un componente por su nombre o descripción.
- Cambiar el título principal de la cabecera.
- Cambiar el texto de una acción/botón.
- Mostrar en el chat qué se modificó o por qué no se pudo aplicar.
- Guardar cada modificación en el borrador y en el historial; volver a pintar la vista previa.

## Ejemplos
- «Usa una paleta azul».
- «Añade un botón».
- «Quita las tarjetas».
- «Quita la barra inferior».
- «Cambia el título por Mi espacio».
- «Cambia el texto del botón a Continuar».

## Límites actuales
El intérprete es local, determinista y basado en expresiones y coincidencias con el catálogo. No hay conexión con ChatGPT, Claude, Gemini ni otro modelo. No interpreta briefs abiertos como un diseñador humano; cuando no identifica un cambio concreto, explica qué ejemplos sí reconoce y deja el diseño intacto.

## Seguridad de edición
- El texto del usuario se trata como texto, no como HTML.
- Las instrucciones no reconocidas no guardan ni mutan el proyecto.
- Las operaciones reconocidas usan el estado existente y el mecanismo de guardado/historial.
