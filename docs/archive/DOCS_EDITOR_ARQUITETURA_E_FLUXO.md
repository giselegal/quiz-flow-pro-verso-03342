## Visão geral do Editor: arquitetura, fluxo e lógica de cálculos

Este documento consolida como o editor funciona ponta-a-ponta: camadas, fluxo de eventos/estado e as regras centralizadas de validação que regem a navegação e os botões.

### Stack e módulos principais

- React 18 + TypeScript + Vite 5 + TailwindCSS
- DnD: `@dnd-kit` (arrastar/soltar no Canvas do Editor)
- Estado/contextos:
  - `EditorProvider` (estado do editor, seleção de bloco, etapa atual, validações por etapa)
  - `QuizFlowProvider` (estado de fluxo/validação para preview e quiz: `currentStep`, `totalSteps`, `canProceed`)
  - `PreviewContext` (controles de navegação do preview, reflete `canGoNext` baseado em `canProceed`)
- Renderização de blocos:
  - Editor: `src/components/editor/blocks/*`
  - Produção/quiz: `src/components/blocks/quiz/*` e `src/components/blocks/inline/*`
  - Inline (editor/produção compartilhado): `OptionsGridInlineBlock`, `ButtonInline`
- Propriedades dos blocos (painel):
  - Esquema: `src/config/blockPropertySchemas.ts`
  - Mapeamento dinâmico: `src/hooks/useUnifiedProperties.ts`

## Camadas do Editor

### 1) Shell do Editor com Preview

- `src/components/editor/EditorPro.tsx`
  - Orquestra o layout: Sidebar de etapas, Canvas (DnD), painel de propriedades.
  - Passa `stepValidation` para a Sidebar para exibir pontos verdes/vermelhos por etapa.
  - Usa `EditorProvider` para estado do editor (bloco selecionado, etapa atual, etc.).

- `src/pages/EditorWithPreview.tsx`
  - Envolve o editor com `QuizFlowProvider` para que o Preview use o mesmo estado de validação/navegação.

- `src/context/PreviewContext.tsx`
  - Expõe API de navegação do preview e computa `canGoNext` a partir de `QuizFlowProvider.canProceed`.
  - Publica `window.__quizCurrentStep` e `window.__quizTotalSteps` para regras step-aware dos blocos.

### 2) Canvas e Blocos

- Canvas organiza e posiciona blocos (via dnd-kit). Cada bloco tem renderizador no editor e (quando aplicável) no quiz/produção.
- Exemplos:
  - Seleção: `OptionsGridBlock.tsx` (editor/preview) e `QuizOptionsGridBlock.tsx` (quiz)
  - Botões: `ButtonInlineBlock.tsx` (editor) e `ButtonInline.tsx`/`ButtonInlineFixed.tsx` (produção)

### 3) Painel de Propriedades

- Esquemas por tipo de bloco em `blockPropertySchemas.ts` (ex.: `button-inline`, `options-grid`).
- `useUnifiedProperties.ts` lê o bloco atual e gera controles (toggles, inputs, selects).
- Itens relevantes:
  - `requiresValidInput`: botão só ativa com input válido.
  - `requiresValidSelection`: botão só ativa com seleção válida (padronizado).
  - Legado: `requiresGridSelection` (manter compat; preferir `requiresValidSelection`).

## Fluxo de dados e eventos

### Eventos customizados (window)

- Seleção: `quiz-selection-change`
  - Payload padronizado:
    - `questionId`, `gridId`
    - `selectionCount`, `requiredSelections`
    - `isValid` (boolean) e alias `valid`
    - `selectedOptions` (opcional)
  - Emissores:
    - Editor/Preview: `OptionsGridBlock.tsx`
    - Quiz/Produção: `QuizOptionsGridBlock.tsx`, `OptionsGridInlineBlock.tsx`

- Input: `quiz-input-change`
  - Para campos como “nome” na intro; usado por botões que requerem input válido.

- Navegação: `navigate-to-step` e `quiz-navigate-to-step`
  - Consumido por Preview/Editor para trocar a etapa.

### Consumidores dos eventos

- `QuizFlowProvider.tsx`: consolida `canProceed` por etapa ouvindo seleção/inputs.
- `PreviewContext.tsx`: define `canGoNext` a partir de `canProceed` (gating da navegação no preview).
- Botões:
  - `ButtonInline.tsx` (produção) e `ButtonInlineBlock.tsx` (editor) escutam `quiz-selection-change` e combinam com `requiresValidInput` para decidir `disabled`.

## Lógica de cálculos (regras centralizadas)

Arquivo: `src/lib/quiz/selectionRules.ts`

- Normalização de etapa: aceita número ou string (`"step-6"` → 6).
- Fases do quiz:
  - Scoring (etapas 2–11): exigem 3 seleções.
  - Estratégica (etapas 13–18): exige 1 seleção.
  - Caso geral: usa `requiredSelections` ou `minSelections` (fallback 1).

APIs principais:
- `getEffectiveRequiredSelections(step, { requiredSelections, minSelections })`
- `computeSelectionValidity(step, selectionCount, config)` → `{ effectiveRequiredSelections, isValid }`

Uso no sistema:
- Grids de seleção chamam `computeSelectionValidity` ao mudar `selectionCount` e emitem o evento padronizado com `requiredSelections` e `isValid`.
- `QuizFlowProvider` consolida `canProceed` por etapa (visual e funcional).
- `PreviewContext` expõe `canGoNext`; navegação é bloqueada até que `isValid` seja true.
- Botões com `requiresValidSelection` só habilitam quando o último evento indica `isValid=true` para a etapa corrente.

### Auto-avance por fase

- Scoring (2–11): ao atingir as seleções obrigatórias, o `OptionsGridBlock` (preview) pode auto-avançar com pequeno atraso (scheduler), evitando múltiplos disparos.
- Outras fases: apenas habilitam os botões; avanço é manual.

## Comportamentos no Editor vs Quiz

- Editor:
  - Renderização fiel no Canvas, mas com camadas de edição (seleção de bloco, outlines, etc.).
  - `StepSidebar` mostra pontos de validade por etapa de `stepValidation`.
  - Preview acoplado: usa `QuizFlowProvider` + `PreviewContext` para simular fluxo real.

- Quiz/Produção:
  - Renderização final com componentes de produção.
  - Mesmas regras de validação (eventos e utility centralizada), garantindo paridade.

## Performance e UX

- Remoção de animações fora do Canvas (redução de `framer-motion` em áreas não críticas).
- Scheduler (`useOptimizedScheduler`) uniformiza timeouts e evita múltiplos disparos.
- Canvas mais largo; evitar scroll horizontal desnecessário.

## Contratos e erros comuns

Contratos (resumo):
- Input: eventos devem enviar `valid` ou `value` não vazio para sinais de “input válido”.
- Seleção: eventos devem incluir `selectionCount` e `isValid`; quando possível, enviar `requiredSelections`.
- Navegação: usar `navigate-to-step`/`quiz-navigate-to-step` com `{ stepId }`.

Erros típicos:
- Grids sem emitir `valid/isValid`: botões nunca habilitam; resolvido padronizando o payload.
- Divergência de regras por etapa: resolvido com `selectionRules.ts` como fonte única.
- Auto-advance duplicado: mitigado por flags + scheduler com cancelamento.

## Como adicionar um novo bloco de seleção

1) Renderizador do bloco em `src/components/editor/blocks/*` (editor/preview) e, se for para produção, em `src/components/blocks/quiz/*`.
2) Ao mudar a seleção, compute:
   - `const { isValid, effectiveRequiredSelections } = computeSelectionValidity(window.__quizCurrentStep, selectionCount, { minSelections, requiredSelections })`
3) Emita `quiz-selection-change` com o payload padronizado.
4) Atualize o `blockPropertySchemas.ts` e mapeie no `useUnifiedProperties.ts` se o bloco for editável.

## Glossário rápido

- `canProceed`: etapa pode avançar (válida) segundo `QuizFlowProvider`.
- `canGoNext`: botão de avançar no Preview está habilitado (usa `canProceed`).
- `stepValidation`: mapa etapa → válido/inválido exibido na Sidebar do Editor.
- `requiresValidSelection`: gating de botão baseado na seleção da etapa atual.

---

Se precisar, posso anexar diagramas ou exemplos práticos de payloads dos eventos para depuração.
