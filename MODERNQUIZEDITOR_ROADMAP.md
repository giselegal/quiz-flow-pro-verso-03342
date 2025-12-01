# 🚀 Roadmap de Implantação - ModernQuizEditor

**Data:** 2024-12-01  
**Versão Atual:** Em Desenvolvimento  
**Status:** 🟡 Parcialmente Implementado (30%)

---

## 📊 Status Atual

### ✅ Já Implementado
- [x] **Estrutura base** do componente
  - `ModernQuizEditor.tsx` - Componente principal
  - `index.tsx` - Exports públicos
  - Zustand stores (quizStore, editorStore)
  
- [x] **Layout de 4 colunas**
  - `EditorLayout.tsx` - Container principal
  - `StepPanel.tsx` - Navegação de steps
  - `BlockLibrary.tsx` - Biblioteca de blocos
  - `Canvas.tsx` - Área de edição
  - `PropertiesPanel.tsx` - Painel de propriedades

- [x] **Sistema de cálculos**
  - `calculationEngine.ts` - Engine de pontuação
  - `CalculationRuleEditor.tsx` - Editor de regras
  - Schemas Zod para validação

- [x] **Integração básica**
  - `EditorPage.tsx` - Página usa ModernQuizEditor
  - `QuizAIPage.tsx` - Página AI usa ModernQuizEditor
  - Lazy loading configurado

### 🟡 Parcialmente Implementado
- [ ] **Drag & Drop** (dnd-kit)
  - ❌ Contexto DnD não configurado
  - ❌ Sensores não implementados
  - ❌ Handlers de drag ausentes

- [ ] **Persistência**
  - ❌ Save não conectado ao backend
  - ❌ Auto-save não implementado
  - ❌ Sincronização com Supabase ausente

- [ ] **Validação**
  - ✅ ValidationPanel existe
  - ❌ Regras de validação não implementadas
  - ❌ Feedback visual incompleto

### ❌ Não Implementado
- [ ] **Undo/Redo**
- [ ] **Snapshots/Drafts**
- [ ] **Testes E2E**
- [ ] **Documentação completa**
- [ ] **Performance optimization**
- [ ] **Keyboard shortcuts**

---

## 🎯 Fase 1: Completar Core Features (Prioridade Alta)

### 1.1 Implementar Drag & Drop System (6-8h)

**Objetivo:** Permitir drag de blocos da biblioteca para o canvas e reordenação

**Tarefas:**
```typescript
// 1. Criar DndContext wrapper no EditorLayout
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

// 2. Implementar BlockLibrary droppable items
// src/components/editor/ModernQuizEditor/layout/BlockLibrary.tsx
const { attributes, listeners, setNodeRef } = useDraggable({
  id: block.type,
  data: { blockType: block.type }
});

// 3. Implementar Canvas droppable area
// src/components/editor/ModernQuizEditor/layout/Canvas.tsx
const { setNodeRef } = useDroppable({ id: 'canvas-drop-zone' });

// 4. Handlers de drag events
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  if (!over) return;
  
  // Adicionar bloco ao quiz
  addBlock(active.data.current?.blockType, over.id);
};
```

**Arquivos a criar/modificar:**
- `src/components/editor/ModernQuizEditor/hooks/useDndHandlers.ts`
- `src/components/editor/ModernQuizEditor/layout/EditorLayout.tsx` (adicionar DndContext)
- `src/components/editor/ModernQuizEditor/layout/BlockLibrary.tsx` (draggable items)
- `src/components/editor/ModernQuizEditor/layout/Canvas.tsx` (droppable zone)

**Testes:**
```bash
# E2E test para drag & drop
npm run test:e2e -- --grep "should drag block from library to canvas"
```

### 1.2 Conectar Persistência Real (4-6h)

**Objetivo:** Salvar alterações no Supabase

**Tarefas:**
```typescript
// 1. Criar serviço de persistência
// src/components/editor/ModernQuizEditor/services/quizPersistence.ts
export async function saveQuizToSupabase(quiz: QuizSchema, funnelId: string) {
  const { data, error } = await supabase
    .from('funnels')
    .upsert({
      id: funnelId,
      quiz_data: quiz,
      updated_at: new Date().toISOString()
    });
  
  if (error) throw error;
  return data;
}

// 2. Adicionar ao quizStore
const save = async () => {
  setState({ isSaving: true, error: null });
  try {
    const savedQuiz = await saveQuizToSupabase(get().quiz, get().funnelId);
    setState({ quiz: savedQuiz, isSaving: false });
    return savedQuiz;
  } catch (error) {
    setState({ error: error.message, isSaving: false });
    throw error;
  }
};

// 3. Implementar auto-save com debounce
import { useDebounce } from '@/hooks/useDebounce';

useEffect(() => {
  const debouncedSave = debounce(() => {
    if (isDirty) {
      save();
    }
  }, 2000);
  
  debouncedSave();
  return () => debouncedSave.cancel();
}, [quiz, isDirty]);
```

**Arquivos a criar/modificar:**
- `src/components/editor/ModernQuizEditor/services/quizPersistence.ts`
- `src/components/editor/ModernQuizEditor/store/quizStore.ts` (adicionar save real)
- `src/components/editor/ModernQuizEditor/hooks/useAutoSave.ts`

### 1.3 Implementar Validação de Quiz (3-4h)

**Objetivo:** Validar estrutura e conteúdo do quiz em tempo real

**Tarefas:**
```typescript
// 1. Criar validadores
// src/components/editor/ModernQuizEditor/utils/validators.ts
export function validateQuiz(quiz: QuizSchema): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Validar steps
  if (!quiz.steps || quiz.steps.length === 0) {
    errors.push({ type: 'error', message: 'Quiz deve ter pelo menos 1 step' });
  }
  
  // Validar blocks
  quiz.steps.forEach(step => {
    if (!step.blocks || step.blocks.length === 0) {
      errors.push({ 
        type: 'warning', 
        message: `Step ${step.id} não tem blocos`,
        stepId: step.id 
      });
    }
  });
  
  return { isValid: errors.filter(e => e.type === 'error').length === 0, errors };
}

// 2. Integrar ao ValidationPanel
export default function ValidationPanel() {
  const quiz = useQuizStore(state => state.quiz);
  const validation = useMemo(() => validateQuiz(quiz), [quiz]);
  
  return (
    <div className="p-4">
      <h3>Validação</h3>
      {validation.errors.map(err => (
        <div key={err.message} className={err.type === 'error' ? 'text-red-600' : 'text-yellow-600'}>
          {err.message}
        </div>
      ))}
    </div>
  );
}
```

**Arquivos a criar/modificar:**
- `src/components/editor/ModernQuizEditor/utils/validators.ts`
- `src/components/editor/ModernQuizEditor/components/ValidationPanel.tsx` (implementar UI)
- `src/components/editor/ModernQuizEditor/store/quizStore.ts` (adicionar validação state)

---

## 🎯 Fase 2: Features Avançadas (Prioridade Média)

### 2.1 Undo/Redo System (4-6h)

**Objetivo:** Permitir desfazer/refazer alterações

**Implementação:**
- Usar `zustand/middleware/redux` ou criar custom middleware
- Armazenar histórico de estados
- Shortcuts: Ctrl+Z, Ctrl+Y

### 2.2 Snapshots/Drafts (3-4h)

**Objetivo:** Salvar versões intermediárias do quiz

**Implementação:**
- IndexedDB para armazenamento local
- Painel `SavedSnapshotsPanel.tsx` já existe (implementar lógica)
- Recovery automático após crash

### 2.3 Keyboard Shortcuts (2-3h)

**Objetivo:** Navegação e ações rápidas via teclado

**Shortcuts sugeridos:**
```
Ctrl+S     → Salvar
Ctrl+Z     → Undo
Ctrl+Y     → Redo
Delete     → Deletar bloco selecionado
Ctrl+D     → Duplicar bloco
Ctrl+↑/↓   → Navegar entre steps
```

---

## 🎯 Fase 3: Polimento e Otimização (Prioridade Baixa)

### 3.1 Performance Optimization
- Virtualização de listas grandes
- Memoização de componentes pesados
- Lazy loading de painéis

### 3.2 Testes Automatizados
- Unit tests para stores (Zustand)
- Integration tests para fluxos completos
- E2E tests com Playwright

### 3.3 Documentação
- README.md completo
- Storybook para componentes
- Guia de migração do QuizModularEditor

---

## 🔄 Migração do QuizModularEditor

### Estratégia de Transição

**Opção A: Big Bang (Recomendado)**
1. Completar Fase 1 do ModernQuizEditor
2. Testar extensivamente em staging
3. Substituir todas as rotas de uma vez
4. Manter QuizModularEditor como fallback por 2 semanas

**Opção B: Gradual (Conservador)**
1. Feature flag: `useModernEditor`
2. Rodar ambos editores em paralelo
3. Migrar usuários em lotes (10%, 50%, 100%)
4. Deprecar QuizModularEditor após 1 mês

### Checklist de Migração

```typescript
// src/config/featureFlags.ts
export const FEATURE_FLAGS = {
  useModernEditor: process.env.VITE_USE_MODERN_EDITOR === 'true',
  // Adicionar flag por rota
  modernEditorRoutes: ['/editor', '/quiz-ai'],
};

// src/pages/editor/EditorPage.tsx
const Editor = FEATURE_FLAGS.useModernEditor 
  ? ModernQuizEditor 
  : QuizModularEditor;
```

**Tarefas:**
- [ ] Criar feature flag system
- [ ] Adicionar métricas de uso (analytics)
- [ ] Comparar performance (Modern vs Legacy)
- [ ] Migrar dados do formato antigo se necessário
- [ ] Documentar breaking changes

---

## 📅 Timeline Estimado

### Sprint 1 (Semana 1-2): Core Features
- **Dia 1-3:** Drag & Drop (8h)
- **Dia 4-5:** Persistência Real (6h)
- **Dia 6-7:** Validação (4h)
- **Total:** ~18h de desenvolvimento

### Sprint 2 (Semana 3): Features Avançadas
- **Dia 1-2:** Undo/Redo (6h)
- **Dia 3:** Snapshots (4h)
- **Dia 4-5:** Keyboard Shortcuts + Polish (5h)
- **Total:** ~15h de desenvolvimento

### Sprint 3 (Semana 4): Testes e Migração
- **Dia 1-2:** Testes E2E (8h)
- **Dia 3:** Documentação (4h)
- **Dia 4-5:** Migração gradual + monitoramento (8h)
- **Total:** ~20h de desenvolvimento

**Total Estimado:** 53 horas (~7 dias úteis de trabalho full-time)

---

## 🚦 Critérios de Sucesso

### MVP (Minimum Viable Product)
- ✅ Drag & drop funcional
- ✅ Save/Load do Supabase
- ✅ Validação básica
- ✅ Navegação entre steps
- ✅ Edição de propriedades de blocos

### Produção-Ready
- ✅ Todos os itens do MVP
- ✅ Undo/Redo funcional
- ✅ Auto-save com debounce
- ✅ Testes E2E cobrindo fluxos críticos
- ✅ Performance < 100ms para interações

### Ideal
- ✅ Todos os itens de Produção-Ready
- ✅ Snapshots locais
- ✅ Keyboard shortcuts completos
- ✅ Documentação completa
- ✅ Migration guide para usuários

---

## 🔧 Próxima Ação Imediata

**COMEÇAR AGORA:**

### Tarefa 1: Implementar Drag & Drop Básico (2h)

```bash
# 1. Instalar dependência se necessário
npm install @dnd-kit/core @dnd-kit/sortable

# 2. Criar arquivo de hooks
touch src/components/editor/ModernQuizEditor/hooks/useDndHandlers.ts

# 3. Editar EditorLayout.tsx para adicionar DndContext
code src/components/editor/ModernQuizEditor/layout/EditorLayout.tsx
```

**Código inicial:**

```typescript
// src/components/editor/ModernQuizEditor/hooks/useDndHandlers.ts
import { DragEndEvent } from '@dnd-kit/core';
import { useQuizStore } from '../store/quizStore';

export function useDndHandlers() {
  const { addBlockToStep, reorderBlocks } = useQuizStore();
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    // Caso 1: Arrastar da biblioteca
    if (active.data.current?.source === 'library') {
      const blockType = active.data.current.blockType;
      const stepId = over.data.current?.stepId || 'step-01';
      addBlockToStep(stepId, blockType);
    }
    
    // Caso 2: Reordenar blocos existentes
    if (active.data.current?.source === 'canvas') {
      const fromIndex = active.data.current.index;
      const toIndex = over.data.current?.index;
      if (fromIndex !== undefined && toIndex !== undefined) {
        reorderBlocks(fromIndex, toIndex);
      }
    }
  };
  
  return { handleDragEnd };
}
```

### Tarefa 2: Adicionar método addBlockToStep ao store (30 min)

```typescript
// src/components/editor/ModernQuizEditor/store/quizStore.ts
addBlockToStep: (stepId: string, blockType: string) => {
  setState(state => {
    const step = state.quiz.steps.find(s => s.id === stepId);
    if (!step) return state;
    
    const newBlock: QuizBlock = {
      id: `block-${Date.now()}`,
      type: blockType,
      order: step.blocks.length,
      properties: {},
      content: {},
      parentId: null,
      metadata: { editable: true }
    };
    
    step.blocks.push(newBlock);
    return { ...state, isDirty: true };
  });
}
```

---

## 📞 Próxima Sessão de Desenvolvimento

**Objetivo:** Implementar Drag & Drop completo (Sprint 1, Dia 1-3)

**Preparação:**
1. Revisar documentação do dnd-kit
2. Verificar se `@dnd-kit/core` está instalado
3. Estudar fluxo atual do QuizModularEditor (referência)

**Deliverables:**
- ✅ Drag de blocos da biblioteca funciona
- ✅ Reordenação de blocos no canvas
- ✅ Feedback visual durante drag
- ✅ Teste manual validado

---

**Última atualização:** 2024-12-01  
**Próxima revisão:** Após conclusão da Fase 1  
**Status:** 🟡 Em Desenvolvimento Ativo
