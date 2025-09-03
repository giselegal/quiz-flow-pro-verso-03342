# Mapa de Código – Funil 21 Etapas, Dados, Hooks e Cálculo de Resultados

Este documento liga cada parte do fluxo (coleta 1–18, gate na 19, cálculo/persistência na 20 e pós-resultado na 21) aos arquivos do projeto: dados, hooks, serviços e UI. Inclui diagramas Mermaid e pseudocódigo do cálculo.

## Visão de módulos (alto nível)

```mermaid
graph TD
  subgraph UI
    S20[Step20Template.tsx]
    Hdr[ResultHeaderInlineBlock.tsx]
  end

  subgraph Utils
    QRC[utils/quizResultCalculator.ts]
    PO[utils/performanceOptimizer.ts]
    Opt[utils/performanceOptimizations.ts]
  end

  subgraph Services
    UQS[services/core/UnifiedQuizStorage.ts]
    ORC[services/core/ResultOrchestrator.ts]
    RE[services/core/ResultEngine.ts]
    MS[services/MonitoringService.ts]
    DP[services/editor/DraftPersistence.ts]
  STS[services/stepTemplateService.ts]
  end

  subgraph Editor
  SDE[components/editor/SchemaDrivenEditorResponsive.tsx]
    EP[components/editor/EditorProvider.tsx]
    HState[hooks/useHistoryState.ts]
    SupaInt[hooks/useEditorSupabaseIntegration.ts]
  end

  subgraph Config & Types
  TPL[templates/quiz21StepsComplete.ts]
    CFG[config/quizStepsComplete.ts]
    Types[types/editor.ts]
  JTPL[config/templates/templates (JSON)]
  end

  S20 -- recalculate/validate --> QRC
  S20 -- render header/percentual --> Hdr
  QRC -- load/save --> UQS
  QRC -- run() --> ORC
  ORC -- policy/tie-break --> RE
  EP -- state/actions --> CFG & TPL & DP
  EP -- history --> HState
  EP -- (opcional) Supabase --> SupaInt
  SDE -- canvas/fallback etapa 20 --> STS & JTPL
  SDE -- fallback check --> Step20EditorFallback.tsx
  Step20EditorFallback.tsx -- usa --> hooks/useQuizResult.ts
  MS -. desativado nos testes .- UI/Utils/Services
  PO & Opt -. timers/listeners .- UI/Editor
```

## Entradas e saídas por módulo

- `src/utils/quizResultCalculator.ts`
  - Funções: `validateQuizData()`, `calculateAndSaveQuizResult()`, `recalculateQuizResult()`
  - Entrada: dados unificados via `UnifiedQuizStorage` (seleções, formData, meta)
  - Saída: `FallbackResult` (não persistido) ou `FinalResult` (persistido)
  - Regras: threshold (≥8 seleções válidas + nome), chama `ResultOrchestrator.run` quando há dados suficientes; persistência local via `UnifiedQuizStorage.saveResult`; remota (opcional) se sessão válida

- `src/services/core/UnifiedQuizStorage.ts`
  - Responsável por unificar e persistir dados (seleções, formData, metadados, resultado)
  - APIs: `loadUnifiedData()`, `hasEnoughDataForResult()`, `saveResult()`, `getDataStats()`

- `src/services/core/ResultOrchestrator.ts`
  - Orquestra as estratégias de pontuação (prefix-based vs. canônica), garante ordem determinística (desempate estável) e forma o payload final

- `src/services/core/ResultEngine.ts`
  - Implementa políticas de score, agregação e critérios de desempate (em ordem determinística)

- `src/components/steps/Step20Template.tsx`
  - UI do resultado: cabeçalho com nome, percentual primário (fallback visual 70% quando inválido), gatilho de validação/recalc protegido contra StrictMode
  - Complementa o editor: o design/preview da Etapa 20 é protegido por fallback no `SchemaDrivenEditorResponsive`

- `src/components/editor/EditorProvider.tsx`
  - Estado do editor e ações (adicionar/remover/ordenar blocos, currentStep, validação por etapa)
  - Integrações: histórico (`useHistoryState`), Supabase (opcional), templates/merge, rascunhos (`DraftPersistence`)
  - Carregamento de templates no editor via `stepTemplateService` é consumido por `SchemaDrivenEditorResponsive`

- `src/utils/performanceOptimizer.ts` e `src/utils/performanceOptimizations.ts`
  - Agendadores e otimizações de performance com rastreio/cancelamento de timers e listeners (auto-desativados em testes)

- `src/services/MonitoringService.ts`
  - Métricas/diagnósticos; listeners desabilitados em testes para evitar vazamentos

- `src/config/quizStepsComplete.ts` e `src/templates/quiz21StepsComplete.ts`
  - Estrutura de blocos por etapa e templates padrão das 21 etapas
  - Novo: sistema JSON `config/templates/templates` consumido por `services/stepTemplateService.ts`
- `src/services/stepTemplateService.ts`
  - Sistema unificado de templates por etapa com carregamento JSON (step-XX.json). Expõe `getStepTemplate()` e mapeia 1–21.
  - Garante template padrão caso JSON esteja ausente/indisponível.

- `src/components/editor/SchemaDrivenEditorResponsive.tsx`
  - Editor responsivo que integra: Toolbar, Stages, Components, Canvas e Properties.
  - Etapa 20: detecta ausência/falha do bloco `result-header-inline` e ativa `Step20EditorFallback` automaticamente.

- `src/components/editor/fallback/Step20EditorFallback.tsx`
  - Fallback inteligente para garantir conteúdo na Etapa 20 do editor.
  - Verifica: bloco `result-header-inline`, erros de cálculo, estado de loading e contagem de blocos; usa `Step20FallbackTemplate` quando necessário.

- `src/hooks/useQuizResult.ts`
  - Hook que calcula/carrega resultado, com timeout, retries e limpeza de timers/listeners.
  - Dispara `calculateAndSaveQuizResult()` quando há dados suficientes; emite eventos para atualização cruzada.

- `src/types/editor.ts`
  - Tipos como `Block` e contratos do editor

## Fluxo detalhado por etapa (19 → 20)

- Etapas 1–18 (coleta): `EditorProvider` gerencia `stepBlocks` e validação; templates e merges quando não é teste.
- Etapa 19 (pré-validação): `quizResultCalculator.validateQuizData()` usa `UnifiedQuizStorage.hasEnoughDataForResult()` para decidir gate (dados suficientes?).
  - Não: retorna `FallbackResult` sem persistir nem chamar orquestração.
- Etapa 20 (resultado): `quizResultCalculator.calculateAndSaveQuizResult()`
  - Sim: carrega unificado, chama `ResultOrchestrator.run`, aplica desempate determinístico (no orquestrador/engine), persiste via `UnifiedQuizStorage.saveResult()`; opcionalmente remota.

## Pseudocódigo do cálculo unificado

```ts
// src/utils/quizResultCalculator.ts (sintetizado)
export async function calculateAndSaveQuizResult(ctx) {
  const data = await UnifiedQuizStorage.loadUnifiedData();
  if (!UnifiedQuizStorage.hasEnoughDataForResult(data)) {
    return { type: 'fallback', persisted: false, reason: 'INSUFFICIENT_DATA' };
  }
  const payload = await ResultOrchestrator.run(data); // já ordenado/determinístico
  await UnifiedQuizStorage.saveResult(payload);
  if (ctx?.session?.canPersistRemote) await persistRemote(payload).catch(() => {});
  return { type: 'final', persisted: true, payload };
}
```

## Regras e thresholds

- Threshold mínimo: ≥8 seleções válidas e `formData.name` preenchido
- Desempate: ordenação determinística (estável), garantindo reprodutibilidade
- Percentual primário na UI: fallback visual 70% quando valor ausente/inválido (não afeta persistência)
- Guarda anti-recalcular: Step 20 protege contra duplo disparo sob React StrictMode

## Hooks e onde são usados

- `useEditor()` e `EditorProvider` — estado do editor, blocos por etapa, validação, ações de manipulação
- `useHistoryState()` — histórico com limite, persistência leve do presente, debounce; em testes, evita auto-merge/template
- `useEditorSupabaseIntegration()` — (opcional) carrega componentes do Supabase e mapeia para blocos de etapa

## Dados e persistência

- Dados unificados: `{ selections, formData, metadata, result? }` — `UnifiedQuizStorage`
- Persistência local: `saveResult(payload)`; leitura via `loadUnifiedData()`
- Persistência remota: opcional, depende de sessão/ambiente válidos

## Testes relevantes (caminhos)

- Gate 19→20 e persistência: `src/utils/__tests__/quizResultCalculator.step19to20.test.ts`
- Desempate determinístico: `src/utils/__tests__/resultEngine.tiebreak.test.ts`
- Integração de orquestrador: `src/services/core/__tests__/ResultOrchestrator.test.ts`
- Percentuais e cálculo: `src/core/result/percentage.test.ts`
- Fluxo do editor e passos: `src/test/editor-validation.test.tsx`, `src/__tests__/quizFlow.e2e.test.ts`

## Dicas de navegação no código

- Procure por "ResultOrchestrator" e "quizResultCalculator" para entrar no coração do cálculo
- Siga `UnifiedQuizStorage` para entender thresholds e persistência
- Em Step 20, veja `Step20Template.tsx` para regras de UI e guarda anti-recalcular

---

Referências visuais: veja também `docs/21-steps-flowchart.md` (fluxograma) e `docs/21-steps-sequence.md` (sequência).
