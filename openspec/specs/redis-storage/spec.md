# Redis Storage Specification

## Purpose

Define el modelo de datos persistido en Redis para medicamentos, drogas, acciones y metadata del vademécum.

## Requirements

### Requirement: Claves de datos
El sistema SHALL almacenar los datos bajo claves con prefijos estables: `vademecum:med:*`, `vademecum:drogas:*`, `vademecum:acciones:*`, `vademecum:snomed:*`, `vademecum:autocomplete` y `vademecum:meta`.

#### Scenario: Almacenamiento de medicamento
- **WHEN** se guarda un medicamento con ID `123`
- **THEN** sus campos se persisten como hash en la clave `vademecum:med:123`

### Requirement: Texto de búsqueda indexado
El sistema SHALL persistir un campo `search_text` por medicamento compuesto por nombre, droga genérica y potencia, normalizados.

#### Scenario: Guardado de search_text
- **WHEN** se guarda un medicamento con nombre, `droga_descrip` y `potencia`
- **THEN** el hash del medicamento incluye `search_text` con esos valores unidos y normalizados

### Requirement: Actualización de precio y estado
El sistema SHALL actualizar precio, vigencia, estado y `fecha_act` de un medicamento sin sobrescribir el resto de sus campos.

#### Scenario: Cambio de precio
- **WHEN** se actualiza el precio de un medicamento
- **THEN** solo `precio`, `vigencia` y `fecha_act` cambian, conservando los demás campos

#### Scenario: Cambio de estado
- **WHEN** se actualiza el estado de un medicamento
- **THEN** solo `estado` y `fecha_act` cambian, conservando los demás campos

### Requirement: Metadata del sync
El sistema SHALL persistir la metadata de sincronización bajo `vademecum:meta` con `ultimolog`, `cant_med`, `cant_drogas`, `cant_acciones` y `fecha_act`.

#### Scenario: Guardado de metadata
- **WHEN** finaliza un sync
- **THEN** el sistema actualiza la metadata en `vademecum:meta`

### Requirement: Limpieza completa
El sistema SHALL poder eliminar todas las claves con prefijo `vademecum:*`.

#### Scenario: Limpieza antes de un sync completo
- **WHEN** se ejecuta una limpieza completa
- **THEN** se eliminan todas las claves `vademecum:*` de Redis
