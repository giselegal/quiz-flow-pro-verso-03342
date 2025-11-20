# Auditoria de JSONs - 2025-11-20

## Resumo

- Total de arquivos: 289
- Válidos: 289
- Inválidos: 0
- Erros de esquema: 3

### Maiores arquivos
- package-lock.json (820 KB)
- docs/auditorias/TS_NOCHECK_AUDIT_REPORT.json (127 KB)
- scripts/cloudinary-all-resources-image.json (120 KB)
- public/templates/quiz21-complete.json (119 KB)
- src/templates/quiz21StepsComplete.json (76 KB)
- docs/auditorias/SERVICE_AUDIT_REPORT.json (66 KB)
- src/config/optimized21StepsFunnel.json (41 KB)
- src/core/schema/defaultSchemas.json (31 KB)
- data/extracted-questions.json (28 KB)
- scripts/outputs/quiz-estilo-faithful.json (28 KB)

## IDs duplicados ignorados pela whitelist
- id "step-12": src/services/data/modularSteps/step-12.json, src/services/data/templates/step-12-template.json
- id "step-19": src/services/data/modularSteps/step-19.json, src/services/data/templates/step-19-template.json
- id "step-20": src/services/data/modularSteps/step-20.json, src/services/data/templates/step-20-template.json

## Duplicatas de steps dentro de arquivos
- src/config/optimized21StepsFunnel.json: stepIds duplicados = step-12, step-13, step-19, step-20, step-21

## Chaves de topo mais comuns
- metadata: presente em 206 arquivos; tipos: object
- blocks: presente em 200 arquivos; tipos: array
- templateVersion: presente em 195 arquivos; tipos: string
- analytics: presente em 152 arquivos; tipos: object
- type: presente em 84 arquivos; tipos: string
- version: presente em 39 arquivos; tipos: string, number
- description: presente em 39 arquivos; tipos: string
- theme: presente em 39 arquivos; tipos: object, string
- validation: presente em 36 arquivos; tipos: object
- id: presente em 34 arquivos; tipos: string
- behavior: presente em 33 arquivos; tipos: object
- navigation: presente em 27 arquivos; tipos: object
- properties: presente em 27 arquivos; tipos: object
- redirectPath: presente em 25 arquivos; tipos: string
- stepNumber: presente em 24 arquivos; tipos: number
- category: presente em 22 arquivos; tipos: string
- label: presente em 22 arquivos; tipos: string
- icon: presente em 22 arquivos; tipos: string
- renderingStrategy: presente em 22 arquivos; tipos: string
- stepId: presente em 21 arquivos; tipos: string
- nextStep: presente em 21 arquivos; tipos: null
- name: presente em 19 arquivos; tipos: string
- steps: presente em 14 arquivos; tipos: array, object
- title: presente em 12 arquivos; tipos: string
- ui: presente em 8 arquivos; tipos: object
- integrations: presente em 7 arquivos; tipos: object
- summary: presente em 6 arquivos; tipos: object, string
- $schema: presente em 6 arquivos; tipos: string
- totalSteps: presente em 6 arquivos; tipos: number
- compilerOptions: presente em 5 arquivos; tipos: object

---
Relatório gerado automaticamente por scripts/audit-jsons.mjs