# Editores principais: arquitetura, estrutura e uso

Este documento apresenta os principais editores do projeto, suas arquiteturas, diretórios e a explicação detalhada de cada um, para facilitar a escolha e a manutenção.

## Visão geral rápida
- Oficial: rota `/editor` → `MainEditor` → `SchemaDrivenEditorResponsive` (recomendado)
- Legado/compat: EditorPro (mantido para cenários específicos e testes)
- Especializados:
  - Quiz Modular (componentes em `components/quiz-editor`)
  - Result Page Editors (componentes em `components/result-editor`)

Rotas relevantes
- `/editor` → `src/pages/MainEditor.tsx` → `SchemaDrivenEditorResponsive`
- `/quiz` → `src/pages/QuizModularPage.tsx` (execução/preview)
- Páginas de teste do EditorPro: `src/pages/EditorPro*`

---

## 1) Editor oficial: SchemaDrivenEditorResponsive

Onde está
- Shell: `src/components/editor/SchemaDrivenEditorResponsive.tsx`
- Entrada de rota: `src/pages/MainEditor.tsx` (monta `EditorProvider` e renderiza)

Arquitetura (resumo)
- Provider central: `EditorProvider` (estado de etapas/blocos, undo/redo, validações)
- Colunas: Estágios (FunnelStages), Biblioteca de Componentes, Canvas, Propriedades
- DnD: `dnd-kit` via `StepDndProvider`, `SortableBlockItem`, `DroppableCanvas`
- Templates: `services/stepTemplateService` (carrega JSON de `config/templates`)
- Resultado (Etapa 20): fallback robusto via `Step20EditorFallback` + cálculo unificado (`quizResultCalculator` → `UnifiedQuizStorage` → `ResultOrchestrator`)

Fluxo lógico
1. MainEditor lê query (template/funnel/step) e monta EditorProvider
2. SchemaDrivenEditorResponsive desenha colunas e Canvas
3. DnD cria/reordena blocos, EditorProvider persiste estado
4. Na Etapa 20: se faltar bloco de header/resultado, usa `Step20EditorFallback`
5. Fallback chama `useQuizResult` → `quizResultCalculator` → `UnifiedQuizStorage` → `ResultOrchestrator`

Diretórios e arquivos-chave
- `src/components/editor/EditorProvider.tsx` — contexto/estado do editor
- `src/components/editor/funnel/*` — estágios, navegação do funil
- `src/components/editor/dnd/*` — wrappers, itens sortáveis, drop zones
- `src/components/editor/properties/*` — painel de propriedades e editores
- `src/components/editor/blocks/*` — blocos disponíveis no Canvas
- `src/components/editor/fallback/Step20EditorFallback.tsx` — fallback da Etapa 20
- `src/hooks/useQuizResult.ts` — cálculo/carregamento de resultado com timeout/retries
- `src/utils/quizResultCalculator.ts` — valida, calcula, persiste
- `src/services/core/*` — `UnifiedQuizStorage`, `ResultOrchestrator`, `ResultEngine`
- `src/services/stepTemplateService.ts` — entrega dos templates por etapa (JSON)

Quando usar
- Sempre que precisar do editor padrão com 21 etapas, DnD e painel de propriedades
- É o editor que a rota `/editor` usa oficialmente

---

## 2) Editor legado: EditorPro

Onde está
- Implementação principal: `src/components/editor/EditorPro.tsx`
- Testes de página: `src/pages/EditorPro*.tsx`

Arquitetura (resumo)
- Usa `EditorProvider` como contexto
- Lazy para sidebars pesadas: `sidebars/StepSidebar`, `sidebars/ComponentsSidebar`, `properties/PropertiesColumn`
- Canvas estruturado em `layouts/CanvasArea` + DnD via `StepDndProvider`
- Extensa instrumentação de logs/performance e diagnósticos (ex.: `run21StepDiagnostic`)

Diretórios e arquivos-chave
- `src/components/editor/EditorPro.tsx` — monolito principal com integrações
- `src/components/editor/sidebars/*` — sidebars de etapas e componentes
- `src/components/editor/properties/*` — coluna de propriedades (legacy)
- `src/components/editor/layouts/*` — layout de canvas/áreas
- `src/components/editor/dnd/*` — DnD kit wrappers e itens

Observações
- Mantido por compatibilidade e para alguns testes de regressão
- Mais pesado e complexo que o editor oficial; evitar evoluções nele

Quando usar
- Apenas se existir fluxo específico ainda não migrado para o editor oficial

---

## 3) Quiz Modular (especializado)

Onde está
- Componentes: `src/components/quiz-editor/*`
- Página: `src/pages/QuizModularPage.tsx` (execução/preview, sem colunas de edição cheias)

Arquitetura (resumo)
- Focado na criação/edição de perguntas e opções do quiz
- Integra com score e navegação modular (sem todo o workspace de 4 colunas)

Diretórios e arquivos-chave
- `src/components/quiz-editor/QuizEditor.tsx` — shell do editor de quiz
- `src/components/quiz-editor/QuestionEditor.tsx`, `QuestionOptionEditor.tsx` — edição de perguntas/opções
- `src/components/quiz-editor/*` — demais utilitários para fluxo modular

Quando usar
- Casos específicos de edição de quiz mais “focada” em perguntas, sem o funil completo visual

---

## 4) Result Page Editors (especializados para Etapa 20)

Onde está
- Componentes: `src/components/result-editor/*`

Arquitetura (resumo)
- Editores voltados para personalizar páginas de resultado (headers, seções, estilos)
- Operam sobre um schema de conteúdo/estilo e se integram ao resultado calculado

Diretórios e arquivos-chave
- `src/components/result-editor/ResultPageVisualEditor.tsx` — editor visual principal
- `src/components/result-editor/ResultPageEditor.tsx` — composição de seções
- `src/components/result-editor/editors/*` e `block-editors/*` — editores por tipo de bloco/seção
- `src/components/result-editor/GlobalStylesEditor.tsx` — estilos globais

Quando usar
- Para personalização avançada da Etapa 20 quando o editor completo não é necessário

---

## Comparativo rápido
- SchemaDrivenEditorResponsive (oficial)
  - + Simples de evoluir, fallback Etapa 20 robusto, melhor divisão por pastas
  - + Rota oficial /editor
  - − Requer alinhamento contínuo de blocos e propriedades
- EditorPro (legado)
  - + Ampla cobertura de casos antigos, útil para validar regressões
  - − Arquivo extenso, carga maior, manutenção custosa
- Quiz Modular / Result Editors (especializados)
  - + Ótimos para focos específicos (perguntas, página de resultado)
  - − Não substituem o workspace completo com 4 colunas

---

## Boas práticas e dicas
- Preferir sempre `SchemaDrivenEditorResponsive` em novas features
- Centralizar cálculos de resultado em `quizResultCalculator` e serviços em `services/core/*`
- Reutilizar `EditorProvider` e seus hooks (`useEditor`, `useStepHandlers`, `useBlockHandlers`)
- Evitar side-effects no render; preferir hooks com cleanup (evita loops e leaks)
- Em testes, usar os scripts segmentados para evitar OOM

---

## Referências cruzadas
- Rota principal: `src/pages/MainEditor.tsx`
- Editor oficial: `src/components/editor/SchemaDrivenEditorResponsive.tsx`
- Legado: `src/components/editor/EditorPro.tsx`
- Especializados: `src/components/quiz-editor/*`, `src/components/result-editor/*`
- Fallback Etapa 20: `src/components/editor/fallback/Step20EditorFallback.tsx`
- Cálculo de resultado: `src/utils/quizResultCalculator.ts`, `src/services/core/*`
