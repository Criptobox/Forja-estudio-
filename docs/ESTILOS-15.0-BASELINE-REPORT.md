# Estilos 15.0 — Informe de preparación de base

**Fecha:** 8 de noviembre de 2026  
**Origen:** `Estilos--main (2).zip`  
**Estado:** preparación y contrato inicial implementados; integración visual aún no activada.

## Protección del original

- El ZIP recibido se conserva sin modificar.
- Se creó una copia de trabajo independiente.
- `ESTILOS-14-BASELINE.json` registra SHA-256, tamaño y ruta de cada archivo del ZIP original, además del hash del propio archivo ZIP.
- Los cambios de esta fase se limitan al modelo nuevo, pruebas, precache y configuración de puertos del runner de pruebas. No se modificó la interfaz de producción ni el almacenamiento existente.

## Inventario confirmado

- 138 registros en `design-library/catalog.json`.
- 26 módulos declarados en el catálogo maestro.
- 38 archivos JavaScript directos en `web/js` pasaron `node --check` antes de añadir el módulo nuevo; el módulo nuevo también pasó `node --check`.
- `tools/build-tinta.py` generó correctamente un HTML autónomo de aproximadamente 700 KB.
- El proyecto no incluye Gradle Wrapper (`gradlew`/`gradle-wrapper.properties`) y el entorno no tiene Gradle disponible; no se declara compilación APK.

## Cambios implementados en 15.0

1. `web/js/document-model.js`: adaptador inicial del constructor clásico a un documento normalizado `estilos-document`, versión 1.
2. Conserva ID de pantalla, ID de componente, UID de capa, propiedades de estilo, bloqueos, overrides de texto, ediciones multimedia y referencias `idb:`.
3. Conversión de regreso al formato del constructor clásico para probar compatibilidad sin cambiar el guardado real.
4. Validación de esquema, límites de pantallas/capas, IDs duplicados y propiedades.
5. `tests/document-model.cjs`: 19 comprobaciones independientes, todas correctas.
6. `web/sw.js`: añade el módulo al precache y cambia el identificador de caché a `tinta-2026.11.2`.
7. `tests/*.cjs`: puertos de prueba aislados en 18080/18081 para no colisionar con el servidor de trabajo que ocupa 8080.

## Resultados de verificación

| Comprobación | Resultado |
|---|---|
| Sintaxis JS del módulo nuevo | Correcta |
| Sintaxis JS de los 38 módulos existentes | Correcta |
| Sintaxis Python de `tools/` | Correcta |
| Generación HTML autónomo | Correcta |
| Modelo de documento y round-trip | 19/19 correctas |
| Coherencia de versión y precache | 50/50 correctas |
| Suite Playwright completa | Bloqueada: falta instalar `playwright` 1.63.0 |
| Compilación APK | No ejecutable: no hay Gradle ni wrapper |

### Incidencias del entorno, no atribuidas al producto

- El puerto 8080 está ocupado por el servicio Jupyter del entorno. El runner se aisló a 18080/18081.
- `npm ci` no terminó dentro del límite de ejecución; `playwright` no quedó instalado. Por eso los E2E no se consideran aprobados ni fallidos: están pendientes de disponer de la dependencia.
- No hay Gradle instalado ni wrapper incluido; APK pendiente de CI o de un entorno Android/Gradle.

## Límites de lo entregado

El nuevo modelo todavía no está conectado al guardado del constructor, a Tinta ni al Agente. Esto es intencional: primero se valida la equivalencia y después se activa mediante una migración con respaldo. No se han modificado datos de usuario ni claves de almacenamiento.

## Próximo paso

Completar pruebas de equivalencia con proyectos reales exportados desde el constructor, inspeccionar los metadatos de biblioteca y definir el adaptador final antes de conectar el modelo al editor. Después se puede iniciar la fase 15.1 (biblioteca) y 15.2 (editor) sobre la misma fuente de datos.
