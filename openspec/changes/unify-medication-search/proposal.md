# Proposal

## Why

Hoy el API expone varias formas de búsqueda y recursos separados (`?snomed`, `/:id`, `/drugs`, `/actions`, `/stats`). El consumidor necesita una única búsqueda por texto que resuelva medicamentos por nombre, droga, potencia y códigos (barras y ATC), simplificando el contrato y cubriendo la identificación por código.

## What Changes

- **BREAKING** Se elimina `GET /api/medications/:id`.
- **BREAKING** Se elimina la búsqueda `GET /api/medications?snomed=`.
- **BREAKING** Se eliminan `GET /api/drugs`, `GET /api/actions` y `GET /api/stats`.
- **BREAKING** `GET /api/medications?q=` deja de aceptar `drug`, `action`, `status` y `snomed`; solo acepta `q` y `limit`.
- La búsqueda `?q` pasa a incluir además `codigoDeBarras` y `atcs` en el texto indexado, con coincidencia parcial.
- Deja de escribirse el índice `vademecum:snomed:*`, que queda sin uso.

## Capabilities

### New Capabilities

- Ninguna.

### Modified Capabilities

- `medication-search`: el término `q` también busca en `codigoDeBarras` y `atcs`; se eliminan los filtros `drug`, `action`, `status` y la búsqueda por SNOMED.
- `redis-storage`: se quita `vademecum:snomed:*` del modelo de claves.
- `medication-detail`: se retira la capacidad (detalle por ID y búsqueda por SNOMED).
- `drugs-search`: se retira la capacidad.
- `actions-search`: se retira la capacidad.
- `stats`: se retira la capacidad.

## Impact

- Código afectado: `src/modules/vademecum/{repository,service,dto,controller,routes}.ts`, `docs/index.md`.
- API: queda solo `GET /api/medications?q=` (requiere `X-Api-Key`).
- Datos: `search_text` debe recalcularse; los datos existentes en Redis no incluirán los códigos hasta re-ejecutar `npm run seed` o `npm run sync`.
- Sin cambios en la autenticación, el manejo de errores ni la sincronización con Alfabeta.
