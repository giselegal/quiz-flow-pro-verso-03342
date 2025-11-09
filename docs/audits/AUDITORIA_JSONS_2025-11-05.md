# Auditoria de JSONs - 2025-11-05

## Resumo

- Total de arquivos: 237
- Válidos: 237
- Inválidos: 0
- Erros de esquema: 7

### Maiores arquivos
- package-lock.json (788 KB)
- TS_NOCHECK_AUDIT_REPORT.json (127 KB)
- scripts/cloudinary-all-resources-image.json (120 KB)
- public/templates/quiz21-complete.json (113 KB)
- public/templates/quiz21-complete.json.backup-1761679655354.json (107 KB)
- public/templates/quiz21-complete.json.backup-1761342018128.json (99 KB)
- public/templates/quiz21-complete.backup-1761325377.json (93 KB)
- SERVICE_AUDIT_REPORT.json (66 KB)
- src/config/optimized21StepsFunnel.json (41 KB)
- src/core/schema/defaultSchemas.json (31 KB)

## IDs duplicados ignorados pela whitelist
- id "step-01": public/templates/blocks/step-01.json, public/templates/normalized/step-01.json
- id "step-02": public/templates/blocks/step-02.json, public/templates/normalized/step-02.json
- id "step-03": public/templates/blocks/step-03.json, public/templates/normalized/step-03.json
- id "step-04": public/templates/blocks/step-04.json, public/templates/normalized/step-04.json
- id "step-05": public/templates/blocks/step-05.json, public/templates/normalized/step-05.json
- id "step-06": public/templates/blocks/step-06.json, public/templates/normalized/step-06.json
- id "step-07": public/templates/blocks/step-07.json, public/templates/normalized/step-07.json
- id "step-08": public/templates/blocks/step-08.json, public/templates/normalized/step-08.json
- id "step-09": public/templates/blocks/step-09.json, public/templates/normalized/step-09.json
- id "step-10": public/templates/blocks/step-10.json, public/templates/normalized/step-10.json
- id "step-11": public/templates/blocks/step-11.json, public/templates/normalized/step-11.json
- id "step-12": public/templates/blocks/step-12.json, src/data/modularSteps/step-12.json, src/data/templates/step-12-template.json
- id "step-13": public/templates/blocks/step-13.json, src/data/modularSteps/step-13.json
- id "step-19": public/templates/blocks/step-19.json, src/data/modularSteps/step-19.json, src/data/templates/step-19-template.json
- id "step-20": public/templates/blocks/step-20.json, src/data/modularSteps/step-20.json, src/data/templates/step-20-template.json

## Duplicatas de steps dentro de arquivos
- src/config/optimized21StepsFunnel.json: stepIds duplicados = step-12, step-13, step-19, step-20, step-21

## Chaves de topo mais comuns
- metadata: presente em 147 arquivos; tipos: object
- templateVersion: presente em 127 arquivos; tipos: string
- blocks: presente em 104 arquivos; tipos: array
- analytics: presente em 93 arquivos; tipos: object
- validation: presente em 68 arquivos; tipos: object
- id: presente em 65 arquivos; tipos: string
- type: presente em 50 arquivos; tipos: string
- theme: presente em 47 arquivos; tipos: object, string
- sections: presente em 45 arquivos; tipos: array
- description: presente em 37 arquivos; tipos: string
- version: presente em 36 arquivos; tipos: string, number
- title: presente em 31 arquivos; tipos: string
- behavior: presente em 27 arquivos; tipos: object
- properties: presente em 27 arquivos; tipos: object
- navigation: presente em 23 arquivos; tipos: object
- layout: presente em 23 arquivos; tipos: object
- category: presente em 22 arquivos; tipos: string
- label: presente em 22 arquivos; tipos: string
- icon: presente em 22 arquivos; tipos: string
- renderingStrategy: presente em 22 arquivos; tipos: string
- design: presente em 22 arquivos; tipos: object
- logic: presente em 22 arquivos; tipos: object
- updatedAt: presente em 21 arquivos; tipos: string
- name: presente em 16 arquivos; tipos: string
- steps: presente em 15 arquivos; tipos: array, object
- meta: presente em 11 arquivos; tipos: object
- scoring: presente em 10 arquivos; tipos: object
- templateId: presente em 7 arquivos; tipos: string
- timestamp: presente em 6 arquivos; tipos: string
- globalConfig: presente em 6 arquivos; tipos: object

---
Relatório gerado automaticamente por scripts/audit-jsons.mjs