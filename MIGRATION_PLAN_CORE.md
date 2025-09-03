# 🎯 PLANO DE MIGRAÇÃO PARA ARQUITETURA CORE

## **📋 SERVIÇOS PENDENTES DE MIGRAÇÃO:**

### **🔥 ALTA PRIORIDADE:**

#### **1. Template Services → CORE**
```
❌ ATUAL (fragmentado):
├── templateService.ts (816 linhas)
├── templateLibraryService.ts  
├── stepTemplateService.ts
└── initializeTemplates.ts

✅ MIGRAR PARA:
└── src/services/core/
    ├── TemplateEngine.ts (unificado)
    ├── TemplateCache.ts (cache inteligente)
    └── TemplateValidator.ts (validação)
```

#### **2. Storage Services → CORE** 
```
❌ ATUAL (disperso):
├── funnelLocalStore.ts
├── resultPageStorage.ts
├── editorService.ts (parte storage)
└── utils/localStorage.ts

✅ CONSOLIDAR EM:
└── src/services/core/
    └── UnifiedStorageService.ts (expandir existente)
```

### **🔶 MÉDIA PRIORIDADE:**

#### **3. Quiz Results → CORE**
```
❌ ATUAL:
├── quizResultsService.ts (808 linhas)
└── resultService.ts

✅ INTEGRAR COM:
└── src/services/core/ResultOrchestrator.ts (já usa)
```

#### **4. Supabase Integration → CORE**
```
❌ ATUAL (acesso direto):
├── quizSupabaseService.ts
├── editorSupabaseService.ts
└── supabaseIntegration.ts

✅ MIGRAR PARA:
└── src/services/core/DatabaseService.ts (wrapper)
```

### **🔵 BAIXA PRIORIDADE:**

#### **5. Builder Services → CORE**
```
❌ ATUAL:
├── quizBuilderService.ts
├── funnelComponentsService.ts
└── pageConfigService.ts

✅ MIGRAR PARA:
└── src/services/core/BuilderEngine.ts
```

---

## **📝 ETAPAS DE MIGRAÇÃO:**

### **FASE 1: Template Engine (1-2 dias)**
1. ✅ Criar `src/services/core/TemplateEngine.ts`
2. ✅ Migrar lógica de `templateService.ts`
3. ✅ Criar cache unificado
4. ✅ Atualizar imports nos componentes
5. ✅ Testes de regressão

### **FASE 2: Storage Unification (1 dia)**
1. ✅ Expandir `UnifiedQuizStorage.ts`
2. ✅ Migrar `funnelLocalStore.ts`
3. ✅ Migrar `resultPageStorage.ts`
4. ✅ Deprecar utilitários dispersos

### **FASE 3: Database Wrapper (2 dias)**
1. ✅ Criar `DatabaseService.ts`
2. ✅ Wrapper para Supabase
3. ✅ Interface unificada
4. ✅ Fallbacks offline

### **FASE 4: Builder Integration (1 dia)**
1. ✅ Consolidar builder services
2. ✅ Integração com CORE existente

---

## **🎯 BENEFÍCIOS DA MIGRAÇÃO:**

### **ANTES (Atual):**
- ❌ 15+ serviços fragmentados
- ❌ Múltiplas formas de storage
- ❌ Imports dispersos
- ❌ Lógica duplicada

### **DEPOIS (CORE):**
- ✅ Arquitetura unificada em `/services/core/`
- ✅ Interface consistente
- ✅ Cache centralizado
- ✅ Manutenção simplificada

---

## **📊 IMPACTO ESTIMADO:**

### **Templates → CORE:**
- 📁 Arquivos afetados: ~20
- 🔄 Imports para atualizar: ~50
- ⏱️ Tempo estimado: 2 dias

### **Storage → CORE:**
- 📁 Arquivos afetados: ~15  
- 🔄 Imports para atualizar: ~30
- ⏱️ Tempo estimado: 1 dia

### **Total da Migração:**
- 📁 Arquivos afetados: ~50
- 🔄 Imports para atualizar: ~100
- ⏱️ Tempo total: 5-6 dias
- 📈 Melhoria de manutenibilidade: +300%

---

## **🚀 PRÓXIMOS PASSOS:**

1. **Começar com Templates** (maior impacto)
2. **Testes em paralelo** durante migração
3. **Rollback plan** se necessário
4. **Documentação atualizada** pós-migração
