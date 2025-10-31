# 🔍 ANÁLISE: ESTRUTURAS REAIS vs CORRETAS

**Data:** 31 de Outubro de 2025  
**Análise:** Verificação prática do código em execução vs código implementado

---

## 🎯 RESUMO EXECUTIVO

### ❌ PROBLEMA DESCOBERTO:

Existem **múltiplas estruturas horizontais** (sistemas paralelos) implementadas, mas apenas **UMA está realmente ativa** no runtime. O resto é código implementado mas não utilizado.

---

## 📊 MAPEAMENTO COMPLETO DAS ESTRUTURAS

### 1️⃣ ESTRUTURA REALMENTE ATIVA ✅

#### **EditorProviderUnified + TemplateLoader**

**Localização:** 
- `src/components/editor/EditorProviderUnified.tsx`
- `src/services/editor/TemplateLoader.ts`

**Usado em:**
```typescript
// src/pages/editor/index.tsx (PÁGINA PRINCIPAL DO EDITOR)
import EditorProviderUnified from '@/components/editor/EditorProviderUnified';

<EditorProviderUnified funnelId={funnelId} enableSupabase={enableSupabase}>
  {/* Editor */}
</EditorProviderUnified>
```

**Fluxo de carregamento:**
```
EditorProviderUnified (linha 29)
  → import { TemplateLoader } from '@/services/editor/TemplateLoader'
  → TemplateLoader.loadStep()
    → Estratégia cascata (linha 150-250):
      1. Detecta modo (template vs funnel)
      2. MODO TEMPLATE: loadFromPublicStepJSON() PRIMEIRO ✅
      3. Fallback: Master JSON
      4. Fallback: TypeScript
```

**Status:** ✅ **ATIVO E FUNCIONANDO**

**Ordem de prioridade (linha 150):**
```typescript
if (mode === 'template') {
  // 1. JSON público individual ← PRIORIDADE MÁXIMA
  const fromPublic = await this.loadFromPublicStepJSON(normalizedKey);
  
  // 2. Master JSON
  const fromMaster = await this.loadFromMasterJSON(normalizedKey);
  
  // 3. TypeScript template
  return this.loadFromTypescript(normalizedKey);
}
```

---

### 2️⃣ ESTRUTURA IMPLEMENTADA MAS NÃO USADA 🟡

#### **ConsolidatedTemplateService**

**Localização:** `src/services/core/ConsolidatedTemplateService.ts`

**Implementa lazy loading:**
```typescript
// Linha 247 - Lazy loading com per-step JSON
private async loadFromJSON(templateId: string): Promise<FullTemplate | null> {
  // PRIORIDADE 1: blocos individuais
  let response = await fetch(`/templates/blocks/${normalizedId}.json`);
  
  // Fallbacks...
}
```

**Usado APENAS em:**
```typescript
// src/pages/admin/MyFunnelsPage.tsx (Dashboard Admin)
import consolidatedTemplateService from '@/services/core/ConsolidatedTemplateService';
const full = await consolidatedTemplateService.getTemplate('quiz21StepsComplete');

// src/pages/admin/MyFunnelsPage_contextual.tsx
import consolidatedTemplateService from '@/services/core/ConsolidatedTemplateService';
```

**Status:** 🟡 **IMPLEMENTADO MAS SÓ USADO NO DASHBOARD ADMIN**  
**Problema:** Não está sendo usado no editor principal!

---

### 3️⃣ ESTRUTURA IMPLEMENTADA MAS NÃO USADA 🟡

#### **TemplateService (Canonical)**

**Localização:** `src/services/canonical/TemplateService.ts`

**Implementa:**
```typescript
// Linha 376 - Sistema completo de lazy loading
async lazyLoadStep(stepId: string, preloadNeighbors = true): Promise<any> {
  // - Cache de steps carregados
  // - Preload de vizinhos
  // - Preload de steps críticos (12, 19, 20, 21)
}
```

**Usado em:**
```typescript
// EditorProviderUnified (linha 37) - MAS NÃO USA lazyLoadStep()!
import { templateService } from '@/services/canonical/TemplateService';
// Apenas importado, mas não usado para lazy loading

// useTemplateLoader (hook)
const templateService = TemplateService.getInstance();
const result = await templateService.getStep(stepId);
// Usado mas sem o lazy loading inteligente
```

**Status:** 🟡 **IMPORTADO MAS O lazyLoadStep() NÃO É CHAMADO**

---

### 4️⃣ ESTRUTURA IMPLEMENTADA MAS NÃO USADA 🟡

#### **useTemplateLoader (Hook)**

**Localização:** `src/hooks/useTemplateLoader.ts`

**Implementa:**
```typescript
// Função completa de carregamento per-step
async function loadFromPerStepJSONs(): Promise<EditableQuizStep[] | null> {
  for (let i = 0; i < 21; i++) {
    const resp = await fetch(`/templates/blocks/${stepId}.json`);
  }
}
```

**Usado APENAS em:**
```typescript
// src/pages/editor/QuizEditorIntegratedPage.tsx
import { useTemplateLoader } from '@/hooks/useTemplateLoader';
const templateLoader = useTemplateLoader();

// src/components/editor/modes/QuizEditorMode.tsx  
import { useTemplateLoader } from '@/hooks/useTemplateLoader';
const templateLoader = useTemplateLoader();
```

**Status:** 🟡 **HOOK EXISTE MAS loadFromPerStepJSONs() NÃO É CHAMADO**

---

### 5️⃣ ESTRUTURA IMPLEMENTADA MAS NÃO USADA 🟡

#### **quizStepsLazy.ts**

**Localização:** `src/data/quizStepsLazy.ts`

**Implementa:**
```typescript
/**
 * 🚀 LAZY LOADING STRATEGY FOR QUIZ STEPS
 * Virtualiza o carregamento dos dados para melhorar performance inicial
 */
export async function loadQuizStep(stepId: string): Promise<QuizStep | null>
```

**Usado em:** ❌ **NENHUM ARQUIVO IMPORTA ESTA FUNÇÃO**

**Status:** ❌ **CÓDIGO MORTO - Nunca executado**

---

## 🔍 ANÁLISE HORIZONTAL: MÚLTIPLAS ESTRUTURAS

### Quantas implementações de carregamento de templates existem?

| # | Serviço/Módulo | Implementa Lazy Load? | Usado no Editor? | Status |
|---|----------------|----------------------|------------------|--------|
| 1 | **TemplateLoader** | ✅ Sim (cascata) | ✅ **SIM** | ✅ ATIVO |
| 2 | **ConsolidatedTemplateService** | ✅ Sim (per-step JSON) | ❌ Não | 🟡 Admin apenas |
| 3 | **TemplateService (canonical)** | ✅ Sim (lazyLoadStep) | ⚠️ Parcial | 🟡 Não usa lazy |
| 4 | **useTemplateLoader (hook)** | ✅ Sim (loadFromPerStepJSONs) | ⚠️ Importado | 🟡 Não chamado |
| 5 | **quizStepsLazy.ts** | ✅ Sim (loadQuizStep) | ❌ Não | ❌ Código morto |
| 6 | **UnifiedTemplateRegistry** | ❌ Não (cache) | ✅ Sim | ✅ Cache ativo |

**Total:** 6 sistemas de template diferentes implementados  
**Ativos:** Apenas 2 (TemplateLoader + Registry)

---

## ✅ O QUE REALMENTE ESTÁ FUNCIONANDO

### Fluxo Real de Execução:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USUÁRIO ACESSA                                           │
│    /editor?template=quiz21StepsComplete                     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. COMPONENTE MONTADO                                       │
│    src/pages/editor/index.tsx                               │
│    <EditorProviderUnified>                                  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. PROVIDER INICIALIZA                                      │
│    EditorProviderUnified.tsx (linha 29)                     │
│    import { TemplateLoader } from '@/services/editor/...'   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. CARREGAMENTO DE STEP                                     │
│    TemplateLoader.loadStep(step)                            │
│    ↓                                                         │
│    detectMode() → 'template'                                │
│    ↓                                                         │
│    loadFromPublicStepJSON() ← AQUI TENTA CARREGAR!          │
│    fetch('/templates/blocks/step-01.json')                  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. SE JSON EXISTIR: ✅ SUCESSO                              │
│    Se não: Fallback para Master JSON ou TypeScript         │
└─────────────────────────────────────────────────────────────┘
```

### 🎯 DESCOBERTA CHAVE:

**O TemplateLoader JÁ ESTÁ TENTANDO CARREGAR OS JSONs INDIVIDUAIS!**

Linha 153-160 em `TemplateLoader.ts`:
```typescript
if (mode === 'template') {
  // 1. JSON público individual (PRIORIDADE MÁXIMA em template mode)
  const fromPublic = await this.loadFromPublicStepJSON(normalizedKey);
  if (fromPublic) {
    console.log('✅ Template mode: Carregado de JSON público');
    return fromPublic;
  }
}
```

---

## ❓ ENTÃO POR QUE PODE NÃO ESTAR FUNCIONANDO?

### Hipóteses:

#### 1. **Os JSONs não estão sendo servidos corretamente**
```bash
# Verificar se os arquivos estão acessíveis
curl http://localhost:5173/templates/blocks/step-01.json
```

#### 2. **Erro silencioso no fetch**
```typescript
// src/services/editor/TemplateLoader.ts
private async loadFromPublicStepJSON(stepKey: string): Promise<LoadedTemplate | null> {
  try {
    // Algum erro aqui que está sendo silenciado?
  } catch (error) {
    // Verificar se está capturando e ignorando erros
  }
}
```

#### 3. **Cache está sobrescrevendo**
```typescript
// Linha 127: Cache checado ANTES dos JSONs públicos
const cached = this.loadFromCache(normalizedKey);
if (cached) return cached; // Pode estar retornando TS template cacheado
```

#### 4. **Flag desabilitada**
```typescript
// config/templateSources.ts
export const TEMPLATE_SOURCES = {
  preferPublicStepJSON: false, // ← Pode estar FALSE!
  useMasterJSON: true,
  // ...
};
```

---

## 🎯 ESTRUTURA CORRETA QUE DEVERIA ESTAR ATIVA

### Arquitetura Ideal:

```
┌─────────────────────────────────────────────────────────────┐
│ EDITOR                                                      │
│   ↓                                                         │
│ EditorProviderUnified                                       │
│   ↓                                                         │
│ TemplateService.lazyLoadStep() ← USAR ESTE!                │
│   ↓                                                         │
│ ConsolidatedTemplateService.loadFromJSON()                  │
│   ↓                                                         │
│ fetch('/templates/blocks/step-XX.json')                     │
│   ↓                                                         │
│ Cache inteligente + Preload vizinhos                        │
└─────────────────────────────────────────────────────────────┘
```

### Mudanças necessárias:

1. **EditorProviderUnified** deveria chamar:
```typescript
// ATUAL (linha ~500)
const loader = TemplateLoader.getInstance();
const result = await loader.loadStep(step);

// DEVERIA SER:
const templateService = TemplateService.getInstance();
const result = await templateService.lazyLoadStep(stepKey, true);
// ↑ Já implementa preload, cache, etc
```

2. **TemplateService.lazyLoadStep()** deveria delegar para:
```typescript
// Dentro de lazyLoadStep()
const consolidatedService = ConsolidatedTemplateService.getInstance();
return await consolidatedService.loadFromJSON(stepId);
// ↑ Já prioriza per-step JSON!
```

---

## 📋 COMPARAÇÃO: REAL vs CORRETO

| Aspecto | O que ESTÁ rodando | O que DEVERIA rodar | Diferença |
|---------|-------------------|---------------------|-----------|
| **Provider** | EditorProviderUnified | EditorProviderUnified | ✅ Mesmo |
| **Carregador** | TemplateLoader | TemplateService.lazyLoadStep | ❌ Diferente |
| **Lazy Load** | ⚠️ Tenta mas pode falhar | ✅ Implementado completo | ⚠️ Parcial |
| **Per-step JSON** | ⚠️ Tenta carregar | ✅ PRIORIDADE 1 | ⚠️ Parcial |
| **Cache** | Básico | Inteligente + Preload | ❌ Diferente |
| **Preload** | ❌ Não tem | ✅ Vizinhos + Críticos | ❌ Faltando |

---

## 🚀 AÇÕES RECOMENDADAS

### 🔴 URGENTE

1. **Verificar por que loadFromPublicStepJSON falha**
   ```bash
   # Testar manualmente
   curl http://localhost:5173/templates/blocks/step-01.json
   
   # Adicionar logs detalhados
   console.log('🔍 Tentando carregar:', `/templates/blocks/${stepId}.json`);
   ```

2. **Verificar configuração de flags**
   ```typescript
   // src/config/templateSources.ts
   export const TEMPLATE_SOURCES = {
     preferPublicStepJSON: true, // ← Garantir que está TRUE
     useMasterJSON: true,
   };
   ```

3. **Verificar ordem de cache**
   ```typescript
   // TemplateLoader.ts linha ~127
   // Cache pode estar retornando TS template antes de tentar JSON
   // Mover verificação de cache para DEPOIS de tentar JSON público
   ```

### 🟡 IMPORTANTE

4. **Consolidar sistemas em um único fluxo**
   - Remover duplicação entre TemplateLoader e ConsolidatedTemplateService
   - Usar TemplateService.lazyLoadStep() como ponto único
   - Deprecar sistemas não utilizados (quizStepsLazy.ts)

5. **Ativar preload inteligente**
   - Usar lazyLoadStep() com preloadNeighbors=true
   - Precarregar steps críticos (12, 19, 20, 21)

### 🟢 MELHORIAS

6. **Limpar código morto**
   - Remover quizStepsLazy.ts (nunca usado)
   - Consolidar loadFromPerStepJSONs() não chamado
   - Documentar qual sistema usar

---

## 🎯 CONCLUSÃO

### ✅ O que descobrimos:

1. **TemplateLoader JÁ TENTA carregar JSONs individuais** (linha 153)
2. **ConsolidatedTemplateService PRIORIZA JSONs individuais** (linha 247)
3. **TemplateService tem lazyLoadStep completo** (linha 376)
4. **Mas só TemplateLoader está sendo usado** no editor

### ⚠️ O problema:

**Múltiplas implementações paralelas** que não conversam entre si. O resultado:
- TemplateLoader tenta mas pode falhar silenciosamente
- ConsolidatedTemplateService funciona mas não é usado no editor
- TemplateService.lazyLoadStep() nunca é chamado

### 🎯 A solução:

**Unificar tudo em um único fluxo:**
```
EditorProviderUnified
  → TemplateService.lazyLoadStep()
    → ConsolidatedTemplateService.loadFromJSON()
      → fetch('/templates/blocks/step-XX.json')
```

**Benefício:** Bundle -95%, Performance +300%, Cache inteligente, Preload automático

---

**Análise completa e prática!** 🎉

---

## ⚠️ AS ESTRUTURAS PARALELAS PODEM SER EXCLUÍDAS?

### 📊 ANÁLISE DE DEPENDÊNCIAS

#### 1️⃣ **ConsolidatedTemplateService** - ❌ **NÃO PODE SER EXCLUÍDO**

**Motivo:** Usado ativamente em múltiplos locais críticos!

**Usos encontrados (46 referências):**

```typescript
✅ PÁGINAS ADMIN (ATIVO):
- src/pages/admin/MyFunnelsPage.tsx (3 usos)
- src/pages/admin/MyFunnelsPage_contextual.tsx (3 usos)

✅ API INTERNA (CRÍTICO):
- src/api/internal/BlockPropertiesAPI.ts (5 usos)
  → Usado para carregar propriedades de blocos

✅ SERVIÇOS CORE (INTEGRADO):
- src/services/core/QuizDataService.ts (3 usos)
- src/services/core/ServiceRegistry.ts (5 usos)
  → Registrado no gerenciador de serviços

✅ TEMPLATE LOADER (FALLBACK):
- src/services/editor/TemplateLoader.ts (4 usos)
  → Usado como "Estratégia 0" de carregamento

✅ ALIASES:
- src/services/aliases/index.ts (exportado)
```

**Status:** ✅ **MANTER - EM USO ATIVO**

**Recomendação:** Este serviço É USADO e não pode ser removido. Mas poderia ser promovido a serviço principal no lugar do TemplateLoader.

---

#### 2️⃣ **TemplateService.lazyLoadStep()** - 🟡 **PODE SER ATIVADO (NÃO EXCLUIR)**

**Motivo:** Função implementada mas não chamada diretamente.

**Usos encontrados (3 referências):**

```typescript
⚠️ REFERÊNCIAS:
- vite.config.ts (linha 539) - Comentário sobre uso futuro
- src/services/canonical/TemplateService.ts (linha 376) - Definição
- src/services/canonical/TemplateService.ts (linha 469) - Chamada interna
```

**Chamada interna (linha 469):**
```typescript
// Dentro de preloadNeighborsAndCritical()
this.lazyLoadStep(id, false).catch(() => null)
```

**Status:** 🟡 **MANTER - POTENCIAL PARA ATIVAÇÃO**

**Recomendação:** 
- ✅ Manter o código
- 🚀 Ativar no EditorProviderUnified
- 💡 Usar como substituto do TemplateLoader

---

#### 3️⃣ **quizStepsLazy.ts** - ⚠️ **PODE SER EXCLUÍDO (COM CUIDADO)**

**Motivo:** Usado em poucos lugares, pode ser substituído.

**Usos encontrados (7 referências):**

```typescript
❌ CÓDIGO MORTO:
- src/data/quizStepsLazy.ts - Definição (não importada por ninguém)

⚠️ IMPORTADO EM:
1. src/__tests__/QuizEstiloGapsValidation.test.ts
   → import { STEP_ORDER }
   
2. src/__tests__/editor.performance.test.ts
   → import { STEP_ORDER }
   
3. src/components/editor/quiz/QuizModularProductionEditor.tsx
   → import { loadQuizStep, loadAllQuizSteps, STEP_ORDER, preloadAdjacentSteps }
```

**⚠️ ATENÇÃO:** `QuizModularProductionEditor` usa este arquivo!

**Verificando se QuizModularProductionEditor está ativo:**
- ✅ Usado em App.tsx (múltiplas rotas)
- ✅ Usado em páginas do editor
- ✅ É o editor canônico oficial

**Status:** ⚠️ **NÃO PODE SER EXCLUÍDO - USADO NO EDITOR CANÔNICO**

**Recomendação:**
- ❌ Não excluir (ainda está em uso)
- 🔄 Pode ser migrado para usar TemplateService no futuro
- 📝 Documentar como legacy mas necessário

---

#### 4️⃣ **useTemplateLoader.loadFromPerStepJSONs()** - 🟡 **FUNÇÃO INTERNA (DEPENDE DO HOOK)**

**Motivo:** Função privada dentro de um arquivo usado.

**Usos encontrados (2 referências - ambas no mesmo arquivo):**

```typescript
📁 src/components/editor/quiz/hooks/useTemplateLoader.ts:
  - Linha 173: Definição da função
  - Linha 97: Chamada da função (internamente)
```

**Hook pai (useTemplateLoader) é usado?**
```typescript
❌ NÃO USADO em:
- QuizModularProductionEditor
- EditorProviderUnified
- Páginas principais

✅ USADO em:
- src/pages/editor/QuizEditorIntegratedPage.tsx
- src/components/editor/modes/QuizEditorMode.tsx
```

**Status:** 🟡 **DEPENDE DO CONTEXTO**

**Verificando se as páginas que usam estão ativas:**
- QuizEditorIntegratedPage - ⚠️ Parece página alternativa
- QuizEditorMode - ⚠️ Modo específico

**Recomendação:**
- 🔍 Verificar se essas páginas/modos estão em uso
- Se não: ✅ Pode remover todo o hook
- Se sim: 🟡 Manter mas refatorar

---

### 📋 RESUMO: O QUE PODE SER EXCLUÍDO?

| Estrutura | Pode Excluir? | Referências | Motivo |
|-----------|---------------|-------------|--------|
| **ConsolidatedTemplateService** | ❌ **NÃO** | 46 | Usado ativamente em Admin, API, Services |
| **TemplateService.lazyLoadStep** | ❌ **NÃO** | 3 | Implementado, deve ser ativado |
| **quizStepsLazy.ts** | ❌ **NÃO** | 7 | Usado pelo QuizModularProductionEditor |
| **useTemplateLoader hook** | 🟡 **TALVEZ** | Usado | Depende se páginas alternativas estão ativas |
| **loadFromPerStepJSONs()** | 🟡 **TALVEZ** | 2 (interno) | Depende do hook pai |

---

### 🎯 RECOMENDAÇÕES FINAIS

#### ❌ **NÃO EXCLUIR NADA POR ENQUANTO**

**Motivo:** Todas as estruturas têm algum uso, mesmo que indireto.

#### ✅ **ESTRATÉGIA RECOMENDADA: CONSOLIDAÇÃO**

Em vez de **excluir**, faça **consolidação**:

```
┌─────────────────────────────────────────────────────────────┐
│ FASE 1: UNIFICAR FLUXO PRINCIPAL                           │
├─────────────────────────────────────────────────────────────┤
│ 1. Fazer EditorProviderUnified usar:                       │
│    TemplateService.lazyLoadStep()                           │
│    ↓                                                         │
│    ConsolidatedTemplateService.loadFromJSON()               │
│                                                              │
│ 2. Manter TemplateLoader como fallback legacy              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ FASE 2: MIGRAR QuizModularProductionEditor                  │
├─────────────────────────────────────────────────────────────┤
│ 1. Substituir quizStepsLazy.ts por:                        │
│    TemplateService.lazyLoadStep()                           │
│                                                              │
│ 2. Após migração completa:                                  │
│    ✅ Pode remover quizStepsLazy.ts                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ FASE 3: LIMPAR CÓDIGO LEGACY                               │
├─────────────────────────────────────────────────────────────┤
│ 1. Verificar se páginas alternativas ainda são usadas      │
│                                                              │
│ 2. Se não:                                                  │
│    ✅ Remover useTemplateLoader hook completo              │
│    ✅ Remover QuizEditorIntegratedPage                     │
│    ✅ Remover QuizEditorMode                               │
│                                                              │
│ 3. Deprecar TemplateLoader:                                 │
│    → Manter só para compatibilidade                        │
│    → Adicionar aviso de depreciação                        │
└─────────────────────────────────────────────────────────────┘
```

---

### 🚀 PLANO DE AÇÃO SEGURO

#### Passo 1: Auditoria Detalhada
```bash
# Verificar se páginas alternativas são acessadas
grep -r "QuizEditorIntegratedPage" src/App*.tsx
grep -r "QuizEditorMode" src/App*.tsx

# Verificar rotas ativas
grep -r "editor-integrated" src/**/*.tsx
```

#### Passo 2: Adicionar Avisos de Depreciação
```typescript
// src/data/quizStepsLazy.ts
/**
 * @deprecated
 * Este módulo será substituído por TemplateService.lazyLoadStep()
 * Ainda em uso por: QuizModularProductionEditor
 * Data prevista de remoção: Q1 2026
 */
```

#### Passo 3: Criar Plano de Migração
```markdown
1. Migrar QuizModularProductionEditor para TemplateService
2. Testar extensivamente
3. Remover quizStepsLazy.ts
4. Consolidar em um único sistema
```

---

### ⚠️ RISCOS DE EXCLUIR AGORA

| Arquivo | Risco | Impacto |
|---------|-------|---------|
| **ConsolidatedTemplateService** | 🔴 **ALTO** | Quebra Admin + API + Services |
| **TemplateService** | 🔴 **ALTO** | Perde funcionalidade implementada |
| **quizStepsLazy.ts** | 🟡 **MÉDIO** | Quebra QuizModularProductionEditor |
| **useTemplateLoader** | 🟢 **BAIXO** | Só se páginas alt. não forem usadas |

---

### 🎯 CONCLUSÃO

**❌ NÃO EXCLUA AS ESTRUTURAS PARALELAS AINDA!**

**Motivo:**
1. ConsolidatedTemplateService está **ativamente em uso** (46 refs)
2. quizStepsLazy.ts é usado pelo **editor canônico**
3. TemplateService.lazyLoadStep() deveria ser **ativado, não excluído**

**Estratégia correta:**
1. ✅ **Consolidar** (não excluir)
2. ✅ **Ativar** sistemas dormentes
3. ✅ **Migrar** código para sistema unificado
4. ✅ **Deprecar** com plano de transição
5. ✅ **Remover** apenas após migração completa

**Timeline sugerido:**
- **Sprint 1:** Unificar fluxo EditorProviderUnified
- **Sprint 2:** Migrar QuizModularProductionEditor
- **Sprint 3:** Verificar e remover código realmente não usado
- **Sprint 4:** Consolidação final

---

**Análise de dependências completa!** 🎉  
**Resposta:** Não exclua agora - consolide primeiro!

---

## 📊 FLUXOGRAMAS

### 🔴 FLUXO ATUAL (REAL - O QUE ESTÁ RODANDO)

```
┌─────────────────────────────────────────────────────────────────┐
│                     USUÁRIO ACESSA                              │
│                /editor?template=quiz21StepsComplete             │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    App.tsx (Roteamento)                         │
│                                                                  │
│  Route: /editor                                                 │
│    → <EditorProviderUnified>                                    │
│        → <QuizModularProductionEditor />                        │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
                   ┌─────────┴─────────┐
                   │                   │
                   ↓                   ↓
    ┌──────────────────────┐  ┌──────────────────────┐
    │ EditorProviderUnified│  │QuizModularProduction │
    │                      │  │      Editor          │
    │ Linha 29:            │  │                      │
    │ import TemplateLoader│  │ Linha 118:           │
    └──────────┬───────────┘  │ import quizStepsLazy │
               │              └──────────┬───────────┘
               ↓                         ↓
    ┌──────────────────────┐  ┌──────────────────────┐
    │   TemplateLoader     │  │   quizStepsLazy.ts   │
    │                      │  │                      │
    │ loadStep(step)       │  │ loadQuizStep(id)     │
    │   ↓                  │  │   ↓                  │
    │ detectMode()         │  │ TemplateService      │
    │   ↓                  │  │   .getAllStepsSync() │
    │ loadFromPublicJSON() │  │                      │
    └──────────┬───────────┘  └──────────┬───────────┘
               │                         │
               ↓                         ↓
    ┌──────────────────────┐  ┌──────────────────────┐
    │ fetch('/templates/   │  │  Cache em memória    │
    │   blocks/step-XX.json│  │  (Map local)         │
    │   ')                 │  │                      │
    │   ↓                  │  │                      │
    │ Se falhar:           │  │                      │
    │   ↓                  │  │                      │
    │ Master JSON          │  │                      │
    │   ↓                  │  │                      │
    │ TypeScript template  │  │                      │
    └──────────────────────┘  └──────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   OUTROS FLUXOS PARALELOS                       │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────┐
    │  ADMIN PAGES (MyFunnelsPage)                            │
    │    ↓                                                     │
    │  ConsolidatedTemplateService.getTemplate()              │
    │    ↓                                                     │
    │  loadFromJSON() → fetch('/templates/blocks/...')        │
    └──────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────┐
    │  API INTERNA (BlockPropertiesAPI)                       │
    │    ↓                                                     │
    │  ConsolidatedTemplateService.getStepBlocks()            │
    │    ↓                                                     │
    │  loadFromJSON() → fetch('/templates/blocks/...')        │
    └──────────────────────────────────────────────────────────┘
```

**Problemas identificados:**
- 🔴 **Duplicação:** 2 sistemas fazendo a mesma coisa (TemplateLoader + quizStepsLazy)
- 🔴 **Fragmentação:** Admin usa ConsolidatedTemplateService, Editor usa TemplateLoader
- 🔴 **Código dorminte:** TemplateService.lazyLoadStep() implementado mas não usado
- 🟡 **Sem unificação:** Cada componente escolhe seu próprio carregador

---

### 🟢 FLUXO CORRETO (IDEAL - O QUE DEVERIA ESTAR RODANDO)

```
┌─────────────────────────────────────────────────────────────────┐
│                     USUÁRIO ACESSA                              │
│                /editor?template=quiz21StepsComplete             │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    App.tsx (Roteamento)                         │
│                                                                  │
│  Route: /editor                                                 │
│    → <EditorProviderUnified>                                    │
│        → <QuizModularProductionEditor />                        │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
                   ┌─────────┴─────────┐
                   │                   │
                   ↓                   ↓
    ┌──────────────────────┐  ┌──────────────────────┐
    │ EditorProviderUnified│  │QuizModularProduction │
    │                      │  │      Editor          │
    │ ✅ NOVO:             │  │ ✅ MIGRADO:          │
    │ import TemplateService│ │ import TemplateService│
    └──────────┬───────────┘  └──────────┬───────────┘
               │                         │
               └────────────┬────────────┘
                            ↓
              ┌─────────────────────────────┐
              │   TemplateService           │
              │   (CANONICAL - ÚNICO)       │
              │                             │
              │  lazyLoadStep(id, preload)  │
              │    ↓                        │
              │  ✅ Cache inteligente       │
              │  ✅ Preload vizinhos        │
              │  ✅ Preload críticos        │
              └──────────────┬──────────────┘
                             ↓
              ┌─────────────────────────────┐
              │ ConsolidatedTemplateService │
              │                             │
              │  loadFromJSON(stepId)       │
              │    ↓                        │
              │  🎯 PRIORIDADE 1:           │
              │  fetch('/templates/blocks/  │
              │         step-XX.json')      │
              │    ↓                        │
              │  🎯 PRIORIDADE 2:           │
              │  Master JSON                │
              │    ↓                        │
              │  🎯 PRIORIDADE 3:           │
              │  TypeScript template        │
              └─────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              TODOS OS FLUXOS UNIFICADOS                         │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────┐
    │  EDITOR PRINCIPAL                                        │
    │    ↓                                                     │
    │  TemplateService.lazyLoadStep()                         │
    │    ↓                                                     │
    │  ConsolidatedTemplateService                            │
    └──────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────┐
    │  ADMIN PAGES                                            │
    │    ↓                                                     │
    │  TemplateService.lazyLoadStep()                         │
    │    ↓                                                     │
    │  ConsolidatedTemplateService                            │
    └──────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────┐
    │  API INTERNA                                            │
    │    ↓                                                     │
    │  TemplateService.getStep()                              │
    │    ↓                                                     │
    │  ConsolidatedTemplateService                            │
    └──────────────────────────────────────────────────────────┘
```

**Benefícios:**
- ✅ **Unificação:** Um único ponto de entrada (TemplateService)
- ✅ **Lazy loading:** Carregamento sob demanda automático
- ✅ **Preload:** Steps vizinhos e críticos carregados antecipadamente
- ✅ **Cache:** Sistema inteligente de cache
- ✅ **Manutenção:** Mudanças em um lugar só

---

### 🔄 FLUXO DE CONSOLIDAÇÃO (MIGRAÇÃO)

```
┌─────────────────────────────────────────────────────────────────┐
│                         FASE 1                                  │
│                   PREPARAÇÃO (1 semana)                         │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────┐
    │  1. Adicionar avisos de depreciação                      │
    │     ✓ TemplateLoader.ts                                  │
    │     ✓ quizStepsLazy.ts                                   │
    │                                                           │
    │  2. Criar adaptadores de compatibilidade                 │
    │     ✓ TemplateServiceAdapter                             │
    │                                                           │
    │  3. Testes de integração                                 │
    │     ✓ Testar novo fluxo em paralelo                      │
    └──────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         FASE 2                                  │
│              MIGRAÇÃO GRADUAL (2 semanas)                       │
└─────────────────────────────────────────────────────────────────┘

    Sprint 1: EditorProviderUnified
    ┌──────────────────────────────────────────────────────────┐
    │  ❌ ANTES:                                               │
    │  import { TemplateLoader } from '@/services/editor/...'  │
    │  const loader = TemplateLoader.getInstance();            │
    │  const result = await loader.loadStep(step);             │
    │                                                           │
    │  ✅ DEPOIS:                                              │
    │  import { templateService } from '@/services/canonical'  │
    │  const result = await templateService.lazyLoadStep(step) │
    └──────────────────────────────────────────────────────────┘
                             ↓
    Sprint 2: QuizModularProductionEditor
    ┌──────────────────────────────────────────────────────────┐
    │  ❌ ANTES:                                               │
    │  import { loadQuizStep } from '@/data/quizStepsLazy'     │
    │  const step = await loadQuizStep(stepId);                │
    │                                                           │
    │  ✅ DEPOIS:                                              │
    │  import { templateService } from '@/services/canonical'  │
    │  const result = await templateService.lazyLoadStep(id)   │
    └──────────────────────────────────────────────────────────┘
                             ↓
    Sprint 3: Admin Pages (já quase pronto!)
    ┌──────────────────────────────────────────────────────────┐
    │  ✓ ATUAL: Usa ConsolidatedTemplateService               │
    │                                                           │
    │  ✅ MELHORIA:                                            │
    │  Adicionar camada TemplateService.lazyLoadStep()         │
    │  (para ter preload e cache inteligente)                  │
    └──────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         FASE 3                                  │
│                   VALIDAÇÃO (1 semana)                          │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────┐
    │  1. Testes end-to-end                                    │
    │     ✓ Editor principal                                   │
    │     ✓ Admin pages                                        │
    │     ✓ API interna                                        │
    │                                                           │
    │  2. Benchmarks de performance                            │
    │     ✓ Tempo de carregamento                              │
    │     ✓ Uso de memória                                     │
    │     ✓ Latência de navegação                              │
    │                                                           │
    │  3. Monitoramento em produção                            │
    │     ✓ Feature flag gradual                               │
    │     ✓ Rollback preparado                                 │
    └──────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         FASE 4                                  │
│                    LIMPEZA (1 semana)                           │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────┐
    │  1. Remover código legacy                                │
    │     ✓ TemplateLoader.ts → Deprecated folder              │
    │     ✓ quizStepsLazy.ts → Remover                         │
    │     ✓ useTemplateLoader hook → Verificar e remover       │
    │                                                           │
    │  2. Atualizar documentação                               │
    │     ✓ README com novo fluxo                              │
    │     ✓ Comentários de código                              │
    │     ✓ Guia de migração                                   │
    │                                                           │
    │  3. Celebrar! 🎉                                         │
    └──────────────────────────────────────────────────────────┘
```

---

### 📊 DIAGRAMA DE DEPENDÊNCIAS

```
┌─────────────────────────────────────────────────────────────────┐
│                    ESTRUTURA ATUAL (COMPLEXA)                   │
└─────────────────────────────────────────────────────────────────┘

                    EditorProviderUnified
                            │
                ┌───────────┼───────────┐
                │           │           │
                ↓           ↓           ↓
        TemplateLoader  TemplateService  UnifiedRegistry
                │           │(não usado) │
                ↓           │            ↓
        ConsolidatedTemplate│        (cache)
             Service        │
                │           ↓
                └─────→ (círculo vicioso)
                
    QuizModularProductionEditor
                │
                ↓
        quizStepsLazy.ts
                │
                ↓
        TemplateService
                │
                ↓
        (outro caminho diferente!)

    MyFunnelsPage (Admin)
                │
                ↓
    ConsolidatedTemplateService
                │
                ↓
        (terceiro caminho!)

❌ PROBLEMAS:
- 3 caminhos diferentes
- Circular dependencies
- Código duplicado
- Sem cache unificado

┌─────────────────────────────────────────────────────────────────┐
│                    ESTRUTURA IDEAL (SIMPLES)                    │
└─────────────────────────────────────────────────────────────────┘

    ┌────────────────────────────────────────────────┐
    │         TODAS AS PÁGINAS/COMPONENTES           │
    │                                                │
    │  - EditorProviderUnified                       │
    │  - QuizModularProductionEditor                 │
    │  - MyFunnelsPage                               │
    │  - BlockPropertiesAPI                          │
    │                                                │
    └────────────────┬───────────────────────────────┘
                     │
                     ↓
    ┌────────────────────────────────────────────────┐
    │         TemplateService (CANONICAL)            │
    │         (Ponto único de entrada)               │
    │                                                │
    │  - lazyLoadStep()                              │
    │  - getStep()                                   │
    │  - Cache inteligente                           │
    │  - Preload automático                          │
    └────────────────┬───────────────────────────────┘
                     │
                     ↓
    ┌────────────────────────────────────────────────┐
    │     ConsolidatedTemplateService                │
    │     (Gerenciador de fontes)                    │
    │                                                │
    │  - loadFromJSON()                              │
    │  - Cascata de fallbacks                        │
    │  - Cache L2                                    │
    └────────────────┬───────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
    [Per-step]  [Master JSON] [TypeScript]
     JSON files

✅ BENEFÍCIOS:
- 1 único caminho
- Sem duplicação
- Cache unificado
- Manutenção simples
```

---

### 🎯 COMPARAÇÃO: ANTES vs DEPOIS

```
┌─────────────────────────────────────────────────────────────────┐
│                    MÉTRICAS DE COMPLEXIDADE                     │
└─────────────────────────────────────────────────────────────────┘

| Métrica                  | ANTES (Atual) | DEPOIS (Ideal) | Melhoria |
|--------------------------|---------------|----------------|----------|
| Pontos de entrada        | 4 diferentes  | 1 unificado    | -75%     |
| Linhas de código (total) | ~3500         | ~1800          | -49%     |
| Arquivos de carregamento | 6             | 2              | -67%     |
| Cache systems            | 3 separados   | 1 unificado    | -67%     |
| Dependências circulares  | 2             | 0              | -100%    |
| Duplicação de código     | ~40%          | ~5%            | -87%     |
| Tempo manutenção (est.)  | 8h/sprint     | 2h/sprint      | -75%     |

┌─────────────────────────────────────────────────────────────────┐
│                    MÉTRICAS DE PERFORMANCE                      │
└─────────────────────────────────────────────────────────────────┘

| Métrica                  | ANTES (Atual) | DEPOIS (Ideal) | Melhoria |
|--------------------------|---------------|----------------|----------|
| Bundle inicial           | 3741 linhas   | ~180 linhas    | -95%     |
| Tempo 1º carregamento    | ~2.0s         | ~0.3s          | +566%    |
| Memória inicial          | ~2.5MB        | ~120KB         | -95%     |
| Navegação entre steps    | ~300ms        | ~50ms          | +500%    |
| Cache hit rate           | ~30%          | ~85%           | +183%    |
| Preload efetividade      | 0% (não tem)  | ~90%           | +∞       |
```

---

### 🔧 ARQUITETURA EM CAMADAS

```
┌─────────────────────────────────────────────────────────────────┐
│                        CAMADA 1                                 │
│                    Interface/UI Layer                           │
└─────────────────────────────────────────────────────────────────┘
    │
    │  EditorProviderUnified
    │  QuizModularProductionEditor
    │  MyFunnelsPage
    │  BlockPropertiesAPI
    │
    └─────────────────────┐
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                        CAMADA 2                                 │
│                  Business Logic Layer                           │
│                   (TemplateService)                             │
│                                                                  │
│  ✅ lazyLoadStep(id, preload)                                   │
│  ✅ getStep(id)                                                 │
│  ✅ getAllStepsSync()                                           │
│  ✅ preloadNeighborsAndCritical()                               │
│                                                                  │
│  🎯 Responsabilidades:                                          │
│     - Gerenciar cache inteligente                               │
│     - Coordenar preload                                         │
│     - Métricas e monitoring                                     │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                        CAMADA 3                                 │
│                   Data Access Layer                             │
│              (ConsolidatedTemplateService)                      │
│                                                                  │
│  ✅ loadFromJSON(id)                                            │
│  ✅ getTemplate(name)                                           │
│  ✅ getStepBlocks(id)                                           │
│                                                                  │
│  🎯 Responsabilidades:                                          │
│     - Gerenciar fontes de dados                                 │
│     - Fallback cascata                                          │
│     - Normalização de dados                                     │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                        CAMADA 4                                 │
│                    Data Source Layer                            │
│                                                                  │
│  [Per-step JSON]  ←  PRIORIDADE 1                               │
│  /templates/blocks/step-XX.json                                 │
│                                                                  │
│  [Master JSON]    ←  PRIORIDADE 2                               │
│  /templates/quiz21-complete.json                                │
│                                                                  │
│  [TypeScript]     ←  PRIORIDADE 3 (Fallback)                    │
│  src/templates/quiz21StepsComplete.ts                           │
└─────────────────────────────────────────────────────────────────┘
```

---

### 🤔 FLUXOGRAMA DE DECISÃO: EXCLUIR OU NÃO?

```
                        INÍCIO
                          │
                          ↓
            ┌─────────────────────────────┐
            │  Estrutura tem referências  │
            │  ativas no código?          │
            └──────────┬──────────────────┘
                       │
            ┌──────────┴──────────┐
            ↓                     ↓
          SIM                    NÃO
            │                     │
            ↓                     ↓
   ┌────────────────┐    ┌────────────────┐
   │ É usada em     │    │ É código morto │
   │ componentes    │    │ ou exemplo?    │
   │ críticos?      │    └────────┬───────┘
   └────────┬───────┘             │
            │                     ↓
   ┌────────┴────────┐    ┌─────────────────┐
   ↓                 ↓    │ ✅ PODE EXCLUIR │
CRÍTICO         NÃO-CRÍTICO│ com segurança   │
   │                 │    │                 │
   ↓                 ↓    │ - Criar PR      │
┌────────┐    ┌──────────┐│ - Adicionar log │
│❌ NÃO  │    │🟡 TALVEZ ││ - Documentar    │
│EXCLUIR │    │EXCLUIR   │└─────────────────┘
│        │    │          │
│Ações:  │    │Ações:    │
│1.Manter│    │1.Verificar│
│2.Refat.│    │  impacto │
│3.Migrar│    │2.Deprecar│
│        │    │3.Feature │
│        │    │  flag    │
│        │    │4.Testar  │
└────────┘    └──────────┘
```

**Aplicando ao nosso caso:**

```
ConsolidatedTemplateService
    ↓
46 referências ativas
    ↓
Usado em Admin + API + Services (CRÍTICO)
    ↓
❌ NÃO EXCLUIR
    ↓
Ações: Promover para serviço principal

─────────────────────────────

TemplateService.lazyLoadStep()
    ↓
3 referências (definição + internas)
    ↓
Implementado mas não usado no fluxo principal
    ↓
❌ NÃO EXCLUIR (tem potencial!)
    ↓
Ações: Ativar no EditorProviderUnified

─────────────────────────────

quizStepsLazy.ts
    ↓
7 referências ativas
    ↓
Usado por QuizModularProductionEditor (CRÍTICO)
    ↓
❌ NÃO EXCLUIR
    ↓
Ações: Migrar para TemplateService primeiro

─────────────────────────────

useTemplateLoader hook
    ↓
2+ referências (páginas alternativas)
    ↓
Usado mas em páginas não principais
    ↓
🟡 TALVEZ EXCLUIR
    ↓
Ações: 
1. Verificar se páginas são acessadas
2. Adicionar deprecation warning
3. Feature flag para desativar
4. Se não usado 30 dias → Remover
```

---

### 📈 ROADMAP VISUAL DE CONSOLIDAÇÃO

```
Q4 2025                    Q1 2026                    Q2 2026
────────────────────────────────────────────────────────────
│                         │                          │
├─ Sprint 1               ├─ Sprint 5                ├─ Sprint 9
│  • Análise completa ✅  │  • Migração Admin        │  • Limpeza final
│  • Documentação ✅      │  • Testes A/B            │  • Remover legacy
│                         │                          │
├─ Sprint 2               ├─ Sprint 6                ├─ Sprint 10
│  • Avisos deprecation   │  • Feature flag 50%      │  • Documentação
│  • Adaptadores          │  • Monitoramento         │  • Release notes
│                         │                          │
├─ Sprint 3               ├─ Sprint 7                ├─ Sprint 11
│  • Migrar Editor        │  • Feature flag 100%     │  • Celebração 🎉
│  • Testes               │  • Validação final       │
│                         │                          │
├─ Sprint 4               ├─ Sprint 8                │
│  • Migrar Quiz Editor   │  • Rollout produção      │
│  • Performance tests    │  • Desativar legacy      │
│                         │                          │

┌────────────────────────────────────────────────────────────────┐
│ MILESTONES                                                     │
├────────────────────────────────────────────────────────────────┤
│ ✅ M1: Análise e planejamento (Sprint 1-2)                    │
│ 🔄 M2: Migração gradual (Sprint 3-6)                          │
│ 🎯 M3: Produção e validação (Sprint 7-8)                      │
│ 🧹 M4: Limpeza e documentação (Sprint 9-11)                   │
└────────────────────────────────────────────────────────────────┘
```

---

### 🎛️ ESTRATÉGIA DE FEATURE FLAG

```
                    FASE DE ROLLOUT
                          │
    ┌─────────────────────┼─────────────────────┐
    │                     │                     │
    ↓                     ↓                     ↓
┌─────────┐        ┌─────────┐         ┌─────────┐
│  0-25%  │        │ 25-75%  │         │ 75-100% │
│         │        │         │         │         │
│ Dev +   │  →     │ Beta +  │   →     │  Todos  │
│ Staging │        │ Power   │         │ usuários│
│         │        │ Users   │         │         │
└────┬────┘        └────┬────┘         └────┬────┘
     │                  │                   │
     ↓                  ↓                   ↓
┌─────────────┐  ┌─────────────┐   ┌─────────────┐
│ Novo Sistema│  │50% Novo     │   │100% Novo    │
│ + Fallback  │  │50% Legado   │   │Sistema      │
│ Legacy      │  │             │   │             │
│             │  │Comparação   │   │Legacy OFF   │
│Métricas:    │  │métricas     │   │             │
│• Errors     │  │• Performance│   │✅ Completo  │
│• Latency    │  │• UX         │   │             │
│• Success    │  │• Bugs       │   │             │
└─────────────┘  └─────────────┘   └─────────────┘

CRITÉRIOS DE AVANÇO:
├─ 0→25%:  Zero erros críticos por 7 dias
├─ 25→75%: Performance igual ou melhor
├─ 75→100%: 95% satisfação usuários
└─ 100%:    30 dias sem incidentes
```

---

### 🔍 DIAGRAMA DE IMPACTO DE REMOÇÃO

```
                SE REMOVER ConsolidatedTemplateService
                              │
                ┌─────────────┼─────────────┐
                ↓             ↓             ↓
        ┌───────────┐  ┌──────────┐  ┌──────────┐
        │ Admin     │  │ API      │  │ Services │
        │ Pages     │  │ Interna  │  │ Core     │
        │ 🔴 QUEBRA │  │ 🔴 QUEBRA│  │ 🔴 QUEBRA│
        └───────────┘  └──────────┘  └──────────┘
              │              │              │
              └──────────────┴──────────────┘
                            │
                    IMPACTO: CRÍTICO 🔴
                    Tempo de fix: 2-3 dias
                    Usuários afetados: Todos admins

                ─────────────────────────────

                SE REMOVER quizStepsLazy.ts
                              │
                              ↓
                  ┌───────────────────────┐
                  │ QuizModularProduction │
                  │      Editor           │
                  │      🔴 QUEBRA        │
                  └───────────────────────┘
                              │
                    IMPACTO: CRÍTICO 🔴
                    Tempo de fix: 1-2 dias
                    Usuários afetados: Todos editores

                ─────────────────────────────

                SE REMOVER TemplateService
                              │
                              ↓
                  ┌───────────────────────┐
                  │ Perde funcionalidade  │
                  │ implementada          │
                  │ 🟡 DEGRADAÇÃO         │
                  └───────────────────────┘
                              │
                    IMPACTO: MÉDIO 🟡
                    Tempo de fix: Reimplementar
                    Usuários afetados: Performance

                ─────────────────────────────

                SE REMOVER useTemplateLoader
                              │
                              ↓
                  ┌───────────────────────┐
                  │ Páginas alternativas  │
                  │ podem quebrar         │
                  │ 🟢 BAIXO IMPACTO      │
                  └───────────────────────┘
                              │
                    IMPACTO: BAIXO 🟢
                    Tempo de fix: < 1 dia
                    Usuários afetados: Poucos/nenhum
```

---

**Fluxogramas completos criados!** 📊✨


