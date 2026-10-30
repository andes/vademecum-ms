# Spec Delta

## MODIFIED Requirements

### Requirement: Búsqueda por coincidencia parcial
El sistema SHALL buscar medicamentos cuyo texto de búsqueda contenga el término consultado, no solo coincidencias por prefijo. El texto de búsqueda incluye nombre, droga genérica, potencia, código de barras y códigos ATC.

#### Scenario: Coincidencia por nombre
- **WHEN** una petición consulta `GET /api/medications?q=actron`
- **THEN** el sistema devuelve medicamentos cuyo nombre contiene "actron"

#### Scenario: Coincidencia por droga genérica
- **WHEN** una petición consulta `GET /api/medications?q=ibuprofeno`
- **THEN** el sistema devuelve medicamentos cuya droga genérica contiene "ibuprofeno"

#### Scenario: Coincidencia por código de barras
- **WHEN** una petición consulta `GET /api/medications?q=<código de barras>`
- **THEN** el sistema devuelve los medicamentos cuyo `codigoDeBarras` contiene el término

#### Scenario: Coincidencia por código ATC
- **WHEN** una petición consulta `GET /api/medications?q=<código ATC>`
- **THEN** el sistema devuelve los medicamentos cuyo `atcs` contiene el término

## ADDED Requirements

### Requirement: Búsqueda sin q
El sistema SHALL devolver una lista vacía cuando no se provee `q`.

#### Scenario: Sin q
- **WHEN** una petición consulta `GET /api/medications` sin `q`
- **THEN** el sistema responde con una lista vacía

## REMOVED Requirements

### Requirement: Filtros opcionales
**Reason**: La búsqueda unificada solo acepta `q` y `limit`.
**Migration**: Usar `q` para acotar resultados; los filtros por droga, acción y estado ya no están disponibles.

### Requirement: Búsqueda sin criterio
**Reason**: La búsqueda por SNOMED se elimina, por lo que el criterio ya no incluye `snomed`.
**Migration**: Usar `q` como único criterio; sin `q` la respuesta es una lista vacía.
