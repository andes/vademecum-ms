# Alfabeta Sync Specification

## Purpose

Sincroniza los datos del vademécum desde la API de Alfabeta hacia Redis, tanto con una carga completa como con actualizaciones incrementales.

## Requirements

### Requirement: Sync completo
El sistema SHALL descargar el catálogo completo de Alfabeta, limpiar Redis y volver a cargar medicamentos, drogas y acciones.

#### Scenario: Importación exitosa
- **WHEN** Alfabeta responde con estado `OK` y datos de catálogo
- **THEN** el sistema limpia Redis, guarda medicamentos, drogas y acciones, y actualiza la metadata con `ultimolog` y contadores

### Requirement: Omisión ante SIN_NOVEDADES
El sistema SHALL omitir la importación completa cuando Alfabeta responde `SIN_NOVEDADES` o sin datos, sin borrar los datos existentes.

#### Scenario: Respuesta SIN_NOVEDADES
- **WHEN** Alfabeta responde con estado `SIN_NOVEDADES` o un catálogo vacío
- **THEN** el sistema devuelve `skipped: true` y conserva los datos ya cargados en Redis

### Requirement: Estados aceptados del catálogo
El sistema SHALL aceptar los estados `OK` y `SIN_NOVEDADES` en la respuesta del catálogo completo.

#### Scenario: Estado inesperado
- **WHEN** Alfabeta responde un estado distinto de `OK` o `SIN_NOVEDADES`
- **THEN** el sistema lanza un error interno y no importa datos

### Requirement: Enriquecimiento con descripciones
El sistema SHALL enriquecer cada medicamento con la descripción de su droga y de su acción.

#### Scenario: Medicamento con droga y acción conocidas
- **WHEN** se importa un medicamento cuyo `droga` y `accion` tienen descripción
- **THEN** el medicamento se guarda con `droga_descrip` y `accion_descrip`

#### Scenario: Drogas o acciones sin descripción
- **WHEN** un medicamento referencia una droga o acción sin descripción
- **THEN** el medicamento se guarda con `droga_descrip` o `accion_descrip` vacíos

### Requirement: Sync incremental
El sistema SHALL procesar actualizaciones incrementales a partir del último `ultimolog` guardado.

#### Scenario: Alta o modificación
- **WHEN** una novedad tiene operación `A` o `M` con un artículo
- **THEN** el sistema guarda (crea o actualiza) el medicamento en Redis

#### Scenario: Baja de medicamento
- **WHEN** una novedad tiene operación `B` con registro, precio y vigencia
- **THEN** el sistema marca el medicamento como inactivo (`I`) y actualiza precio y vigencia

#### Scenario: Alta de medicamento
- **WHEN** una novedad tiene operación `R` con registro, precio y vigencia
- **THEN** el sistema marca el medicamento como activo (`A`) y actualiza precio y vigencia

#### Scenario: Cambio de precio
- **WHEN** una novedad tiene operación `P` con registro, precio y vigencia
- **THEN** el sistema actualiza el precio y la vigencia del medicamento

### Requirement: Avance del cursor de actualización
El sistema SHALL actualizar `ultimolog` con el mayor `orden` procesado al finalizar el sync incremental.

#### Scenario: Actualización del ultimolog
- **WHEN** se procesa un lote de novedades
- **THEN** el sistema persiste el `orden` máximo procesado como nuevo `ultimolog`
