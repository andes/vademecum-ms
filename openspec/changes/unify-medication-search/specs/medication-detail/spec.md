# Spec Delta

## REMOVED Requirements

### Requirement: Detalle por ID
**Reason**: Se elimina el endpoint `GET /api/medications/:id` al unificar la búsqueda en `?q`.
**Migration**: Usar `GET /api/medications?q=` para localizar el medicamento.

### Requirement: ID numérico
**Reason**: Se elimina el endpoint que validaba el parámetro `:id`.
**Migration**: No aplica; ya no existe el parámetro `:id`.

### Requirement: Búsqueda por SNOMED
**Reason**: Se unifica toda la búsqueda de medicamentos en `?q`.
**Migration**: Buscar por `q` (nombre, droga, potencia, códigos de barras o ATC).
