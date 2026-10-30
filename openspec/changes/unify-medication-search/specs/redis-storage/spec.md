# Spec Delta

## MODIFIED Requirements

### Requirement: Claves de datos
El sistema SHALL almacenar los datos bajo claves con prefijos estables: `vademecum:med:*`, `vademecum:drogas:*`, `vademecum:acciones:*`, `vademecum:autocomplete` y `vademecum:meta`.

#### Scenario: Almacenamiento de medicamento
- **WHEN** se guarda un medicamento con ID `123`
- **THEN** sus campos se persisten como hash en la clave `vademecum:med:123`

### Requirement: Texto de búsqueda indexado
El sistema SHALL persistir un campo `search_text` por medicamento compuesto por nombre, droga genérica, potencia, códigos de barras y códigos ATC, normalizados.

#### Scenario: Guardado de search_text
- **WHEN** se guarda un medicamento con nombre, `droga_descrip`, `potencia`, `codigoDeBarras` y `atcs`
- **THEN** el hash del medicamento incluye `search_text` con esos valores unidos y normalizados
