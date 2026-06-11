# Skill: Mantenimiento de vademecum-ms

## Descripción

Reglas del proyecto vademecum-ms, microservicio de vademécum con Redis + Alfabeta.

## Stack

- Node 24.x, Express 4.x, TypeScript 5.x
- Redis (ioredis), Alfabeta API (axios)
- Validación con Zod, lint con ESLint

## Estructura del proyecto

```
src/
├── server.ts               # Entry point: Express → initRedis → routes
├── config/config.ts        # Env vars tipadas con dotenv
├── shared/                 # Infraestructura común
│   ├── api-response.ts     # { status, data } / { status, error }
│   ├── errors/             # ApiError, NotFoundError, ValidationError, InternalError
│   ├── middlewares/
│   │   ├── auth.middleware.ts   # checkApiKey (valida X-Api-Key)
│   │   └── error-handler.ts     # Global error handler
│   └── redis/redis.service.ts   # initializeRedis, getRedisClient, closeRedis
├── integrations/alfabeta/  # Conexión con API de Alfabeta
│   ├── alfabeta.client.ts  # HTTP client (axios)
│   ├── alfabeta.sync.ts    # syncFull + syncUpdates
│   └── alfabeta.types.ts   # Interfaces de respuesta
├── modules/vademecum/      # Un solo módulo de dominio
│   ├── index.ts            # Composition root
│   ├── vademecum.controller.ts
│   ├── vademecum.service.ts
│   ├── vademecum.repository.ts  # Capa Redis (HGETALL, ZRANGEBYLEX, pipeline)
│   ├── vademecum.routes.ts
│   ├── vademecum.dto.ts
│   ├── vademecum.types.ts
│   └── vademecum.errors.ts
└── routes/routes.ts        # Monta módulos bajo /api
```

## Convenciones de código

- 4 espacios, comillas simples, sin console.log (salvo `// eslint-disable-next-line no-console`)
- Errores custom heredan de `ApiError` en `shared/errors/`
- Preferir arrow functions en controllers
- Usar `next(error)` para delegar errores al error handler global

## Rutas API

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/medications?q=` | ApiKey | Búsqueda prefix por nombre (autocomplete) |
| GET | `/api/medications/:id` | ApiKey | Detalle por ID Alfabeta |
| GET | `/api/medications?snomed=` | ApiKey | Búsqueda por SNOMED |
| GET | `/api/drugs?q=` | ApiKey | Búsqueda de drogas |
| GET | `/api/actions?q=` | ApiKey | Búsqueda de acciones |
| GET | `/api/stats` | ApiKey | Estadísticas del vademécum |

Todas requieren header `X-Api-Key` con el valor configurado en `VADEMECUM_API_KEY`.

## Formato de respuestas

```json
// Éxito
{ "status": "success", "data": [...] }

// Error
{ "status": "error", "error": { "code": "NOT_FOUND", "message": "..." } }
```

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del servidor (default 4001) |
| `REDIS_HOST` | Host de Redis |
| `REDIS_PORT` | Puerto de Redis |
| `REDIS_PASSWORD` | Password de Redis |
| `REDIS_DB` | Base de datos Redis |
| `ALFABETA_ENDPOINT` | Endpoint de la API de Alfabeta |
| `ALFABETA_USUARIO` | Usuario para Alfabeta |
| `ALFABETA_CLAVE` | Clave para Alfabeta |
| `VADEMECUM_API_KEY` | API Key para autenticación interna |

## Scripts

```bash
npm run dev        # Desarrollo con nodemon
npm run build      # Compilar TypeScript
npm start          # Producción
npm run seed       # Importación completa desde Alfabeta a Redis
npm run sync       # Actualización incremental desde Alfabeta
npm run lint       # ESLint
npm run lint:fix   # ESLint con autofix
```

## Verificación

```bash
npm run build
npm run lint
```

Ambos deben pasar sin errores antes de cualquier commit.
