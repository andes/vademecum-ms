# Stats Specification

## Purpose

Expone estadísticas de estado de la base local del vademécum.

## Requirements

### Requirement: Estadísticas del vademécum
El sistema SHALL devolver un resumen con el último log de actualización y los contadores de medicamentos, drogas y acciones.

#### Scenario: Consulta de estadísticas
- **WHEN** una petición consulta `GET /api/stats`
- **THEN** el sistema responde `200` con `ultimolog`, `cant_med`, `cant_drogas`, `cant_acciones` y `fecha_act`

#### Scenario: Valores nulos antes del primer sync
- **WHEN** no existe metadata guardada en Redis
- **THEN** el sistema devuelve `ultimolog` y `fecha_act` como `null`, y contadores en `0`
