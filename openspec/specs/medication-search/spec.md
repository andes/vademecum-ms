# Medication Search Specification

## Purpose

Permite buscar medicamentos por coincidencia parcial sobre el nombre, la droga genérica, la potencia, el código de barras o los códigos ATC, de forma tolerante a acentos y mayúsculas.

## Requirements

### Requirement: Búsqueda por coincidencia parcial
El sistema SHALL buscar medicamentos cuyo texto de búsqueda contenga el término consultado, no solo coincidencias por prefijo.

#### Scenario: Coincidencia por nombre
- **WHEN** una petición consulta `GET /api/medications?q=actron`
- **THEN** el sistema devuelve medicamentos cuyo nombre contiene "actron"

#### Scenario: Coincidencia por droga genérica
- **WHEN** una petición consulta `GET /api/medications?q=ibuprofeno`
- **THEN** el sistema devuelve medicamentos cuya droga genérica contiene "ibuprofeno"

### Requirement: Normalización de términos
El sistema SHALL normalizar el término de búsqueda y el texto indexado quitando acentos, convirtiendo a minúsculas y recortando espacios.

#### Scenario: Búsqueda sin acentos
- **WHEN** una petición consulta un término con acentos, por ejemplo "ácido"
- **THEN** el sistema también encuentra registros indexados como "acido"

### Requirement: Filtros opcionales
El sistema SHALL soportar filtros opcionales por droga, acción y estado sobre los resultados de búsqueda.

#### Scenario: Filtro por droga
- **WHEN** una petición consulta `GET /api/medications?q=600&drug=5`
- **THEN** el sistema devuelve solo los resultados cuyo `droga` es `5`

#### Scenario: Filtro por estado
- **WHEN** una petición consulta `GET /api/medications?q=actron&status=A`
- **THEN** el sistema devuelve solo los resultados con estado `A`

### Requirement: Límite de resultados
El sistema SHALL limitar la cantidad de resultados con el parámetro `limit`, con valor por defecto 20 y rango válido entre 1 y 100.

#### Scenario: Sin limit especificado
- **WHEN** una petición omite el parámetro `limit`
- **THEN** el sistema devuelve como máximo 20 resultados

#### Scenario: limit fuera de rango
- **WHEN** una petición envía `limit` menor a 1 o mayor a 100
- **THEN** el sistema responde `422` con código `VALIDATION_ERROR`

### Requirement: Orden de resultados
El sistema SHALL ordenar los resultados alfabéticamente por nombre.

#### Scenario: Resultados ordenados
- **WHEN** una búsqueda devuelve múltiples medicamentos
- **THEN** los resultados se devuelven ordenados por `nombre`

### Requirement: Búsqueda sin criterio
El sistema SHALL devolver una lista vacía cuando no se provee `q` ni `snomed`.

#### Scenario: Sin q ni snomed
- **WHEN** una petición consulta `GET /api/medications` sin `q` ni `snomed`
- **THEN** el sistema responde con una lista vacía
