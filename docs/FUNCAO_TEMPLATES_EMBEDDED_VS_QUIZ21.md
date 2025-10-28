## 🎯 FUNÇÃO DOS ARQUIVOS DE TEMPLATE

**Data:** 2025-10-28  
**Objetivo:** Explicar a diferença e função de cada arquivo de template

---

## 📋 VISÃO GERAL

Existem **DOIS arquivos principais** de templates, cada um com função específica:

| Arquivo | Função | Quando Usar |
|---------|--------|-------------|
| `embedded.ts` | **L3 Cache (Build-time)** | Produção, performance crítica |
| `quiz21StepsComplete.ts` | **API & Desenvolvimento** | Scripts, debugging, personalização |

---

## 🏗️ 1. EMBEDDED.TS (Build-time Templates)

### **Localização:**
```
src/templates/embedded.ts
```

### **Função Principal:**
✅ **Cache L3 (Layer 3) para Performance em Produção**

### **Características:**

1. **Gerado Automaticamente**
   ```bash
   npm run build:templates
   ```
   - Lê JSONs de `public/templates/*.json`
   - Converte para TypeScript hardcoded
   - Embute todos os 21 steps e 127 blocos

2. **Formato:**
   ```typescript
   const embedded: Record<string, Block[]> = {
     "step-01": [ /* 6 blocos */ ],
     "step-02": [ /* 5 blocos */ ],
     // ... 21 steps totais
   };
   ```

3. **Performance:**
   - ⚡ **~10ms** de carregamento (já está em memória no bundle)
   - 🎯 Sem requisições HTTP
   - 📦 Tree-shaking automático (apenas steps usados)

4. **Usado Por:**
   - `UnifiedTemplateRegistry.loadFromL3()` (fallback L3)
   - Sistema de cache em cascade (L1 → L2 → L3)

### **Fluxo de Uso (Produção):**
```typescript
// 1. UnifiedTemplateRegistry tenta L1 (Memory Cache)
const l1 = this.l1Cache.get(stepId);

// 2. Se falhar, tenta L2 (IndexedDB)
const l2 = await this.l2Cache.get('templates', stepId);

// 3. Se falhar, carrega do L3 (embedded.ts)
const module = await import('@templates/embedded');
const l3 = module.embedded[stepId];

// 4. Se falhar, carrega do servidor (/templates/*.json)
const l4 = await fetch(`/templates/${stepId}-v3.json`);
```

### **Vantagens:**
- ✅ Zero latência de rede
- ✅ Funciona offline
- ✅ Bundle otimizado (minificado)
- ✅ Garantia de disponibilidade

### **Desvantagens:**
- ❌ Aumenta tamanho do bundle (~50-100KB)
- ❌ Requer rebuild para atualizar templates
- ❌ Não suporta personalização dinâmica

---

## 🎨 2. QUIZ21STEPSCOMPLETE.TS (API & Development)

### **Localização:**
```
src/templates/quiz21StepsComplete.ts
```

### **Função Principal:**
✅ **API de Templates + Personalização + Scripts de Desenvolvimento**

### **Características:**

1. **Também Gerado Automaticamente**
   ```bash
   npm run generate:templates
   ```
   - Lê JSONs de `public/templates/*.json`
   - Gera TypeScript com funções de acesso
   - Inclui cache e personalização

2. **Formato (Estrutura de Dados + API):**
   ```typescript
   // Dados brutos
   export const QUIZ_STYLE_21_STEPS_TEMPLATE: Record<string, any> = {
     'step-01': [ /* blocos */ ],
     'step-02': [ /* blocos */ ],
     // ...
   };

   // API de acesso
   export function getStepTemplate(stepId: string): any { ... }
   
   // API de personalização por funil
   export function getPersonalizedStepTemplate(
     stepId: string, 
     funnelId?: string
   ): any { ... }
   ```

3. **Personalização:**
   ```typescript
   // Adiciona sufixo único baseado no funnelId
   const template = getPersonalizedStepTemplate('step-05', 'funnel-abc123');
   
   // Resultado:
   // block.id: "question-title-05" → "question-title-05-fnlabc123"
   ```

4. **Usado Por:**
   - Scripts de validação (`scripts/validate-templates.ts`)
   - Scripts de debug (`scripts/debug/check-blocks.ts`)
   - Scripts de migração (`scripts/migration/*.ts`)
   - Testes unitários
   - Editor de templates (quando personalizar por funil)

### **Funções Exportadas:**

| Função | Propósito |
|--------|-----------|
| `getStepTemplate(stepId)` | Retorna blocos de um step (com cache) |
| `getPersonalizedStepTemplate(stepId, funnelId)` | Retorna blocos personalizados por funil |
| `QUIZ_STYLE_21_STEPS_TEMPLATE` | Objeto bruto com todos os steps |
| `QUIZ_GLOBAL_CONFIG` | Configurações globais do quiz |

### **Vantagens:**
- ✅ API limpa e tipada
- ✅ Cache de templates
- ✅ Personalização por funil
- ✅ Ideal para scripts e debugging
- ✅ Estrutura completa com metadata

### **Desvantagens:**
- ❌ Carregamento mais lento (~50ms+)
- ❌ Requer import do módulo completo
- ❌ Maior uso de memória (estruturas adicionais)

---

## 🔄 COMPARAÇÃO LADO A LADO

### **Estrutura de Dados:**

```typescript
// 📦 EMBEDDED.TS (Simples)
const embedded: Record<string, Block[]> = {
  "step-01": [
    { id: "intro-header-01", type: "quiz-intro-header", order: 0, ... }
  ]
};

// 🎨 QUIZ21STEPSCOMPLETE.TS (Com API)
const QUIZ_STYLE_21_STEPS_TEMPLATE: Record<string, any> = {
  'step-01': [
    { id: "intro-header-01", type: "quiz-intro-header", order: 0, ... }
  ]
};

// + Funções de acesso com cache e personalização
```

### **Uso em Produção:**

```typescript
// ✅ RUNTIME (UnifiedTemplateRegistry usa embedded.ts)
const blocks = await registry.getStep('step-05');
// → L1 (Map) → L2 (IndexedDB) → L3 (embedded.ts) → L4 (fetch)

// ✅ SCRIPTS (Usam quiz21StepsComplete.ts)
import { getStepTemplate } from '@/templates/quiz21StepsComplete';
const blocks = getStepTemplate('step-05');
```

---

## 🎯 QUANDO USAR CADA UM?

### **Use `embedded.ts` quando:**
- ✅ Produção (via UnifiedTemplateRegistry)
- ✅ Performance crítica (L3 cache)
- ✅ Offline-first
- ✅ Bundle otimizado

### **Use `quiz21StepsComplete.ts` quando:**
- ✅ Scripts de validação/debugging
- ✅ Testes unitários
- ✅ Personalização por funil
- ✅ Desenvolvimento/análise de templates
- ✅ Migrações de dados

---

## 📊 FLUXO COMPLETO DE GERAÇÃO

```bash
# 1. Editar templates originais
vim public/templates/step-01-v3.json
vim public/templates/step-02-v3.json

# 2. Gerar ambos os arquivos TypeScript
npm run generate:templates
# ↓
# Gera: src/templates/quiz21StepsComplete.ts

npm run build:templates
# ↓
# Gera: src/templates/embedded.ts

# 3. Commit ambos
git add public/templates/*.json
git add src/templates/quiz21StepsComplete.ts
git add src/templates/embedded.ts
git commit -m "chore: atualizar templates"
```

---

## 🔍 EXEMPLO DE USO EM CÓDIGO

### **Caso 1: Runtime (Produção)**
```typescript
// useQuizState.ts
import { getUnifiedTemplateRegistry } from '@/services/UnifiedTemplateRegistry';

const registry = getUnifiedTemplateRegistry();
const blocks = await registry.getStep('step-05');
// ↑ Usa embedded.ts via L3 cache
```

### **Caso 2: Script de Validação**
```typescript
// scripts/validate-templates.ts
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '../src/templates/quiz21StepsComplete';

for (const [stepId, blocks] of Object.entries(QUIZ_STYLE_21_STEPS_TEMPLATE)) {
  console.log(`Validando ${stepId}: ${blocks.length} blocos`);
}
```

### **Caso 3: Personalização por Funil**
```typescript
// Editor com funil específico
import { getPersonalizedStepTemplate } from '@/templates/quiz21StepsComplete';

const blocks = getPersonalizedStepTemplate('step-05', 'funnel-xyz');
// ↑ IDs dos blocos terão sufixo único: "question-title-05-fnlxyz"
```

---

## ✅ CONCLUSÃO

| Aspecto | embedded.ts | quiz21StepsComplete.ts |
|---------|-------------|------------------------|
| **Propósito** | Cache L3 de produção | API + desenvolvimento |
| **Performance** | ⚡ ~10ms | 🐢 ~50ms+ |
| **Personalização** | ❌ Não | ✅ Sim (por funil) |
| **Cache** | ❌ Não (é o cache) | ✅ Sim (Map interno) |
| **Usado em** | Runtime (via Registry) | Scripts + testes |
| **Tamanho** | Menor (só dados) | Maior (dados + lógica) |

**Recomendação:**
- 🏭 **Produção:** Use `UnifiedTemplateRegistry` (que usa `embedded.ts`)
- 🔧 **Scripts/Debug:** Import direto de `quiz21StepsComplete.ts`
- 🎨 **Personalização:** Use `getPersonalizedStepTemplate()` de `quiz21StepsComplete.ts`
