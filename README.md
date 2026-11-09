# Estilos · Tinta

**Versión web publicada en este repositorio: 15.15 — Cerebro IA conectado.**

Estilos es una biblioteca de diseño y un constructor visual multipantalla, pensado para móvil. La aplicación web se publica desde `web/` como PWA; Android se compila desde `app/`.

## Versiones publicadas

- **Web:** 15.15. Referencia canónica: [VERSION-ENTREGA.json](VERSION-ENTREGA.json).
- **Manifiesto detallado:** [VERSION-ENTREGA-15.15.json](releases/manifests/VERSION-ENTREGA-15.15.json).
- **Android:** versión independiente en `version.json`.
- **Entrada web:** `web/index.html` y `web/crear.html` deben ser idénticos.
- **Despliegue:** GitHub Pages publica exclusivamente `web/`.
- **Histórico:** previews y manifiestos antiguos están archivados en `releases/`.

> La versión 15.16 no está integrada en la rama `main` auditada. No debe anunciarse como publicada hasta incorporarla y verificarla.

## Funciones de 15.15

- «Habla con Tinta» puede enviar el contexto del diseño a un modelo compatible configurado y probado.
- La respuesta utiliza operaciones JSON restringidas y validación local antes de modificar el diseño.
- El modo local determinista sigue disponible como alternativa explícita.
- Las claves de proveedores se gestionan mediante el gateway privado: cifrado AES-256-GCM en D1, sesión temporal y llamadas servidor-a-servidor.
- Límites de peticiones por proveedor y estadísticas de consumo por modelo.
- No se ejecuta HTML, CSS ni JavaScript generado por el modelo.

Consulta [Cerebro IA conectado · 15.15](docs/ESTILOS-15.15-CEREBRO-IA-REAL.md) y la guía [Tinta Private AI](backend/worker/README.md). El Worker se despliega de forma independiente; no requiere secretos en GitHub.

## Estructura

| Ruta | Contenido |
|---|---|
| `web/` | Aplicación web, PWA y recursos publicados |
| `app/` | Proyecto Android |
| `design-library/` | Catálogo y documentación de recursos |
| `docs/` | Documentación técnica, changelogs y operación |
| `tests/` | Pruebas automatizadas |
| `tools/` | Herramientas de sincronización y generación |
| `releases/previews/` | Previews HTML históricos |
| `releases/manifests/` | Manifiestos de entregas históricas |

## Ejecutar y verificar

Sirve la carpeta `web/` mediante HTTP(S); no abras el HTML con `file://`, porque el service worker necesita un origen HTTP(S).

```sh
python tools/sync-tinta-entry.py --check
for f in web/js/*.js web/sw.js; do node --check "$f" || exit 1; done
cd tests
npm ci
npx playwright install chromium
npm test
```

La publicación PWA depende de que pase la batería E2E completa. No se debe omitir la batería para declarar una versión estable.

## Compilar Android

```sh
gradle :app:assembleDebug
```

El workflow `.github/workflows/android.yml` genera el APK debug como artefacto.

## Documentación operativa

- [Publicación y actualización del repositorio](docs/DEPLOYMENT.md)
- [Biblioteca de diseño](design-library/README.md)
- [Auditoría CI y organización · noviembre 2026](docs/REPO-AUDIT-2026-11.md)

## Historial

Las notas siguientes describen etapas anteriores. Para conocer lo que está publicado actualmente, prevalecen `VERSION-ENTREGA.json` y la documentación de la versión vigente.

## Nuevo en 14.1 · Lavender Glass y Luma

Cambio de dirección visual a partir de una referencia de vidrio esmerilado lavanda: transparencias, reflejos interiores, sombras suaves y superficies redondeadas. Se mantienen la organización y las funciones del editor; se reemplaza su acabado administrativo plano.

- **Luma** es la identidad visual del agente: avatar 3D propio, visible en biblioteca, cabecera del editor y presentación del asistente. El asset es WebP local (aprox. 8 KB), sin servicios externos.
- Biblioteca con cabecera creativa y categorías como iconos sobre superficies de vidrio.
- Editor con paneles esmerilados, lienzo lavanda y marco de dispositivo de acabado suave.
- Dos temas: lavanda claro (predeterminado para nuevas instalaciones) y violeta nocturno. Se respetan las preferencias ya guardadas.
- El avatar no añade un modelo de IA: las propuestas siguen usando recetas locales, como indica la interfaz.

La referencia se usa como dirección de materiales y atmósfera, no como una maqueta copiada. Los estilos seleccionados en el lienzo conservan su propio contenido y tokens; el nuevo acabado no se inyecta en su HTML exportado.

Pruebas: `node tests/lavender.cjs`.

## Nuevo en 14.0 · Rediseño del entorno Studio

- Sistema visual compartido entre biblioteca y editor: superficies neutras, índigo, bordes sutiles y sin brillos decorativos. Preferencia de tema compartida.
- Navegación lateral en escritorio; navegación inferior en móvil. Acceso directo a proyectos desde la biblioteca. El creador clásico sigue disponible.
- Editor con capas a la izquierda, lienzo al centro e inspector de propiedades a la derecha desde 1200 px. En móvil y tablet el inspector es un panel inferior.
- Selección directa de bloques en el lienzo o la lista, con indicador de selección. El inspector de escritorio no bloquea la interacción con el resto de la app.
- Reordenación por arrastre desde la miniatura del bloque, con las flechas como alternativa táctil y de teclado. Compatible con deshacer/rehacer.
- Brief plegable (cerrado inicialmente en escritorio) para priorizar la lista de bloques. Selector con elección de rol para recuperar bloques opcionales o reemplazarlos.
- Biblioteca con tarjetas de marco consistente y miniaturas ajustadas para no recortar diseños altos. La vista detallada conserva el tamaño completo.
- Proyectos como vista de trabajo en escritorio, con miniaturas aisladas del diseño guardado. Las miniaturas resumen encabezado, tarjeta y acción; no representan la pantalla completa. En móvil se conserva el diálogo de gestión.

No se ha cambiado el formato de proyectos ni se han eliminado funciones de exportación o respaldo. El lienzo del Agente sigue siendo móvil (390 px), no un constructor de diseños de escritorio responsive.

Pruebas nuevas: `node tests/studio-shell.cjs`. Detalles: `docs/DISENO-STUDIO-14.md`.

## Nuevo en 13.7 · Imágenes y destinos por bloque

Desde **Aa → Editar contenido**:

- Imágenes en cuatro variantes: **Producto clara**, **Texto sobre foto**, **Categoría con ilustración** y **Comida**. Otros diseños muestran sus limitaciones; no se sustituyen iconos arbitrariamente.
- URL HTTPS o archivo PNG/JPEG/WebP de hasta 5 MB. El archivo se redimensiona a un máximo de 1024 px y se incorpora como JPEG (la transparencia se aplana sobre blanco). No se admite SVG. La imagen comprimida debe caber en el límite de 750 000 caracteres.
- Descripción alternativa y restauración de la ilustración original.
- Destinos para botones y enlaces: http(s), mailto, tel o ancla #seccion. No implementa acciones de compra, envío de formularios ni navegación entre pantallas. Las anclas dependen de que exista un destino compatible en la página exportada.
- Los botones con destino se exportan como enlaces, conservando sus estilos. El editor evita navegar al pulsarlos.
- Imágenes, descripciones y enlaces se incluyen en proyectos, historial y respaldos JSON. Respaldos anteriores sin estos campos siguen siendo compatibles.

Las imágenes externas requieren internet; las subidas quedan dentro del HTML/JSON. Si el almacenamiento del navegador se llena, se avisa: exporta el HTML antes de salir. Mantén las imágenes pequeñas para no agotar el almacenamiento local.

Pruebas: `node tests/media.cjs`.

## Nuevo en 13.6 · Respaldos portables JSON

En **Agente → Proyectos**:

- **Exportar todos · JSON** descarga las copias guardadas. Cada proyecto tiene también **Exportar JSON**.
- Actualiza antes las copias si quieres incluir los últimos cambios del borrador.
- **Importar respaldo** valida el archivo y muestra sus nombres antes de confirmar.
- La confirmación añade copias con identificadores nuevos: no sobrescribe proyectos ni cambia la pantalla actual.
- Límite de archivo: **8 MB**; límite total: **30 proyectos**. La importación es completa o no se guarda ninguno, incluido si falla el almacenamiento.
- Solo se acepta el formato versionado de proyectos de Estilos, no el JSON de tokens. Se validan bloques, roles, paleta, orden, textos y tamaños. El JSON no se ejecuta como código.

El archivo permite llevar las pantallas a otro navegador sin cuenta ni nube. El historial de deshacer no se incluye. Conserva el respaldo en un lugar seguro: contiene el contenido escrito en tus proyectos.

Pruebas: `node tests/backup.cjs`.

## Nuevo en 13.5 · Proyectos locales

En **Agente → Proyectos** puedes guardar hasta 30 pantallas con nombre, abrirlas, duplicarlas, renombrarlas, actualizarlas o eliminarlas. Abrir, actualizar y eliminar requieren confirmación.

La pantalla de trabajo se guarda automáticamente. Los proyectos son **copias explícitas independientes**: usa **Actualizar** para reemplazar una copia con la pantalla actual. Abrir una copia reemplaza el borrador y reinicia el historial. Guarda una copia del borrador antes de abrir otro proyecto si deseas conservarlo.

Se guardan los bloques, el orden, los candados, los textos, la paleta, el tema y el brief. Los proyectos viven solo en el almacenamiento del navegador: no se sincronizan ni tienen respaldo en la nube; borrar los datos del sitio los elimina. Un error de almacenamiento se muestra sin anunciar un guardado exitoso.

Pruebas: `node tests/projects.cjs`.

## Nuevo en 13.4 · Comparar antes de aplicar

El selector del Agente permite buscar por varias palabras, filtrar por tema original y ordenar por catálogo, nombre o diseño actual. Muestra el número de coincidencias y permite limpiar los filtros.

Selecciona una miniatura para comparar **Actual / Propuesta** con tu paleta y tus textos. El proyecto no cambia hasta pulsar **Aplicar diseño**. Cancelar o Escape descartan la propuesta sin tocar el historial. Aplicar se puede deshacer y rehacer. La comparación corresponde al bloque seleccionado; en tarjetas no simula la pareja completa que forma el lienzo.

Pruebas: `node tests/picker.cjs`.

## Nuevo en 13.3 · Deshacer y rehacer

- Historial de **50 cambios por sesión**: bloques, candados, visibilidad, orden, sector, marca, brief y contenido.
- Botones en la barra superior y en el editor de contenido. Atajos **Ctrl/⌘Z**, **Ctrl/⌘Mayús+Z** y **Ctrl+Y** fuera de campos de texto.
- Escritura y controles continuos se agrupan; un cambio nuevo tras deshacer descarta la rama de rehacer.
- El diseño actual y el orden sobreviven a una recarga; el historial empieza vacío al volver a abrir.
- Acciones de los bloques siempre visibles en móvil, sin depender del hover.

Pruebas: `node tests/history.cjs`.

## Nuevo en 13.2 · Contenido propio

En el Agente, pulsa **Aa** junto a un bloque para editar sus textos y placeholders. Los cambios se guardan automáticamente por diseño, se muestran en el lienzo y se incluyen en el HTML exportado. Si hay dos tarjetas se pueden editar las dos desde el mismo editor. **Restaurar originales** elimina las sustituciones de los diseños abiertos.

Solo se admite texto (máximo 500 caracteres por campo), no HTML. Esta versión no edita imágenes, enlaces ni acciones. El editor admite Escape y mantiene el foco de teclado dentro del diálogo.

Pruebas del editor: `node tests/content.cjs`.

## Nuevo en 13.1 · Explorar y coherencia visual

- Navegación simplificada: **Explorar · Crear · Agente**. Plantillas y Colecciones viven dentro de Explorar.
- Portada con vistas previas reales, categorías y recuento dinámico del catálogo.
- Acento de marca compartido, tipografía y sombras normalizadas.
- Buscador global con **Ctrl/⌘K**, `/`, flechas, Enter y Escape.
- Candado por bloque: conserva diseño y visibilidad al regenerar; se recuerda al recargar.
- Revisión del Agente con seis comprobaciones orientativas de estructura, contraste de tokens y tamaños declarados. No sustituye una auditoría de accesibilidad de todos los bloques.
- Verificación: `node tests/e2e.cjs` (174) y `node tests/mejoras.cjs` (60).

## Nuevo en 13.0 · Agente de diseño (`web/agente.html`)
- **Flujo tipo Stitch**: escribes un brief (o eliges sector) y el agente propone una pantalla completa.
- **7 bloques**: Encabezado, Buscador, Métricas, Tarjetas, Lista, Botón y Barra inferior. Cada bloque se cambia por cualquiera de los 107 diseños de la biblioteca, con tu paleta ya aplicada.
- **ADN de marca**: 3 colores, redondeo, tema claro/oscuro y densidad aplicados a todos los bloques a la vez.
- **Exportar**: HTML autocontenido (Shadow DOM declarativo, sin JS), tokens JSON y prompt para otra IA.
- Recolor seguro: solo se sustituyen los colores con saturación real (nunca los grises de fondo); en oscuro se invierten solo los neutros. Los diseños que ya eran oscuros se dejan intactos.
- Acceso desde la portada (tarjeta **Agente**), atajo en el manifest y precache en el service worker.
- Corrección: el `fonts/plus-jakarta-sans.woff2` tenía el espacio a 0.17 em (las palabras se pegaban); ahora 0.26 em.
- Análisis completo y plan de mejoras: `docs/ANALISIS-Y-MEJORAS.md`.

## Aspecto (12.0)
- Violeta → azul sobre azul noche, con cristal y brillo; **oscuro por defecto** y un claro a juego (Ajustes → Tema; Automático sigue al sistema).
- Barra inferior de 5 elementos con etiqueta: **Inicio, Biblioteca, Creador, Plantillas, Colecciones**. Ajustes pasa a la cabecera de Inicio.
- **Inicio**: título, buscador, accesos rápidos con cifras reales y «Recientes» (los últimos estilos abiertos).
- **Biblioteca**: cuadrícula de categorías con filtros Todo / Fundamentos / Componentes; cada categoría abre su lista, con un chip «Todo».
- **Colecciones**: los estilos guardados.
- **Creador móvil** (pantallas de hasta 759 px): lienzo siempre visible, barra de herramientas (Añadir, Estilos, Colores, Texto, Tamaño) y hojas que suben desde abajo y empujan el lienzo en vez de taparlo, con los cambios en vivo. Modos Diseño / Código / Vista previa, barra de acciones sobre el componente y hoja de Capas y pantallas. En escritorio se mantiene la distribución en columnas.
- **Detalle**: pestañas Detalles, Código, Editor y Relacionados; panel de Uso; **descarga del componente como PNG o SVG**.
- **Paletas**: filas con la barra de colores (cada color se copia con un toque) y filtro Todas / Claras / Oscuras.
- **Plantillas**: cuadrícula de dos columnas con vistas previas reducidas.
- Iconos de la app con el nuevo estilo.

## Biblioteca
- 107 diseños base en 15 categorías con componentes.
- 27 capturas de referencia.
- Previsualización, código, paletas, favoritos, búsqueda y contraste WCAG.

## Constructor
- Hasta 8 pantallas por proyecto, con creación, duplicación, cambio y eliminación.
- Hasta 12 componentes por pantalla.
- Cada pantalla guarda su propio título, descripción, capas y propiedades.
- Edición de color, tipografía, tamaño, peso, alineación, redondeo, espaciado, borde, sombra, ancho y desplazamiento.
- Arrastre del asa en la vista previa para ajustar posición.
- Temas predefinidos: Violeta Studio, Midnight, Ivory y Mint.
- Guardado de temas personalizados en el dispositivo.
- Tamaño de la maqueta: móvil pequeño, móvil, móvil grande o tablet.
- Exportar: HTML autocontenido con navegación entre pantallas, o **ZIP** con ese HTML, un proyecto **React + CSS** y un proyecto **React + Tailwind v4** (Vite), con las imágenes como archivos. Opción de modo oscuro automático en la página exportada.
- **Compartir con un enlace**: el proyecto va comprimido en el `#` de la dirección (no pasa por ningún servidor); quien lo abre confirma y puede deshacerlo. Las imágenes no viajan en el enlace.
- **Reordenar capas arrastrando el asa** (⠿) con el dedo o el ratón; también se puede arrastrar a una carpeta.
- **Calidad de las imágenes** que reemplazas: Baja (640 px), Media (1000 px) o Alta (1600 px).
- Las imágenes que reemplazas se guardan en IndexedDB (no en `localStorage`, que se llena con pocas fotos).
- El historial de deshacer/rehacer sobrevive a las recargas (misma pestaña).
- Las ediciones de texto e imagen guardan, además de la ruta, la etiqueta y el texto original; si un diseño cambia, la edición solo se aplica si el nodo sigue siendo el mismo.
- «Aplicar al constructor» en la paleta de una captura: ajusta el color principal y el fondo y la guarda como tema.

## Novedades (PWA)
- Archivos nuevos: `web/js/stacks.js` (tokens para otras plataformas) y `web/js/userrefs.js` (capturas propias y extracción de paleta).
- **Editor en vivo** (pestaña *Editor* del detalle): colores, radio y modo con vista previa al instante; *Aplicar a este estilo* o *Guardar variante*.
- **Código para más plataformas**: HTML/CSS (componente completo) y tokens del tema para Tailwind (v3 y v4), Jetpack Compose, SwiftUI y Flutter.
- **Capturas propias** en *Referencias* (se guardan en este dispositivo con IndexedDB) y **sacar la paleta** de cualquier captura → crear un estilo con ella.
- **Copia automática en un archivo** (Chrome y Edge de escritorio): eliges un archivo una vez y la app lo actualiza sola con cada cambio; tras reiniciar el navegador pide reactivarla con un toque.
- **Copia de seguridad en archivo**: descargar, compartir (menú del sistema) e importar `.json`. Incluye tus estilos, el proyecto del constructor con sus imágenes, tus temas y tus capturas propias.
- Búsqueda sin acentos y con varias palabras; vistas previas que se dibujan al acercarse a la pantalla.
- Service worker «caché primero»: abre al instante sin conexión o con mala red.
- Capturas de referencia en WebP (2,8 MB → 0,65 MB).
- Accesibilidad: el foco queda dentro de hojas y visor y vuelve al botón que los abrió; *Eliminar* pasa al menú «⋯» del detalle.
- Opción en Ajustes para atenuar las vistas previas claras de las listas en modo oscuro.

## Modo oscuro
- Tema **Automático / Claro / Oscuro**: botón en la cabecera de Inicio (alterna) y selector en Ajustes. Se guarda en `localStorage` (`estilos-theme`) y se aplica antes de pintar (sin destello).
- Toda la interfaz usa variables CSS (`:root` y `:root[data-theme="dark"]` en `css/styles.css`); las vistas previas mantienen su propio escenario claro/oscuro.
- Android 10+ (API 29): tema `DayNight` en `res/values-v29`, así el modo Automático y las barras del sistema siguen al teléfono. En Android 8–9 el modo Automático usa claro; elige Oscuro a mano.


## Versiones
- Web/PWA: `14.1.0` (GitHub Actions añade el número de compilación).
- Android: `versionCode 46`, `versionName 12.16`.
- Application ID: `com.estilos.app`; minSdk 26; targetSdk 34.

## Ejecutar
```bash
cd web
python3 -m http.server 8000
```
Abrir `http://localhost:8000`.

## Pruebas
Pruebas de extremo a extremo con Playwright y Chromium (`tests/e2e.cjs`): arranque y tema, búsqueda, editor en vivo, constructor (añadir, deshacer, carpetas, imágenes, texto), persistencia, copia de seguridad, exportación HTML/ZIP, accesibilidad, móvil y sin conexión.
```bash
cd tests
npm ci
npx playwright install chromium
npm test            # todas las pruebas (tests/run-all.cjs)
node run-all.cjs tinta   # solo las que contengan «tinta»
```
`run-all.cjs` levanta su propio servidor estático, genera el HTML autónomo y guarda capturas en un directorio temporal; también comprueba la coherencia de versiones (`version.json` ⇄ Gradle ⇄ README) y el precache del service worker. La versión de Android se cambia **solo** en `version.json`.

Las ejecuta el workflow `tests.yml` en cada pull request, y `pages.yml` las ejecuta antes de publicar: **si fallan, la PWA no se publica** (una publicación manual puede saltárselas con `skip_tests`).

## Compilar APK
Requiere JDK 17, Android SDK 34 y Gradle 8.9.
```bash
gradle :app:assembleDebug
```
El workflow `android.yml` compila una APK debug y la publica como artifact.

## Estado de verificación
Se comprueba la sintaxis de todos los JavaScript y la integridad del ZIP. La compilación APK y las pruebas en un teléfono físico deben confirmarse en GitHub Actions/dispositivo.

## Historial
- **12.16**: todas las pantallas de la app (Inicio, Explorar, Guardados y Perfil) con barra navegable y exportación multi-pantalla. Ver `docs/CHANGELOG-12.16.md`.
- **12.15**: Mis estilos: crear, editar y borrar estilos propios en Tinta. Ver `docs/CHANGELOG-12.15.md`.
- **12.14**: paletas de color como capa sobre fondo, tarjetas y botones. Ver `docs/CHANGELOG-12.14.md`.
- **12.13**: Recientes y descarga PNG/SVG en Tinta. Ver `docs/CHANGELOG-12.13.md`.
- **12.12**: animaciones en la biblioteca, aplicables a la pantalla y a la exportación. Ver `docs/CHANGELOG-12.12.md`.
- **12.11**: plantillas completas en la biblioteca de Tinta. Ver `docs/CHANGELOG-12.11.md`.
- **12.10**: las tarjetas como estilos: «Copias» con contenido del sector. Ver `docs/CHANGELOG-12.10.md`.
- **12.9**: compartir una pantalla de Tinta por enlace (se recibe como copia). Ver `docs/CHANGELOG-12.9.md`.
- **12.8**: un solo estilo en toda la app (piel de Tinta en el Editor y la biblioteca clásica). Ver `docs/CHANGELOG-12.8.md`.
- **12.7**: una sola biblioteca dentro de Tinta (Favoritos incluidos); `biblioteca.html` redirige a Tinta. Ver `docs/CHANGELOG-12.7.md`.
- **12.6**: botón «Instalar la app» en Tinta, capturas e `id` en el manifest y arreglo de la publicación. Ver `docs/CHANGELOG-12.6.md`.
- **12.5**: el Agente ofrece «Ver 3 propuestas» para comparar y elegir. Ver `docs/CHANGELOG-12.5.md`.
- **12.4**: «Adaptar textos a mi idea» rellena los bloques según el sector; botón Atrás de Android y pruebas unificadas. Ver `docs/CHANGELOG-12.4.md`.
- **12.3**: el creador arma la página entera: pantalla vacía por defecto, posición Arriba/Contenido/Abajo, elementos sin tarjeta, cabecera y barra de ejemplo opcionales, 20 elementos por pantalla. Ver `docs/CHANGELOG-12.3.md`.
- **12.2**: nuevo aspecto (fase 3): Detalle con Relacionados y Uso, PNG/SVG del componente, Paletas, Plantillas e iconos. Ver `docs/CHANGELOG-12.2.md`.
- **12.1**: nuevo aspecto (fase 2): Creador móvil con lienzo siempre visible, herramientas y hojas. Ver `docs/CHANGELOG-12.1.md`.
- **12.0**: nuevo aspecto (fase 1): sistema visual oscuro/claro, barra de 5 elementos, Inicio, Biblioteca por categorías y Colecciones. Ver `docs/CHANGELOG-12.0.md`.
- **11.1**: exportación con Tailwind, copia automática en un archivo, compartir por enlace, reordenar capas con el dedo, calidad de imagen y publicación condicionada a las pruebas. Ver `docs/CHANGELOG-11.1.md`.
- **11.0**: copia de seguridad completa (con el constructor), imágenes en IndexedDB, historial persistente, tamaños de pantalla, exportación ZIP con React y modo oscuro, ediciones robustas, paleta → constructor, panel de capas accesible y pruebas automáticas. Ver `docs/CHANGELOG-11.0.md`.
- **10.9 + PWA**: modo oscuro (también en el constructor), editor en vivo, código para Tailwind/Compose/SwiftUI/Flutter, capturas propias y paleta, copia en archivo, búsqueda sin acentos, carga diferida, caché primero, WebP y foco accesible. En el constructor: textos junto a iconos editables y deshacer fiable en modo Texto. Ver `docs/CHANGELOG-10.9.md`.
- **10.9**: Auditoría y correcciones de integración. Ver `docs/CHANGELOG-10.9.md`.
- **10.8**: Deshacer y rehacer. Ver `docs/CHANGELOG-10.8.md`.
- **10.7**: Grupos y carpetas de capas. Ver `docs/CHANGELOG-10.7.md`.
- **10.6**: Panel visual de capas. Ver `docs/CHANGELOG-10.6.md`.
- **10.5**: Reemplazo de imágenes en el lienzo. Ver `docs/CHANGELOG-10.5.md`.
- **10.4**: Edición de texto directa. Ver `docs/CHANGELOG-10.4.md`.
- **10.3**: Edición táctil directa. Ver `docs/CHANGELOG-10.3.md`.
- **10.2**: Constructor optimizado para móvil. Ver `docs/CHANGELOG-10.2.md`.
- **10.1**: Colocación visual por arrastre. Ver `docs/CHANGELOG-10.1.md`.
- **10.0**: Selector visual de diseños. Ver `docs/CHANGELOG-10.0.md`.
- **9.1**: Component Studio integrado en el constructor principal: variantes, animaciones, elevación y presets en cada componente. Ver `docs/CHANGELOG-9.1.md`.
- **9.0**: Component Studio: variantes Glass, Soft UI, Outline y Bold; animaciones configurables; duración, elevación y presets rápidos. Ver `docs/CHANGELOG-9.0.md`.
- **8.0**: estudio visual con avatares, iconos, ilustraciones, fondos, recursos animados, seis paletas e importación de imágenes. Ver `docs/CHANGELOG-8.0.md`.
- **7.0**: favoritos, búsqueda y filtros, colecciones propias y componentes personalizados reutilizables. Ver `docs/CHANGELOG-7.0.md`.
- **6.0**: biblioteca de 15 componentes con búsqueda y categorías, cuatro plantillas completas y nuevos bloques de navegación, formularios y datos. Ver `docs/CHANGELOG-6.0.md`.
- **5.0**: edición del contenido de cada componente, navegación entre pantallas, guardado local y exportación HTML o React + CSS. Ver `docs/CHANGELOG-5.0.md`.
- **4.0**: constructor multipantalla. Ver `docs/CHANGELOG-4.0.md`.

## Estilos 15.1 · Biblioteca avanzada

La biblioteca suma 20 iconos SVG locales seleccionables, filtros por tipo de ficha y tratamiento visual sólido, slugs únicos y un inventario regenerable de 158 registros. Ver [`docs/ESTILOS-15.1-BIBLIOTECA.md`](docs/ESTILOS-15.1-BIBLIOTECA.md).

## Estilos 15.2 · Editor visual

El paso Pantalla incluye un editor visual con selección directa de capas, selección múltiple, inspector contextual de composición, orden de capas, copiar/pegar/restablecer estilos y persistencia en el borrador e historial. Detalles y límites: [`docs/ESTILOS-15.2-EDITOR.md`](docs/ESTILOS-15.2-EDITOR.md).

## Estilos 15.5 · Edición interna y tipografía

El inspector ahora da acceso directo a los editores existentes de texto, imágenes/enlaces, superficies de tarjeta y botones. Añade tipografía por bloque (familia permitida y escala de encabezados), con vista previa, guardado en el proyecto y exportación HTML. Detalles y límites: [`docs/ESTILOS-15.3-EDICION-INTERNA.md`](docs/ESTILOS-15.3-EDICION-INTERNA.md).


## Estilos 15.6 · Editor visual de medios
Control de ajuste cover/contain/fill, posición horizontal/vertical, redondeo adicional y texto alternativo por imagen. Ver `docs/ESTILOS-15.6-EDITOR-MEDIOS.md`.


## Estilos 15.7 · Inspector avanzado
Inspector interno con bordes, opacidad, relleno, ancho, sombras y controles SVG. Ver `docs/ESTILOS-15.7-INSPECTOR-AVANZADO.md`.


## Estilos 15.8 · Posición, alineación e iconos
Movimiento con ajuste magnético, seis alineaciones, espaciado de contenedores y personalización SVG ampliada. Ver `docs/ESTILOS-15.8-POSICION-ICONOS.md`.


### Centro de conexiones de IA · 15.14
- Conecta endpoints compatibles con OpenAI mediante endpoint base configurable.
- Descubre IDs disponibles con la ruta de modelos configurable.
- Prueba individualmente todos los modelos encontrados con una petición real de chat.
- Solo clasifica como utilizables los modelos que devuelven texto; fallos quedan separados y se pueden reintentar.
- Permite añadir IDs manualmente si el proveedor no ofrece catálogo.
- Guarda perfiles y modelos que superaron la prueba; las claves solo viven en memoria y deben volver a introducirse tras recargar.
- Admite varias conexiones y eliminación de perfiles.

**Límites:** compatibilidad automática para catálogo tipo `/models` y chat tipo `/chat/completions`. CORS puede impedir llamadas directas desde GitHub Pages. La clave no se guarda, pero una conexión directa sigue siendo visible para el contexto del navegador; para producción se recomienda un proxy backend seguro. El agente todavía no consume el modelo seleccionado: esta fase entrega la configuración, detección y pruebas de conectividad.

Ver [`docs/ESTILOS-15.14-CENTRO-CONEXIONES-IA.md`](docs/ESTILOS-15.14-CENTRO-CONEXIONES-IA.md).


### Cómo configurar un proveedor en 15.14
1. Abre el menú superior y entra en **Conexiones de IA · modelos**.
2. Escribe un nombre, endpoint base, clave y autenticación.
3. Ajusta las rutas si el proveedor no usa `/models` y `/chat/completions`.
4. Pulsa **Cargar y probar modelos**. Tinta probará los IDs encontrados uno por uno.
5. Si no hay catálogo, añade el ID manualmente y prueba ese modelo.

La lista «Modelos que funcionan» contiene únicamente respuestas que superaron la prueba de chat en la sesión actual. Los IDs guardados de sesiones anteriores deben volver a probarse. Las claves se mantienen en memoria y se limpian del campo al terminar; al recargar hay que introducirlas otra vez.
