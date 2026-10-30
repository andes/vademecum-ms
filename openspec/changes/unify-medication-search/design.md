# Design

## Context

Ver `proposal.md` — Why. El API actual expone búsquedas y recursos adicionales. La búsqueda por texto ya se resuelve con `searchContaining`, que escanea `vademecum:med:*` y filtra por el campo `search_text`. El enriquecimiento de `search_text` ocurre en `buildSearchText` al guardar cada medicamento.

## Goals / Non-Goals

- Goal: una sola búsqueda `GET /api/medications?q=` que resuelva nombre, droga, potencia, `codigoDeBarras` y `atcs`.
- Goal: eliminar endpoints y código muerto asociado.
- Non-goal: cambiar el sync con Alfabeta ni el almacenamiento de drogas/acciones (siguen persistiéndose aunque no se expongan).

## Decisions

- **Incluir códigos en `search_text`** en vez de un campo/índice nuevo: reutiliza el mecanismo de búsqueda parcial existente y evita un índice adicional. Los arrays se aplanan uniéndolos con espacios antes de normalizar.
- **Coincidencia parcial** para códigos, por consistencia con nombre/droga/potencia.
- **Retirar la escritura de `vademecum:snomed:*`**: queda sin lector al eliminar la búsqueda por SNOMED; mantenerla solo agrega datos muertos.
- **Mantener `getStats` en el repositorio**: lo consume `alfabeta.sync.ts`; solo se elimina el endpoint.

## Risks / Trade-offs

- **Datos existentes sin reindexar** → `search_text` no incluirá códigos hasta `npm run seed`/`npm run sync`. Se documenta en la verificación.
- **BREAKING para consumidores** de `/drugs`, `/actions`, `/stats`, `/:id`, `?snomed` → se actualiza `docs/index.md` y se comunica en el PR.
- **Coincidencia parcial en códigos** puede generar más resultados de los esperados → aceptado; `q` es una búsqueda de texto.

## Migration Plan

1. Desplegar el código con los nuevos deltas de spec.
2. Ejecutar `npm run seed` (o `npm run sync`) para recalcular `search_text` con códigos.
3. Rollback: revertir el commit; los endpoints vuelven y los datos no cambiaron de forma destructiva.

## Open Questions

Ninguna.
