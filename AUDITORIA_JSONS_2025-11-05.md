# Auditoria de JSONs - 2025-11-05

## Resumo

- Total de arquivos: 236
- Válidos: 226
- Inválidos: 10

### Maiores arquivos
- package-lock.json (785 KB)
- TS_NOCHECK_AUDIT_REPORT.json (127 KB)
- scripts/cloudinary-all-resources-image.json (120 KB)
- public/templates/quiz21-complete.json (113 KB)
- public/templates/quiz21-complete.json.backup-1761679655354.json (107 KB)
- public/templates/quiz21-complete.json.backup-1761342018128.json (99 KB)
- public/templates/quiz21-complete.backup-1761325377.json (93 KB)
- SERVICE_AUDIT_REPORT.json (66 KB)
- src/config/optimized21StepsFunnel.json (41 KB)
- src/core/schema/defaultSchemas.json (31 KB)

## Erros de sintaxe
- exemplo-quiz-estilo.json: — Unexpected end of JSON input
- schemas/component.schema.json: — Unexpected end of JSON input
- schemas/logic.schema.json: — Unexpected end of JSON input
- schemas/outcome.schema.json: — Unexpected end of JSON input
- schemas/stage.schema.json: — Unexpected end of JSON input
- schemas/template.schema.json: — Unexpected end of JSON input
- scripts/quiz-images-organized.json: — Unexpected end of JSON input
- scripts/testing/clean-scripts.json: — Unexpected end of JSON input
- scripts/testing/funnel_teste.json: — Unexpected token 'J', ..."ettings": JSON.strin"... is not valid JSON
- src/templates/step21-offer-template.json: (linha 153, coluna 5) posição 5417 — Expected ',' or ']' after array element in JSON at position 5417 (line 153 column 5)

## IDs duplicados entre arquivos
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
- blocks: presente em 103 arquivos; tipos: array
- analytics: presente em 93 arquivos; tipos: object
- validation: presente em 68 arquivos; tipos: object
- id: presente em 64 arquivos; tipos: string
- theme: presente em 47 arquivos; tipos: object, string
- type: presente em 45 arquivos; tipos: string
- sections: presente em 45 arquivos; tipos: array
- version: presente em 35 arquivos; tipos: string, number
- description: presente em 35 arquivos; tipos: string
- behavior: presente em 27 arquivos; tipos: object
- title: presente em 25 arquivos; tipos: string
- navigation: presente em 23 arquivos; tipos: object
- layout: presente em 23 arquivos; tipos: object
- category: presente em 22 arquivos; tipos: string
- label: presente em 22 arquivos; tipos: string
- icon: presente em 22 arquivos; tipos: string
- renderingStrategy: presente em 22 arquivos; tipos: string
- properties: presente em 22 arquivos; tipos: object
- design: presente em 22 arquivos; tipos: object
- logic: presente em 22 arquivos; tipos: object
- updatedAt: presente em 21 arquivos; tipos: string
- steps: presente em 14 arquivos; tipos: array, object
- name: presente em 14 arquivos; tipos: string
- meta: presente em 11 arquivos; tipos: object
- scoring: presente em 10 arquivos; tipos: object
- templateId: presente em 7 arquivos; tipos: string
- timestamp: presente em 6 arquivos; tipos: string
- globalConfig: presente em 6 arquivos; tipos: object

---
Relatório gerado automaticamente por scripts/audit-jsons.mjs