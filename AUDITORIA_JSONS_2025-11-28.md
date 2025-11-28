# Auditoria de JSONs - 2025-11-28

## Resumo

- Total de arquivos: 164
- Válidos: 164
- Inválidos: 0
- Erros de esquema: 77

### Maiores arquivos
- package-lock.json (593 KB)
- audit_reports/deep_audit.json (255 KB)
- docs/auditorias/TS_NOCHECK_AUDIT_REPORT.json (127 KB)
- public/templates/quiz21-complete.json (120 KB)
- scripts/cloudinary-all-resources-image.json (120 KB)
- public/templates/quiz21Steps/compiled/full.json (119 KB)
- public/templates/quiz21-v4.json (97 KB)
- src/templates/quiz21StepsComplete.json (77 KB)
- docs/auditorias/SERVICE_AUDIT_REPORT.json (66 KB)
- tools/vsl/package-lock.json (50 KB)

## IDs duplicados entre arquivos (não-whitelisted)
- id "quiz21StepsComplete": src/templates/funnels/quiz21Steps/metadata.json, src/templates/quiz21StepsComplete.json

## IDs duplicados ignorados pela whitelist
- id "step-12": public/templates/steps-refs/step-12-ref.json, src/services/data/modularSteps/step-12.json, src/services/data/templates/step-12-template.json
- id "step-13": public/templates/steps-refs/step-13-ref.json, src/services/data/modularSteps/step-13.json
- id "step-19": public/templates/steps-refs/step-19-ref.json, src/services/data/modularSteps/step-19.json, src/services/data/templates/step-19-template.json
- id "step-20": public/templates/steps-refs/step-20-ref.json, src/services/data/modularSteps/step-20.json, src/services/data/templates/step-20-template.json

## Duplicatas de steps dentro de arquivos
- src/config/optimized21StepsFunnel.json: stepIds duplicados = step-12, step-13, step-19, step-20, step-21

## Chaves de topo mais comuns
- type: presente em 81 arquivos; tipos: string
- version: presente em 61 arquivos; tipos: string, number
- metadata: presente em 57 arquivos; tipos: object
- id: presente em 56 arquivos; tipos: string
- blocks: presente em 52 arquivos; tipos: array, object
- title: presente em 47 arquivos; tipos: string
- templateVersion: presente em 46 arquivos; tipos: string
- navigation: presente em 42 arquivos; tipos: object
- validation: presente em 41 arquivos; tipos: object
- behavior: presente em 41 arquivos; tipos: object
- redirectPath: presente em 41 arquivos; tipos: string
- description: presente em 38 arquivos; tipos: string
- $schema: presente em 33 arquivos; tipos: string
- properties: presente em 28 arquivos; tipos: object
- theme: presente em 24 arquivos; tipos: object
- category: presente em 23 arquivos; tipos: string
- label: presente em 22 arquivos; tipos: string
- icon: presente em 22 arquivos; tipos: string
- renderingStrategy: presente em 22 arquivos; tipos: string
- _modular: presente em 21 arquivos; tipos: object
- blockIds: presente em 21 arquivos; tipos: array
- name: presente em 18 arquivos; tipos: string
- steps: presente em 12 arquivos; tipos: array, object
- summary: presente em 6 arquivos; tipos: object, string
- templateId: presente em 6 arquivos; tipos: string
- compilerOptions: presente em 6 arquivos; tipos: object
- $id: presente em 6 arquivos; tipos: string
- $comment: presente em 6 arquivos; tipos: string
- additionalProperties: presente em 6 arquivos; tipos: boolean
- settings: presente em 5 arquivos; tipos: object, string

---
Relatório gerado automaticamente por scripts/audit-jsons.mjs