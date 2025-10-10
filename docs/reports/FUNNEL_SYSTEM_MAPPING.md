# 🏗️ MAPEAMENTO COMPLETO: SISTEMA DE FUNIS

## 📊 ESTRUTURA ATUAL DOS FUNIS

### 1. **CORE SERVICES** (`src/services/core/`)

#### 1.1 Serviços Fundamentais
- ✅ `FlowCore.ts` - Núcleo do fluxo de quiz
- ✅ `ResultEngine.ts` - Motor de cálculo de resultados  
- ✅ `ResultOrchestrator.ts` - Orquestrador de resultados
- ✅ `CanonicalScorer.ts` - Sistema de pontuação canônica
- ✅ `QuizAnalyticsService.ts` - Analytics de quiz
- ✅ `QuizDataService.ts` - Serviço de dados do quiz
- ✅ `StorageService.ts` - Serviço de armazenamento
- ✅ `UnifiedQuizStorage.ts` - Armazenamento unificado

#### 1.2 Adaptadores
- ✅ `adapters/optimizedAdapter.ts` - Adaptador otimizado

### 2. **FUNNEL SERVICES** (`src/services/`)

#### 2.1 Serviços Específicos de Funil
- ✅ `funnelTemplateService.ts` - Gestão de templates de funil
- ✅ `funnelComponentsService.ts` - Componentes de funil
- ✅ `funnelPublishing.ts` - Publicação de funis
- ✅ `funnelLocalStore.ts` - Armazenamento local de funis
- ✅ `supabaseFunnelService.ts` - Integração Supabase para funis

#### 2.2 Serviços de Suporte
- ✅ `stepTemplateService.ts` - Templates de etapas
- ✅ `templateService.ts` - Serviços gerais de template
- ❌ `schemaDrivenFunnelService.ts` - **FALTANDO IMPLEMENTAÇÃO**

### 3. **HOOKS CORE** (`src/hooks/core/`)

#### 3.1 Hooks Fundamentais
- ✅ `useQuizFlow.ts` - Hook principal do fluxo de quiz
- ✅ `useNavigation.tsx` - Navegação entre etapas
- ✅ `useCalculations.tsx` - Cálculos de quiz
- ✅ `useStorage.tsx` - Armazenamento
- ✅ `useUnifiedEditor.ts` - Editor unificado

#### 3.2 Hooks de Funil
- ✅ `src/core/funnel/hooks/useFunnel.ts` - **IMPLEMENTADO**
- ✅ `src/core/funnel/hooks/useFunnelTemplates.ts` - **IMPLEMENTADO**
- ✅ `src/core/funnel/hooks/useFunnelState.ts` - **IMPLEMENTADO**

### 4. **TEMPLATES DE FUNIL** (`src/templates/`)

#### 4.1 Templates Base
- ✅ `quiz21StepsComplete.ts` - Template completo 21 etapas
- ✅ `models/funnel-21-steps.ts` - Modelo de funil 21 etapas
- ✅ `models/optimized-funnel-21-steps.ts` - Modelo otimizado
- ✅ `models/funnel-21-steps.json` - Configuração JSON

#### 4.2 Dados de Configuração
- ✅ `src/data/funnelStages.ts` - Estágios de funil
- ✅ `src/data/funnelTemplates.ts` - Templates de funil
- ✅ `src/config/funnelSteps.ts` - Configuração de etapas

### 5. **COMPONENTES DE FUNIL**

#### 5.1 Editor Components
- ✅ `src/components/editor/EditorProvider.tsx` - Provider principal
- ❌ `src/components/editor/panels/FunnelManagementPanel.tsx` - **FALTANDO**
- ❌ `src/components/editor/blocks/UnifiedFunnelBlock.tsx` - **FALTANDO**

#### 5.2 Dashboard Components
- ✅ `src/components/enhanced-editor/dashboard/FunnelTemplatesDashboard.tsx`
- ✅ `src/pages/admin/MyFunnelsPage.tsx`
- ✅ `src/pages/admin/FunnelPanelPage.tsx`
- ✅ `src/pages/admin/FunnelSettingsPage.tsx`

### 6. **UTILITIES E HELPERS**

#### 6.1 Utilitários de Funil
- ✅ `src/utils/templateToFunnelCreator.ts` - Criador de funis a partir de templates
- ✅ `src/utils/TemplateManager.ts` - Gerenciador de templates
- ❌ `src/utils/FunnelManager.ts` - **FALTANDO**
- ❌ `src/utils/funnelHelpers.ts` - **FALTANDO**

#### 6.2 Mapeadores
- ✅ `src/utils/supabaseMapper.ts` - Mapeamento Supabase
- ✅ `src/utils/supabaseMapperFixed.ts` - Mapeamento corrigido

### 7. **DATABASE STRUCTURE** (`supabase/migrations/`)

#### 7.1 Tabelas de Funil
- ✅ `001_create_funnel_tables.sql` - Criação de tabelas
- ✅ `004_funnel_system.sql` - Sistema de funil
- ✅ `20250817041000_create_funnel_templates_system.sql` - Sistema de templates
- ✅ `20250817042000_fix_component_instances_funnel_id.sql` - Correção de IDs

### 8. **PROBLEMAS IDENTIFICADOS**

#### 8.1 Estrutura Core Incompleta
- ❌ Falta um `FunnelCore.ts` centralizador
- ❌ Falta separação clara entre Quiz e Funnel
- ❌ Hooks específicos de funil não existem
- ❌ Gerenciador centralizado de funil ausente

#### 8.2 Serviços Dispersos
- ❌ Código de funil espalhado em múltiplos diretórios
- ❌ Falta padronização de interfaces
- ❌ Dependências circulares entre serviços
- ❌ Falta documentação de fluxos

---

## 🔧 REESTRUTURAÇÃO PROPOSTA

### FASE 1: CORE UNIFICADO
```
src/core/
├── funnel/
│   ├── FunnelCore.ts           # Núcleo central
│   ├── FunnelEngine.ts         # Motor de funil
│   ├── FunnelOrchestrator.ts   # Orquestrador
│   └── types.ts                # Tipos centralizados
├── quiz/
│   ├── QuizCore.ts             # Núcleo de quiz
│   ├── QuizEngine.ts           # Motor de quiz
│   └── types.ts                # Tipos de quiz
└── shared/
    ├── Storage.ts              # Armazenamento compartilhado
    ├── Analytics.ts            # Analytics compartilhado
    └── types.ts                # Tipos compartilhados
```

### FASE 2: SERVIÇOS ORGANIZADOS
```
src/services/
├── funnel/
│   ├── FunnelService.ts        # Serviço principal
│   ├── TemplateService.ts      # Templates
│   ├── PublishingService.ts    # Publicação
│   └── StorageService.ts       # Armazenamento
└── quiz/
    ├── QuizService.ts          # Serviço principal
    ├── ResultService.ts        # Resultados
    └── FlowService.ts          # Fluxo
```

### FASE 3: HOOKS ESPECIALIZADOS
```
src/hooks/
├── funnel/
│   ├── useFunnel.ts            # Hook principal
│   ├── useFunnelTemplates.ts   # Templates
│   ├── useFunnelState.ts       # Estado
│   └── useFunnelFlow.ts        # Fluxo
└── quiz/
    ├── useQuiz.ts              # Hook principal
    ├── useQuizFlow.ts          # Fluxo existente
    └── useQuizResults.ts       # Resultados
```

---

## 📋 STATUS ATUAL - FASE 1 COMPLETADA ✅

### ✅ **IMPLEMENTADO:**

**CORE ARCHITECTURE COMPLETA:**
- ✅ `src/core/funnel/types.ts` - Sistema completo de tipos
- ✅ `src/core/funnel/FunnelCore.ts` - Núcleo central (navegação, validação, eventos)
- ✅ `src/core/funnel/FunnelEngine.ts` - Engine de processamento
- ✅ `src/core/funnel/hooks/` - Sistema completo de hooks:
  - ✅ `useFunnel.ts` - Hook principal
  - ✅ `useFunnelState.ts` - Estado, persistência, analytics
  - ✅ `useFunnelTemplates.ts` - Templates e criação
- ✅ `src/core/funnel/index.ts` - Exportações organizadas

**FEATURES IMPLEMENTADAS:**
- ✅ Separação completa de tipos quiz/funnel
- ✅ Navegação inteligente com condições
- ✅ Sistema de eventos centralizado
- ✅ Validação automática de componentes
- ✅ Engine de ações e lifecycle
- ✅ Persistência automática
- ✅ Histórico (undo/redo)
- ✅ Analytics de performance
- ✅ Comparação de estados

### 🟡 **PRÓXIMOS PASSOS - FASE 2:**

1. **Migração de Serviços** - Adaptar serviços existentes
2. **Integração de Componentes** - Conectar UI com nova arquitetura
3. **Testes de Regressão** - Garantir compatibilidade
4. **Refatoração Gradual** - Substituir código legado
