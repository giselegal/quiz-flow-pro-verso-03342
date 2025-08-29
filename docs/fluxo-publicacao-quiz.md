## Fluxo da rota de publicação (/quiz)

Resumo do runner: `src/pages/QuizModularPage.tsx` usa `useQuizFlow` (modo production) + `TemplateManager` para carregar os blocos das 21 etapas, com navegação e validação via eventos globais.

- Etapas e papéis:
  - 1: Coleta de nome (form-container). Valida e avança. Nome salvo via `saveName` e localStorage.
  - 2–11: Perguntas que pontuam (options-grid). Cada seleção chama `answerScoredQuestion(q1..q10)` mapeada pela etapa.
  - 12: Transição (overlay). Sem coleta.
  - 13–18: Estratégicas (options-grid single). Chamam `answerStrategy` para métricas (não impacta pontuação).
  - 19: Processamento/Overlay. Dispara `computeAndPersistResult()` para gravar `localStorage.quizResult`.
  - 20: Resultado. Blocos leem `useQuizResult()` que consome `localStorage.quizResult` e interpolam placeholders.
  - 21: Oferta/CTA final.

### Cálculo e persistência

Na etapa 19 o runner consolida as seleções das etapas 2–11, mapeia prefixos de optionId para estilos e grava um payload normalizado em `localStorage.quizResult` (com `primaryStyle`, `secondaryStyles`, `scores`, `userData.name`). Isso garante que `ResultHeaderInlineBlock` e outros componentes de resultado exibam o estilo calculado na etapa 20.

Arquivo chave: `src/pages/QuizModularPage.tsx` (função `computeAndPersistResult`).

### Eventos e integração dos blocos

- Navegação: blocos disparam `navigate-to-step`/`quiz-navigate-to-step`.
- Validação: `quiz-selection-change` e `quiz-input-change` atualizam `stepValidation` e podem acionar auto-advance.
- Callbacks de blocos: `onOptionSelect` e `onInputChange` conectam seleções e inputs ao fluxo oficial.

### Arquivos obsoletos removidos

- `src/pages/ModernQuizPage.tsx` (placeholder antigo)
- `src/pages/QuizFlowPage.tsx` (runner duplicado, substituído por `QuizModularPage`)
- `src/pages/Quiz.tsx` (vazio)

Esses arquivos não estão referenciados nas rotas atuais e foram removidos para evitar manutenção duplicada.
