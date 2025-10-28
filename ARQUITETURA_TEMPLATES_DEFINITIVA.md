# 🏗️ ARQUITETURA DE TEMPLATES - GUIA DEFINITIVO

## ✅ FONTE ÚNICA DE VERDADE

```
public/templates/quiz21-complete.json (3553 linhas)
├─ Formato: JSON normalizado v3.0
├─ Estrutura: steps.{step-id}.blocks[]
├─ Status: ✅ MASTER SOURCE
└─ Edição: Manual ou via scripts
```

---

## 📦 ARQUIVOS GERADOS (NÃO EDITAR)

### **src/templates/quiz21StepsComplete.ts**
```typescript
// ✅ GERADO AUTOMATICAMENTE
// Comando: npm run build:templates
// Script: scripts/build-templates-from-master.ts
// Formato: Block[] (editor visual)
// Status: EM USO ATIVO (30+ imports)
```

**Importadores ativos:**
- `src/core/builder.ts`
- `src/services/core/ConsolidatedTemplateService.ts`
- `src/adapters/QuizToEditorAdapter.ts`
- `src/pages/admin/MyFunnelsPage.tsx`
- `src/contexts/funnel/FunnelsContext.tsx`
- E mais 25+ arquivos

**Uso correto:**
```typescript
import { QUIZ_STYLE_21_STEPS_TEMPLATE, getStepTemplate } from '@/templates/quiz21StepsComplete';

// Carregar step específico
const blocks = getStepTemplate('step-02');

// Ou acessar diretamente
const blocks = QUIZ_STYLE_21_STEPS_TEMPLATE['step-02'];
```

---

## ❌ ARQUIVOS DEPRECATED

### **src/data/quizSteps.ts**
```typescript
// ⚠️ DEPRECATED - MIGRAÇÃO CONCLUÍDA (Core 100%)
// Motivo: Duplica dados de quiz21-complete.json
// Status: 11 arquivos core migrados ✅
// Remaining: Scripts e testes (legacy aceito)
// Formato: QuizStep interface (antigo)
// Documentação: Ver MIGRATION_STATUS.md
```

**NÃO USE MAIS EM CÓDIGO DE PRODUÇÃO:**
```typescript
// ❌ EVITE ISSO:
import { QUIZ_STEPS, STEP_ORDER } from '@/data/quizSteps';
const step = QUIZ_STEPS['step-02'];
```

**USE ISSO:**
```typescript
// ✅ USE TEMPLATESERVICE:
import { templateService } from '@/services/canonical/TemplateService';

// Síncrono (recomendado para editor/hooks)
const allSteps = templateService.getAllStepsSync();
const stepOrder = templateService.getStepOrder();
const step = allSteps['step-02'];

// Assíncrono (para operações complexas)
const result = await templateService.getStep('step-02');
if (result.success) {
  const blocks = result.data;
  // Use blocks aqui
}
```

**✅ Type imports são sempre OK:**
```typescript
// Isso é permitido (não cria dependência runtime)
import type { QuizStep } from '@/data/quizSteps';
```

---

## 🔄 FLUXO DE DADOS CORRETO

```
┌─────────────────────────────────────────────────────────┐
│  FONTE ÚNICA: quiz21-complete.json                      │
│  ├─ 21 steps                                            │
│  ├─ Blocos normalizados                                 │
│  └─ Metadata                                            │
└─────────────────────────────────────────────────────────┘
                        ↓
          npm run build:templates
          (scripts/build-templates-from-master.ts)
                        ↓
┌─────────────────────────────────────────────────────────┐
│  GERADO: quiz21StepsComplete.ts                         │
│  ├─ QUIZ_STYLE_21_STEPS_TEMPLATE                        │
│  ├─ getStepTemplate()                                   │
│  └─ Cache otimizado                                     │
└─────────────────────────────────────────────────────────┘
                        ↓
          TemplateService.getInstance()
          (src/services/canonical/TemplateService.ts)
                        ↓
┌─────────────────────────────────────────────────────────┐
│  RUNTIME: Componentes e Hooks                           │
│  ├─ useTemplateLoader (migrado ✅)                      │
│  ├─ useUnifiedQuizLoader (migrado ✅)                   │
│  ├─ useQuizState (em migração ⏳)                       │
│  └─ Outros componentes                                  │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 TEMPLATESERVICE - API CANÔNICA

### **Métodos Disponíveis:**

```typescript
import { TemplateService } from '@/services/canonical/TemplateService';

const templateService = TemplateService.getInstance();

// 1. Buscar step específico
const stepResult = await templateService.getStep('step-02');
// Retorna: ServiceResult<Block[]>

// 2. Buscar template completo
const templateResult = await templateService.getTemplate('step-02');
// Retorna: ServiceResult<Template>

// 3. Listar todos os templates
const listResult = templateService.listTemplates();
// Retorna: ServiceResult<Template[]>

// 4. Buscar por query
const searchResult = templateService.searchTemplates('intro');
// Retorna: ServiceResult<Template[]>

// 5. Invalidar cache
templateService.invalidateTemplate('step-02');

// 6. Limpar todo cache
templateService.clearCache();
```

### **ServiceResult Pattern:**
```typescript
interface ServiceResult<T> {
  success: boolean;
  data: T;
  error?: Error;
}

// Uso com verificação
const result = await templateService.getStep('step-02');
if (result.success) {
  const blocks = result.data; // Block[]
} else {
  console.error('Erro:', result.error);
}
```

---

## 🔄 MIGRAÇÃO EM ANDAMENTO

### **Status Atual:**

| Arquivo | Status | Prioridade |
|---------|--------|-----------|
| useTemplateLoader.ts | ✅ Migrado | - |
| useUnifiedQuizLoader.ts | ✅ Migrado | - |
| TemplateEngineQuizEstiloPage.tsx | 🗑️ Deletado | - |
| useQuizState.ts | ⏳ Próximo | 🔴 CRÍTICO |
| QuizEditorBridge.ts | ⏳ Fila | 🔴 CRÍTICO |
| UnifiedQuizBridge.ts | ⏳ Fila | 🔴 CRÍTICO |
| useEditorBootstrap.ts | ⏳ Fila | 🟡 ALTO |
| quizValidationUtils.ts | ⏳ Fila | 🟡 ALTO |
| computeResult.ts | ⏳ Fila | 🟡 ALTO |

### **Estratégia:**
1. Migrar arquivos **CRÍTICOS** primeiro (hooks de estado e bridges)
2. Migrar **UTILS** (validação, resultado)
3. Migrar **COMPONENTES** de editor
4. Migrar **TESTES**
5. **DELETAR** quizSteps.ts quando todos migrarem

---

## 📝 REGRAS IMPORTANTES

### ✅ **PERMITIDO:**
- ✅ Importar de `@/templates/quiz21StepsComplete`
- ✅ Usar `TemplateService.getInstance()`
- ✅ Editar `quiz21-complete.json` diretamente
- ✅ Rodar `npm run build:templates` após edição

### ❌ **PROIBIDO:**
- ❌ Editar `quiz21StepsComplete.ts` manualmente (é gerado)
- ❌ Importar de `@/data/quizSteps` (deprecated)
- ❌ Criar novos imports de `QUIZ_STEPS` constante
- ❌ Duplicar conteúdo de templates em outros arquivos

---

## 🔍 DIFERENÇAS ENTRE FORMATOS

### **Block[] (quiz21StepsComplete.ts)**
```typescript
// Formato do editor visual
{
  id: "intro-title",
  type: "intro-title",
  order: 0,
  content: {
    title: "Chega de um guarda-roupa lotado..."
  },
  properties: {
    padding: 16
  }
}
```

### **QuizStep (quizSteps.ts - DEPRECATED)**
```typescript
// Formato antigo
{
  id: "step-01",
  type: "intro",
  title: "Chega de um guarda-roupa lotado...",
  formQuestion: "Como posso te chamar?",
  placeholder: "Digite seu primeiro nome...",
  buttonText: "Quero Descobrir meu Estilo Agora!"
}
```

### **Conversão (QuizStepAdapter)**
```typescript
import { QuizStepAdapter } from '@/adapters/QuizStepAdapter';

// Block[] → QuizStep (temporário durante migração)
const quizStep = QuizStepAdapter.fromBlocks(blocks, 'step-02');
```

---

## 🎯 RESUMO EXECUTIVO

| Item | Status | Observação |
|------|--------|-----------|
| **Fonte única** | ✅ `quiz21-complete.json` | Master source |
| **Arquivo gerado** | ✅ `quiz21StepsComplete.ts` | Não editar |
| **Service canônico** | ✅ `TemplateService` | API unificada |
| **Arquivo deprecated** | ⚠️ `quizSteps.ts` | **Migração Core: 100% ✅** |
| **Cache** | ✅ 5min TTL | Otimizado |
| **Telemetria** | ✅ Integrada | CanonicalServicesMonitor |
| **Build Status** | ✅ 0 erros | Produção funcional |
| **Arquivos Migrados** | ✅ 11 core files | Ver MIGRATION_STATUS.md |

---

## 📊 STATUS DA MIGRAÇÃO (Atualizado: 28/10/2025)

### ✅ Migração Completa (Core 100%)

**Arquivos Migrados com Sucesso:**
- ✅ Hooks (2): useQuizState, useEditorBootstrap
- ✅ Services (2): QuizEditorBridge, UnifiedQuizBridge
- ✅ Utils (2): quizValidationUtils, StepDataAdapter
- ✅ Components (3): QuizModularProductionEditor, QuizProductionEditor, QuizFunnelEditor
- ✅ Debug Tools (1): QuizFunnelEditorDebug
- ✅ Outros (1): quizConversionUtils (já estava limpo)

**Estatísticas:**
- 📊 Erros corrigidos: 700+ → 17 (redução de 97%)
- 📊 Linhas migradas: ~9,500+
- 📊 Build status: ✅ Totalmente funcional
- 📊 Testes validados: 54 (22 validação + 32 conversão)

### 🟡 Legacy Aceito (Documentado)

**Scripts** (~5 arquivos):
- seed-draft.ts, check-quiz-steps.ts, validate-sync-quiz-steps-templates.ts
- Justificativa: Scripts auxiliares, não afetam produção

**Testes** (~10 arquivos):
- fullQuizFlow.test.tsx, QuestionStep.test.tsx, QuizModularProductionEditor.test.tsx
- Justificativa: Testes podem usar dados estáticos/mocks

**Arquivos Deprecated** (~40 arquivos):
- archived/, deprecated/, legacy/
- Justificativa: Código não usado, será removido futuramente

**📚 Documentação Completa:** Ver `MIGRATION_STATUS.md` para detalhes completos.

---

## 📞 CONTATO E SUPORTE

Para dúvidas sobre a arquitetura de templates:
- Documentação: Este arquivo
- Service: `src/services/canonical/TemplateService.ts`
- Adapter: `src/adapters/QuizStepAdapter.ts`
- Issue: Criar issue com tag `[templates]`
