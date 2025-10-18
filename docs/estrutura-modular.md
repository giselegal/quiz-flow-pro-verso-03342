# Arquitetura do Editor Modular (Resumo)

Este documento resume o pipeline de dados e componentes usados no `/editor`.

## Prioridade de fontes por step

1. JSON modular estático (quando existir)
   - Steps: 01, 02, 12, 13, 19, 20
   - Origem mostrada como `modular-json` no diagnóstico
2. JSON público master hidratado
   - Arquivo: `/templates/quiz21-complete.json`
   - Hidratação via `hydrateSectionsWithQuizSteps(stepId, sections)` usando `QUIZ_STEPS`
   - Origem: `master-hydrated`
3. Fallback TS (template mínimo)
   - `src/templates/quiz21StepsComplete.ts`
   - Conversão via `safeGetTemplateBlocks` → `blockComponentsToBlocks`
   - Origem: `ts-template`

## Contrato do Hydrator

Entrada:
- stepId: `step-XX`
- sections: Array de sections v3 (ex.: `question-hero`, `options-grid`, `transition-hero`, `offer-hero`)

Saída:
- Mesmas sections com `content` e regras de seleção preenchidas a partir de `QUIZ_STEPS`

Cobertura:
- intro, question, strategic-question, transition, transition-result, result/offer (parcial)

## Mapeamento de tipos

O arquivo `src/utils/blockTypeMapper.ts` converte tipos de sections v3 para tipos de blocos do editor, p.ex.:
- `question-hero` → `quiz-question-header`
- `options-grid` → `options-grid`
- `transition-hero` → `transition-hero`
- `offer-hero` → `offer-hero`
- Result e offer incluem cabeçalhos, listas, depoimentos, pricing etc.

## Diagnóstico

- Página: `/debug/editor-blocks`
- Mostra quantidade de blocos por step e origem registrada em `state.stepSources` do `EditorProviderUnified`.

## Testes

- Hidrator: passos 03 e 13 (unitários)
- Provider: `ensureStepLoaded` cobre steps 03, 12, 19, 20, 21
- Smoke: rota `/editor` renderiza container principal do editor

## Observações

- Todos os componentes modulares aceitam `props.blocks`; fallback de autoload ocorre apenas quando necessário.
- Para duplicar funis, priorize usar o master JSON + hydrator; sobrescreva com JSON modular apenas quando houver conteúdo enriquecido.
