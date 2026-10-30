# Drugs Search Specification

## Purpose

Permite listar y buscar drogas (principios activos) por descripción.

## Requirements

### Requirement: Listado de drogas
El sistema SHALL devolver una lista de drogas con su identificador y descripción.

#### Scenario: Listado completo
- **WHEN** una petición consulta `GET /api/drugs` sin parámetro `q`
- **THEN** el sistema responde con las drogas disponibles, ordenadas alfabéticamente por descripción

### Requirement: Filtro por descripción
El sistema SHALL filtrar las drogas por coincidencia parcial de su descripción, sin distinguir mayúsculas y minúsculas.

#### Scenario: Coincidencia parcial
- **WHEN** una petición consulta `GET /api/drugs?q=ibupro`
- **THEN** el sistema responde solo las drogas cuya descripción contiene "ibupro"

### Requirement: Límite de resultados
El sistema SHALL limitar la cantidad de resultados con `limit`, por defecto 20.

#### Scenario: Sin limit especificado
- **WHEN** una petición omite el parámetro `limit`
- **THEN** el sistema devuelve como máximo 20 drogas
