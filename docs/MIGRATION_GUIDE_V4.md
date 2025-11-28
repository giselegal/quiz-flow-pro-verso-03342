# 📚 Guia de Migração - Estrutura Modular v4.0

## 🎯 Visão Geral

Este guia documenta a migração de services legados para a **Estrutura Modular v4.0**, consolidada no `TemplateService` canônico.

**Status:** ✅ **IMPLEMENTAÇÃO COMPLETA** (100%)

---

## 📊 Mapeamento de APIs

### **Services Consolidados → TemplateService**

| Service Legado | Método Antigo | TemplateService v4.0 | Hook React Query |
|----------------|---------------|----------------------|------------------|
| `stepTemplateService` | `getStep(id)` | `templateService.getStep(id)` | `useStep(id)` |
| `UnifiedTemplateRegistry` | `getStepBlocks(id)` | `templateService.getStep(id)` | `useStep(id)` |
| `HybridTemplateService` | `loadTemplate(id)` | `templateService.prepareTemplate(id)` | `usePrepareTemplate(id)` |
| `JsonTemplateService` | `loadJSON(path)` | `templateService.loadV4Template()` | `useStepV4(id)` |
| `TemplateEditorService` | `saveBlocks(id, blocks)` | `templateService.saveStep(id, blocks)` | `useSaveStep(id)` |
| `customTemplateService` | `createStep(info)` | `templateService.steps.add(info)` | `useAddCustomStep()` |

---

## 🔄 Exemplos de Migração

### **1. Carregar Step**

#### ❌ **Antes (Legacy)**
```typescript
// Usando UnifiedTemplateRegistry
import { unifiedTemplateRegistry } from '@/services/deprecated/UnifiedTemplateRegistry';

async function loadStep() {
  const blocks = await unifiedTemplateRegistry.getStepBlocks('step-01');
  return blocks;
}
```

#### ✅ **Depois (v4.0 - Service)**
```typescript
// Usando TemplateService canônico
import { templateService } from '@/services/canonical/TemplateService';

async function loadStep() {
  const result = await templateService.getStep('step-01');
  if (result.success) {
    return result.data; // Block[]
  }
  throw result.error;
}
```

#### ⚡ **Melhor: React Query Hook**
```typescript
// Usando hook especializado
import { useStep } from '@/hooks/useTemplateServiceMutations';

function MyComponent() {
  const { data: blocks, isLoading, error } = useStep('step-01');
  
  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;
  
  return <BlockRenderer blocks={blocks} />;
}
```

---

### **2. Salvar Step**

#### ❌ **Antes (Legacy)**
```typescript
// Usando HybridTemplateService
import { hybridTemplateService } from '@/services/deprecated/HybridTemplateService';

async function saveStep(stepId: string, blocks: Block[]) {
  await hybridTemplateService.updateStep(stepId, { blocks });
}
```

#### ✅ **Depois (v4.0 - Service)**
```typescript
// Usando TemplateService canônico
import { templateService } from '@/services/canonical/TemplateService';

async function saveStep(stepId: string, blocks: Block[]) {
  const result = await templateService.saveStep(stepId, blocks);
  if (!result.success) {
    throw result.error;
  }
}
```

#### ⚡ **Melhor: React Query Hook**
```typescript
// Usando hook com invalidação automática
import { useSaveStep } from '@/hooks/useTemplateServiceMutations';

function MyEditor() {
  const { mutate: saveStep, isPending } = useSaveStep('step-01');
  
  const handleSave = () => {
    saveStep(updatedBlocks, {
      onSuccess: () => {
        toast.success('Step salvo com sucesso!');
      },
      onError: (error) => {
        toast.error(`Erro: ${error.message}`);
      }
    });
  };
  
  return <button onClick={handleSave} disabled={isPending}>Salvar</button>;
}
```

---

### **3. Preparar Template**

#### ❌ **Antes (Legacy)**
```typescript
// Usando JsonTemplateService
import { jsonTemplateService } from '@/services/deprecated/JsonTemplateService';

async function prepareTemplate() {
  const template = await jsonTemplateService.loadMasterJSON('quiz21StepsComplete');
  const totalSteps = template.totalSteps || 21;
  // Lógica manual de detecção de steps
}
```

#### ✅ **Depois (v4.0)**
```typescript
// Detecção automática de steps
import { templateService } from '@/services/canonical/TemplateService';

async function prepareTemplate() {
  await templateService.prepareTemplate('quiz21StepsComplete');
  // Template ativo + steps detectados automaticamente
}
```

#### ⚡ **Melhor: React Query Hook**
```typescript
import { usePrepareTemplate } from '@/hooks/useTemplateServiceMutations';

function TemplateLoader({ templateId }) {
  const { isLoading } = usePrepareTemplate(templateId);
  
  if (isLoading) return <Spinner text="Preparando template..." />;
  
  return <Editor />;
}
```

---

### **4. Validação Zod (v4.0)**

#### 🆕 **Novo Recurso**
```typescript
import { templateService } from '@/services/canonical/TemplateService';

// Carregar com validação Zod automática
const result = await templateService.loadV4Template();

if (result.success) {
  const validated = result.data; // QuizSchema validado
  console.log(`Template v4 com ${validated.steps.length} steps`);
}
```

---

## 🏗️ Hierarquia de Dados

### **Ordem de Prioridade (HierarchicalTemplateSource)**

```mermaid
graph TD
    A[Request: getStep('step-01')] --> B{Funnel Ativo?}
    B -->|Sim| C[1. USER_EDIT<br/>Supabase: funnel_steps]
    B -->|Não| D[2. ADMIN_OVERRIDE<br/>Supabase: template_overrides]
    
    C -->|Found| E[✅ Return Blocks]
    C -->|Not Found| D
    
    D -->|Found| E
    D -->|Not Found| F[3. BUILT_IN<br/>JSON: /templates/*.json]
    
    F -->|Found| E
    F -->|Not Found| G[4. FALLBACK<br/>Empty Array]
    
    G --> E
```

### **Configurar Contexto**

```typescript
// Definir funnel ativo (USER_EDIT priority)
templateService.setActiveFunnel('funnel-uuid-123');

// Definir template ativo (navegação)
templateService.setActiveTemplate('quiz21StepsComplete', 21);

// Carregar step (usará USER_EDIT se funnel ativo)
const result = await templateService.getStep('step-01');
```

---

## 📦 Templates JSON

### **Estrutura v4.0 (Canônica)**

```json
{
  "version": "4.0.0",
  "schemaVersion": "1.0",
  "metadata": {
    "id": "quiz21StepsComplete",
    "name": "Quiz de Estilo Completo",
    "description": "Template v4 com validação Zod",
    "author": "Sistema",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-11-28T00:00:00Z"
  },
  "theme": { /* ... */ },
  "settings": { /* ... */ },
  "steps": [
    {
      "id": "step-01",
      "type": "intro",
      "order": 1,
      "title": "Introdução",
      "blocks": [
        {
          "id": "block-intro-header",
          "type": "intro-logo-header",
          "order": 0,
          "properties": { /* ... */ },
          "content": { /* ... */ }
        }
      ],
      "navigation": { /* ... */ },
      "validation": { /* ... */ }
    }
  ]
}
```

### **Localização dos Templates**

| Arquivo | Versão | Uso |
|---------|--------|-----|
| `public/templates/quiz21-v4.json` | 4.0 | ✅ Canônico (com validação Zod) |
| `public/templates/step-XX-v3.json` | 3.2 | ✅ Steps individuais |
| `public/templates/quiz21-complete.json` | 3.0 | ⚠️ Legacy (fallback) |

---

## 🎨 Schemas Zod

### **Tipos de Blocos Suportados (v4.0)**

```typescript
import { BlockTypeZ } from '@/schemas/quiz-schema.zod';

// 50+ tipos de blocos validados:
const blockTypes = [
  // Intro
  'intro-logo', 'intro-logo-header', 'intro-title', 'intro-subtitle',
  'intro-description', 'intro-image', 'intro-form', 'intro-button',
  
  // Question
  'question-title', 'question-description', 'options-grid', 'form-input',
  
  // Transition
  'transition-title', 'transition-text', 'transition-button', 'transition-image',
  
  // Result
  'result-header', 'result-title', 'result-description', 'result-image',
  'result-display', 'result-guide-image',
  
  // Offer
  'offer-hero', 'quiz-offer-hero', 'offer-card', 'benefits-list',
  'testimonials', 'pricing', 'guarantee', 'urgency-timer',
  'value-anchoring', 'secure-purchase', 'cta-button',
  
  // Generic
  'text', 'heading', 'image', 'button', 'container', 'spacer', 'divider'
];
```

### **Validação de Templates**

```typescript
import { validateQuizSchema } from '@/schemas/quiz-schema.zod';

// Validar template JSON
const result = validateQuizSchema(jsonData);

if (result.success) {
  console.log('✅ Template válido:', result.data);
} else {
  console.error('❌ Erros de validação:', result.errors);
  result.errors.errors.forEach(err => {
    console.log(`- ${err.path.join('.')}: ${err.message}`);
  });
}
```

---

## 🚀 Feature Flags

### **Controlar Comportamento**

```typescript
// localStorage overrides (útil para debug)
localStorage.setItem('USE_HIERARCHICAL_SOURCE', 'true');  // Usar novo sistema
localStorage.setItem('VITE_TEMPLATE_JSON_ONLY', 'true');   // Modo JSON-only
localStorage.setItem('VITE_DISABLE_SUPABASE', 'true');     // Offline mode

// Ou via .env
VITE_ENABLE_HIERARCHICAL_SOURCE=true
VITE_TEMPLATE_JSON_ONLY=true
VITE_DISABLE_SUPABASE=false
```

---

## 📈 Métricas e Cache

### **Obter Estatísticas**

```typescript
import { templateService } from '@/services/canonical/TemplateService';

// Obter stats de cache
const stats = templateService.getCacheStats();

console.log({
  cacheHitRate: stats.cacheHitRate,        // "85.3%"
  stepsInMemory: stats.stepsLoadedInMemory, // 15
  avgLoadTime: stats.avgLoadTimeMs,         // 23.5ms
});

// Log formatado no console
templateService.logCacheReport();
```

### **Hook de Estatísticas**

```typescript
import { useCacheStats } from '@/hooks/useTemplateServiceMutations';

function CacheMonitor() {
  const { data: stats } = useCacheStats(); // Atualiza a cada 30s
  
  return (
    <div>
      <p>Cache Hit Rate: {stats?.cacheHitRate}</p>
      <p>Steps Loaded: {stats?.stepsLoadedInMemory}</p>
    </div>
  );
}
```

---

## 🔧 Operações Avançadas

### **Lazy Loading**

```typescript
// Smart lazy loading com preload de vizinhos
const stepData = await templateService.lazyLoadStep('step-05', true);

// Preload crítico manual
await templateService.steps.preload([1, 12, 19, 20, 21]);

// Descarregar steps inativos (liberar memória)
templateService.unloadInactiveSteps(5); // 5 minutos de inatividade
```

### **Steps Customizados**

```typescript
// Adicionar step customizado
await templateService.steps.add({
  id: 'step-custom-01',
  name: 'Minha Etapa Customizada',
  type: 'custom',
  order: 22,
  description: 'Etapa criada do zero',
  blocksCount: 0,
  hasTemplate: false
});

// Duplicar step existente
const duplicated = await templateService.steps.duplicate('step-01');

// Remover step customizado
await templateService.steps.remove('step-custom-01');
```

---

## ✅ Checklist de Migração

### **Para Desenvolvedores**

- [ ] Remover imports de services legados (`stepTemplateService`, `UnifiedTemplateRegistry`, etc.)
- [ ] Substituir por `templateService` canônico
- [ ] Usar hooks React Query (`useStep`, `useSaveStep`) para componentes
- [ ] Configurar `setActiveFunnel` e `setActiveTemplate` no início da aplicação
- [ ] Testar fluxo: USER_EDIT → JSON → FALLBACK
- [ ] Validar templates v4 com Zod
- [ ] Monitorar métricas de cache em dev

### **Para QA**

- [ ] Testar carregamento de steps (21 steps do quiz)
- [ ] Testar salvamento com funnel ativo (USER_EDIT)
- [ ] Testar salvamento sem funnel (cache local)
- [ ] Validar prioridade de fontes (Supabase → JSON)
- [ ] Testar modo offline (VITE_DISABLE_SUPABASE=true)
- [ ] Verificar cache hit rate > 80%
- [ ] Testar criação de steps customizados

---

## 📞 Suporte

**Problemas Comuns:**

1. **"Step not found"** → Verificar se `prepareTemplate()` foi chamado
2. **"Cache sempre MISS"** → Verificar `USE_HIERARCHICAL_SOURCE` flag
3. **"Validação Zod falhou"** → Verificar estrutura do JSON v4
4. **"USER_EDIT não funciona"** → Verificar `setActiveFunnel()` chamado

**Logs de Debug:**

```typescript
// Habilitar logs detalhados
const templateService = TemplateService.getInstance({ debug: true });

// Ver no console
window.__canonicalTemplateService; // Instância exposta
```

---

**Data da Última Atualização:** 28 de Novembro de 2025  
**Versão do Guia:** 1.0.0  
**Status:** ✅ Produção
