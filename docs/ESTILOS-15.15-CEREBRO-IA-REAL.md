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

## Seguridad y límites
- No se ejecuta HTML, CSS ni JavaScript generado por el modelo.
- Solo se aplican operaciones estructuradas contra IDs existentes en el catálogo.
- Las claves siguen en memoria de sesión y no se incluyen en el ZIP, el proyecto ni localStorage.
- El modelo activo debe haberse probado en la sesión actual; después de recargar hay que volver a introducir la clave y probarlo.
- El modo navegador depende de CORS y expone la clave al contexto de la aplicación mientras se usa. Para publicar la app a terceros, usar un backend proxy propio.
- La petición consume cuota del proveedor. La prueba de modelo solo confirma una respuesta básica de chat.
- El contrato es JSON por prompt y validación local; no se presupone que todos los proveedores soporten `response_format`.
- No hay fallback silencioso: si el modelo falla, el usuario ve el error y puede volver al modo local manualmente.

## Pruebas
Se ejecutan comprobaciones de sintaxis, contrato del agente, pruebas específicas de integración mock y validación del paquete. No se afirma compatibilidad universal con todos los proveedores ni prueba en dispositivo físico.
