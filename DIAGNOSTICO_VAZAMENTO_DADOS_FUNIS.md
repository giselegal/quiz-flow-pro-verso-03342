# 🚨 DIAGNÓSTICO: VAZAMENTO DE DADOS ENTRE FUNIS

## 🎯 **PROBLEMA IDENTIFICADO**

As edições feitas no `/editor` estão refletindo em todos os "Modelos de Funis" e "Meus Funis" porque há **vazamento de dados entre diferentes contextos** devido a:

### **❌ 1. SINGLETONS COMPARTILHADOS**
Vários services estão usando padrão Singleton, compartilhando estado entre páginas:

```typescript
// PROBLEMÁTICOS - SINGLETONS GLOBAIS:
- FunnelManager.getInstance()
- LocalStorageService.getInstance()  
- PersistenceService.getInstance()
- TemplateService.getInstance()
- SettingsService.getInstance()
- PublishingService.getInstance()
```

### **❌ 2. CHAVES LOCALSTORAGE SEM CONTEXTO**
As chaves do localStorage não diferenciam contexto de uso:

```typescript
// PROBLEMÁTICO:
localStorage.setItem(`funnel-${state.id}`, data)  // ❌ Mesmo ID em todos contextos
localStorage.setItem('funnels-list', list)        // ❌ Lista global compartilhada

// DEVERIA SER:
localStorage.setItem(`editor-funnel-${state.id}`, data)     // ✅ Específico para editor
localStorage.setItem(`templates-funnel-${state.id}`, data)  // ✅ Específico para templates  
localStorage.setItem(`my-funnels-${state.id}`, data)        // ✅ Específico para meus funis
```

### **❌ 3. ID DE FUNNEL COMPARTILHADO**
O mesmo `funnelId` está sendo usado em contextos diferentes:

```typescript
// PROBLEMÁTICO - MESMO ID USADO EM:
- /editor → getFunnelIdFromEnvOrStorage() → 'default-funnel'
- /admin/meus-funis → Mesmo 'default-funnel' 
- /admin/templates → Mesmo 'default-funnel'
```

### **❌ 4. SCHEMA DRIVEN SERVICE SEM ISOLAMENTO**
O `schemaDrivenFunnelService` não tem isolamento por contexto:

```typescript
// PROBLEMÁTICO:
schemaDrivenFunnelService.saveFunnel(data)  // ❌ Salva globalmente
schemaDrivenFunnelService.loadFunnel(id)    // ❌ Carrega de pool global
```

## 🔧 **SOLUÇÃO NECESSÁRIA**

### **✅ 1. CONTEXTOS ISOLADOS**
Criar sistema de contextos para isolar dados:

```typescript
enum FunnelContext {
  EDITOR = 'editor',
  TEMPLATES = 'templates', 
  MY_FUNNELS = 'my-funnels',
  PREVIEW = 'preview'
}
```

### **✅ 2. SERVICES COM CONTEXTO**
Modificar services para aceitar contexto:

```typescript
// NOVO:
class ContextualFunnelService {
  constructor(private context: FunnelContext) {}
  
  saveFunnel(data) {
    const key = `${this.context}-funnel-${data.id}`;
    localStorage.setItem(key, JSON.stringify(data));
  }
}
```

### **✅ 3. IDS ÚNICOS POR CONTEXTO**
Gerar IDs únicos por contexto:

```typescript
const generateContextualId = (context: FunnelContext, baseId?: string) => {
  return `${context}-${baseId || generateId()}`;
};
```

### **✅ 4. STORAGE KEYS CONTEXTUAIS**
Usar chaves específicas por contexto:

```typescript
const getContextualStorageKey = (context: FunnelContext, key: string) => {
  return `${context}-${key}`;
};
```

## 📊 **ARQUIVOS AFETADOS**

### **🎯 Services que precisam de isolamento:**
- `src/services/schemaDrivenFunnelService.ts`
- `src/core/funnel/FunnelManager.ts`
- `src/core/funnel/services/LocalStorageService.ts`
- `src/core/funnel/services/PersistenceService.ts`

### **🔧 Hooks que precisam de contexto:**
- `src/hooks/editor/useEditorPersistence.ts`
- `src/hooks/editor/useEditorAutoSave.ts`
- `src/hooks/core/useUnifiedEditor.ts`

### **📝 Utils que precisam de modificação:**
- `src/utils/funnelIdentity.ts`
- `src/utils/funnelStorageKeys.ts`

## 🚀 **PLANO DE IMPLEMENTAÇÃO**

### **FASE 1: Criar Sistema de Contextos**
1. Criar enum `FunnelContext`
2. Criar `ContextualFunnelService`
3. Modificar `funnelStorageKeys` para aceitar contexto

### **FASE 2: Modificar Services Principais**  
1. Adicionar contexto ao `schemaDrivenFunnelService`
2. Criar instâncias contextuais dos singletons
3. Modificar `LocalStorageService` para usar chaves contextuais

### **FASE 3: Atualizar Hooks e Components**
1. Passar contexto para hooks
2. Modificar componentes para usar service contextual
3. Atualizar páginas admin para usar contexto correto

### **FASE 4: Migração de Dados**
1. Migrar dados existentes para novos contextos
2. Limpar dados órfãos
3. Validar isolamento completo

---

**⚠️ URGÊNCIA:** ALTA  
**🎯 IMPACTO:** Dados de editor vazando para produção  
**⏱️ ESTIMATIVA:** 4-6 horas de implementação  

**Status:** 🔴 **CRÍTICO - REQUER CORREÇÃO IMEDIATA**
