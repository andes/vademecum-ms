# Vademecum MS

Microservicio de vademécum con Redis + Alfabeta.

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
| GET | `/api/medications?q=` | Buscar medicamentos por nombre |
| GET | `/api/medications/:id` | Detalle por ID |
| GET | `/api/medications?snomed=` | Buscar por SNOMED |
| GET | `/api/drugs?q=` | Buscar drogas |
| GET | `/api/actions?q=` | Buscar acciones |
| GET | `/api/stats` | Estadísticas |
