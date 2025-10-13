# 🏗️ UNIFIED QUIZ ARCHITECTURE - Documentação Completa

## 📋 Visão Geral

Sistema unificado que elimina fragmentação entre Editor e Runtime de Quiz, usando schema intermediário para garantir consistência.

## 🎯 Problema Resolvido

**ANTES (Fragmentado):**
```
QuizStep (runtime) ━━━━━━━━━━━━━━━━✗ Fragmentação
                                    ✗ Duplicação  
Block[] (editor) ━━━━━━━━━━━━━━━━━✗ Inconsistência
                                    ✗ Conversões complexas
JSONv3 (templates) ━━━━━━━━━━━━━━━✗ 3 formatos diferentes
```

**DEPOIS (Unificado):**
```
                    UnifiedQuizStep
                    (Schema Central)
                          ↕️
        ┌─────────────────┼─────────────────┐
        ↓                 ↓                  ↓
    QuizStep          Block[]           JSONv3
   (runtime)         (editor)         (templates)
```

## 📦 Componentes do Sistema

### 1. UnifiedQuizStep (Schema Central)

```typescript
interface UnifiedQuizStep {
  // Identificação
  id: string;
  stepNumber: number;
  type: QuizStep['type'];
  
  // Conteúdo estruturado
  sections: Array<{
    type: string;
    content: Record<string, any>;
    style?: Record<string, any>;
  }>;
  
  // Metadados
  metadata: {
    version: string;
    source: 'quizstep' | 'blocks' | 'json';
  };
  
  // Preservação dos dados originais
  raw: {
    quizStep?: QuizStep;
    blocks?: Block[];
    json?: JSONv3Template;
  };
}
```

### 2. UnifiedQuizStepAdapter (Conversores)

```typescript
// QuizStep → Unified
UnifiedQuizStepAdapter.fromQuizStep(quizStep, stepId)

// Block[] → Unified
UnifiedQuizStepAdapter.fromBlocks(blocks, stepId)

// JSONv3 → Unified
UnifiedQuizStepAdapter.fromJSON(json)

// Unified → QuizStep
UnifiedQuizStepAdapter.toQuizStep(unified)

// Unified → Block[]
UnifiedQuizStepAdapter.toBlocks(unified)

// Unified → JSONv3
UnifiedQuizStepAdapter.toJSON(unified)
```

### 3. useUnifiedQuizLoader (Hook de Carregamento)

```typescript
const { steps, loadStep, isLoading } = useUnifiedQuizLoader({
  source: 'hardcoded' | 'templates' | 'database',
  funnelId?: string,
  enableCache?: boolean
});
```

**Fontes de dados:**
- `hardcoded`: QUIZ_STEPS (produção atual)
- `templates`: Arquivos JSON v3.0
- `database`: Supabase (futuro)

### 4. UnifiedQuizBridge (Gerenciador)

```typescript
const bridge = UnifiedQuizBridge.getInstance();

// Carregar funil completo
const funnel = await bridge.loadProductionFunnel();

// Carregar step individual
const step = await bridge.loadStep('step-01', 'hardcoded');

// Exportar para JSON v3.0
const templates = await bridge.exportToJSONv3('funnel-id');

// Validar integridade
const validation = await bridge.validateFunnel('funnel-id');
```

### 5. useUnifiedQuiz (Hook Simplificado)

```typescript
// Carregar step individual
const { step, isLoading } = useUnifiedQuiz('step-01');

// Carregar funil completo
const { funnel, isLoading } = useUnifiedQuiz();

// Carregar múltiplos steps
const { steps } = useUnifiedQuizSteps(['step-01', 'step-02']);
```

## 🔄 Fluxos de Conversão

### Fluxo 1: Runtime → Editor

```typescript
// 1. QuizStep de produção
const quizStep = QUIZ_STEPS['step-01'];

// 2. Converter para Unified
const unified = UnifiedQuizStepAdapter.fromQuizStep(quizStep, 'step-01');

// 3. Extrair blocks para editor
const blocks = UnifiedQuizStepAdapter.toBlocks(unified);
```

### Fluxo 2: Editor → Runtime

```typescript
// 1. Blocks do editor
const blocks = editorContext.blocks;

// 2. Converter para Unified
const unified = UnifiedQuizStepAdapter.fromBlocks(blocks, 'step-01');

// 3. Extrair QuizStep para runtime
const quizStep = UnifiedQuizStepAdapter.toQuizStep(unified);
```

### Fluxo 3: Template → Runtime/Editor

```typescript
// 1. Carregar JSON v3.0
const json = await fetch('/templates/step-01-v3.json').then(r => r.json());

// 2. Converter para Unified
const unified = UnifiedQuizStepAdapter.fromJSON(json);

// 3. Extrair formato desejado
const quizStep = UnifiedQuizStepAdapter.toQuizStep(unified);
const blocks = UnifiedQuizStepAdapter.toBlocks(unified);
```

## 🧪 Testes Automatizados

### UnifiedQuizStepAdapter (15 testes)
- ✅ Conversões QuizStep ↔ Unified
- ✅ Conversões Block[] ↔ Unified
- ✅ Conversões JSONv3 ↔ Unified
- ✅ Round-trip preservation
- ✅ Metadata handling
- ✅ Error handling

### useUnifiedQuizLoader (15 testes)
- ✅ Hardcoded source loading
- ✅ Template source loading
- ✅ Cache behavior
- ✅ Loading states
- ✅ Auto-load on mount
- ✅ Multiple step loading

### Total: 30+ testes automatizados

## 📊 Benefícios

### 1. Eliminação de Fragmentação
- ❌ ANTES: 3 formatos incompatíveis
- ✅ AGORA: 1 schema central unificado

### 2. Preservação de Dados
- Conversões não destrutivas
- Dados originais preservados em `raw`
- Round-trip validation

### 3. Fonte Única de Verdade
- Editor e Runtime usam mesmos dados
- Cache unificado
- Validação centralizada

### 4. Extensibilidade
- Fácil adicionar novos formatos
- Schema versioned
- Metadata tracking

### 5. Testabilidade
- 30+ testes automatizados
- Round-trip validation
- Error handling coverage

## 🚀 Uso nos Componentes

### Componente Quiz Runtime

```typescript
import { useUnifiedQuiz } from '@/hooks/useUnifiedQuiz';

function QuizStep({ stepId }) {
  const { step, isLoading } = useUnifiedQuiz(stepId);
  
  if (isLoading) return <Loading />;
  if (!step) return <Error />;
  
  // Usar step.sections para renderizar
  return <StepRenderer sections={step.sections} />;
}
```

### Componente Editor

```typescript
import { UnifiedQuizStepAdapter } from '@/adapters/UnifiedQuizStepAdapter';

function EditorCanvas({ stepId }) {
  const [blocks, setBlocks] = useState([]);
  
  // Carregar
  useEffect(() => {
    async function load() {
      const unified = await unifiedQuizBridge.loadStep(stepId);
      if (unified) {
        setBlocks(UnifiedQuizStepAdapter.toBlocks(unified));
      }
    }
    load();
  }, [stepId]);
  
  // Salvar
  async function save() {
    const unified = UnifiedQuizStepAdapter.fromBlocks(blocks, stepId);
    await unifiedQuizBridge.saveStep(stepId, unified);
  }
  
  return <BlockEditor blocks={blocks} onChange={setBlocks} onSave={save} />;
}
```

## 🔮 Próximos Passos

1. **Database Integration**
   - Criar tabela `quiz_production` no Supabase
   - Implementar salvamento/carregamento do banco
   - Migrar dados hardcoded para DB

2. **Real-time Sync**
   - Implementar sync entre editor e runtime
   - Preview em tempo real
   - Collaborative editing

3. **Versioning**
   - Sistema de versionamento de steps
   - Rollback capabilities
   - Change history

4. **Performance**
   - Lazy loading de steps
   - Optimistic updates
   - Background sync

## 📝 Checklist de Migração

Para migrar componentes existentes:

- [ ] Substituir `useTemplateLoader` por `useUnifiedQuizLoader`
- [ ] Substituir `QuizEditorBridge` por `UnifiedQuizBridge`
- [ ] Usar `UnifiedQuizStepAdapter` para conversões
- [ ] Adicionar testes para novos fluxos
- [ ] Remover código fragmentado antigo
- [ ] Atualizar documentação

## 🎓 Princípios Arquiteturais

1. **Single Source of Truth**: UnifiedQuizStep como schema central
2. **Non-Destructive Conversions**: Dados originais preservados
3. **Bidirectional Flow**: Conversões em ambas direções
4. **Cache First**: Performance via caching inteligente
5. **Type Safety**: TypeScript em toda stack
6. **Test Coverage**: 30+ testes automatizados

---

**Status**: ✅ Fases 2-5 completas
**Próximo**: Integração completa e migração de componentes legados
