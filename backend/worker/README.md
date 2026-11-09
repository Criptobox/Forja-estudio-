# Tinta Private AI · Cloudflare Worker

Este servicio mantiene las claves fuera del almacenamiento persistente del navegador. La clave se transmite una vez por HTTPS, se cifra con AES-256-GCM y queda en D1 como texto cifrado. Las consultas posteriores incluyen solo ID de proveedor, modelo y contexto.

## Requisitos

- Cuenta Cloudflare con Workers y D1 habilitados.
- Node.js 20 o posterior y npx wrangler disponible.
- App publicada en https://criptobox.github.io/Forja-estudio-/.

## 1. Crear D1

Desde esta carpeta:

```sh
npx wrangler d1 create tinta-private-ai
```

Copia el database_id que devuelve Wrangler y reemplaza el UUID 00000000-0000-0000-0000-000000000000 de wrangler.toml. No publiques secretos ni .dev.vars.

Aplica todas las migraciones pendientes (incluida la 0002 de límites y métricas):

```sh
npx wrangler d1 migrations apply tinta-private-ai --remote
```

En una instalación ya existente, vuelve a ejecutar este comando antes de desplegar el Worker actualizado.

## 2. Crear secretos

Genera tres valores aleatorios en tu PC. No los pegues en el chat ni los subas a GitHub:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"   # contraseña admin
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"   # clave AES de 32 bytes
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"   # secreto de sesión
```

Guárdalos por separado y cárgalos uno a uno:

```sh
npx wrangler secret put TINTA_ADMIN_PASSWORD
npx wrangler secret put TINTA_ENCRYPTION_KEY
npx wrangler secret put TINTA_SESSION_SECRET
```

La contraseña admin debe tener al menos 24 caracteres. No reutilices la contraseña de GitHub.

## 3. Desplegar

```sh
npx wrangler deploy
```

Comprueba la URL workers.dev que entrega Wrangler:

```sh
curl -H 'Origin: https://criptobox.github.io' https://TU-WORKER.workers.dev/health
```

## 4. Conectar Tinta

1. Menú superior → Conexiones de IA · modelos.
2. En Servidor privado, pega la URL del Worker y la contraseña admin.
3. Pulsa Conectar servidor. La sesión dura 8 horas y solo permanece en memoria.
4. Agrega proveedores y claves API. El Worker cifra las claves y las consultas ya no las envían desde el navegador.

## Seguridad

- CORS limitado a ALLOWED_ORIGINS.
- Sesiones HMAC firmadas, caducidad de 8 horas y bloqueo tras 5 contraseñas incorrectas en 15 minutos.
- Claves cifradas con AES-256-GCM y un IV aleatorio por actualización.
- Las claves no aparecen en las respuestas del Worker ni en perfiles.
- Se bloquean hosts locales, IP literales, rutas con traversal y redirecciones del proveedor.
- Se validan mensajes, tamaño del contexto y modelos probados. No se ejecuta código generado por el proveedor.
- La contraseña admin y la clave AES son críticas. Si pierdes la clave AES no podrás recuperar las claves cifradas.
- La primera introducción de una clave ocurre en el formulario y se transmite una vez al Worker por HTTPS. No se guarda en localStorage ni se reenvía en cada consulta. Un usuario que controle el navegador puede inspeccionar lo que teclea; no protege frente a un dispositivo comprometido.

## Desarrollo local

Crea backend/worker/.dev.vars (ignorado por Git), aplica la migración local y ejecuta:

```sh
npx wrangler d1 migrations apply tinta-private-ai --local
npx wrangler dev
```

La URL local suele ser http://127.0.0.1:8787. Añade http://127.0.0.1:18080 a ALLOWED_ORIGINS para probar desde el servidor estático de Tinta.


## Límites y estadísticas de consumo

Cada proveedor tiene dos límites editables desde Tinta: **300 peticiones al día** y **60 por minuto** por defecto. Puedes ajustar el diario entre 1 y 100 000 y el límite por minuto entre 1 y 600. El Worker reserva cada llamada de forma atómica en D1; la interfaz no puede saltarse estos límites.

Se cuentan las llamadas al catálogo, las pruebas individuales y los mensajes del agente. Las llamadas que llegan al proveedor y fallan cuentan como consumo; las peticiones que el Worker rechaza por límite no incrementan el contador. El día se calcula en UTC y se restablece a las 00:00 UTC. El panel muestra los últimos 7 días, el uso diario y por minuto, solicitudes, errores y tokens por modelo cuando el proveedor devuelve el objeto `usage`. No se almacenan prompts ni respuestas; los agregados se conservan durante un máximo de 90 días.

Para una instalación anterior a esta versión, aplica la migración `0002_usage_limits.sql` antes de desplegar el Worker nuevo. Sin ella no estarán creadas las columnas y tablas que necesita esta función.
