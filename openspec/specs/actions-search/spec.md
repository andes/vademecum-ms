# Actions Search Specification

## Purpose

Permite listar y buscar acciones farmacológicas por descripción.

## Requirements

### Requirement: Listado de acciones
El sistema SHALL devolver una lista de acciones con su identificador y descripción.

#### Scenario: Listado completo
- **WHEN** una petición consulta `GET /api/actions` sin parámetro `q`
- **THEN** el sistema responde con las acciones disponibles, ordenadas alfabéticamente por descripción

### Requirement: Filtro por descripción
El sistema SHALL filtrar las acciones por coincidencia parcial de su descripción, sin distinguir mayúsculas y minúsculas.

#### Scenario: Coincidencia parcial
- **WHEN** una petición consulta `GET /api/actions?q=analg`
- **THEN** el sistema responde solo las acciones cuya descripción contiene "analg"

### Requirement: Límite de resultados
El sistema SHALL limitar la cantidad de resultados con `limit`, por defecto 20.

#### Scenario: Sin limit especificado
- **WHEN** una petición omite el parámetro `limit`
- **THEN** el sistema devuelve como máximo 20 acciones
