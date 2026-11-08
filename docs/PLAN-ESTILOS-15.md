# Estilos 15 — Plan de evolución sobre la base actual

**Base:** `Estilos--main` recibido el 8 de noviembre de 2026.  
**Objetivo:** evolucionar editor, biblioteca, constructor multipantalla y Agente sin sustituir sistemas que ya funcionan.  
**Estrategia:** cambios incrementales, compatibilidad hacia atrás, pruebas por fase y publicación solo al superar criterios de aceptación.

## 0. Decisión de arquitectura

Estilos 15 seguirá siendo una aplicación web nativa (HTML, CSS y JavaScript) dentro de la PWA y del contenedor Android. No se migrará el editor completo a React ni se reescribirá el motor visual.

Se conservarán:
- `designs-core.js` y los módulos `designs-*`: motor de renderizado y fuente de verdad de las piezas visuales.
- `app.js` y `crear.js`: flujos existentes del constructor y del entorno Tinta.
- `tinta-*`: catálogo, historial, pantallas, plantillas, estados, recursos y utilidades.
- `agente.js`: motor local de recetas, propuestas, candados e historial.
- `export.js`: exportadores actuales, que se ampliarán sin retirar HTML/ZIP.
- `localStorage` e IndexedDB mientras se prepara una capa de persistencia versionada compatible.
- PWA, service worker, Android WebView y workflows GitHub Actions.

**No hacer:** reescritura total, cambio de framework por moda, sustitución de la biblioteca, borrado de datos, cambio de IDs de diseños ni introducir una API de pago como requisito.

## 1. Radiografía de la base

### 1.1 Estructura real observada

| Área | Archivos principales | Responsabilidad |
|---|---|---|
| Entrada Tinta | `web/index.html`, `web/crear.html` | Interfaz principal y carga de módulos |
| Motor de diseños | `web/js/designs-core.js`, `designs-a.js`…`designs-extra.js`, `data.js` | Definición y renderizado de componentes |
| Constructor visual | `web/js/app.js`, `web/js/crear.js` | Lienzo, capas, selección, propiedades, pantallas y navegación |
| Sistema visual | `web/css/studio-shell.css`, `crear.css`, `styles.css`, `tinta-skin.css` | Layout responsive y estilos |
| Biblioteca | `tinta-library.js`, `tinta-catalog.js`, `tinta-assets.js`, `design-library/catalog.json` | Catálogo, recursos y metadatos |
| Agente | `web/agente.html`, `web/js/agente.js`, `web/css/agente.css` | Brief, recetas, bloques, propuestas, candados e historial |
| Exportación | `web/js/export.js`, `stacks.js`, `image-export.js` | HTML, ZIP, React/Vite y Tailwind |
| Persistencia y medios | `tinta-history.js`, `project-backup.js`, `studio-media.js`, `media.js`, `autobackup.js` | Historial, proyectos, imágenes y respaldos |
| Android/PWA | `app/`, `web/sw.js`, `.github/workflows/` | WebView, caché, publicación y APK |
| Pruebas | `tests/*.cjs`, `tests/run-all.cjs` | Playwright y comprobaciones funcionales |

El catálogo `design-library/catalog.json` contiene **138 registros y 26 módulos de especificación**. No debe confundirse ese total con los diseños ejecutables cargados por el motor: son conjuntos distintos y deben reconciliarse antes de ampliar el catálogo.

### 1.2 Funciones existentes que se reutilizan

**Editor/constructor:** selección desde lista y lienzo; capas con miniatura, orden, duplicado y eliminación; ocultar/mostrar; bloquear/desbloquear; carpetas; inspector con contenido, imágenes, color, tipografía, tamaño, borde, sombra, alineación, anchura, desplazamiento y variantes; historial; arrastre y redimensionamiento. El código actual permite hasta 20 elementos por pantalla.

**Pantallas:** estado por pantalla, pantalla activa, multipantalla, navegación en exportación HTML, plantillas y proyectos.

**Agente:** detección local de sector/brief, recetas, ADN de marca, tres propuestas, candados por bloque, historial y proyectos. **No incorpora un modelo de lenguaje real**: es un motor de reglas offline.

**Biblioteca:** motor que produce HTML/CSS, previews mediante Shadow DOM o iframe según el diseño, favoritos, recursos, paletas, referencias, variantes y plantillas en módulos separados.

### 1.3 Limitaciones y validaciones pendientes

1. El Agente es un motor de reglas; no debe presentarse como IA generativa real.
2. El exportador React/Tailwind genera proyectos Vite, pero los bloques se encapsulan en `iframe`/`srcDoc`. Eso no equivale a componentes React nativos editables.
3. El catálogo maestro y el catálogo ejecutable no comparten necesariamente esquema; hace falta auditoría de integridad.
4. El Studio es responsive, pero cada flujo nuevo debe probarse en móvil real.
5. La suite Playwright existe, pero en el entorno de esta revisión no estaban instaladas las dependencias `tests/node_modules`; no se declara ejecutada ni aprobada en esta inspección.
6. No hay `package.json` en la raíz; la suite tiene `tests/package.json` y `tests/package-lock.json`.
7. La compilación Android y la firma de producción deben validarse en CI/dispositivo. No cambiar package ID, versionCode ni clave sin migración explícita.

## 2. Mapa de dependencias

```text
Motor de diseños (designs-core + designs-*)
          │
          ▼
Contrato común de componente + metadatos normalizados
          │
          ├──────────────► Biblioteca avanzada
          │                    │
          │                    ▼
          │              Búsqueda / filtros / variantes
          │                    │
          ▼                    ▼
Modelo de documento ─────► Constructor multipantalla
          │                    │
          ▼                    ▼
Persistencia versionada   Editor profesional
          │                    │
          └─────────┬──────────┘
                    ▼
          API interna de operaciones
                    │
                    ▼
             Agente de diseño
       (reglas offline + proveedor IA opcional)
                    │
                    ▼
        Auditoría + exportación verificada
                    │
                    ▼
        PWA / ZIP / HTML / React nativo
```

| Entregable | Depende de | Motivo |
|---|---|---|
| Biblioteca avanzada | Contrato de componente y metadatos | Los filtros y variantes requieren datos normalizados |
| Editor profesional | Modelo de documento y operaciones | Selección, edición, undo y redo deben compartir una fuente de verdad |
| Constructor avanzado | Modelo de documento + biblioteca | Las pantallas deben reutilizar componentes y conservar propiedades |
| Agente mejorado | Metadatos + modelo + operaciones | Debe operar sobre documentos reales, no sobre estado paralelo |
| IA externa opcional | Contrato de proveedor + validador | La salida del modelo se valida antes de modificar el proyecto |
| Exportación profesional | Documento normalizado + renderers | Cada formato necesita una salida reproducible y comprobable |

## 3. Arquitectura objetivo

### 3.1 Contrato común de componente

No reemplazar de golpe los objetos actuales. Añadir un adaptador que traduzca los registros existentes al contrato normalizado. Ejemplo conceptual:

```js
{
  schemaVersion: 1,
  id: "button-primary-01",
  name: "Botón principal",
  category: "buttons",
  role: ["primary-action"],
  tags: ["rounded", "solid", "mobile"],
  platforms: ["web", "pwa"],
  themes: ["light", "dark"],
  preview: { kind: "shadow-dom" },
  fields: [
    { key: "label", type: "text", default: "Continuar" },
    { key: "background", type: "color", default: "#635BFF" },
    { key: "radius", type: "number", min: 0, max: 32, default: 12 }
  ],
  variants: ["solid", "outline", "soft"],
  renderers: { html: "designs-core", react: "native-react-renderer" },
  provenance: { source: "internal", license: "project-owned" }
}
```

El contrato definitivo debe ajustarse a los objetos reales después de inspeccionarlos; el ejemplo no es una migración literal.

### 3.2 Modelo de documento

Un documento contiene proyecto, pantallas, tokens e instancias de componentes. Cada instancia conserva un `uid` propio aunque use el mismo diseño de biblioteca.

```js
{
  schemaVersion: 1,
  projectId: "project-id",
  updatedAt: "ISO-8601",
  designTokens: {},
  screens: [{
    id: "screen-home",
    name: "Inicio",
    viewport: { width: 390, height: 844 },
    nodes: [{
      uid: "instance-unique-id",
      componentId: "button-primary-01",
      props: {}, style: {}, constraints: {}, interactions: []
    }]
  }]
}
```

Principios: identidad estable; separar definición de biblioteca e instancia; conservar IDs actuales; no mutar la definición original al editar; validar/migrar por `schemaVersion`; no tratar código arbitrario como propiedades confiables.

### 3.3 API interna de operaciones

Editor, constructor y Agente deben usar las mismas operaciones: `selectNode`, `updateNode`, `moveNode`, `duplicateNode`, `removeNode`, `setNodeVisibility`, `setNodeLocked`, `addScreen`, `updateScreen`, `connectInteraction`, `undo` y `redo`.

Cada operación valida entrada, respeta bloqueos, genera una acción reversible, actualiza el estado, guarda con debounce y notifica solo las vistas afectadas. No mantener un segundo estado paralelo del documento dentro del Agente.

## 4. Plan por fases

## Fase 0 — Congelar y medir la base

**Objetivo:** línea base reproducible antes de tocar código.

Tareas:
1. Guardar el ZIP original como referencia inmutable.
2. Calcular hashes de archivos críticos.
3. Instalar Playwright desde `tests/package-lock.json`.
4. Ejecutar `node tests/run-all.cjs` y guardar resultados.
5. Analizar sintaxis de todos los JS.
6. Inventariar IDs, categorías, fuentes, imágenes y plantillas.
7. Abrir PWA en Chrome y WebView Android.
8. Crear proyectos de prueba y exportar respaldos para probar compatibilidad.
9. Confirmar build APK y disponibilidad segura del keystore.

**Salida:** suite base registrada; fallos preexistentes separados de regresiones; backup reimportable; versión original recuperable. No hacer refactors grandes antes de completar esta fase.

## Fase 1 — Modelo de documento y persistencia compatible

**Prioridad técnica máxima.**

Tareas:
1. Crear `web/js/document-model.js`.
2. Crear adaptadores desde el estado actual del constructor y del Agente.
3. Definir `schemaVersion` y migraciones idempotentes.
4. Crear `web/js/document-operations.js` para operaciones compartidas.
5. Separar identidad de instancia y definición de catálogo.
6. Validar documentos importados.
7. Guardar copias antes de migrar.
8. Mantener lectura de formatos antiguos.
9. Añadir pruebas round-trip: guardar → cerrar → abrir → comparar.
10. No cambiar la clave de almacenamiento hasta que el adaptador esté probado.

**Aceptación:** proyectos antiguos abren sin pérdida; orden, grupos, bloqueos, propiedades, medios y pantallas sobreviven a guardar/reabrir; undo/redo no cruza proyectos; JSON inválido no sobrescribe datos.

## Fase 2 — Biblioteca avanzada

**Objetivo:** convertir la biblioteca en fuente estructurada del editor y del Agente.

Tareas:
1. Auditar los 138 registros maestros y reconciliarlos con los diseños ejecutables.
2. Detectar IDs repetidos, metadatos ausentes, variantes duplicadas y recursos rotos.
3. Crear índice normalizado sin borrar los datos originales.
4. Añadir rol, categoría, tags, plataforma, tema, altura, dependencias, licencia, campos editables y variantes.
5. Crear facetas combinables por categoría, rol, estilo, color, tema, plataforma y densidad.
6. Añadir búsqueda global con sinónimos y búsqueda sin acentos.
7. Añadir vista cuadrícula/lista y previews consistentes.
8. Añadir favoritos, recientes y colecciones sin duplicar registros.
9. Añadir variantes reales y comparación lado a lado.
10. Deduplicación por huella visual/HTML/CSS, con revisión manual antes de eliminar.
11. Importación de paquetes con validación y procedencia.
12. Detalle con preview, variantes, campos, compatibilidad y código.

**Aceptación:** cada entrada tiene preview o fallback explícito; IDs no cambian; filtros combinados correctos; deduplicación no borra automáticamente; miniaturas no ejecutan scripts importados; biblioteca offline.

## Fase 3 — Editor profesional

**Objetivo:** completar el editor actual, no duplicarlo.

### 3A. Capas y selección
- Leer/escribir el modelo común.
- Sincronizar selección entre lienzo, capas e inspector.
- Multi-selección con Shift/Ctrl cuando sea viable.
- Agrupar/desagrupar instancias.
- Reordenar por drag & drop y controles accesibles.
- Persistir bloqueos, visibilidad y jerarquía.
- Estados claros de selección, hover, foco y bloqueo.

### 3B. Inspector contextual
- Pestañas: Contenido, Apariencia, Layout, Interacciones y Accesibilidad.
- Mostrar controles válidos según el tipo de componente.
- Editar tipografía, dimensiones, espaciado, borde, sombra, fondo, opacidad y posición.
- Generar campos desde metadatos.
- Reset por propiedad/instancia.
- Copiar/pegar propiedades y estilos.
- Validación en tiempo real.

### 3C. Herramientas del lienzo
- Guías de alineación y snapping.
- Reglas y rejilla opcional.
- Zoom, pan y centrar selección.
- Redimensionamiento con handles y teclado.
- Alinear y distribuir varios elementos.
- Espaciado uniforme y duplicación con offset.
- Paneles plegables/redimensionables en escritorio.
- Inspector inferior y navegación contextual en móvil.

### 3D. Historial
- Operaciones reversibles para todas las acciones.
- Agrupar cambios consecutivos del mismo campo.
- Deshacer/rehacer movimientos, borrados, estilos, interacciones y pantallas.
- Puntos de restauración con nombre.

**Aceptación:** selección sincronizada; cambios actualizan preview sin reconstruir todo; bloqueos impiden edición/borrado/movimiento; undo/redo exacto; pruebas a 360, 390, 768, 1024 y 1440 px; drag no interfiere con scroll táctil.

## Fase 4 — Constructor de aplicaciones y prototipos

**Objetivo:** convertir las pantallas actuales en un flujo de aplicación comprobable.

Tareas:
1. Unificar pantallas con el modelo común.
2. Añadir árbol de pantallas: crear, duplicar, renombrar, ordenar y eliminar.
3. Definir navegación como interacciones explícitas: evento, origen y destino.
4. Añadir acciones: navegar, volver, abrir/cerrar modal, cambiar tab y abrir URL permitida.
5. Añadir estados: default, hover, pressed, focus, disabled, loading, error y success.
6. Crear visor de prototipo con navegación real y modo presentación.
7. Definir rutas de inicio y retorno.
8. Validar destinos inexistentes y ciclos no deseados.
9. Añadir transiciones y respetar `prefers-reduced-motion`.
10. Añadir datos de prueba para formularios y estados.
11. Añadir responsive por pantalla: viewport, breakpoints y overrides.
12. Exportar prototipo HTML navegable sin depender del editor.

**Aceptación:** enlaces internos válidos; prototipo no muta documento; rutas completas probables en móvil; estados representados/exportados; duplicar pantalla genera IDs nuevos y actualiza referencias; proyectos de una pantalla siguen funcionando.

## Fase 5 — Agente inteligente

**Objetivo:** pasar de recetas aisladas a un agente que entiende y opera sobre el documento, manteniendo modo offline.

### 5A. Motor local primero
- Mantener recetas existentes como proveedor offline.
- Generar propuestas a partir de metadatos.
- Seleccionar por rol, compatibilidad, altura y campos.
- Rellenar contenido según sector y contexto, evitando textos/datos incoherentes.
- Preservar bloques bloqueados y decisiones manuales.
- Aplicar cambios mediante `document-operations.js`.
- Regenerar pantalla, sección o instancia concreta.

### 5B. Edición conversacional
- Intenciones: crear, cambiar tema, reemplazar, reorganizar, añadir pantalla, conectar navegación y auditar.
- Antes de ejecutar, presentar plan de cambios y alcance.
- Mostrar preview con aplicar, descartar o ajustar.
- No sobrescribir instancias bloqueadas.
- Mantener historial y reversión.

### 5C. Proveedor IA opcional
Definir interfaz: `provider.generateDesign(request)`, `provider.editDesign(document, instruction)`, `provider.explainAudit(document)` y `provider.health()`.

Implementaciones: `LocalRulesProvider` (siempre disponible/offline), `RemoteProvider` (opt-in, configurable y sujeto a credenciales/límites) y endpoint local si el usuario dispone de uno. El proveedor remoto no será requisito para crear, editar, guardar o exportar. Las claves no se guardan en el repo ni se exponen en el cliente sin advertencia; para producción se requiere proxy/backend seguro o endpoint local controlado.

### 5D. Auditoría visual y funcional
- Contraste WCAG AA/AAA.
- Jerarquía tipográfica y consistencia de tokens.
- Espaciado y alineación.
- Componentes repetidos/incompatibles.
- Texto truncado y overflow.
- Pantallas sin entrada/salida.
- Enlaces rotos y destinos inexistentes.
- Estados ausentes.
- Recursos faltantes y peso de imágenes.
- Accesibilidad de controles y teclado.
- Informe con severidad, evidencia, elemento afectado y acción sugerida.

**Aceptación:** Agente offline; propuestas basadas en componentes y metadatos reales; preview no muta el proyecto; aplicar/deshacer conserva el documento; locks intactos; respuestas externas validadas; cada hallazgo de auditoría apunta a nodo/pantalla.

## Fase 6 — Exportación y validación final

Aunque no sea una de las cuatro prioridades elegidas, es dependencia de calidad.

Tareas:
1. Mantener el exportador HTML como baseline.
2. Separar renderers HTML, React, Tailwind y, más adelante, Compose.
3. Sustituir iframes en React por componentes nativos cuando exista renderer fiel.
4. Mantener iframe sandbox como fallback explícito para código arbitrario no convertible.
5. Generar CSS y tokens globales una sola vez.
6. Exportar navegación y estados.
7. Incluir recursos y fuentes locales.
8. Generar README con instalación, build y limitaciones.
9. Ejecutar instalación, build y smoke test dentro del ZIP exportado.
10. Validar rutas, imágenes, fuentes y consola.

**Aceptación:** HTML abre localmente; React instala y compila; Tailwind compila sin perder clases dinámicas; no hay rutas internas de Estilos; medios y pantallas se conservan; fallbacks y limitaciones se informan.

## 5. Orden de ejecución y entregas

| Entrega | Incluye | Dependencia |
|---|---|---|
| 15.0 — Base segura | Baseline, backups, inventario, modelo y migraciones | Ninguna |
| 15.1 — Biblioteca | Metadatos, facetas, variantes, búsqueda, deduplicación asistida | 15.0 |
| 15.2 — Editor | Capas unificadas, inspector, guías, selección e historial | 15.0 |
| 15.3 — Constructor | Árbol de pantallas, navegación, estados y prototipo | 15.0 + contrato de componentes |
| 15.4 — Agente | Generación contextual, operaciones compartidas, edición conversacional y auditoría | 15.1 + 15.2 + 15.3 |
| 15.5 — Exportación | React nativo, HTML verificado y ZIP autocontenido | 15.2 + 15.3 |
| 15.6 — Release | PWA, Android, pruebas finales y documentación | Todas |

**Ruta crítica:** 15.0 → 15.1/15.2 en paralelo cuando el modelo esté estable → 15.3 → 15.4 → 15.5 → 15.6. Biblioteca y editor pueden avanzar en paralelo después de acordar el contrato. El Agente espera a que contrato y operaciones estén estables.

## 6. Pruebas y protección contra regresiones

**Unitarias:** adaptadores, esquemas, migraciones idempotentes, operaciones, undo/redo, búsqueda/filtros, variantes, selección por metadatos, reglas de auditoría, renderers y escaping.

**Integración:** biblioteca → lienzo → editar → guardar → reabrir; duplicar y editar copia; lock + propuesta; pantalla + navegación + prototipo; importar proyecto antiguo → editar → exportar; HTML/React/Tailwind fuera de Estilos; medios IndexedDB → backup → restauración.

**E2E:** Chrome escritorio, Chrome móvil emulado, Android WebView real; viewports 360×800, 390×844, 768×1024, 1024×768 y 1440×900; teclado, foco, Escape, Atrás, drag táctil y scroll; PWA offline y actualización del service worker.

**Regla de entrega:** no aceptar una fase con errores de consola, fallos de pruebas previas sin explicación, pérdida de datos, controles sin acción, overflow móvil, ni APK que no compile en CI. Cada fase incluye changelog, archivos modificados, pruebas ejecutadas, fallos conocidos y ZIP.

## 7. Riesgos y prevención

| Riesgo | Prevención |
|---|---|
| Romper proyectos guardados | Adaptadores y migraciones versionadas; no resetear storage |
| Duplicar sistemas de capas | Unificar con operaciones del documento |
| Duplicar lógica del Agente | El Agente usa las mismas operaciones del editor |
| Inflar biblioteca con clones | Huellas + comparación + aprobación manual |
| IA modifica demasiado | Plan previo, preview, locks y undo |
| Claves API expuestas | Sin secretos en cliente/repo; proxy o endpoint local |
| Export React no nativo | Renderers nativos y fallback iframe declarado |
| Caché PWA obsoleta | Versionar precache y probar actualización |
| APK no actualizable | Mantener package ID y firma original |
| Rendimiento móvil | Render selectivo, lazy thumbnails y medición |

## 8. Primer sprint ejecutable

No empezar añadiendo botones a la interfaz. Preparar la base común:
1. Crear backup inmutable `estilos-14-baseline`.
2. Instalar dependencias y ejecutar suite completa.
3. Registrar hashes y tamaños de datos.
4. Exportar e importar un proyecto de prueba.
5. Inventariar campos reales de registros ejecutables.
6. Auditar los 138 registros y 26 módulos del catálogo maestro.
7. Diseñar contrato de componente con datos reales.
8. Diseñar modelo de documento y adaptador del estado actual.
9. Implementar solo lectura/serialización del nuevo modelo, sin cambiar el guardado por defecto.
10. Añadir pruebas de equivalencia visual y round-trip.
11. Activar el modelo nuevo detrás de una bandera interna para pruebas.
12. Documentar migración antes de convertirlo en estado principal.

**Definición de terminado:** versión original abre; proyectos existentes se leen sin migración destructiva; modelo nuevo representa pantallas, capas, propiedades, recursos y tokens; serializar/reconstruir no produce diferencias; suite anterior y nueva pasan; no se ha eliminado ninguna función.

## 9. Decisiones técnicas recomendadas

1. Mantener JavaScript nativo en el editor principal.
2. Compartir modelo de documento entre editor, constructor y Agente.
3. Usar metadatos declarativos como fuente común de biblioteca y Agente.
4. Mantener IA opcional y modo local completo para tareas esenciales.
5. Separar renderers por destino; no simular React nativo con iframes sin declararlo.
6. Migrar persistencia con copias, versiones y rollback.
7. Exigir pruebas antes de ampliar funcionalidades.

## 10. Resultado esperado

El usuario podrá buscar componentes por función; ver y comparar variantes; construir y editar interfaces con herramientas de precisión; editar instancias sin alterar la biblioteca; crear pantallas y conectar interacciones; probar un prototipo navegable; pedir al Agente cambios acotados; bloquear lo aprobado y regenerar el resto; ejecutar auditorías con hallazgos localizados; y exportar proyectos que funcionen fuera de Estilos.

**Principio de Estilos 15:** ampliar capacidades sin sacrificar estabilidad, rendimiento móvil, funcionamiento offline ni compatibilidad con proyectos anteriores.


---

## Estado de ejecución — Fase 15.0 (8 de noviembre de 2026)

Preparación inicial completada en la copia de trabajo: baseline SHA-256 del ZIP original, inventario de catálogo, `document-model.js` en modo adaptador no conectado, 19 pruebas del modelo, precache versionado y puertos de test aislados. La sintaxis JS/Python y el build HTML autónomo pasan. La suite Playwright queda pendiente porque no se pudo instalar la dependencia en este entorno; APK pendiente por ausencia de Gradle/Wrapper. Ver [`ESTILOS-15.0-BASELINE-REPORT.md`](ESTILOS-15.0-BASELINE-REPORT.md) y [`ESTILOS-14-BASELINE.json`](ESTILOS-14-BASELINE.json). No se activó aún la migración ni se cambió el almacenamiento real.
