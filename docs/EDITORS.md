# Editores principais: arquitetura, estrutura e uso

Este documento apresenta os principais editores do projeto, suas arquiteturas, diretórios e a explicação detalhada de cada um, para facilitar a escolha e a manutenção.

## Visão geral rápida (status atual - CONSENSO CORRIGIDO)
- **Oficial em produção**: rota `/editor` → `MainEditor` → `EditorPro` (USA MAIS arquitetura CORE)
- **Alternativo moderno**: `SchemaDrivenEditorResponsive` (interface moderna, menos CORE)
- **Rota alternativa**: `/editor/schema` para SchemaDrivenEditorResponsive
- Especializados:
  - Quiz Modular (componentes em `components/quiz-editor`)
  - Result Page Editors (componentes em `components/result-editor`)

Rotas relevantes
- `/editor` → `src/pages/MainEditor.tsx` → import dinâmico de `src/legacy/editor/EditorPro.tsx` (PRINCIPAL + CORE)
- `/editor/schema` → `src/pages/SchemaEditorPage.tsx` → `src/components/editor/SchemaDrivenEditorResponsive.tsx` (ALTERNATIVO)
- `/showcase/steps` → `src/pages/StepsShowcase.tsx` (renderiza as 21 etapas + painel de propriedades)
- `/quiz` → `src/pages/QuizModularPage.tsx` (execução/preview)

---

## 1) Editor oficial (CORE PRINCIPAL): EditorPro + Arquitetura CORE

Onde está
- Implementação: `src/legacy/editor/EditorPro.tsx`
- **OFICIAL** em `/editor` (usa TODA a arquitetura CORE)
- Integração completa com `services/core/*` via `calculateAndSaveQuizResult`

Arquitetura (resumo)
- Provider central: `EditorProvider` (estado de etapas/blocos, undo/redo, validações)
- **CORE Services**: `ResultOrchestrator`, `UnifiedQuizStorage`, `StorageService` (via calculateAndSaveQuizResult)
- Lazy loading: `sidebars/StepSidebar`, `sidebars/ComponentsSidebar`, `properties/PropertiesColumn`
- Canvas estruturado em `layouts/CanvasArea` + DnD via `StepDndProvider`
- **3 CHAMADAS diretas** para `calculateAndSaveQuizResult` (que usa toda arquitetura CORE)

Fluxo lógico
1. MainEditor carrega EditorPro dinamicamente
2. EditorPro renderiza layout com sidebars e canvas  
3. DnD cria/reordena blocos, EditorProvider persiste estado
4. **Nas etapas finais**: EditorPro chama `calculateAndSaveQuizResult` 3x
5. `calculateAndSaveQuizResult` → `ResultOrchestrator` → `UnifiedQuizStorage` → persistência CORE

Diretórios e arquivos-chave
- `src/legacy/editor/EditorPro.tsx` — editor principal com integração CORE
- `src/utils/quizResultCalculator.ts` — chamado pelo EditorPro (integração CORE)
- `src/services/core/ResultOrchestrator.ts` — orquestração de resultados
- `src/services/core/UnifiedQuizStorage.ts` — armazenamento unificado
- `src/services/core/StorageService.ts` — persistência base
- `src/components/editor/EditorProvider.tsx` — contexto/estado do editor
- `src/components/editor/sidebars/*` — sidebars de etapas e componentes
- `src/components/editor/layouts/*` — layout de canvas/áreas

Quando usar
- **SEMPRE** - Este é o editor oficial que MAIS utiliza arquitetura CORE
- Para funcionalidades que dependem de cálculos robustos e persistência CORE
- Integração testada e confiável com `ResultOrchestrator` e `UnifiedQuizStorage`

---

## 2) Editor alternativo (UI moderna): SchemaDrivenEditorResponsive

---

## 1) Editor oficial (CORE PRINCIPAL): EditorPro + Arquitetura CORE

Onde está
- Implementação: `src/legacy/editor/EditorPro.tsx`
- **OFICIAL** em `/editor` (usa TODA a arquitetura CORE via calculateAndSaveQuizResult)
- **3 CHAMADAS DIRETAS** para `calculateAndSaveQuizResult` → `ResultOrchestrator` → `UnifiedQuizStorage`

Arquitetura (resumo)
- Provider central: `EditorProvider` (estado de etapas/blocos, undo/redo, validações)
- **INTEGRAÇÃO CORE COMPLETA**: `calculateAndSaveQuizResult` nas linhas 425, 432, 439
- **CORE Services utilizados**: `ResultOrchestrator`, `UnifiedQuizStorage`, `StorageService`
- Lazy loading: `sidebars/StepSidebar`, `sidebars/ComponentsSidebar`, `properties/PropertiesColumn`
- Canvas estruturado em `layouts/CanvasArea` + DnD via `StepDndProvider`
- Extensa instrumentação de logs/performance e diagnósticos

Diretórios e arquivos-chave
- `src/components/editor/EditorPro.tsx` — monolito principal com integrações
- `src/components/editor/sidebars/*` — sidebars de etapas e componentes
- `src/components/editor/properties/*` — coluna de propriedades (legacy)
- `src/components/editor/layouts/*` — layout de canvas/áreas
- `src/components/editor/dnd/*` — DnD kit wrappers e itens

Observações
- Mantido por compatibilidade e por abranger fluxos antigos
- Conta com fail-safe de template: `EditorProvider` faz merge do template padrão no mount, e há watchdog que recarrega se tudo estiver vazio; no header do Canvas existe botão “Recarregar template”
- Mais pesado e complexo; preferir evoluções no editor alternativo quando possível

Quando usar
- **Para UI/UX modernos** com menos dependência de arquitetura CORE
- Quando precisar de interface mais limpa e responsiva
- Para prototipagem rápida sem cálculos complexos

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

## Comparativo rápido (CONSENSO CORRIGIDO)
- **EditorPro + CORE (OFICIAL - MAIS ROBUSTO)**
  - ✅ **Editor principal em `/editor`**
  - ✅ **USA TODA a arquitetura CORE** (calculateAndSaveQuizResult → ResultOrchestrator → UnifiedQuizStorage)
  - ✅ **3 chamadas diretas** para serviços CORE
  - ✅ Robustez máxima para cálculos e persistência
  - ⚠️ Interface legada, mas estável e confiável
- **SchemaDrivenEditorResponsive (ALTERNATIVO MODERNO)**
  - ✅ Interface moderna e responsiva
  - ✅ Melhor UX e layout de 4 colunas
  - ⚠️ **USA POUCA arquitetura CORE** (só via useQuizResult)
  - ⚠️ Menos integração com serviços robustos
- **Quiz Modular / Result Editors (ESPECIALIZADOS)**
  - ✅ Ótimos para focos específicos (perguntas, página de resultado)
  - ⚠️ Não substituem o workspace completo com 4 colunas

---

## Boas práticas e dicas (CONSENSO CORRIGIDO)
- **SEMPRE usar `EditorPro`** para funcionalidades que precisam de arquitetura CORE robusta
- **Usar `SchemaDrivenEditorResponsive`** para interfaces modernas com menos dependência CORE
- Centralizar cálculos de resultado em `calculateAndSaveQuizResult` (já integrado no EditorPro)
- Utilizar `services/core/*` (`ResultOrchestrator`, `UnifiedQuizStorage`) via EditorPro
- Reutilizar `EditorProvider` e seus hooks (`useEditor`, `useStepHandlers`, `useBlockHandlers`)
- Evitar side-effects no render; preferir hooks com cleanup (evita loops e leaks)
- Em testes, usar os scripts segmentados para evitar OOM

---

## Referências cruzadas (CONSENSO CORRIGIDO)
- **Rota principal**: `src/pages/MainEditor.tsx` → `EditorPro` (USA MAIS CORE)
- **Editor oficial CORE**: `src/legacy/editor/EditorPro.tsx` (calculateAndSaveQuizResult)
- **CORE Services**: `src/services/core/*` (ResultOrchestrator, UnifiedQuizStorage, StorageService)
- **CORE Calculator**: `src/utils/quizResultCalculator.ts` (usado pelo EditorPro)
- **Editor alternativo**: `src/components/editor/SchemaDrivenEditorResponsive.tsx` (UI moderna)
- **CORE Hooks**: `src/hooks/useQuizResult.ts` (usado indiretamente)
- **Especializados**: `src/components/quiz-editor/*`, `src/components/result-editor/*`
- **Fallback Etapa 20**: `src/components/editor/fallback/Step20EditorFallback.tsx`
