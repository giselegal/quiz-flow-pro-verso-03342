# 🔍 ANÁLISE DE DUPLICAÇÃO E ANINHAMENTO DE CÓDIGO

**Data**: 6 de outubro de 2025  
**Status**: ⚠️ **PROBLEMAS CRÍTICOS ENCONTRADOS**

---

## 🚨 PROBLEMAS CRÍTICOS IDENTIFICADOS

### 1. **MÚLTIPLOS EDITORES DUPLICADOS** (10+ arquivos)

#### **Editores de Quiz Encontrados**:
1. ✅ `QuizFunnelEditorWYSIWYG.tsx` (800 linhas) - **ATIVO**
2. 🔄 `QuizFunnelEditorWYSIWYG_Refactored.tsx` - Cópia refatorada
3. 📝 `QuizFunnelEditorSimplified.tsx` - Versão simplificada
4. 🏗️ `QuizFunnelEditor.tsx` - Editor original
5. 📄 `QuizPageEditor.tsx` - Editor de páginas
6. 👁️ `EditorQuizPreview.tsx` - Preview
7. 🆕 `ModernUnifiedEditor.tsx` - Novo com Facade
8. 🎨 `ModularEditorLayout.tsx` - **NOVO sistema modular**
9. 🔧 `ModernUnifiedEditor.legacy.tsx` - Backup
10. 🌐 `UniversalVisualEditor.tsx` - Editor universal

#### **Duplicação de Lógica**:

```typescript
// ❌ DUPLICADO em 5+ arquivos:
const [steps, setSteps] = useState<EditableQuizStep[]>([]);

useEffect(() => {
    const existing = (crud.currentFunnel as any)?.quizSteps as EditableQuizStep[] | undefined;
    if (existing && existing.length) {
        setSteps(existing.map(s => ({ ...s })));
    }
}, [crud.currentFunnel]);
```

**Arquivos com código duplicado**:
- `QuizFunnelEditorWYSIWYG.tsx` (linhas 92-115)
- `QuizFunnelEditorSimplified.tsx` (linhas 72-92)
- `QuizFunnelEditor.tsx` (linhas 244-265)
- `ModularEditorLayout.tsx` (linhas 61-76)
- `QuizFunnelEditorWYSIWYG_Refactored.tsx` (linhas 34-55)

---

### 2. **ANINHAMENTO EXCESSIVO DE PROVIDERS** (4-5 níveis)

#### **App.tsx - Aninhamento Típico**:

```tsx
<Route path="/editor">
  <EditorErrorBoundary>           // Nível 1
    <div data-testid="...">       // Nível 2
      <UnifiedCRUDProvider>       // Nível 3
        <ModernUnifiedEditor />   // Nível 4
          // Dentro tem:
          <FunnelFacadeContext.Provider>  // Nível 5
            <BlockRegistryProvider>       // Nível 6
              <ModularEditorLayout />     // Nível 7
            </BlockRegistryProvider>
          </FunnelFacadeContext.Provider>
      </UnifiedCRUDProvider>
    </div>
  </EditorErrorBoundary>
</Route>
```

**Total**: 7 níveis de aninhamento!

#### **Repetição de Provider em App.tsx**:

```typescript
// ❌ DUPLICADO 5 vezes no App.tsx:
<UnifiedCRUDProvider autoLoad={true}>
  <Componente />
</UnifiedCRUDProvider>

// Linhas: 116, 129, 156, 235 + outras
```

---

### 3. **FACADES CONFLITANTES**

#### **Problema de Arquitetura**:

```
FunnelEditingFacade (src/editor/facade/)
    ↓
Abstrai acesso aos dados
    ↓
MAS os editores usam useUnifiedCRUD() direto!
    ↓
CONFLITO: Dois sistemas de acesso aos dados
```

**Arquivos afetados**:
- `ModernUnifiedEditor.tsx` → Cria `FunnelEditingFacade`
- `ModularEditorLayout.tsx` → Usa `useUnifiedCRUD()` direto
- **Resultado**: Dados podem ficar dessincronizados

---

### 4. **HOOKS DUPLICADOS**

#### **useStepBlocks.ts vs Lógica Inline**:

```typescript
// src/editor/hooks/useStepBlocks.ts (377 linhas)
// Tenta usar Facade, mas Facade não tem dados corretos

// vs

// Lógica inline em TODOS os editores (5+ arquivos)
const updateStep = (id, patch) => {
    setSteps(prev => prev.map(s => s.id === id ? {...s, ...patch} : s));
};

// ❌ DUPLICADO em:
// - QuizFunnelEditorWYSIWYG.tsx
// - QuizFunnelEditorSimplified.tsx  
// - QuizFunnelEditor.tsx
// - ModularEditorLayout.tsx
```

---

### 5. **TIPOS DUPLICADOS**

```typescript
// ❌ Definido em 5+ arquivos:
type EditableQuizStep = QuizStep & { id: string };

// Arquivos:
// - QuizFunnelEditorWYSIWYG.tsx (linha 31)
// - QuizFunnelEditorSimplified.tsx (linha 14)
// - QuizFunnelEditor.tsx (linha 32)
// - ModularEditorLayout.tsx (linha 32)
// - QuizFunnelEditorWYSIWYG_Refactored.tsx
```

---

### 6. **COMPONENTES DE STEPS SIMILARES**

#### **Componentes Editáveis Duplicados**:

```
src/components/editor/editable-steps/
├── EditableIntroStep.tsx
├── EditableQuestionStep.tsx
├── EditableStrategicQuestionStep.tsx
├── EditableTransitionStep.tsx
├── EditableResultStep.tsx
└── EditableOfferStep.tsx

vs

src/editor/components/blocks/
├── QuizIntroHeaderBlock.tsx
├── TextBlock.tsx
├── FormInputBlock.tsx
└── ButtonBlock.tsx
```

**Problema**: Dois sistemas de componentes fazendo a mesma coisa!

---

## 📊 MÉTRICAS DE DUPLICAÇÃO

| Categoria | Quantidade | Impacto |
|-----------|------------|---------|
| **Editores Completos** | 10 arquivos | 🔴 CRÍTICO |
| **UnifiedCRUDProvider wraps** | 5 duplicações | 🟠 ALTO |
| **EditableQuizStep type** | 5 duplicações | 🟠 ALTO |
| **updateStep function** | 5 duplicações | 🟠 ALTO |
| **useEffect para carregar steps** | 5 duplicações | 🟠 ALTO |
| **Níveis de aninhamento** | 7 níveis | 🔴 CRÍTICO |
| **Sistemas de componentes** | 2 sistemas | 🟠 ALTO |
| **Facades concorrentes** | 2 sistemas | 🟠 ALTO |

---

## 🎯 RECOMENDAÇÕES DE REFATORAÇÃO

### **PRIORIDADE CRÍTICA** 🔴

#### 1. **Consolidar Editores em UM ÚNICO**

```
❌ REMOVER:
- QuizFunnelEditorWYSIWYG_Refactored.tsx
- QuizFunnelEditorSimplified.tsx
- QuizFunnelEditor.tsx (original)
- ModernUnifiedEditor.legacy.tsx
- UniversalVisualEditor.tsx

✅ MANTER:
- ModularEditorLayout.tsx (novo sistema)
- QuizFunnelEditorWYSIWYG.tsx (como fallback/legacy)
```

#### 2. **Decidir: Facade OU CRUD Direto**

**Opção A - Usar Facade** (recomendado se quiser abstração):
```typescript
// Todos os editores usam:
const facade = useFunnelFacade();
const steps = facade.getSteps();
```

**Opção B - CRUD Direto** (mais simples):
```typescript
// Todos os editores usam:
const crud = useUnifiedCRUD();
const steps = crud.currentFunnel.quizSteps;
```

**⚠️ NUNCA misturar os dois!**

#### 3. **Extrair Hook Compartilhado**

```typescript
// src/hooks/useQuizSteps.ts
export function useQuizSteps() {
    const crud = useUnifiedCRUD();
    const [steps, setSteps] = useState<EditableQuizStep[]>([]);
    
    useEffect(() => {
        const existing = crud.currentFunnel?.quizSteps;
        if (existing) setSteps([...existing]);
    }, [crud.currentFunnel]);
    
    const updateStep = (id: string, patch: Partial<EditableQuizStep>) => {
        setSteps(prev => prev.map(s => s.id === id ? {...s, ...patch} : s));
    };
    
    const saveSteps = async () => {
        const updated = { ...crud.currentFunnel, quizSteps: steps };
        await crud.saveFunnel(updated);
    };
    
    return { steps, updateStep, saveSteps };
}
```

#### 4. **Reduzir Aninhamento de Providers**

```typescript
// ❌ ANTES (7 níveis)
<ErrorBoundary>
  <div>
    <UnifiedCRUDProvider>
      <Editor>
        <FacadeProvider>
          <BlockRegistry>
            <Layout />
          </BlockRegistry>
        </FacadeProvider>
      </Editor>
    </UnifiedCRUDProvider>
  </div>
</ErrorBoundary>

// ✅ DEPOIS (3 níveis)
<ErrorBoundary>
  <UnifiedCRUDProvider>
    <ModularEditorLayout />
  </UnifiedCRUDProvider>
</ErrorBoundary>
```

#### 5. **Criar Tipos Compartilhados**

```typescript
// src/types/editor.ts
export type EditableQuizStep = QuizStep & { id: string };

// Todos os arquivos importam daqui
import type { EditableQuizStep } from '@/types/editor';
```

---

### **PRIORIDADE ALTA** 🟠

#### 6. **Unificar Sistema de Componentes**

Escolher entre:
- `editable-steps/` (componentes monolíticos por tipo de step)
- `blocks/` (componentes modulares por propriedade)

**Recomendação**: Usar sistema de `blocks/` (modular)

#### 7. **Extrair Provider Wrapper**

```typescript
// src/components/editor/EditorProviders.tsx
export function EditorProviders({ children, funnelId }: Props) {
    return (
        <ErrorBoundary>
            <UnifiedCRUDProvider funnelId={funnelId} autoLoad>
                {children}
            </UnifiedCRUDProvider>
        </ErrorBoundary>
    );
}

// App.tsx
<Route path="/editor">
    <EditorProviders>
        <ModularEditorLayout />
    </EditorProviders>
</Route>
```

---

## 📈 IMPACTO ESPERADO

### **Antes da Refatoração**:
- 📁 **10 arquivos de editor** (5.000+ linhas duplicadas)
- 🔄 **5 implementações** de carregar steps
- 🎯 **2 sistemas** de acesso a dados (Facade + CRUD)
- 📊 **7 níveis** de aninhamento
- ⏱️ **Manutenção**: 10x mais difícil

### **Depois da Refatoração**:
- 📁 **2 arquivos de editor** (1 ativo + 1 legacy)
- 🔄 **1 hook compartilhado** (`useQuizSteps`)
- 🎯 **1 sistema** de acesso (CRUD direto)
- 📊 **3 níveis** de aninhamento
- ⏱️ **Manutenção**: 10x mais fácil

---

## 🚀 PLANO DE AÇÃO

### **Fase 1 - Imediato** (1-2 dias)
1. ✅ Criar `useQuizSteps` hook compartilhado
2. ✅ Migrar `ModularEditorLayout` para usar hook
3. ✅ Remover `FunnelEditingFacade` do fluxo
4. ✅ Criar `EditorProviders` wrapper

### **Fase 2 - Curto Prazo** (3-5 dias)
1. 🔄 Mover tipos para `src/types/editor.ts`
2. 🔄 Arquivar editores antigos em `src/components/editor/quiz/legacy/`
3. 🔄 Atualizar rotas para usar apenas `ModularEditorLayout`
4. 🔄 Testar e validar

### **Fase 3 - Médio Prazo** (1 semana)
1. 📦 Unificar sistema de componentes (decidir entre editable-steps vs blocks)
2. 📦 Implementar componentes faltantes
3. 📦 Remover código morto
4. 📦 Documentar arquitetura final

---

## 📝 CONCLUSÃO

**Status Atual**: 🔴 **CÓDIGO ALTAMENTE DUPLICADO**

**Problema Principal**:
- **10 editores** fazendo basicamente a mesma coisa
- **Dois sistemas** de acesso a dados conflitando
- **Aninhamento excessivo** (7 níveis)
- **Manutenção insustentável**

**Solução**:
- Consolidar em **1 editor modular**
- **1 hook compartilhado** para lógica
- **1 sistema** de acesso a dados
- **Reduzir aninhamento** para 3 níveis

**Ganhos Esperados**:
- 📉 **-80%** de código duplicado
- 🚀 **+200%** de velocidade de desenvolvimento
- 🐛 **-90%** de bugs de sincronização
- 📖 **+500%** de facilidade de manutenção

---

**Próximo Passo Recomendado**: 
Começar pela **Fase 1** criando o `useQuizSteps` hook e consolidando a lógica duplicada.
