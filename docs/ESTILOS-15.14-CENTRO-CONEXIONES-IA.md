# Estilos 15.14 · Centro de conexiones de IA

## Objetivo
Permitir conectar proveedores con API compatible con OpenAI, descubrir modelos, probar cada uno y conservar como modelos utilizables solo los que responden correctamente.

## Funciones
- Nombre del proveedor, endpoint base, clave API, autenticación Bearer / x-api-key / api-key, ruta de modelos y ruta de chat configurables.
- Descubrimiento mediante `GET {endpoint}{modelsPath}`.
- Prueba secuencial de cada ID mediante `POST {endpoint}{chatPath}` con un mensaje mínimo. Cada modelo probado consume al menos una solicitud de la cuota del proveedor.
- Lista separada de modelos que responden y modelos fallidos.
- Opción de añadir un ID manualmente cuando el proveedor no expone catálogo.
- Varias conexiones guardadas y posibilidad de eliminarlas.
- Claves solo en memoria de la sesión; no se escriben en localStorage, proyectos, exportaciones ni repositorio.
- Endpoints HTTPS; HTTP solo para localhost. No se aceptan credenciales, parámetros de consulta ni fragmentos dentro de la URL.

## Compatibilidad
El modo automático espera una respuesta de modelos tipo `{data:[{id:"..."}]}` o `{models:[...]}` y un endpoint de chat tipo OpenAI Chat Completions. El endpoint base puede ser personalizado, al igual que las rutas `/models` y `/chat/completions`.

## Límites y seguridad
- No existe un estándar universal para listar modelos o probar inferencia. Proveedores incompatibles requieren adaptador específico o alta manual.
- La petición desde navegador depende de CORS. Un error de CORS no demuestra que la clave o el modelo sean inválidos.
- La clave no se guarda persistentemente y se pierde al recargar.
- La conexión directa expone la clave al contexto del navegador y al proveedor. Para producción se recomienda un backend proxy propio con secretos del lado servidor, controles de acceso y límites de uso.
- Una prueba correcta confirma respuesta de texto en ese momento, no visión, herramientas, contexto largo ni disponibilidad futura.
- La integración de chat del agente con el modelo seleccionado queda para una fase posterior; esta versión configura, descubre y prueba proveedores.

## Prueba
`node tests/tinta-provider-manager.cjs`
