# Templates do Quiz 21 Etapas — Fonte Canônica

Este projeto usa como FONTE ÚNICA de verdade os JSONs v3 por etapa em `public/templates/step-XX-v3.json`, que geram o TypeScript `src/templates/quiz21StepsComplete.ts` usado em runtime.

## Princípios

- Runtime do editor e do renderizador usa SEMPRE o arquivo TypeScript gerado (`quiz21StepsComplete.ts`).
- Master/normalized/modular servem apenas para: exportação, diagnóstico e testes offline. Não são usados no runtime.
- O loader anota `_source: 'ts'` para cada step e loga a origem.
- Variações como `options-grid` são normalizadas para `options grid` automaticamente.

## Como editar templates

1. Edite os JSONs v3 em `public/templates/step-XX-v3.json`.
2. Gere o TS canônico:
   - `npm run generate:templates`
3. Execute o build e testes:
   - `npm run build`
   - `npm run test:templates` (opcional)

## Auditoria

- O script de auditoria (a ser adicionado em `scripts/audit/compare-sources.ts`) compara os JSONs v3, o TS gerado e artefatos de diagnóstico.
- Critério de aceite: 100% das etapas devem reportar `_source: ts` no runtime.

## Itens legados

- O master `quiz21-complete.json`, JSONs normalizados e o template legado `QUIZ_STYLE_21_STEPS_TEMPLATE` anterior ficam como referência apenas.
- O serviço `HybridTemplateService` foi atualizado para recusar fetch do master e sempre retornar a fonte TS no runtime.
