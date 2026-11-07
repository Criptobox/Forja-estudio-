# FORJA STUDIO — siguiente integración

1. **Conectar biblioteca Estilos:** leer el catálogo real desde `Estilos-original/design-library/` y mapear IDs, categorías, previews y licencias.
2. **Unificar el modelo de pantalla:** definir un JSON schema versionado para páginas, secciones, componentes, tokens y navegación.
3. **Conectar Tinta/constructor:** convertir acciones del editor FORJA en operaciones del constructor existente, sin duplicar el motor visual.
4. **Agente/harness:** integrar el runtime elegido detrás de una API de herramientas limitada y auditable.
5. **Playwright:** ejecutar el proyecto en sandbox, capturar móvil/tablet/desktop y validar consola, navegación y responsive.
6. **Corrección visual:** comparar capturas con objetivos y aplicar cambios pequeños, con historial y rollback.
7. **Voz:** STT + TTS en streaming; evaluar Kokoro y alternativas según licencia, latencia y español.
8. **FORJA Brain:** conectar el modelo propio como proveedor intercambiable cuando exista un checkpoint útil.

Cada fase debe conservar los proyectos y exportaciones existentes, tener pruebas y no marcar una acción como completada si no se ejecutó realmente.
