# Medication Detail Specification

## Purpose

Permite consultar el detalle de un medicamento por su identificador o por su código SNOMED.

## Requirements

### Requirement: Detalle por ID
El sistema SHALL devolver el detalle completo de un medicamento dado su identificador.

#### Scenario: Medicamento existente
- **WHEN** una petición consulta `GET /api/medications/:id` con un ID existente
- **THEN** el sistema responde `200` con el detalle del medicamento

#### Scenario: Medicamento inexistente
- **WHEN** una petición consulta `GET /api/medications/:id` con un ID que no existe
- **THEN** el sistema responde `404` con código `NOT_FOUND`

### Requirement: ID numérico
El sistema SHALL validar que `:id` sea un número.

#### Scenario: ID inválido
- **WHEN** una petición consulta `GET /api/medications/abc`
- **THEN** el sistema responde `422` con código `VALIDATION_ERROR`

### Requirement: Búsqueda por SNOMED
El sistema SHALL resolver un medicamento a partir de su código SNOMED.

#### Scenario: SNOMED existente
- **WHEN** una petición consulta `GET /api/medications?snomed=` con un SNOMED existente
- **THEN** el sistema responde con el medicamento asociado

#### Scenario: SNOMED inexistente
- **WHEN** una petición consulta `GET /api/medications?snomed=` con un SNOMED inexistente
- **THEN** el sistema responde con una lista vacía
