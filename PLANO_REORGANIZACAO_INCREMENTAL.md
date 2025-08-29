# Plano de Reorganização Incremental (orientado por features)

Objetivo: reduzir duplicação entre editores/resultado/fluxos mantendo estabilidade. Aplicar em fases pequenas (PRs pequenos), com auditorias automáticas e sem quebrar a compatibilidade.

## Princípios
- Feature-first: agrupar por domínio (quiz-flow, editor, blocks, core, services) em vez de tipo de arquivo.
- Compatibilidade: manter aliases para caminhos antigos durante a transição.
- Observabilidade: scripts de auditoria (duplicados, imports, dead code) em reports/.
- Escopo pequeno por PR: mover 1-2 módulos por vez + testes rápidos.

## Mapa de destino (proposto)
- src/core/ — serviços/engines estáveis (StorageService, ResultEngine, FlowCore, QuizDataService)
- src/features/quiz-flow/ — useQuizFlow, useQuizLogic, hooks de navegação, Step gates
- src/features/editor/ — EditorPro, QuizRenderer, preview adapters, painéis
- src/features/blocks/ — blocks reutilizáveis (OptionsGridBlock, ResultHeaderInlineBlock, StyleCardInlineBlock, SecondaryStylesInlineBlock)
- src/entities/ — tipos/contratos (QuizResultPayload, StepConfig, etc.)
- src/integrations/supabase/ — quizSupabaseService e contratos
- src/pages/ — QuizModularPage, rotas públicas
- src/shared/ — utils comuns

## Fase 0 — Auditoria
1) Rodar `npm run audit:dupes` e revisar `reports/duplicates-*.md`.
2) Identificar grupos com arquivos iguais entre `src/components/editor/*` e `src/components/*/result*`.
3) Marcar alvos de deduplicação com maior impacto (blocos e serviços).

## Fase 1 — Núcleo como single source of truth
- Garantir que `src/core/*` é usado por produção e editor (já encaminhado).
- Evitar `localStorage` direto: migrar para `StorageService` (sprint pontual).

## Fase 2 — Consolidar blocks de resultado
- Mover `ResultHeaderInlineBlock`, `StyleCardInlineBlock`, `SecondaryStylesInlineBlock` para `src/features/blocks/`.
- Introduzir barrel exports e aliases temporários para caminhos antigos.
- Atualizar imports em páginas e no editor.

## Fase 3 — Navegação/resultado legado
- Unificar `useStepNavigation` e `quizResultsService` para usarem payload do `ResultEngine`.
- Marcar versões legadas como deprecated e redirecionar imports.

## Fase 4 — Editor
- Extrair adaptadores de preview para `src/features/editor/preview`.
- Remover duplicatas nos diretórios antigos do editor.

## Fase 5 — Limpeza e remoção de aliases
- Remover aliases temporários após migração completa.
- Executar sweep final de imports.

## Automação e qualidade
- Scripts: `audit:dupes`, `check-imports`, testes de smoke (vitest -t navigation, steps).
- CI (futuro): bloquear merge se grupos duplicados > baseline.

## Riscos e mitigação
- Risco: quebra de imports em arquivos não tocados → Mitigar com aliases e PRs pequenos.
- Risco: regressão em Step 19/20 → Mitigar com smoke tests + conferência manual.

## Done Definition por PR
- Build e vitest passam.
- Relatório de duplicados atualizado (igual ou menor que baseline anterior).
- Sem referências diretas a localStorage nos módulos alterados.
