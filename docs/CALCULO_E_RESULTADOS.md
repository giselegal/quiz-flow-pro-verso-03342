# Cálculo do Resultado do Quiz (Etapas 2 → 20)

Este guia descreve, passo a passo, como os dados são coletados durante o quiz, como o resultado é calculado ao chegar na etapa 20 e como ele é exibido/persistido. Inclui fluxos, eventos, pontos de integração e troubleshooting.

## Visão geral do fluxo

Etapa 1 (dados do usuário)
- Coleta do nome do usuário (e possivelmente email) conforme o template da etapa 1
- Persistência: `unifiedQuizStorage.updateFormData('userName', valor)` (compat: espelha em `quizAnswers`)
- Evento: `unified-quiz-data-updated` (para refletir a atualização do form)

1) Coleta de respostas (etapas 2–19)
- Componente principal: `src/components/editor/blocks/OptionsGridBlock.tsx`
- Persistência: `unifiedQuizStorage.updateSelections()` e também compatibilidade legacy via `StorageService.safeSetJSON('userSelections', ...)`
- Eventos disparados: `quiz-selection-change` (custom), `unified-quiz-data-updated` e `quiz-answer-updated` (via UnifiedQuizStorage)

2) Progresso/navegação entre etapas
- Origem: `EditorProvider.setCurrentStep()` em `src/components/editor/EditorProvider.tsx`
- Persistência: `unifiedQuizStorage.updateProgress(step)` → grava `metadata.currentStep` (gate para etapa 20)
- Evento: `unified-quiz-data-updated`

3) Chegada na etapa 20 (resultado)
- Editor padrão: `src/legacy/editor/EditorPro.tsx` força cálculo em 19/20
- Fallback moderno: `src/components/editor/SchemaDrivenEditorResponsive.tsx` força cálculo ao detectar `currentStep === 20`, com uma segunda tentativa 800ms depois
- Eventos: após cálculo, emite `quiz-result-refresh` e `quiz-result-updated`

4) Cálculo e persistência do resultado
- Função central: `src/utils/quizResultCalculator.ts` → `calculateAndSaveQuizResult()`
- Orquestração: `src/services/core/ResultOrchestrator.ts` + `src/services/core/ResultEngine.ts`
- Armazenamento:
  - Legacy: `StorageService.safeSetJSON('quizResult', payload)`
  - Unificado: `unifiedQuizStorage.saveResult(payload)`
- Eventos emitidos: `quiz-result-updated`, `unified-quiz-data-updated`

5) Leitura/Exibição do resultado
- Hook: `src/hooks/useQuizResult.ts`
  - Lê de legacy/unificado; se não houver, tenta calcular (timeout de 10s + retries)
  - Anti-concorrência: guarda global evita cálculos paralelos
  - Eventos escutados: `quiz-result-updated`, `quiz-result-refresh`, `unified-quiz-data-updated`, `quiz-answer-updated`
- Blocos de UI principais:
  - `ResultHeaderInlineBlock.tsx` (header/percentual/imagens)
  - `Step20Result.tsx` e `Step20Template.tsx` (layouts de resultado)
  - Fallback robusto: `Step20FallbackTemplate.tsx` (usado pelo editor ou rota `/step20`)

## Componentes e responsabilidades

- OptionsGridBlock (etapas de perguntas)
  - Resolve opções com múltiplos fallbacks (properties → content → canônico por etapa)
  - Persiste seleções no unificado e no legacy para compatibilidade
  - Emite evento de mudança para validação/calculadora

- EditorProvider
  - Estado global do editor (etapa atual, blocos por etapa)
  - Atualiza `unifiedQuizStorage.metadata.currentStep` para gate do passo 20

- UnifiedEditor
  - Tenta carregar `EditorPro` (legado). Se indisponível, cai para `SchemaDrivenEditorResponsive`

- SchemaDrivenEditorResponsive
  - Garante cálculo ao entrar na etapa 20 e ativa fallback de UI se faltarem blocos de resultado

- ResultOrchestrator/ResultEngine
  - Converte seleções em estilos, aplica regras/canonização e produz payload final a persistir

- useQuizResult (hook)
  - Carrega do storage; calcula quando necessário; controla `isLoading`, `error`, `retry`
  - Timeout de 10s por tentativa; até 3 retries (2s/4s/6s)
  - Evita duplicidade de cálculos via guarda global `__quizResultGlobal`

## Passo a passo detalhado

Pré-passo — Etapa 1 (dados do usuário)
- Usuário informa o nome
- O editor/fluxo salva com `unifiedQuizStorage.updateFormData('userName', value)`
- O dado fica disponível para o cálculo e personalização do resultado (e para interpolação no UI via `getBestUserName`)

1. Usuário seleciona opções (etapas 2–19)
- OptionsGridBlock chama `unifiedQuizStorage.updateSelections(questionId, selected[])`
- UnifiedQuizStorage salva, sincroniza chaves legadas e dispara `unified-quiz-data-updated`/`quiz-answer-updated`

2. Navegação avança etapas
- `EditorProvider.setCurrentStep(n)` atualiza estado + `unifiedQuizStorage.updateProgress(n)`
- Quando `n === 20`, o gate libera cálculo mesmo com dados mínimos

3. Ao entrar na etapa 20
- EditorPro e/ou SchemaDrivenEditorResponsive chamam `calculateAndSaveQuizResult()`
- Em caso de corrida, a guarda global do hook evita cópias paralelas
- Após sucesso, `quiz-result-updated` é emitido; UI re-renderiza

4. Exibição do resultado
- Blocos consultam `useQuizResult()`:
  - `isLoading` → esqueletos de loading
  - `error` → aviso + botão `retry`
  - `primaryStyle`, `secondaryStyles` → UI de resultado

5. Fallbacks de UI
- Se faltar bloco `result-header-inline`, `Step20EditorFallback` injeta `Step20FallbackTemplate`
- Na rota `/step20`, `QuizModularPage`/`Step20FallbackTemplate` também mostram resultado garantindo resiliência

## Eventos importantes

- `quiz-answer-updated` (EVENTS.QUIZ_ANSWER_UPDATED)
  - Disparado ao salvar seleções/form; o hook pode recalcular
- `quiz-result-updated` (EVENTS.QUIZ_RESULT_UPDATED)
  - Disparado quando um novo resultado é salvo
- `quiz-result-refresh` (custom)
  - Nudge para hooks/temas refazerem leitura
- `unified-quiz-data-updated`
  - Mudanças no unified storage (selections/form/metadata/result)

## Dados e chaves no storage

- Unificado: `unifiedQuizData`
  - `selections`: { [stepId]: [optionIds] }
  - `formData`: { userName, email, ... }
  - `metadata`: { currentStep, completedSteps[], startedAt, lastUpdated, version }
  - `result`: payload final (primaryStyle, secondaryStyles, etc.)
  - Observação: o `userName` é coletado na etapa 1 e usado na personalização do resultado

- Legacy (compatibilidade):
  - `userSelections`
  - `quizAnswers`
  - `quizResult`

## Troubleshooting rápido

- Travou carregando no passo 20
  - Verifique se `metadata.currentStep` está em 20 (deve ser atualizado por `EditorProvider`)
  - Confirme eventos no console: deve haver logs de cálculo e `quiz-result-updated`
  - Abra Application → Local Storage e veja se `quizResult`/`unifiedQuizData.result` existem
  - O hook tem timeout de 10s e 3 tentativas; use o botão "Tentar Novamente" quando disponível

- Opções não aparecem na etapa 2
  - `OptionsGridBlock` resolve via properties → content → canônico; revise o template e logs em dev

- Resultado "Natural" sempre
  - Em cenários sem respostas, o orquestrador usa ordenação determinística; com dados reais, o estilo muda

## Arquivos-chave (referência)

- Cálculo/armazenamento
  - `src/utils/quizResultCalculator.ts`
  - `src/services/core/UnifiedQuizStorage.ts`
  - `src/services/core/ResultOrchestrator.ts`
  - `src/services/core/ResultEngine.ts`

- Editor e navegação
  - `src/components/editor/EditorProvider.tsx`
  - `src/components/editor/UnifiedEditor.tsx`
  - `src/legacy/editor/EditorPro.tsx`
  - `src/components/editor/SchemaDrivenEditorResponsive.tsx` (fallback moderno/backup quando o EditorPro não está disponível ou quando se deseja o fluxo moderno com fallback da etapa 20)

- UI de resultado (passo 20)
  - `src/components/editor/blocks/ResultHeaderInlineBlock.tsx`
  - `src/components/steps/Step20Template.tsx`
  - `src/components/steps/Step20Result.tsx`
  - `src/components/quiz/Step20FallbackTemplate.tsx`
  - `src/components/editor/fallback/Step20EditorFallback.tsx`

- Hook
  - `src/hooks/useQuizResult.ts`

## Validação automática (smoke)

- `npm run step20` executa `scripts/smoke-step20.mjs` que:
  - Abre `/editor`, navega para a etapa 20 por evento,
  - Verifica um cue visual e leitura de `quizResult` no storage,
  - Loga um resumo JSON no terminal.

---
Este documento deve ajudar na evolução e depuração do fluxo de cálculo e exibição do resultado. Atualize sempre que regras de negócio ou eventos mudarem.

## Estrutura visual dos diretórios (referência rápida)

```text
src/
├─ components/
│  ├─ editor/
│  │  ├─ EditorProvider.tsx
│  │  ├─ UnifiedEditor.tsx
│  │  ├─ SchemaDrivenEditorResponsive.tsx   # Fallback moderno do editor
│  │  ├─ blocks/
│  │  │  ├─ OptionsGridBlock.tsx            # Etapas 2–19 (seleções)
│  │  │  └─ ResultHeaderInlineBlock.tsx     # Header do resultado (etapa 20)
│  │  ├─ fallback/
│  │  │  └─ Step20EditorFallback.tsx        # Fallback robusto no editor (passo 20)
│  │  ├─ funnel/
│  │  │  └─ FunnelStagesPanelUnified.tsx
│  │  └─ ...
│  ├─ quiz/
│  │  └─ Step20FallbackTemplate.tsx         # Template de resultado resiliente
│  └─ steps/
│     ├─ Step20Result.tsx
│     └─ Step20Template.tsx
│
├─ legacy/
│  └─ editor/
│     └─ EditorPro.tsx                      # Editor padrão (prioritário)
│
├─ hooks/
│  └─ useQuizResult.ts                      # Hook de leitura/cálculo com timeout/retry
│
├─ services/
│  └─ core/
│     ├─ UnifiedQuizStorage.ts              # Armazenamento unificado + eventos
│     ├─ ResultOrchestrator.ts              # Orquestra regras/escoring
│     ├─ ResultEngine.ts                    # Monta/persiste payload final
│     ├─ StorageService.ts                  # Wrapper seguro de storage (compat)
│     └─ ...
│
├─ utils/
│  └─ quizResultCalculator.ts               # calculateAndSaveQuizResult()
│
├─ core/
│  └─ constants/
│     └─ events.ts                          # Nomes de eventos centralizados
│
├─ pages/
│  ├─ MainEditor.tsx                        # Entrada do /editor
│  └─ QuizModularPage.tsx                   # Rota /step20 (fallback de UX)
│
└─ scripts/
  └─ smoke-step20.mjs                      # Smoke para validar passo 20
```
