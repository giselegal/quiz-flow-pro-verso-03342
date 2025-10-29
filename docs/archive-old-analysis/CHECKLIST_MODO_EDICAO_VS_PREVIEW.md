# Checklist: Modo Edição vs Modo Preview

Data: 17/10/2025
Baseado no código real e análises do repositório.

Referências principais:
- Editor (canvas e painéis): `src/components/editor/quiz/QuizModularProductionEditor.tsx`
- Preview modular (editável): `src/components/editor/quiz/ModularPreviewContainer.tsx`
- Preview runtime (produção): `src/components/editor/quiz/QuizProductionPreview.tsx`
- App de produção com previewMode: `src/components/quiz/QuizAppConnected.tsx`
- Renderer unificado: `src/components/editor/quiz/components/UnifiedStepRenderer.tsx`
- Provider unificado do editor: `src/components/editor/EditorProviderUnified.tsx`

Observação importante:
- Existem DOIS sabores de preview no contexto do editor:
  1) Preview Modular (editável): usa UnifiedStepRenderer em modo "edit" para permitir abrir propriedades e seleção de blocos, mantendo simulação de sessão.
  2) Live Runtime Preview (produção): usa `QuizAppConnected` com `previewMode`, reproduzindo fielmente comportamento de produção (auto-avanço, placeholders, etc.).

## 1) Componentes renderizados

- [x] Edição: renderiza wrappers modulares/edição no `UnifiedStepRenderer` com `mode="edit"` (ex.: `ModularIntroStep`, `ModularQuestionStep`, etc.).
- [x] Preview Modular (editável): também usa `UnifiedStepRenderer` com `mode="edit"` (ver `ModularPreviewContainer`) para permitir abertura do painel de propriedades pelo preview.
- [x] Preview Runtime (produção): renderiza componentes de produção via `QuizAppConnected` (`IntroStep`, `QuestionStep`, `TransitionStep`, `ResultStep`, `OfferStep`).
- [x] Produção real: usa os mesmos componentes de produção (sem wrappers de edição).

Critério de validação:
- [ ] Confirmar que os casos de `mode="preview"` em `UnifiedStepRenderer` continuam renderizando componentes de produção, quando usados fora do editor.

## 2) Providers e estado

- [x] Edição: `EditorProviderUnified` gerencia `stepBlocks`, `selectedBlockId`, `currentStep`, histórico, persistência opcional (Supabase), `ensureStepLoaded`.
- [x] Preview Modular: pode rodar sob o mesmo `EditorProviderUnified` (detecta via `useEditorOptional()`), e se ausente, encapsula com o Provider para habilitar seleção e painel de propriedades.
- [x] Preview Runtime: usa `useQuizState` para sessão (userName, respostas, progresso), independente do `EditorProviderUnified`.
- [x] `QuizAppConnected` passa `editorMode || previewMode` para carregar configs rapidamente, mas `autoSave` só é verdadeiro em `editorMode` (no previewMode é falso).

Critérios de validação:
- [ ] Em preview runtime, verificar que `editorMode=false`, `previewMode=true`, `autoSave=false` nos hooks `useComponentConfiguration`.
- [ ] Em edição, verificar `ensureStepLoaded` para o step atual quando `currentStep` muda.

## 3) Navegação e auto-avanço

- [x] Edição (canvas): navegação de etapas via UI do editor (ex.: `StepNavigator`), sem auto-avanço por respostas.
- [x] Preview Modular: tem botões Anterior/Próximo e mantém sessão; não força auto-avanço pela lógica do `UnifiedStepRenderer` (modo edit).
- [x] Preview Runtime: auto-avanço habilitado em perguntas normais quando `answers.length === requiredSelections` e em estratégicas ao definir `strategicAnswer` (ver effect em `QuizAppConnected`).

Critérios de validação:
- [ ] Perguntas estratégicas avançam automaticamente no preview runtime após resposta.
- [ ] Perguntas normais avançam ao atingir `requiredSelections` e espera ~800ms antes de avançar (feedback visual).

## 4) UI de edição e overlays

- [x] Edição: overlays de seleção, DnD, reorder, seleção de bloco abre painel de propriedades. Reordenação via `editor.actions.reorderBlocks`.
- [x] Preview Modular: atalho "p" abre o painel de propriedades e tenta selecionar o primeiro bloco do step (ver `ModularPreviewContainer`).
- [x] Preview Runtime: sem overlays de edição; apenas UI do quiz.

Critérios de validação:
- [ ] Tecla "p" no Preview Modular abre painel e seleciona bloco.
- [ ] Reordenar blocos no modo edição atualiza `stepBlocks` e mantém coerência com metadados de ordem.

## 5) Dados e persistência

- [x] Edição: persiste estrutura de blocos/steps (templates modulares ou padrão) no provider e opcionalmente Supabase (via UnifiedCRUD, debounce, autosave 30s quando habilitado).
- [x] Preview Modular: sessão mantida localmente (`useQuizState`), sem persistência externa.
- [x] Preview Runtime: sessão mantida (`useQuizState`); carrega configurações de API (global, tema, step) via `useComponentConfiguration` com `realTimeSync`; sem `autoSave`.

Critérios de validação:
- [ ] `saveToSupabase` só disponível quando `enableSupabase=true` no Provider.
- [ ] `QuizAppConnected` aplica `applyPlaceholders` com dados de sessão no preview runtime.

## 6) Configuração e tema

- [x] Edição: pode ter editores de tema (`ThemeEditorPanel`) e tokens (`EditorThemeProvider`).
- [x] Preview Runtime: aplica `mergedConfig` (global + tema + step), estilos dinâmicos (CSS vars) e placeholders (`{userName}`, `{primaryStyle}`, etc.).
- [x] Preview Modular: mostra `SharedProgressHeader` em steps 2..19 (simulação de UI de produção).

Critérios de validação:
- [ ] Em preview runtime, barra de progresso oculta em intro/transition/transition-result e visível nos demais.

## 7) Performance e carregamento

- [x] Edição: lazy de componentes específicos; histórico simplificado; `ensureStepLoaded` evita loops e recarrega apenas quando necessário.
- [x] Preview Runtime: `registerProductionSteps` uma vez; fallback de registry quando vazio; normalized renderer opcional nas primeiras etapas; carregamento com spinners.

Critérios de validação:
- [ ] `ensureStepLoaded` usa functional `setState` e set de steps em loading para evitar race/loop.
- [ ] Preview bloqueia render até `registryReady` (em `QuizModularProductionEditor`) para manter fidelidade.

## 8) Atalhos e acessibilidade

- [x] Preview Modular: tecla "p" abre painel de propriedades (com proteção para inputs focados).
- [x] Edição: foco/seleção de blocos respeita inputs e contentEditable.

Critério:
- [ ] Não acionar atalho "p" quando digitando em inputs/textarea/contentEditable.

## 9) Erros/estados vazios

- [x] Preview Modular: exibe mensagem "Etapa não encontrada" se `currentStepData` ausente.
- [x] Preview Runtime: telas de carregamento com status de conexão; erros da API (exceto timeout) exibidos; step ausente mostra instrução no modo editor.

Critérios:
- [ ] Timeout não é erro fatal no preview runtime (usa fallback).

## 10) Resultados e ofertas

- [x] Edição/Preview Modular: `computeResult` utilizado para montar dados realistas no step de resultado.
- [x] Preview Runtime: também usa `computeResult` e aplica placeholders.

Critério:
- [ ] Mesmo algoritmo de pontuação em edição/preview/produção para garantir consistência dos estilos.

---

## Resumo rápido (matriz)

- Componentes
  - Edição: Modulares + overlays (UnifiedStepRenderer modo edit)
  - Preview Modular: Modulares + sessão (modo edit)
  - Preview Runtime: Produção (QuizAppConnected + previewMode)

- Estado
  - Edição: EditorProviderUnified (blocos/steps)
  - Preview Modular: useQuizState (sessão) + Provider opcional p/ propriedades
  - Preview Runtime: useQuizState (sessão) + configs API

- Navegação
  - Edição: manual por UI do editor (sem auto-avanço)
  - Preview Modular: botões prev/next
  - Preview Runtime: auto-avanço por respostas

- Persistência
  - Edição: opcional Supabase (autosave)
  - Preview Modular: nenhuma
  - Preview Runtime: nenhuma (apenas leitura de configs)

---

## Ações de QA sugeridas

- [ ] Verificar que o Live Runtime Preview segue exatamente o fluxo de produção (auto-avanço e placeholders).
- [ ] Confirmar que abrir propriedades via preview (tecla "p") seleciona o bloco correto no Provider.
- [ ] Reordenar blocos no editor e validar reflexo visual imediato e persistência no Provider.
- [ ] Alterar `requiredSelections` e checar timings de auto-avanço no preview runtime.
- [ ] Conferir que `autoSave` NÃO dispara no preview runtime (somente editorMode).

---

### Notas sobre novos controles de Preview Modular

- `ModularPreviewContainer` agora aceita:
  - `editable?: boolean` — alterna entre modo de edição modular e preview (produção) dentro do mesmo container.
  - `showViewportControls?: boolean` — exibe barra de controle de viewport.
  - `viewport?: 'full'|'desktop'|'tablet'|'mobile'` e `onViewportChange?` — controlam a largura máxima simulada.
  - `onSessionChange?: (session) => void` — propaga alterações de sessão para sincronização externa.

- `QuizProductionPreview` agora:
  - Possui controles de Viewport e Modo na barra superior (desktop/tablet/mobile/full e edit/preview).
  - Sincroniza `?viewport=` e `?mode=` na URL para persistir estado entre reloads.
  - Encaminha sessão via `onSessionChange` para quem precisar ouvir.
