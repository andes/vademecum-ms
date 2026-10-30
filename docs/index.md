# Vademecum MS

Microservicio de vademécum con Redis + Alfabeta.

## Especificación

El comportamiento del sistema está documentado como especificaciones OpenSpec en [`openspec/specs/`](../openspec/specs/):

| Capacidad | Ruta |
|-----------|------|
| Autenticación (`X-Api-Key`) | `authentication` |
| Búsqueda de medicamentos | `medication-search` |
| Sincronización con Alfabeta | `alfabeta-sync` |
| Manejo de errores | `error-handling` |
| Almacenamiento en Redis | `redis-storage` |

## Requisitos

- Node.js 24.x (ver `.nvmrc`)
- Redis 7.x
- Docker (recomendado para Redis local)

## Redis local

```bash
docker run -d --name redis-local -p 6379:6379 redis:7-alpine
```

## Instalación

```bash
npm install
cp .env .env.local  # opcional
```

Completar `.env` con las credenciales de Alfabeta y Redis.

## Ejecución

```bash
npm run dev        # Desarrollo (puerto 4001)
npm run build      # Compilar
npm start          # Producción
```

## Seed y sync

```bash
npm run seed       # Importación completa desde Alfabeta
npm run sync       # Actualización incremental
```

## API

Todas las rutas requieren header `X-Api-Key`.

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/medications?q=` | Buscar medicamentos por nombre, droga genérica, potencia, código de barras o código ATC (ej. "actron 600", "ibuprofeno 600") |
