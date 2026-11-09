# Estilos 15.15 — Cerebro IA conectado

## Qué incorpora
- Selector «Motor de Tinta» en el chat del agente.
- Selección de modelos que han superado una prueba real durante la sesión actual.
- Petición de chat al endpoint, ruta, autenticación y proveedor configurados en 15.14.
- Contexto enviado al modelo: brief, componentes seleccionados, paleta, catálogo de componentes y campos editables disponibles.
- Contrato JSON limitado a operaciones de Tinta: `set_palette`, `add_component`, `remove_component`, `replace_component` y `update_text`.
- La respuesta se parsea como JSON y se valida con `TintaAgentCore.validatePlan` antes de modificar el diseño.
- Si la respuesta no es válida, el modelo falla o el plan no supera la validación, no se aplican cambios.
- El modo local sigue disponible seleccionando «Modo local · reglas integradas».
- Estado del modelo visible en el chat; acceso directo al Centro de conexiones.
- El selector se actualiza al terminar las pruebas y conserva los modelos probados al cambiar entre conexiones durante la misma sesión; los resultados de sesiones anteriores no se reutilizan.
- Mientras el modelo responde, el envío se bloquea para evitar solicitudes duplicadas. Si el diseño o la conexión cambian durante la espera, se descarta la respuesta para proteger las ediciones recientes.

## Seguridad y límites
- No se ejecuta HTML, CSS ni JavaScript generado por el modelo.
- Solo se aplican operaciones estructuradas contra IDs existentes en el catálogo.
- La conexión directa de 15.15 mantenía las claves en memoria de sesión y llamaba al proveedor desde el navegador.
- El gateway privado opcional añade sesión HMAC, límite de intentos y cifrado AES-256-GCM de las claves en D1. Las consultas salen del Worker y el navegador envía solo proveedor, modelo y contexto.
- La primera introducción de una clave sigue ocurriendo en el formulario del navegador y se transmite una vez por HTTPS al Worker; no se persiste ni se adjunta a cada consulta. Un navegador comprometido aún puede inspeccionar lo que se escribe.
- La configuración se documenta en `backend/worker/README.md`. La app conserva el modo local si no se despliega el Worker.
- La petición consume cuota del proveedor. La prueba de modelo solo confirma una respuesta básica de chat.
- El contrato es JSON por prompt y validación local; no se presupone que todos los proveedores soporten `response_format`.
- No hay fallback silencioso: si el modelo falla, el usuario ve el error y puede volver al modo local manualmente.

## Pruebas
La batería incluye pruebas del contrato, gestor de proveedores y recorrido de integración en navegador con un endpoint simulado: descubrimiento, prueba, aparición del modelo en el selector, aplicación de un plan válido y rechazo de un plan inválido. No se afirma compatibilidad universal con todos los proveedores ni prueba en dispositivo físico.
