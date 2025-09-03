# Gargalos críticos e plano de ação (priorizado)

Este relatório consolida os principais problemas detectados (aninhamento excessivo, duplicidades, funções semelhantes e inconsistências) e define um plano de ação objetivo, baseado nos últimos MDs e na auditoria do editor.

## 1) Duplicidades e fontes de verdade conflitantes

1. Dois registries de blocos do editor
- Arquivos: `src/components/editor/blocks/EnhancedBlockRegistry.tsx` e `src/components/editor/blocks/enhancedBlockRegistry.ts`
- Sintomas: funções iguais (`getEnhancedBlockComponent`, `AVAILABLE_COMPONENTS`) em arquivos distintos e com casing diferente.
- Riscos: divergência de importações entre módulos, bugs específicos por SO (case-sensitive), confusão em testes e builds.
- Ação P0:
  - Unificar no arquivo canônico `EnhancedBlockRegistry.tsx`.
  - Remover/arquivar `enhancedBlockRegistry.ts` (ou transformá-lo em re-export explícito para trás-compatibilidade por um ciclo curto).
  - Grep global e substituir importações antigas por `EnhancedBlockRegistry.tsx`.

2. Schemas de propriedades duplicados
- Arquivos: `src/config/blockPropertySchemas.ts` (preferencial) e `src/config/funnelBlockDefinitions.ts` (legado/fallback)
- Sintomas: schemas para os mesmos blocos em dois lugares; painéis funcionam, mas manutenção é cara.
- Riscos: divergência de props, UI inconsistente no painel, regressões silenciosas.
- Ação P0:
  - Canonizar schemas em `blockPropertySchemas.ts`.
  - Deixar `funnelBlockDefinitions.ts` apenas como fallback transitório (com aviso deprecatório na docstring).
  - Adicionar teste que valida que todo bloco presente no registry tem schema resolvido via `blockPropertySchemas`.

3. Sidebar estática vs registro oficial de componentes
- Arquivo: `src/components/editor/components/ComponentsSidebar.tsx`
- Sintomas: lista manual diverge de `AVAILABLE_COMPONENTS`.
- Riscos: usuário não encontra blocos suportados; mismatch entre editor e render universal.
- Ação P1:
  - Ler `AVAILABLE_COMPONENTS` do `EnhancedBlockRegistry` e renderizar grupos a partir de lá.
  - Adicionar feature flag temporária para poder voltar à lista estática em caso de problemas.

4. Vite config duplicado no root
- Arquivos: `vite.config.ts` e `vite.config.js` (além de variações em `examples/` e `scripts/testing/`).
- Sintomas: múltiplos configs podem causar confusão e warnings em toolchains que autodetectam arquivos.
- Riscos: builds diferentes por ambiente, comportamentos não determinísticos.
- Ação P1:
  - Padronizar em `vite.config.ts` no root; mover `vite.config.js` para `docs/archive/` ou remover.
  - Manter configs em `examples/` e `scripts/testing/` apenas para aqueles contextos, com comentário claro.

5. EditorPro e variantes legadas espalhadas
- Evidências: testes e scripts referenciam `EditorPro`, `EditorPro-WORKING`, `QuizEditorPro`, páginas de demo e testes antigos.
- Sintomas: partes do código ainda importam editor legado; rota oficial usa `SchemaDrivenEditorResponsive`.
- Riscos: manutenção duplicada, bugs só no editor legado, confusão para novos contribuidores.
- Ação P0:
  - Mover editores legados para `src/legacy/` e ajustar import paths.
  - Atualizar testes que importam `EditorPro` para o editor oficial ou criar testes de compat legado isolados com marcação `[legacy]`.

## 2) Aninhamento e responsabilidades

6. EditorProvider muito abrangente
- Arquivo: `src/components/editor/EditorProvider.tsx`
- Sintomas: gerencia seleção, DnD, persistência, import/export, step loading, supabase; risco de componente "God object".
- Riscos: difícil testar, efeitos colaterais cruzados, rerenders caros.
- Ação P1:
  - Extrair hooks: `useStepBlocks`, `useSelection`, `usePersistence` (storage/template) e `useDnDChannel`.
  - Adicionar testes unitários dos hooks desacoplados.

7. Canvas e wrapper com lógica acoplada
- Arquivos: `CanvasDropZone.simple.tsx`, `SortableBlockWrapper.simple.tsx`
- Sintomas: lógica de DnD/seleção/render juntas; callbacks complexos; possíveis branches profundos.
- Riscos: regressões ao mexer no DnD, dificuldade de simular em testes.
- Ação P2:
  - Separar camada de render (visual) da camada de comportamento (DnD/seleção).
  - Introduzir componentes puros para facilitar testes (props → render previsível).

## 3) Inconsistências e problemas de build/runtime

8. Erro "require is not defined" em ambiente remoto
- Evidência: `attached_assets/...SchemaDrivenEditorResponsive...` aponta erro em runtime.
- Causa provável: dependência CJS sem shim em ESM ou import condicional.
- Ação P0:
  - Auditar imports desse componente e de dependências usadas nesse caminho.
  - Forçar ESM ou usar `vite.optimizeDeps`/`build.commonjsOptions` apropriado.
  - Teste de smoke E2E em preview para validar.

9. Warnings de chunks grandes e dynamic/static imports
- Sintomas: build ok com avisos sobre tamanho de chunks e imports inconsistentes para `UnifiedQuizStorage`/`quizResultCalculator`.
- Riscos: performance inicial ruim e risco de code-splitting indevido.
- Ação P2:
  - Definir `manualChunks` para vendors pesados.
  - Tornar imports determinísticos (lazy vs eager) por rota.

10. Testes monolíticos com OOM em teardown
- Sintomas: ambiente jsdom pesado e timers/listeners residuais.
- Ação P1:
  - Shardar testes (por pastas ou tags) e usar `--maxWorkers`.
  - Garantir cleanup universal (timers/RAF/idle) e evitar long-running effect loops.

## 4) Plano de ação priorizado (2–3 sprints curtos)

P0 — imediato (alto impacto, baixo risco)
- Unificar registry de blocos: remover `enhancedBlockRegistry.ts`, padronizar imports.
- Canonizar schemas em `blockPropertySchemas.ts` e colocar nota deprecatória em `funnelBlockDefinitions.ts`.
- Isolar legado: mover `EditorPro*`/`QuizEditorPro*` para `src/legacy/` e ajustar/tests.
- Investigar e corrigir "require is not defined" na cadeia do `SchemaDrivenEditorResponsive`.
- Entregáveis: PR com refactor + testes de smoke no /editor e Step 20 fallback.

P1 — curto prazo
- Sidebar alimentada por `AVAILABLE_COMPONENTS` (feature flag para rollback).
- Extrair hooks do `EditorProvider` e adicionar testes unitários.
- Padronizar Vite config no root para `.ts`; arquivar `.js`.
- Sharding de testes e limpeza de timers/RAF global.

P2 — melhoria contínua
- Canvas: separar render/behavior para reduzir aninhamento e facilitar testes.
- Tuning de build (manualChunks, imports consistentes) e medir TTI/JS payload.
- Consolidar templates/resultados (se houver redundâncias) e gerar tipos a partir de schemas.

## 5) Critérios de aceite e checagens rápidas

- Registry único: `grep -R "enhancedBlockRegistry" src | wc -l` retorna 0 para o arquivo obsoleto; todos imports apontam para `EnhancedBlockRegistry.tsx`.
- Schemas: teste que valida `getSchemaFor(block.type)` vindo de `blockPropertySchemas` para 95%+ dos blocos (resto via fallback com aviso).
- Sidebar: renderiza mesmos itens que `AVAILABLE_COMPONENTS` (snapshot test simples).
- Build: sem warnings de config duplicada e sem erro de `require is not defined`.
- Testes: suíte particionada roda sem OOM; relatório de cobertura estável.

## 6) Observações finais

- Manter uma única fonte de verdade: `EnhancedBlockRegistry` + `blockPropertySchemas`.
- Documentar legado em `src/legacy/` com README curto e prazo para remoção.
- Automatizar uma verificação CI para impedir regressão de duplicidades (lint custom/grep + job de falha se encontrar arquivos proibidos).
