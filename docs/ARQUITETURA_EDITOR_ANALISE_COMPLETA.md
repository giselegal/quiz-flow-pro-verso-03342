# 🏗️ ARQUITETURA DO EDITOR - ANÁLISE COMPLETA E PLANO DE REFATORAÇÃO

> **Status:** Documentação consolidada - Outubro 2025  
> **Objetivo:** Mapear arquitetura atual vs ideal e definir roadmap de implementação

---

## 📊 RESUMO EXECUTIVO

### **Situação Atual**
- ✅ **Editor funcional** rodando em `/editor`
- ⚠️ **Provider Hell** com 4 camadas aninhadas causando overhead
- ⚠️ **Componente monolítico** com 2423 linhas e 27 `useState` locais
- ⚠️ **Service Hell** com 77 serviços (37 deprecated, 28 duplicados)
- ⚠️ **Bundle size** de ~4.2MB

### **Objetivos da Refatoração**
1. **Consolidar providers** de 4 → 1 (`MasterEditorProvider`)
2. **Refatorar componente principal** de 2423 → ~400 linhas
3. **Arquivar services deprecated** reduzindo de 77 → 12 serviços
4. **Otimizar bundle** de 4.2MB → ~2.8MB (-33%)
5. **Unificar dashboards** eliminando duplicações de rotas e dados mockados

---

## 🔍 ANÁLISE DA ARQUITETURA ATUAL

### **1. PROVIDER HELL (Critical)**

#### **Stack Atual:**
```typescript
// src/App.tsx - Rota /editor (linhas 182-206)
<ConsolidatedProvider context={FunnelContext.EDITOR}>
  └─ SuperUnifiedProvider
      └─ UnifiedCRUDProvider
          └─ EditorProviderUnified (NÃO USADO!)
              └─ QuizModularProductionEditor
```

#### **Problemas Identificados:**
| Problema | Impacto | Severidade |
|----------|---------|------------|
| **4 camadas de providers aninhados** | +300% re-renders desnecessários | 🔴 Critical |
| **EditorProviderUnified órfão** | Código morto no bundle | 🟡 Medium |
| **Estado fragmentado** | Inconsistências entre providers | 🔴 Critical |
| **Múltiplos caches** | IndexedDB + localStorage duplicados | 🟡 Medium |

#### **Medições:**
- **Providers ativos:** 4 (SuperUnifiedProvider, UnifiedCRUDProvider, ConsolidatedProvider, ThemeProvider)
- **EditorProviderUnified:** Implementado mas não usado
- **Re-renders por ação:** ~3-4 (excesso de 2-3)

---

### **2. COMPONENTE MONOLÍTICO (Critical)**

#### **QuizModularProductionEditor.tsx:**
```
Linhas: 2423
useState: 27
useEffect: 18+
Custom hooks: 12+
```

#### **27 Estados Locais (deveria estar em EditorProviderUnified):**
```typescript
// src/components/editor/quiz/QuizModularProductionEditor.tsx
const [stepBlocks, setStepBlocks] = useState<Record<string, EditorBlock[]>>({});
const [currentStep, setCurrentStep] = useState(1);
const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
const [showComponentLibrary, setShowComponentLibrary] = useState(false);
const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);
const [isPreviewMode, setIsPreviewMode] = useState(false);
const [isSaving, setIsSaving] = useState(false);
const [lastSaved, setLastSaved] = useState<Date | null>(null);
// ... +19 estados adicionais
```

#### **Impacto:**
- ❌ **EditorProviderUnified completamente ignorado**
- ❌ **Estado duplicado** entre componente e providers
- ❌ **Difícil testabilidade** (componente gigante)
- ❌ **Impossível lazy loading** de features

---

### **3. SERVICE HELL (High)**

#### **Situação dos 77 Serviços:**
```
src/services/
├── ✅ ATIVOS (12 serviços) - 15%
│   ├── core/EnhancedUnifiedDataService.ts
│   ├── core/RealDataAnalyticsService.ts
│   ├── core/ConsolidatedFunnelService.ts
│   └── ...
│
├── ⚠️ DEPRECATED (37 serviços) - 48%
│   ├── FunnelService.ts
│   ├── funnelApiClient.ts
│   ├── editorService.ts
│   ├── funnelLocalStore.ts
│   └── ... (+33 arquivos)
│
└── 🔄 DUPLICADOS (28 serviços) - 36%
    ├── funnelUnifiedService.ts (vs FunnelUnifiedService.ts)
    ├── templateService.ts (vs UnifiedTemplateService.ts)
    └── ... (+26 arquivos)
```

#### **Impacto no Bundle:**
- **Services deprecated:** ~1.2MB (estimado)
- **Services duplicados:** ~400KB (estimado)
- **Total removível:** ~1.6MB (-38% do bundle)

---

### **4. ROTAS E DASHBOARDS DUPLICADOS (High)**

#### **Duplicações Identificadas:**

**Dashboards Principais:**
```
❌ /admin → ModernAdminDashboard.tsx (canônico)
❌ /dashboard → ModernDashboardPage.tsx (DUPLICADO)
❌ /admin → DashboardPage.tsx (DEPRECATED)
```

**Analytics:**
```
✅ /admin/analytics → EnhancedRealTimeDashboard (447 linhas) - DADOS REAIS
❌ /dashboard/analytics → RealTimeDashboard.tsx (524 linhas) - VERSÃO ANTIGA
❌ /dashboard/real-time → AnalyticsDashboard.tsx - DADOS MOCKADOS
❌ /dashboard/analytics-advanced → AdvancedAnalytics.tsx - DUPLICADO
```

**Overview Pages:**
```
✅ /admin → ConsolidatedOverviewPage.tsx (520 linhas) - DADOS REAIS SUPABASE
❌ /dashboard → OverviewPage.tsx (315 linhas) - DADOS MOCKADOS
❌ /admin → OverviewPageFixed.tsx - DUPLICATA
```

**Participantes:**
```
✅ /admin/participants → admin/ParticipantsPage.tsx
❌ /dashboard/participants → dashboard/ParticipantsPage.tsx (wrapper duplicado)
```

#### **Páginas com Dados Mockados:**
1. `Phase2Dashboard.tsx` → Métricas hardcoded
2. `OverviewPage.tsx` → totalParticipants: 1248 (fake)
3. `AnalyticsDashboard.tsx` → Fallback para mock data
4. Múltiplas páginas usando dados fictícios

---

## 🎯 ARQUITETURA IDEAL PROPOSTA

### **1. PROVIDER ÚNICO - MasterEditorProvider**

```typescript
// src/providers/MasterEditorProvider.tsx (NOVO)
interface MasterEditorContextType {
  // Estado Consolidado (5 providers → 1)
  funnels: {
    list: UnifiedFunnelData[];
    current: UnifiedFunnelData | null;
    isLoading: boolean;
  };
  
  editor: {
    stepBlocks: Record<string, EditorBlock[]>;
    currentStep: number;
    selectedBlockId: string | null;
    history: EditorHistory;
    // ... todos os 27 useState consolidados
  };
  
  ui: {
    showComponentLibrary: boolean;
    showPropertiesPanel: boolean;
    isPreviewMode: boolean;
    // ... estados de UI
  };
  
  // Ações Consolidadas
  actions: {
    // CRUD
    createFunnel: (name: string) => Promise<UnifiedFunnelData>;
    saveFunnel: (funnel: UnifiedFunnelData) => Promise<void>;
    deleteFunnel: (id: string) => Promise<void>;
    
    // Editor
    addBlock: (stepId: string, block: EditorBlock) => void;
    updateBlock: (blockId: string, updates: Partial<EditorBlock>) => void;
    deleteBlock: (blockId: string) => void;
    reorderBlocks: (stepId: string, blocks: EditorBlock[]) => void;
    
    // Navegação
    setCurrentStep: (step: number) => void;
    selectBlock: (blockId: string | null) => void;
    
    // Histórico
    undo: () => void;
    redo: () => void;
    
    // UI
    toggleComponentLibrary: () => void;
    togglePropertiesPanel: () => void;
    togglePreviewMode: () => void;
  };
  
  // Cache Unificado
  cache: {
    invalidate: (key: string) => void;
    clear: () => void;
  };
}

// Hook Único
export const useMasterEditor = () => useContext(MasterEditorContext);
```

#### **Vantagens:**
- ✅ **Providers:** 4 → 1 (-75%)
- ✅ **Re-renders:** -60%
- ✅ **Cache unificado:** IndexedDB como single source of truth
- ✅ **API consistente:** 1 hook para tudo
- ✅ **Histórico automático:** Undo/Redo nativo

---

### **2. COMPONENTE REFATORADO - QuizModularEditor.tsx**

```typescript
// src/components/editor/quiz/QuizModularEditor.tsx (REFATORADO)
const QuizModularEditor: React.FC = () => {
  // ✅ ESTADO CENTRALIZADO (0 useState locais!)
  const { editor, ui, actions } = useMasterEditor();
  
  // ✅ DERIVAÇÕES LOCAIS APENAS
  const currentStepBlocks = editor.stepBlocks[`step-${editor.currentStep}`] || [];
  const selectedBlock = currentStepBlocks.find(b => b.id === editor.selectedBlockId);
  
  return (
    <EditorLayout>
      <StepNavigator 
        currentStep={editor.currentStep}
        onStepChange={actions.setCurrentStep}
      />
      
      <CanvasArea
        blocks={currentStepBlocks}
        selectedBlockId={editor.selectedBlockId}
        onBlockClick={actions.selectBlock}
        onBlockUpdate={actions.updateBlock}
        onBlocksReorder={(blocks) => actions.reorderBlocks(`step-${editor.currentStep}`, blocks)}
      />
      
      {ui.showComponentLibrary && (
        <ComponentLibraryPanel onAddBlock={actions.addBlock} />
      )}
      
      {ui.showPropertiesPanel && selectedBlock && (
        <PropertiesPanel 
          block={selectedBlock}
          onUpdate={actions.updateBlock}
        />
      )}
    </EditorLayout>
  );
};
```

#### **Vantagens:**
- ✅ **Linhas:** 2423 → ~400 (-83%)
- ✅ **useState:** 27 → 0 (-100%)
- ✅ **Componentes reutilizáveis:** Extraídos e isolados
- ✅ **Testável:** Cada componente testável isoladamente

---

### **3. SERVICES CONSOLIDADOS**

#### **Estrutura Final:**
```
src/services/
├── core/ (12 serviços ativos) ✅
│   ├── EnhancedUnifiedDataService.ts      # Analytics + Metrics
│   ├── RealDataAnalyticsService.ts        # Analytics reais Supabase
│   ├── ConsolidatedFunnelService.ts       # CRUD Funnels
│   ├── UnifiedTemplateService.ts          # Templates
│   ├── IndexedDBService.ts                # Cache local
│   ├── UnifiedStorageService.ts           # Storage
│   ├── EditorDashboardSyncService.ts      # Sincronização
│   ├── FunnelUnifiedService.ts            # Funil unified
│   ├── unifiedQuizFunctions.ts            # Quiz logic
│   ├── analyticsService.ts                # Analytics
│   ├── validationService.ts               # Validação
│   └── cacheService.ts                    # Cache management
│
└── archived/ (65 serviços) 🗄️
    └── v1-deprecated/
        ├── FunnelService.ts
        ├── funnelApiClient.ts
        └── ... (+63 arquivos)
```

#### **Vantagens:**
- ✅ **Services:** 77 → 12 (-84%)
- ✅ **Bundle:** 4.2MB → ~2.8MB (-33%)
- ✅ **Imports claros:** Sem ambiguidade
- ✅ **Manutenção:** 12 arquivos vs 77

---

### **4. ROTAS CONSOLIDADAS**

#### **Estrutura Final:**
```typescript
// src/App.tsx - Rotas Consolidadas

// ✅ ADMIN ÚNICO (canônico)
<Route path="/admin">
  <ModernAdminDashboard>
    <Route path="/" element={<ConsolidatedOverviewPage />} />
    <Route path="/analytics" element={<EnhancedRealTimeDashboard />} />
    <Route path="/participants" element={<ParticipantsPage />} />
    <Route path="/funnels" element={<MeusFunisPageReal />} />
    <Route path="/templates" element={<TemplatesPage />} />
    <Route path="/settings" element={<SettingsPage />} />
  </ModernAdminDashboard>
</Route>

// ✅ PHASE 2 ENTERPRISE (separado)
<Route path="/phase2" element={<Phase2Dashboard />} />

// ✅ REDIRECTS (compatibilidade)
<Route path="/dashboard" element={<Navigate to="/admin" replace />} />
<Route path="/dashboard/*" element={<Navigate to="/admin" replace />} />
```

#### **Páginas Removidas:**
```
🗑️ ModernDashboardPage.tsx
🗑️ admin/DashboardPage.tsx (DEPRECATED)
🗑️ dashboard/OverviewPage.tsx (dados mockados)
🗑️ dashboard/OverviewPageFixed.tsx
🗑️ components/dashboard/RealTimeDashboard.tsx
🗑️ components/dashboard/AnalyticsDashboard.tsx
🗑️ components/dashboard/AdvancedAnalytics.tsx
```

---

## 🚀 PLANO DE IMPLEMENTAÇÃO (4 FASES)

### **FASE 1: CONSOLIDAR PROVIDERS (Prioridade CRÍTICA - 4h)**

#### **1.1 Criar MasterEditorProvider (2h)**
```bash
# Criar arquivo
touch src/providers/MasterEditorProvider.tsx

# Implementar:
- Consolidar SuperUnifiedProvider + UnifiedCRUDProvider + EditorProviderUnified
- Estado unificado: { funnels, editor, ui, cache }
- Hook único: useMasterEditor()
- Bridges de compatibilidade para hooks existentes
```

**Arquivos afetados:**
- `src/providers/MasterEditorProvider.tsx` (NOVO)
- `src/hooks/useMasterEditor.ts` (NOVO)

#### **1.2 Atualizar App.tsx (30min)**
```typescript
// ANTES:
<ConsolidatedProvider>
  <QuizModularProductionEditor />
</ConsolidatedProvider>

// DEPOIS:
<MasterEditorProvider>
  <QuizModularProductionEditor />
</MasterEditorProvider>
```

**Arquivos afetados:**
- `src/App.tsx`

#### **1.3 Testes de Regressão (1h30)**
- ✅ Editor abre sem erros
- ✅ CRUD completo funcional
- ✅ Drag & Drop funcional
- ✅ Auto-save funcional

**Resultado Esperado:**
- ✅ Providers: 4 → 1 (-75%)
- ✅ Re-renders: -60%
- ✅ Estado unificado

---

### **FASE 2: REFATORAR COMPONENTE PRINCIPAL (Prioridade ALTA - 6h)**

#### **2.1 Extrair EditorStateManager (2h)**
```bash
# Criar state manager
touch src/components/editor/state/EditorStateManager.ts

# Implementar:
- Hook useEditorState() que usa useMasterEditor()
- Migrar 27 useState para provider
- Derivações locais apenas
```

**Arquivos afetados:**
- `src/components/editor/state/EditorStateManager.ts` (NOVO)
- `src/hooks/useEditorState.ts` (NOVO)

#### **2.2 Modularizar Componente (3h)**
```bash
# Componente principal vira orquestrador
# Integrar componentes já existentes:
- <StepNavigator /> ✅
- <ComponentLibraryPanel /> ✅
- <CanvasArea /> ✅
- <PropertiesPanel /> ✅
```

**Refatoração:**
```typescript
// QuizModularProductionEditor.tsx
// ANTES: 2423 linhas, 27 useState
// DEPOIS: ~400 linhas, 0 useState, apenas composição
```

**Arquivos afetados:**
- `src/components/editor/quiz/QuizModularProductionEditor.tsx`

#### **2.3 Testes Unitários (1h)**
- Testar cada componente isolado
- Testar integração via MasterEditorProvider
- Coverage > 70%

**Resultado Esperado:**
- ✅ Componente: 2423 → ~400 linhas (-83%)
- ✅ useState: 27 → 0 (-100%)
- ✅ Componentes reutilizáveis
- ✅ Testes isolados

---

### **FASE 3: ARQUIVAR SERVICES DEPRECATED (Prioridade MÉDIA - 3h)**

#### **3.1 Criar Diretório Archived (15min)**
```bash
mkdir -p src/services/archived/v1-deprecated

# Mover 37 serviços deprecated
mv src/services/FunnelService.ts src/services/archived/v1-deprecated/
mv src/services/funnelApiClient.ts src/services/archived/v1-deprecated/
# ... +35 arquivos
```

#### **3.2 Atualizar Imports (2h)**
```bash
# Buscar todos os imports de services deprecated
grep -r "from '@/services/FunnelService'" src/

# Substituir por services consolidados
# Adicionar @deprecated comments
```

#### **3.3 Validar Bundle (45min)**
```bash
npm run build

# Verificar:
- Bundle size ≤ 3.0MB (vs 4.2MB)
- Zero imports de /archived/
- Build sem warnings
```

**Resultado Esperado:**
- ✅ Services: 77 → 12 (-84%)
- ✅ Bundle: 4.2MB → ~2.8MB (-33%)
- ✅ Imports claros

---

### **FASE 4: CONSOLIDAR DASHBOARDS E DADOS REAIS (Prioridade ALTA - 6h)**

#### **4.1 Consolidar Rotas (2h)**
```typescript
// App.tsx - Rotas finais
<Route path="/admin" element={<ModernAdminDashboard />}>
  <Route index element={<ConsolidatedOverviewPage />} />
  <Route path="analytics" element={<EnhancedRealTimeDashboard />} />
  <Route path="participants" element={<ParticipantsPage />} />
  <Route path="funnels" element={<MeusFunisPageReal />} />
</Route>

// Redirects
<Route path="/dashboard/*" element={<Navigate to="/admin" replace />} />
```

**Arquivos deletados:**
- `src/pages/ModernDashboardPage.tsx`
- `src/pages/admin/DashboardPage.tsx`
- `src/pages/dashboard/OverviewPage.tsx`
- `src/components/dashboard/RealTimeDashboard.tsx`
- `src/components/dashboard/AnalyticsDashboard.tsx`

#### **4.2 Implementar Dados Reais Supabase (3h)**
```typescript
// RealDataAnalyticsService.ts
export const getPhase2Metrics = async () => {
  const { data: sessions } = await supabase
    .from('quiz_sessions')
    .select('*')
    .eq('status', 'completed');
    
  const { data: leads } = await supabase
    .from('quiz_users')
    .select('*')
    .not('email', 'is', null);
  
  return {
    totalSessions: sessions?.length || 0,
    totalLeads: leads?.length || 0,
    conversionRate: calculateConversion(sessions, leads),
  };
};
```

**Queries Supabase Necessárias:**
```sql
-- Dashboard Overview
SELECT 
  COUNT(DISTINCT f.id) as total_funnels,
  COUNT(DISTINCT qs.id) as total_sessions,
  AVG(CASE WHEN qs.status = 'completed' THEN 100.0 ELSE 0 END) as avg_conversion
FROM funnels f
LEFT JOIN quiz_sessions qs ON qs.funnel_id = f.id
WHERE f.user_id = auth.uid();

-- Real-time Metrics
SELECT 
  COUNT(*) FILTER (WHERE started_at > NOW() - INTERVAL '5 minutes') as active_now
FROM quiz_sessions
WHERE funnel_id = $1;

-- Lead Generation
SELECT COUNT(DISTINCT qu.id) as total_leads
FROM quiz_users qu
JOIN quiz_sessions qs ON qs.quiz_user_id = qu.id
WHERE qs.status = 'completed';
```

#### **4.3 Documentação (1h)**
```markdown
# MIGRATION_GUIDE.md

## Rotas Atualizadas
- `/dashboard/*` → Redirect para `/admin/*`
- `/admin` → ModernAdminDashboard (único)

## Components Removidos
- RealTimeDashboard.tsx → usar EnhancedRealTimeDashboard
- OverviewPage.tsx → usar ConsolidatedOverviewPage

## Dados Reais
- Phase2Dashboard → agora usa RealDataAnalyticsService
- ConsolidatedOverviewPage → 100% dados Supabase
```

**Resultado Esperado:**
- ✅ Rotas: `/admin/*` único
- ✅ Dados: 100% reais do Supabase
- ✅ Páginas mockadas: 0

---

## 📊 COMPARAÇÃO: ANTES vs DEPOIS

### **Métricas Técnicas:**
| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **Providers aninhados** | 4 níveis | 1 nível | -75% |
| **useState em QuizModular** | 27 | 0 | -100% |
| **Linhas QuizModular** | 2423 | ~400 | -83% |
| **Services ativos** | 77 | 12 | -84% |
| **Bundle size** | 4.2MB | ~2.8MB | -33% |
| **Re-renders por ação** | 3-4 | 1-2 | -60% |
| **Rotas duplicadas** | 24+ | 1 (`/admin`) | -96% |
| **Páginas mockadas** | 12 | 0 | -100% |

### **Métricas de Performance:**
| Métrica | Antes | Meta | Melhoria |
|---------|-------|------|----------|
| **Time to Interactive** | ~2.0s | ≤1.2s | -40% |
| **First Contentful Paint** | ~1.5s | ≤0.9s | -40% |
| **Bundle inicial** | 4.2MB | ≤3.0MB | -29% |
| **Memory usage** | ~85MB | ≤60MB | -29% |

---

## ✅ CRITÉRIOS DE SUCESSO

### **Técnicos:**
- [ ] Bundle size ≤ 3.0MB
- [ ] Providers aninhados = 1
- [ ] Componente principal ≤ 500 linhas
- [ ] Services ativos ≤ 15
- [ ] Time to Interactive ≤ 1.2s
- [ ] Zero imports de `/archived/`
- [ ] Zero dados mockados

### **Funcionais:**
- [ ] Editor abre sem erros
- [ ] CRUD completo funcional
- [ ] Drag & Drop sem regressões
- [ ] Undo/Redo funcional
- [ ] Auto-save (3s debounce) funcional
- [ ] Preview idêntico à produção
- [ ] Dashboards 100% dados reais Supabase

### **Qualidade:**
- [ ] Zero warnings no console
- [ ] Cobertura de testes ≥ 70%
- [ ] Documentação atualizada
- [ ] Migration guide criado

---

## ⚠️ RISCOS E MITIGAÇÕES

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Quebra de funcionalidade existente** | Médio | Crítico | Testes E2E antes/depois + Feature flags |
| **Performance regression** | Baixo | Alto | Benchmarks contínuos + Rollback automático |
| **Estado inconsistente durante migração** | Médio | Alto | Migração em fases + Bridges de compatibilidade |
| **Bundle temporário maior** | Alto | Médio | Lazy loading agressivo + Code splitting |
| **Queries Supabase lentas** | Médio | Médio | Indexes otimizados + Caching |
| **Users perdidos após redirects** | Baixo | Médio | Mensagem informativa + Analytics tracking |

---

## 📋 CHECKLIST PRÉ-DEPLOY

### **FASE 1 - Providers:**
- [ ] MasterEditorProvider criado e testado
- [ ] App.tsx atualizado
- [ ] Testes E2E passando
- [ ] Zero re-renders extras

### **FASE 2 - Componente:**
- [ ] EditorStateManager implementado
- [ ] QuizModularProductionEditor refatorado
- [ ] Componentes modularizados
- [ ] Coverage ≥ 70%

### **FASE 3 - Services:**
- [ ] 37 services movidos para `/archived/`
- [ ] Imports atualizados
- [ ] Bundle ≤ 3.0MB
- [ ] Build sem warnings

### **FASE 4 - Dashboards:**
- [ ] Rotas consolidadas em `/admin`
- [ ] Redirects `/dashboard/*` funcionais
- [ ] Dados 100% do Supabase
- [ ] Migration guide criado

---

## 🎯 CRONOGRAMA PROPOSTO

### **Sprint 1 (1 semana):**
- **Dia 1-2:** FASE 1 - Consolidar Providers (4h)
- **Dia 3-5:** FASE 2 - Refatorar Componente (6h)

### **Sprint 2 (1 semana):**
- **Dia 1-2:** FASE 3 - Arquivar Services (3h)
- **Dia 3-5:** FASE 4 - Dashboards e Dados Reais (6h)

### **Sprint 3 (3 dias):**
- **Dia 1:** Testes finais e ajustes
- **Dia 2:** Documentação e migration guide
- **Dia 3:** Deploy gradual com feature flags

**Total estimado:** 19h de desenvolvimento + 5h de testes/docs = **24h**

---

## 📚 REFERÊNCIAS

### **Documentos Relacionados:**
- `EDITOR_MIGRATION.md` - Histórico de migrações
- `TODAS_AS_FASES_COMPLETADAS.md` - Fases 1-2 já implementadas
- `RELATORIO_CONSOLIDADO_EDITOR.md` - Análise detalhada
- `FUNNEL_CONSOLIDATION_SUMMARY.md` - Consolidação de contextos

### **Arquivos Principais:**
- `src/App.tsx` - Rotas principais
- `src/providers/ConsolidatedProvider.tsx` - Provider atual
- `src/components/editor/quiz/QuizModularProductionEditor.tsx` - Componente principal
- `src/services/core/EnhancedUnifiedDataService.ts` - Service principal

---

**Data de Criação:** 14 de Outubro de 2025  
**Status:** 📋 Planejamento Completo - Pronto para Implementação  
**Próximo Passo:** Implementar FASE 1 - Consolidar Providers
