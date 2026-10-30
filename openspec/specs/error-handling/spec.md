# Error Handling Specification

## Purpose

Define el formato uniforme de respuestas de éxito y de error, y el mapeo de errores a códigos de estado HTTP.

## Requirements

### Requirement: Formato de respuesta de éxito
El sistema SHALL responder las operaciones exitosas con el formato `{ "status": "success", "data": ... }`.

#### Scenario: Respuesta exitosa
- **WHEN** una operación concluye correctamente
- **THEN** el sistema responde `200` con `status: "success"` y `data` con el resultado

### Requirement: Formato de respuesta de error
El sistema SHALL responder los errores con el formato `{ "status": "error", "error": { "code", "message" } }`.

#### Scenario: Error controlado
- **WHEN** se produce un error de negocio o validación
- **THEN** el sistema responde con `status: "error"` y un `error` con `code` y `message`

### Requirement: Mapeo de errores conocidos
El sistema SHALL mapear las excepciones `ApiError` a su código de estado HTTP y código de error asociados.

#### Scenario: Error de tipo ApiError
- **WHEN** el error handler recibe una excepción `ApiError`
- **THEN** el sistema responde con el `statusCode` y `code` definidos en la excepción

### Requirement: Error interno
El sistema SHALL responder `500` con código `INTERNAL_ERROR` ante errores no controlados.

#### Scenario: Excepción no controlada
- **WHEN** se produce una excepción que no es `ApiError`
- **THEN** el sistema registra el error y responde `500` con código `INTERNAL_ERROR`

### Requirement: Ruta no encontrada
El sistema SHALL responder `404` con código `NOT_FOUND` para rutas que no existen.

#### Scenario: Ruta inexistente
- **WHEN** una petición consulta una ruta no definida
- **THEN** el sistema responde `404` con código `NOT_FOUND`
