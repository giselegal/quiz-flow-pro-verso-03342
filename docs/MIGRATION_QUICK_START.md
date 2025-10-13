# 🚀 MIGRATION GUIDE - Sistema Unificado

## 📝 Checklist de Migração

### Fase 1: Substituir Hooks Antigos ✅

#### ANTES:
```typescript
import { useTemplateLoader } from '@/hooks/useTemplateLoader';
const { loadQuizEstiloTemplate } = useTemplateLoader();
const step = await loadQuizEstiloTemplate(1);
```

#### DEPOIS:
```typescript
import { useUnifiedQuiz } from '@/hooks/useUnifiedQuiz';
const { step, isLoading } = useUnifiedQuiz('step-01');
```

---

### Fase 2: Usar UnifiedQuizBridge ✅

#### ANTES:
```typescript
import { QuizEditorBridge } from '@/services/QuizEditorBridge';
const bridge = new QuizEditorBridge();
const funnel = await bridge.loadFunnelForEdit('production');
```

#### DEPOIS:
```typescript
import { unifiedQuizBridge } from '@/services/UnifiedQuizBridge';
const funnel = await unifiedQuizBridge.loadProductionFunnel();
```

---

## 🎯 Exemplos Práticos

Ver arquivo: `docs/INTEGRATION_EXAMPLES.tsx`

### 1. Carregar Step Individual
```typescript
const step = await unifiedQuizBridge.loadStep('step-01', 'hardcoded');
```

### 2. Converter para Editor
```typescript
const blocks = UnifiedQuizStepAdapter.toBlocks(unified);
```

### 3. Salvar Edições
```typescript
const unified = UnifiedQuizStepAdapter.fromBlocks(blocks, stepId);
await unifiedQuizBridge.saveStep(stepId, unified);
```

### 4. Export/Import JSON v3.0
```typescript
const templates = await unifiedQuizBridge.exportToJSONv3('production');
const funnel = await unifiedQuizBridge.importFromJSONv3(templates);
```

### 5. Validar Integridade
```typescript
const validation = await unifiedQuizBridge.validateFunnel('production');
```

---

## 📦 Arquivos Criados

- ✅ `src/adapters/UnifiedQuizStepAdapter.ts` - Conversões bidirecionais
- ✅ `src/hooks/useUnifiedQuizLoader.ts` - Hook de carregamento
- ✅ `src/hooks/useUnifiedQuiz.ts` - Hook simplificado
- ✅ `src/services/UnifiedQuizBridge.ts` - Bridge consolidado
- ✅ `src/__tests__/UnifiedQuizStepAdapter.test.ts` - 15 testes
- ✅ `src/__tests__/useUnifiedQuizLoader.test.ts` - 15 testes
- ✅ `src/__tests__/UnifiedQuizBridge.test.ts` - 10 testes
- ✅ `docs/UNIFIED_QUIZ_ARCHITECTURE.md` - Arquitetura completa
- ✅ `docs/INTEGRATION_EXAMPLES.tsx` - Exemplos práticos

---

## ✅ Status Final

**Sistema Unificado**: 100% Implementado
**Testes Automatizados**: 40+ testes passando
**Documentação**: Completa
**Integração**: Funcionando em produção (/quiz-estilo)
