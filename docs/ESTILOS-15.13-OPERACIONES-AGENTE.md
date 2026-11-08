# Estilos 15.13 · Operaciones estructuradas del agente

## Qué cambia
- Las instrucciones admitidas se convierten primero en un plan versionado de operaciones.
- Cada operación pasa por una lista permitida y validación estricta de propiedades, tipos, IDs y categorías.
- Se admiten `set_palette`, `add_component`, `remove_component`, `replace_component` y `update_text`.
- Se valida el plan completo antes de modificar el estado; si la aplicación falla, se restaura el borrador en memoria.
- Los cambios siguen pasando por el historial existente y se pueden deshacer.
- El núcleo `tinta-agent-core.js` no evalúa código, no acepta HTML arbitrario y no realiza llamadas de red.

## Límite explícito
El planificador sigue usando reglas locales deterministas. Esta entrega no conecta un LLM ni un proveedor externo. El contrato de operaciones prepara una futura capa de proveedor, pero no incluye credenciales, endpoint ni backend.

## Validación
Ejecutar `node tests/tinta-agent-1513.cjs` y la regresión de versiones. La interfaz real en navegador/Android requiere pruebas adicionales.
