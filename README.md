# Estilos · Tinta

Biblioteca UI/UX y constructor visual multipantalla. Proyecto web móvil-first, PWA y envoltorio Android.

Versión Android: `versionCode 38`, `versionName 12.8`.

## Publicar en GitHub Pages

1. Crea o abre el repositorio donde guardarás el proyecto.
2. Descomprime este ZIP en tu dispositivo/PC.
3. Sube **todo el contenido de esta carpeta a la raíz del repositorio**. No subas el ZIP como un único archivo y no metas la carpeta completa dentro de otra carpeta.
4. Asegúrate de incluir también `.github/` (puede estar oculta en algunos exploradores).
5. En GitHub entra en **Settings → Pages** y selecciona **GitHub Actions** como método de publicación.
6. En **Actions**, espera a que terminen correctamente los workflows. El sitio se publica desde `web/`.

## Entradas de la aplicación

- `web/index.html`: portada publicada (Tinta).
- `web/crear.html`: constructor Tinta.
- `web/biblioteca.html`: biblioteca clásica.
- `web/agente.html`: editor/agente clásico y proyectos.
- `ABRIR-TINTA-ACTUAL.html`: vista autónoma para abrir localmente; no es la raíz del código fuente.

## Estructura principal

```text
.github/workflows/   Publicación y pruebas de GitHub Actions
app/                 Aplicación Android (Gradle/Kotlin)
design-library/      Catálogo y documentación de componentes
web/                 Aplicación web/PWA publicada en GitHub Pages
tests/               Pruebas automatizadas
tools/              Scripts de sincronización, catálogo y empaquetado
docs/                Documentación, análisis y roadmap
```

## Desarrollo y comprobaciones

Requisitos: Python 3.12, Node.js 22 y npm.

```bash
python tools/sync-tinta-entry.py --check
for f in web/js/*.js web/sw.js; do node --check "$f"; done
cd tests
npm ci
npx playwright install chromium
npm test
```

La publicación automática ejecuta las pruebas antes de desplegar `web/`. Consulta `LEEME-SUBIR-A-GITHUB.md` para las instrucciones de actualización y caché PWA, y `docs/` para el alcance y las funciones documentadas.

## Alcance de esta entrega

Este paquete conserva el proyecto Estilos/Tinta recibido, su estructura Android, biblioteca, editor, recursos, pruebas y workflows. No incorpora un backend de IA ni afirma que el agente esté conectado a un proveedor de modelos.
