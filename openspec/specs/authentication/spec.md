# Authentication Specification

## Purpose

Protege el acceso a la API exigiendo una API key válida en el header `X-Api-Key`.

## Requirements

### Requirement: Toda ruta /api exige una API key válida
El sistema SHALL rechazar toda petición a rutas bajo `/api` que no incluya una API key válida.

#### Scenario: API key válida
- **WHEN** una petición incluye el header `X-Api-Key` con el valor configurado en `VADEMECUM_API_KEY`
- **THEN** el sistema procesa la petición con normalidad

#### Scenario: API key faltante
- **WHEN** una petición no incluye el header `X-Api-Key`
- **THEN** el sistema responde `401` con código `UNAUTHORIZED`

#### Scenario: API key inválida
- **WHEN** una petición incluye un valor de `X-Api-Key` distinto de `VADEMECUM_API_KEY`
- **THEN** el sistema responde `401` con código `UNAUTHORIZED`
