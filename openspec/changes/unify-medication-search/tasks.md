# Tasks

## 1. Búsqueda e índice

- [x] 1.1 Incluir `codigoDeBarras` y `atcs` en `buildSearchText` y verificar que un medicamento guardado contiene esos códigos en `search_text` (revisar hash en Redis tras el seed)
- [x] 1.2 Quitar la escritura y limpieza de `vademecum:snomed:*` en `saveMedication`, `saveMedications` y `deleteMedication`, y verificar que no quedan referencias a ese prefijo en el repositorio

## 2. Repositorio

- [x] 2.1 Eliminar `getMedicationById`, `getMedicationBySnomed`, `getDrugs`, `getActions`, `countDrugs` y `countActions`, y verificar que no quedan usos (`grep`)
- [x] 2.2 Mantener `getStats` (usado por `alfabeta.sync.ts`) y verificar que `npm run build` compila

## 3. Servicio, DTO, controller y rutas

- [x] 3.1 Reducir `searchMedicationsSchema` a `q` y `limit`, y eliminar los demás schemas/tipos; verificar que no hay imports rotos
- [x] 3.2 Dejar en el controller solo `searchMedications` y en las rutas solo `GET /medications`; verificar con `grep` que no quedan handlers de drugs/actions/stats/:id
- [x] 3.3 Reducir `searchMedications` del service al camino `q` y eliminar métodos no usados; verificar `npm run build`

## 4. Documentación

- [x] 4.1 Actualizar `docs/index.md` para reflejar solo `GET /api/medications?q=` y los campos buscados

## 5. Verificación

- [x] 5.1 `npm run build` y `npm run lint` pasan sin errores
- [x] 5.2 `openspec validate --specs` y `openspec validate unify-medication-search` pasan
- [ ] 5.3 Tras `npm run seed`, `GET /api/medications?q=<códigoDeBarras>` y `?q=<atc>` devuelven coincidencias parciales
