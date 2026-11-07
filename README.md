# FORJA STUDIO — Mobile-first Web Designer

**Esta carpeta es el proyecto nuevo para GitHub.** `index.html` en la raíz abre FORJA Studio directamente. No hay que buscar una página dentro de `web/`.

## Vista incluida
Interfaz móvil de FORJA con las pantallas del concepto aprobado: bienvenida, inicio, agente, proceso de creación, resultado, lista de pantallas, editor, componentes, estilos, preview responsive, proyectos, biblioteca/diseños y exportación.

## Ejecutar
- Abre `index.html` en un navegador moderno.
- Para GitHub Pages: sube TODO el contenido de este ZIP a la raíz del repositorio y configura Pages para publicar desde `main` / `(root)`.
- URL resultante: `https://USUARIO.github.io/REPOSITORIO/`

## Estructura
```text
FORJA-STUDIO/
├── index.html                 # Entrada principal de FORJA
├── assets/
│   ├── forja.css
│   ├── forja.js
│   └── plus-jakarta-sans.woff2
├── README.md
├── ROADMAP.md
└── Estilos-original/           # Proyecto recibido, conservado íntegramente
    ├── web/
    ├── app/
    ├── design-library/
    ├── tests/
    └── ...
```

## Interacciones disponibles en este prototipo
- Navegación inferior entre áreas.
- Inicio con texto de brief y accesos rápidos.
- Flujo visual de creación y resultado de ejemplo.
- Agente conversacional de demostración.
- Lista de pantallas del proyecto.
- Editor visual con acciones de interfaz.
- Biblioteca de componentes con búsqueda.
- Personalización de paleta, temas y radios.
- Vista previa con selector móvil/tablet/escritorio.
- Gestión de proyectos de muestra.
- Selección de formato de exportación.

## Límites explícitos
Este ZIP implementa la interfaz frontend. **No afirma tener todavía un modelo conectado ni generación real**. El LLM/DeepSeek Harness, la voz STT/TTS, Playwright, el guardado persistente y el exportador real se integrarán en fases posteriores. Los botones que necesitan esos servicios muestran mensajes indicando que están pendientes.

## Diseño visual
- Carbón: `#100F18`
- Superficies: `#1A1925`, `#242230`
- Naranja principal: `#FF790D`
- Violeta: `#8E38FF`
- Tarjetas redondeadas, sombras y brillos discretos.
- Mobile-first, safe-area y navegación inferior fija.
- Tipografía Plus Jakarta Sans incluida localmente, sin depender de Google Fonts.

## Proyecto anterior
`Estilos-original/` contiene el proyecto recibido y se conserva como base para la integración posterior. No se reemplazaron sus archivos ni se modificó su punto de entrada.
