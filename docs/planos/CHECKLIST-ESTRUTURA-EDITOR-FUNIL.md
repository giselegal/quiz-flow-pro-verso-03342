# 📋 CHECKLIST COMPLETO - Estrutura do Editor e Fluxo do Funil

## 🎯 ESTRUTURA PRINCIPAL DO /EDITOR

### 1. ROTA PRINCIPAL E INICIALIZAÇÃO

| Componente | Arquivo | Status | Integrado |
|------------|---------|--------|-----------|
| **EditorRoutes** | `/src/pages/editor/index.tsx` | ✅ | ✅ |
| ├─ useResourceIdFromLocation | `index.tsx` (linha ~33) | ✅ | ✅ |
| ├─ useEditorResource | `@/hooks/useEditorResource` | ⚠️ | ? |
| ├─ SuperUnifiedProvider | `@/contexts/providers/SuperUnifiedProvider` | ⚠️ | ? |
| ├─ EditorStartupModal | `@/components/editor/EditorStartupModal` | ✅ | ✅ |
| └─ QuizModularEditor | `@/components/editor/quiz/QuizModularEditor` | ⚠️ | ? |

**Observações:**
- ✅ Rota principal bem estruturada
- ⚠️ Precisa validar existência dos hooks e providers
- URL params: `?resource=`, `?template=`, `?funnelId=` (legacy)

---

## 2. CONTEXTOS E PROVIDERS

### 2.1 Contextos de Editor

| Context | Arquivo | Provider | Hook | Status |
|---------|---------|----------|------|--------|
| **EditorContext** | `/src/contexts/EditorContext.tsx` | ❌ Stub | `useEditorContext()` | ⚠️ Stub |
| **EditorProvider (Canonical)** | `/src/contexts/editor/EditorContext.tsx` | `EditorProvider` | `useEditor()` | ✅ |
| **EditorProviderCanonical** | `/src/components/editor/EditorProviderCanonical.tsx` | ✅ | `useEditor()` | ✅ |
| **EditorQuizProvider** | `/src/contexts/editor/EditorQuizContext` | ✅ | `useEditorQuiz()` | ⚠️ ? |
| **SuperUnifiedProvider** | `/src/contexts/providers/SuperUnifiedProvider` | ✅ | `useSuperUnified()` | ⚠️ ? |

**⚠️ ALERTA:** Múltiplos EditorContext/Provider - pode causar conflito!

### 2.2 Contextos de Funnel

| Context | Arquivo | Provider | Hook | Status |
|---------|---------|----------|------|--------|
| **FunnelContext** (enum) | `/src/core/contexts/FunnelContext.ts` | - | - | ✅ Enum |
| **FunnelsProvider** | `/src/contexts/funnel/FunnelsContext.tsx` | ✅ | `useFunnels()` | ✅ |
| **UnifiedFunnelProvider** | `/src/contexts/funnel/UnifiedFunnelContext.tsx` | ✅ | `useUnifiedFunnel()` | ⚠️ ? |
| **FunnelContext (component)** | `/src/components/editor/properties/contexts/FunnelContext.tsx` | ❓ | ❓ | ⚠️ Duplicado? |

**⚠️ ALERTA:** FunnelContext tem 3 definições diferentes!

---

## 3. COMPONENTES DO EDITOR

### 3.1 Componentes Principais

| Componente | Arquivo | Propósito | Status |
|------------|---------|-----------|--------|
| **UniversalVisualEditor** | `/src/pages/editor/UniversalVisualEditor.tsx` | Editor visual universal | ✅ |
| **QuizEditorIntegratedPage** | `/src/pages/editor/QuizEditorIntegratedPage.tsx` | Editor integrado de quiz | ✅ |
| **QuizModularEditor** | `/src/components/editor/quiz/QuizModularEditor.tsx` | Editor modular de quiz | ⚠️ ? |
| **EditorLayout** | `/src/pages/editor/components/EditorLayout.tsx` | Layout do editor | ✅ |
| **EditorPropertiesPanel** | `/src/pages/editor/components/EditorPropertiesPanel.tsx` | Painel de propriedades | ✅ |

### 3.2 Componentes de UI/Canvas

| Componente | Arquivo | Função | Status |
|------------|---------|--------|--------|
| **UniversalBlock** | `/src/components/core/UniversalBlock.tsx` | Renderização de blocos | ⚠️ ? |
| **OptimizedBlockRenderer** | `/src/components/editor/OptimizedBlockRenderer.tsx` | Renderização otimizada | ⚠️ ? |
| **UniversalBlockRenderer** | `/src/components/editor/blocks/UniversalBlockRenderer.tsx` | Renderizador universal | ⚠️ ? |
| **SelectableBlock** | `/src/components/editor/SelectableBlock.tsx` | Blocos selecionáveis | ⚠️ ? |
| **SortableBlock** | `/src/components/editor/SortableBlock.tsx` | Blocos ordenáveis | ⚠️ ? |

**⚠️ ALERTA:** Múltiplos renderizadores de blocos - qual usar?

### 3.3 Painéis e Sidebars

| Componente | Arquivo | Função | Status |
|------------|---------|--------|--------|
| **ComponentsPanel** | `/src/components/editor/ComponentsPanel.tsx` | Painel de componentes | ✅ |
| **ComponentsSidebar** | `/src/components/editor/ComponentsSidebar.tsx` | Sidebar de componentes | ✅ |
| **ComponentsSidebarSimple** | `/src/components/editor/ComponentsSidebarSimple.tsx` | Sidebar simplificada | ✅ |
| **EnhancedComponentsSidebar** | `/src/components/editor/EnhancedComponentsSidebar.tsx` | Sidebar avançada | ⚠️ ? |
| **StepsPanel** | `/src/components/editor/StepsPanel.tsx` | Painel de etapas | ⚠️ ? |
| **QuizStepsPanel** | `/src/components/editor/QuizStepsPanel.tsx` | Painel de etapas do quiz | ⚠️ ? |
| **PropertiesPanel** | `/src/components/editor/panels/*` | Painéis de propriedades | ⚠️ ? |
| **DynamicPropertiesPanel** | `/src/components/editor/panels/DynamicPropertiesPanel.tsx` | Painel dinâmico | ⚠️ ? |

**⚠️ ALERTA:** Múltiplas versões de sidebars e painéis - qual é a ativa?

---

## 4. SISTEMA DE BLOCOS

### 4.1 Blocos do Quiz

| Bloco | Arquivo | Tipo | Status |
|-------|---------|------|--------|
| **CaktoQuizIntro** | `/src/components/editor/blocks/CaktoQuizIntro.tsx` | Intro | ⚠️ ? |
| **CaktoQuizQuestion** | `/src/components/editor/blocks/CaktoQuizQuestion.tsx` | Question | ⚠️ ? |
| **CaktoQuizResult** | `/src/components/editor/blocks/CaktoQuizResult.tsx` | Result | ⚠️ ? |
| **CaktoQuizOffer** | `/src/components/editor/blocks/CaktoQuizOffer.tsx` | Offer | ⚠️ ? |
| **CaktoQuizTransition** | `/src/components/editor/blocks/CaktoQuizTransition.tsx` | Transition | ⚠️ ? |
| **QuizIntroHeaderBlock** | `/src/components/editor/blocks/QuizIntroHeaderBlock.tsx` | Header | ⚠️ ? |

### 4.2 Sistema de Propriedades de Blocos

| Componente | Arquivo | Função | Status |
|------------|---------|--------|--------|
| **BlockPropertiesIntegration** | `/src/components/editor/BlockPropertiesIntegration.tsx` | Integração de props | ⚠️ ? |
| **DynamicPropertyControls** | `/src/components/editor/DynamicPropertyControls.tsx` | Controles dinâmicos | ⚠️ ? |
| **PropertyInput** | `/src/components/editor/panels/block-properties/PropertyInput.tsx` | Input de propriedade | ⚠️ ? |
| **ValidatedPropertyPanel** | `/src/components/editor/ValidatedPropertyPanel.tsx` | Painel validado | ⚠️ ? |

---

## 5. HOOKS

### 5.1 Hooks de Editor

| Hook | Arquivo | Função | Status |
|------|---------|--------|--------|
| **useEditor** | `/src/contexts/editor/EditorContext.tsx` | Context do editor | ✅ |
| **useEditorContext** | `/src/contexts/EditorContext.tsx` | Stub context | ⚠️ Stub |
| **useEditorResource** | `/src/hooks/useEditorResource` | Gerenciar resource | ⚠️ ? |
| **useEditorQuiz** | `/src/contexts/editor/EditorQuizContext` | Quiz no editor | ⚠️ ? |
| **useEditorFieldValidation** | (referenciado) | Validação de campos | ⚠️ ? |

### 5.2 Hooks de Funnel

| Hook | Arquivo | Função | Status |
|------|---------|--------|--------|
| **useFunnels** | `/src/contexts/funnel/FunnelsContext.tsx` | Lista de funnels | ✅ |
| **useUnifiedFunnel** | `/src/contexts/funnel/UnifiedFunnelContext.tsx` | Funnel unificado | ⚠️ ? |
| **useSuperUnified** | `/src/contexts/providers/SuperUnifiedProvider` | Provider unificado | ⚠️ ? |

---

## 6. SERVIÇOS

### 6.1 Serviços de Template

| Serviço | Arquivo | Função | Status |
|---------|---------|--------|--------|
| **templateService** | `/src/services/canonical/TemplateService` | CRUD de templates | ⚠️ ? |
| **loadDefaultSchemas** | `/src/core/schema/loadDefaultSchemas` | Carregar schemas | ⚠️ ? |
| **schemaInterpreter** | `/src/core/schema/SchemaInterpreter` | Interpretar schemas | ⚠️ ? |

### 6.2 Outros Serviços

| Serviço | Arquivo | Função | Status |
|---------|---------|--------|--------|
| **useAnalytics** | `/src/hooks/useAnalytics` | Analytics | ⚠️ ? |
| **appLogger** | `/src/lib/utils/appLogger` | Logging | ✅ |
| **detectResourceType** | `/src/types/editor-resource` | Detectar tipo | ⚠️ ? |

---

## 7. COMPONENTES DE SUPORTE

### 7.1 UI Components

| Componente | Localização | Status |
|------------|-------------|--------|
| **Button** | `/src/components/ui/button` | ✅ |
| **Input** | `/src/components/ui/input` | ✅ |
| **Select** | `/src/components/ui/select` | ✅ |
| **Tabs** | `/src/components/ui/tabs` | ✅ |
| **ScrollArea** | `/src/components/ui/scroll-area` | ✅ |
| **Switch** | `/src/components/ui/switch` | ✅ |
| **Badge** | `/src/components/ui/badge` | ✅ |
| **Card** | `/src/components/ui/card` | ✅ |

### 7.2 Feedback e Estado

| Componente | Arquivo | Função | Status |
|------------|---------|--------|--------|
| **EditorLoadingWrapper** | `/src/components/editor/EditorLoadingWrapper.tsx` | Loading state | ⚠️ ? |
| **EditorFallback** | `/src/components/editor/EditorFallback.tsx` | Fallback UI | ⚠️ ? |
| **ErrorBoundary** | `/src/components/editor/ErrorBoundary.tsx` | Error handling | ⚠️ ? |
| **LoadingStates** | `/src/components/editor/LoadingStates.tsx` | Estados de loading | ⚠️ ? |
| **SaveStatusIndicator** | `/src/components/editor/SaveStatusIndicator.tsx` | Status de save | ⚠️ ? |
| **SavingIndicator** | `/src/components/editor/SavingIndicator.tsx` | Indicador de saving | ⚠️ ? |

---

## 8. FUNCIONALIDADES AVANÇADAS

### 8.1 Drag & Drop

| Componente | Arquivo | Status |
|------------|---------|--------|
| **DragDropManager** | `/src/components/editor/DragDropManager.tsx` | ⚠️ ? |
| **SortableBlock** | `/src/components/editor/SortableBlock.tsx` | ⚠️ ? |

### 8.2 Colaboração e Versionamento

| Componente | Arquivo | Status |
|------------|---------|--------|
| **CollaborationStatus** | `/src/components/editor/CollaborationStatus.tsx` | ⚠️ ? |
| **UndoRedoToolbar** | `/src/components/editor/UndoRedoToolbar.tsx` | ⚠️ ? |

### 8.3 Performance e Otimização

| Componente | Arquivo | Status |
|------------|---------|--------|
| **VirtualScrolling** | `/src/components/editor/VirtualScrolling.tsx` | ⚠️ ? |
| **PerformanceMetrics** | `/src/components/editor/PerformanceMetrics.tsx` | ⚠️ ? |
| **OptimizedPropertiesPanel** | `/src/components/editor/OptimizedPropertiesPanel.tsx` | ⚠️ ? |

### 8.4 Templates e Import/Export

| Componente | Arquivo | Status |
|------------|---------|--------|
| **TemplateLibrary** | `/src/components/editor/TemplateLibrary.new.tsx` | ⚠️ ? |
| **ImportTemplateButton** | `/src/components/editor/ImportTemplateButton.tsx` | ⚠️ ? |
| **ExportTemplateButton** | `/src/components/editor/ExportTemplateButton.tsx` | ⚠️ ? |
| **SaveTemplateModal** | `/src/components/editor/SaveTemplateModal.tsx` | ⚠️ ? |

---

## 9. FUNCIONALIDADES DE FUNNEL

### 9.1 Gerenciamento de Funnel

| Componente | Arquivo | Status |
|------------|---------|--------|
| **FunnelManager** | `/src/components/editor/FunnelManager.tsx` | ⚠️ ? |
| **FunnelHeader** | `/src/components/editor/FunnelHeader.tsx` | ⚠️ ? |
| **FunnelSettingsModal** | `/src/components/editor/FunnelSettingsModal.tsx` | ⚠️ ? |
| **FunnelTypeDetector** | `/src/components/editor/FunnelTypeDetector.tsx` | ⚠️ ? |
| **FunnelConfigProvider** | `/src/components/funnel-blocks/editor/FunnelConfigProvider.tsx` | ⚠️ ? |
| **SaveAsFunnelButton** | `/src/components/editor/SaveAsFunnelButton.tsx` | ⚠️ ? |

---

## 10. DEBUG E DIAGNÓSTICO

| Componente | Arquivo | Status |
|------------|---------|--------|
| **EditorDiagnostics** | `/src/components/editor/EditorDiagnostics.tsx` | ⚠️ ? |
| **EditorTelemetryPanel** | `/src/components/editor/EditorTelemetryPanel.tsx` | ⚠️ ? |
| **ModularBlocksDebugPanel** | `/src/components/editor/debug/ModularBlocksDebugPanel.tsx` | ⚠️ ? |
| **EditorBootstrapProgress** | `/src/components/editor/EditorBootstrapProgress.tsx` | ⚠️ ? |

---

## 📊 RESUMO DO STATUS

### Estatísticas:
- ✅ **Validados:** 15 componentes
- ⚠️ **Precisa validar:** 75+ componentes
- ❌ **Com problemas:** 3 (contextos duplicados)

### Problemas Identificados:

#### 🔴 CRÍTICOS:
1. **Múltiplos EditorContext** - Conflito entre:
   - `/src/contexts/EditorContext.tsx` (stub)
   - `/src/contexts/editor/EditorContext.tsx` (canonical)
   - `/src/components/editor/EditorProviderCanonical.tsx`

2. **Múltiplos FunnelContext** - Conflito entre:
   - `/src/core/contexts/FunnelContext.ts` (enum)
   - `/src/contexts/funnel/UnifiedFunnelContext.tsx` (provider)
   - `/src/components/editor/properties/contexts/FunnelContext.tsx` (duplicado?)

3. **Múltiplos renderizadores de blocos**:
   - UniversalBlock
   - OptimizedBlockRenderer
   - UniversalBlockRenderer

#### 🟡 ATENÇÃO:
1. Múltiplas sidebars (ComponentsSidebar, Simple, Enhanced)
2. Múltiplos painéis de propriedades
3. Hooks não validados (useEditorResource, etc)
4. Serviços não validados (templateService, etc)

---

## 🔍 PRÓXIMA ETAPA: INVESTIGAÇÃO

Agora vou investigar cada componente crítico para verificar:
1. Se existe
2. Se está implementado
3. Se está integrado corretamente
4. Se há conflitos
5. Recomendações de correção

---

**Status deste checklist:** 📝 COMPLETO - Pronto para investigação
**Data:** 10 de Novembro de 2025
**Próximo passo:** Investigação detalhada de cada componente
