# Skill: Mantenimiento de vademecum-ms

## Descripción

Reglas del proyecto vademecum-ms, microservicio de vademécum con Redis + Alfabeta.

La fuente de verdad del contexto del proyecto es [`openspec/config.yaml`](../../../openspec/config.yaml) y las especificaciones de comportamiento viven en [`openspec/specs/`](../../../openspec/specs/). Antes de tocar código, leé la spec de la capacidad correspondiente.

## Verificación

```bash
npm run build
npm run lint
```

Ambos deben pasar sin errores antes de cualquier commit.

## Flujo de trabajo OpenSpec

Para cambios de comportamiento usá el flujo spec-driven: `/opsx-propose`, `/opsx-apply`, `/opsx-archive`.
