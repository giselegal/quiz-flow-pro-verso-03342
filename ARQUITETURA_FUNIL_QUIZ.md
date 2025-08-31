# Arquitetura do Funil de 21 Etapas (Atualizada)

Este documento descreve a arquitetura prática do funil/quiz de 21 etapas conforme o código atual.

## Visão Geral
- Frontend: React 18 + Vite + TypeScript.
- Dev: Vite Dev Server (`npm run dev`).
- Prod: build Vite + servidor Node/Express (bundle em `dist/server.js`).
- Rotas principais (wouter):
  - `/step/:step` → página de execução do funil (produção/preview) via `StepPage`.
  - Editor/Admin conforme configuração existente.

## Página de Execução: StepPage
- Arquivo: `src/pages/StepPage.tsx`.
- Providers/Fluxo: `QuizFlowProvider` controla etapa atual, progresso, validação e dispara cálculo.
- Templates: `templateService.getTemplateByStep(step)` converte para blocos do editor e renderiza via `CanvasDropZone.simple` em modo preview.
- Navegação: `QuizNavigation` usa `useQuizFlow` para avançar/voltar.

## Templates de Etapas
- Fonte de verdade: `src/templates/quiz21StepsComplete.ts` (exporta `QUIZ_STYLE_21_STEPS_TEMPLATE`).
- Step 20 contém blocos de resultado (ex.: `result-header-inline`, `style-card-inline`, `secondary-styles`).

## Coleta de Nome e Respostas
- Nome (Etapa 1):
  - Hooks: `useQuizFlow.saveName` → `useQuizLogic.setUserNameFromInput`.
  - Persistência: `StorageService.safeSetString('userName', name)` e `quizUserName` (compat).
- Respostas (Etapas 2–11):
  - Bloco: `QuizOptionsGridBlock` emite `quiz-selection-change` e persiste incrementalmente em `StorageService.safeSetJSON('quizResponses', ...)` usando `window.__quizCurrentStep`.
  - Regras de seleção: `computeSelectionValidity`.

## Cálculo e Resultado
- Disparo/integração (produção): `QuizFlowProvider`.
  - Expõe `window.__quizCurrentStep`.
  - Ao entrar nas etapas 19 ou 20:
    - Agrega `quizResponses` → transforma estrutura.
    - Tenta cálculo central `services/quizResultsService.calculateResults` (se disponível).
    - Fallback local por palavras-chave.
    - Normaliza e persiste `quizResult` em `StorageService` e emite `quiz-result-updated`.
- Motor local (alternativo): `useQuizLogic.completeQuiz` soma estilos de q1–q10 (weights) e também persiste `quizResult` + tenta serviço central.

## Consumo do Resultado
- Hook: `useQuizResult` lê `quizResult` do Storage e reage a eventos `quiz-result-updated` e `storage`.
- Blocos:
  - `ResultHeaderInlineBlock`:
    - Lê `userName` de Storage/janela.
    - Usa `primaryStyle.category` (label humano) e `primaryStyle.percentage` (ou override via prop `percentage`).
    - Busca assets/config em `getStyleConfig`.
  - Demais blocos de resultado (cards, secundários etc.) também dependem do hook/Storage.

## Contratos de Dados (StorageService)
- `userName: string` – capturado na etapa 1.
- `quizResponses: { [step: string]: { [questionId: string]: { ids: string[]; texts: string[] } } }` – respostas incrementais.
- `quizResult` normalizado:
```
{
  primaryStyle: { category: string; style: string; score: number; percentage: number },
  secondaryStyles: Array<{ category: string; style: string; score: number; percentage: number }>,
  totalQuestions: number,
  completedAt: Date | string,
  scores?: Record<string, number>,
  userData?: { name?: string }
}
```

## Eventos Globais
- Emissão pelos blocos: `quiz-selection-change` (validação/prosseguir).
- Navegação: `quiz-navigate-to-step`.
- Resultado: `quiz-result-updated` (reidrata consumidores como `useQuizResult`).

## Pontos de Atenção/Erros Comuns
- Sem `window.__quizCurrentStep` → respostas sem contexto de etapa; já corrigido no `QuizFlowProvider`.
- Falta de `quizResult` ao entrar no step 20 → cálculo garantido nas etapas 19/20 com fallback.
- Divergência de nomes de estilo (key vs label) → `ResultHeaderInlineBlock` prioriza `category` (label humano) e resolve assets via key/label.

## Testes (Smoke Tests)
- `result-header-inline` renderiza nome, estilo e percentual com `quizResult` no Storage.
- Núcleo lógico calcula e persiste `quizResult` após respostas de q1–q10, incluindo `userData.name`.

## Como Executar
- Dev: `npm run dev` (porta 5173) e opcionalmente `npm run dev:server`.
- Testes: `npm run test` ou `npm run test:run`.

---

Esta arquitetura reflete o caminho de produção atual (`StepPage` + `QuizFlowProvider` + templates `quiz21StepsComplete.ts`) e a forma como os blocos de resultado consomem `quizResult`.

## Centralizações no Core (Atualização)
- IDs e UUIDs: `src/core/utils/id.ts` expõe `isUUID()` e `generateUuid()` para uso consistente. Evita duplicação de validações.
- Eventos: `src/core/constants/events.ts` padroniza nomes como `QUIZ_RESULT_UPDATED` e `QUIZ_SESSION_STARTED`. Use as constantes, não literais.
- Resultado (orquestração): `src/services/core/ResultOrchestrator.ts` unifica cálculo (`ResultEngine`), persistência no `StorageService` e persistência opcional no Supabase quando houver sessão UUID.

## CRUD do Funil (Ajustes)
- `schemaDrivenFunnelService.ts` alinhar ao schema do Supabase:
  - Deixar o DB gerar `funnels.id` (UUID)
  - Gerar `funnel_pages.id` com `generateUuid()`
  - Normalizar `page_type` (intro|question|result|lead_form|transition)
  - Garantir `blocks` como array JSON

## Sessões (Regras)
- `sessionService.startQuizSession()` só cria sessão no Supabase se o `quizId` (funnelId) for UUID válido (evita FK inválida). Caso contrário, opera em modo local.
- Ao criar sessão Supabase, emite `QUIZ_SESSION_STARTED` e salva `sessionId` UUID no localStorage.

## Próximos Passos
- Mover eventuais duplicações de `isValidUUID` remanescentes para `core/utils/id.ts`.
- Padronizar chaves de storage (`core/constants/storageKeys.ts`).
- Adicionar testes unitários para normalização de pages no `schemaDrivenFunnelService` e para o `ResultOrchestrator` (happy path + persistência condicional).
