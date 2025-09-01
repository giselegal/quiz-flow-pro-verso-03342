# Gargalos e Pontos Cegos – Lógica de Cálculo por Etapa no /editor (Funil 21 passos)

Este documento mapeia como as etapas são processadas no módulo do editor, lista gargalos/pontos cegos observados e sugere instrumentação para aumentar a visibilidade e reduzir bugs difíceis de reproduzir.

## Visão rápida
- Processamento de etapa no editor depende de eventos globais (window) e do estado `currentStep` local do editor.
- A computação real de resultado (19→20) acontece no runtime/fluxo modular, mas não é totalmente refletida no editor puro, gerando placeholders em 20.
- Há riscos de sincronização por stepId em formatos diferentes (número vs `step-#`) e por uso de `__quizCurrentStep` em múltiplos pontos.
- Falta telemetria de “alcance de etapas” e “tempo por etapa”, dificultando detectar etapas nunca acessadas (13–18) e latências na transição 19→20.

## Como cada etapa é processada (no /editor)
1) Seleção da etapa atual
- Fonte: `EditorProvider` (estado `currentStep`) e/ou `QuizFlowProvider` quando integrado ao preview.
- Arquivos relevantes:
  - `src/components/editor/EditorProvider.tsx` (estado, ensureStepLoaded, getBlocksForStep)
  - `src/components/core/QuizRenderer.tsx` (override de etapa e sincronização com preview)
  - `src/components/core/QuizFlowOrchestrator.tsx` (orquestra estado de etapa/blocos em cenários integrados)

2) Carregamento/render dos blocos da etapa
- Função: `getBlocksForStep(step, stepBlocks)`
- Arquivos relevantes:
  - `src/components/editor/EditorPro.tsx` (memo para `currentStepData`)
  - `src/components/editor/layouts/CanvasArea.tsx` (renderização do canvas por etapa)

3) Validação por eventos globais
- Eventos: `quiz-input-change` e `quiz-selection-change`
- Atualiza: `setStepValid(currentStep, ok)`
- Arquivos relevantes:
  - `src/components/editor/EditorPro.tsx` (listeners e heurísticas de validade)
  - `src/components/editor/unified/EditorStageManager.tsx` (variantes unificadas)
  - Emissores: `OptionsGridInlineBlock.tsx`, `QuizOptionsGridBlock.tsx` (disparam `quiz-selection-change`)

4) Navegação
- Eventos: `navigate-to-step`, `quiz-navigate-to-step`
- Ação: `actions.setCurrentStep(target)`
- Arquivos relevantes:
  - `src/components/editor/EditorPro.tsx`, `EditorStageManager.tsx`
  - `src/context/QuizFlowProvider.tsx` (goTo/goNext/goPrev)

5) Cálculo de resultados (19→20)
- Runtime/produção: há `computeAndPersist` no fluxo modular (p.ex. `QuizModularPage.tsx`, `QuizFlowProvider.tsx`).
- Editor puro: normalmente não computa; step 20 exibe placeholders se o cálculo não estiver alimentando o storage/eventos.

## Gargalos e causas prováveis
1) Dependência de eventos globais sem `stepId` explícito
- Onde: handlers em `EditorPro.tsx`, `EditorStageManager.tsx`, `QuizRenderer.tsx`.
- Sintoma: validação marcada para a etapa errada quando o evento chega após troca de etapa.
- Causa: payload do evento nem sempre inclui `stepId`; o handler usa `state.currentStep` e/ou `__quizCurrentStep`.
- Risco: condição de corrida em navegações rápidas.

2) StepId inconsistente (número vs `step-#`)
- Onde: navegação (`navigate-to-step`), setagens de `__quizCurrentStep`, keys do template.
- Sintoma: listeners ignoram eventos ou mapeiam para a etapa errada.
- Sugestão: padronizar helpers `parseStepNumber`/`formatStepKey` e utilizá-los em todos os handlers.

3) Uso concorrente de `__quizCurrentStep`
- Onde: `EditorPro.tsx`, `QuizRenderer.tsx`, `QuizFlowProvider.tsx`, blocos que emitem eventos.
- Sintoma: emissores usam um valor que ainda não foi atualizado pelo consumidor, causando validação/navegação incorretas.
- Sugestão: fonte única de verdade via contexto/hook e passar `stepId` no evento (evitar reliance global).

4) Heurística de validação simplista
- Onde: handlers de `quiz-selection-change` e `quiz-input-change` (regra: válido se seleção > 0 ou input não vazio).
- Sintoma: etapas com regras específicas (min/max seleções) são aceitas/rejeitadas incorretamente.
- Sugestão: centralizar validação por etapa usando a config da etapa (ex.: `QuizDataService.getStepConfig` ou metadados de blocos).

5) Auto-avance com debounce/schedule sem cancelamento completo
- Onde: `QuizModularPage.tsx` (uso de `schedule/debounce`), outros fluxos de preview.
- Sintoma: avanço de etapa indevido após o usuário navegar manualmente.
- Causa: timeouts pendentes não cancelados na troca de etapa.
- Sugestão: garantir `cancelAll()` na mudança de etapa e invalidar tokens de tarefa por step.

6) Custo de lookup/render por etapa
- Onde: `getBlocksForStep` chamado a cada render; loops por 21 etapas em algumas views.
- Sintoma: UI “pesada” ao navegar; FPS baixo em templates densos.
- Sugestão: memoizar por `stepKey` + versão de blocos; medir tempo de `getBlocksForStep`.

7) Duplicidade de `questionId` entre etapas
- Onde: template 21 passos; ex.: etapas estratégicas podem compartilhar `questionId`.
- Sintoma: estado/validação se sobrepõe entre etapas diferentes; contagens “pulam”.
- Sugestão: scanner de duplicidade ao carregar template; avisar no console e painel.

8) Cálculo 19→20 não refletido no editor
- Onde: Editor sem `computeAndPersist` do resultado.
- Sintoma: step 20 mostra placeholders `{resultStyle}` sem binding real.
- Sugestão: simular evento de cálculo no editor ou ler do storage via hook dedicado ao entrar em 20.

9) Falta de métricas de “alcance de etapas”
- Onde: não há contadores por etapa no editor.
- Sintoma: etapas 13–18 podem nunca ser exercitadas e regressões passarem despercebidas.
- Sugestão: tracer leve com visitas/tempo/validações.

## Pontos cegos adicionais
- Blocos que não emitem eventos (ou emitem de forma parcial) deixam a etapa eternamente inválida.
- Recarregamento de template “bloco a bloco” via evento pode duplicar blocos e gerar muitos re-renders.
- Tokens sem resolução (ex.: `{userName}`, `{resultStyle}`) não são auditados; difícil detectar quando ficam “vazios”.

## Instrumentação e estatísticas recomendadas
1) Tracer leve (telemetria local)
- Contar: visitas por etapa, tempo médio/total por etapa, taxa de validação (ok/total), eventos de seleção (contagem), densidade de blocos.
- Medir: duração percebida do “cálculo” 19→20.
- Avisos: duplicidade de `questionId`; tokens sem resolução no step-20.

2) Logs padronizados por evento
- `quiz-navigate-to-step`: `{ from, to, source, ts }`
- `quiz-selection-change`: `{ stepId, selectionCount, valid, blockId? }`
- `quiz-input-change`: `{ stepId, field, empty, valid }`

3) Painel Dev (opcional)
- Exibir tabela por etapa com visitas, validações, seleção, tempo, erros.
- Link para “recarregar step”, “limpar timeouts”, “forçar cálculo”.

4) Medição de custos
- `console.time/console.timeEnd` ao redor de `getBlocksForStep` e do render do Canvas da etapa.

## Integrações sugeridas (pontuais)
- Em `EditorPro.tsx` e `EditorStageManager.tsx`:
  - Ao entrar em uma etapa: registrar visita e `blocksCount`.
  - Nos handlers de seleção/input: incluir `stepId` do emissor (passar via evento ou prop) e logar contagem/validade.
  - Na navegação: logar `{from, to, source}` e cancelar timeouts pendentes.
- Em `QuizFlowProvider.tsx`/`QuizRenderer.tsx`:
  - Sinalizar início/fim de “cálculo” ao transitar 19→20 e medir duração.
- No carregamento de template:
  - Executar scanner de `questionId` duplicado e alertar no console.

## Checklist de correções rápidas
- [ ] Padronizar utilitário `parseStepNumber` e uso em todos os handlers de navegação.
- [ ] Incluir `stepId` explícito em todos os eventos emitidos pelos blocos.
- [ ] Centralizar validação por etapa com base na configuração (min/max seleções, obrigatoriedade).
- [ ] Cancelar timeouts/debounces ao mudar de etapa.
- [ ] Memoizar `getBlocksForStep` por `stepKey` + versão dos blocos.
- [ ] Scanner de `questionId` duplicado ao carregar template.
- [ ] Telemetria: visitas/tempo/validações por etapa; medir 19→20.

## Como auditar agora (sem alterar código)
- Abra o console e monitore eventos:
  - `window.addEventListener('quiz-selection-change', e => console.log('selection', e.detail))`
  - `window.addEventListener('quiz-input-change', e => console.log('input', e.detail))`
  - `window.addEventListener('quiz-navigate-to-step', e => console.log('navigate', e.detail))`
- Navegue 1→21 no /editor e anote:
  - Etapas que não disparam eventos; etapas que nunca validam; atrasos na transição 19→20.

## Referências rápidas (onde investigar no código)
- Estado e navegação do editor:
  - `src/components/editor/EditorProvider.tsx`
  - `src/components/editor/EditorPro.tsx`
  - `src/components/editor/unified/EditorStageManager.tsx`
- Fluxo/core e preview:
  - `src/components/core/QuizRenderer.tsx`
  - `src/context/QuizFlowProvider.tsx`
  - `src/components/core/QuizFlowOrchestrator.tsx`
- Emissores de eventos:
  - `src/components/blocks/inline/OptionsGridInlineBlock.tsx`
  - `src/components/blocks/quiz/QuizOptionsGridBlock.tsx`
- Template (21 etapas):
  - `src/templates/quiz21StepsComplete.ts`

---

Observação: há um documento de arquitetura complementar em `docs/ARQUITETURA_FUNIL_QUIZ.md` que cobre fluxo geral, serviços e integrações; este arquivo foca nos gargalos específicos do /editor.
