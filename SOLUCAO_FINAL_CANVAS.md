# 🎯 SOLUÇÃO FINAL - CANVAS COM ESTRUTURA REAL

## ✅ O QUE FOI FEITO

### **Mudança de Arquitetura**

**❌ ANTES (ERRADO)**:
- Tentava usar `FunnelEditingFacade` com `getSteps()` / `getSnapshot()`
- Estrutura de dados abstraída e incompatível
- Facade não tinha os dados reais do banco

**✅ AGORA (CORRETO)**:
- Usa `useUnifiedCRUD()` - MESMA estrutura do `QuizFunnelEditorWYSIWYG`
- Acessa `crud.currentFunnel.quizSteps` diretamente
- Dados reais do banco de dados carregados

---

## 📊 ARQUITETURA FINAL

```typescript
// ModularEditorLayout.tsx
const crud = useUnifiedCRUD();  // ← IGUAL ao WYSIWYG
const [steps, setSteps] = useState<EditableQuizStep[]>([]);

// Carregar steps do banco
useEffect(() => {
    const existing = (crud.currentFunnel as any)?.quizSteps as EditableQuizStep[] | undefined;
    if (existing && existing.length) {
        setSteps(existing.map(s => ({ ...s })));
    }
}, [crud.currentFunnel]);

// Salvar alterações
const handleSave = async () => {
    const updated = { ...crud.currentFunnel, quizSteps: steps };
    crud.setCurrentFunnel(updated);
    await crud.saveFunnel(updated);
};
```

---

## 🔄 FLUXO DE DADOS

```
Supabase (banco de dados)
    ↓
UnifiedCRUDProvider (autoLoad=true)
    ↓
crud.currentFunnel.quizSteps: EditableQuizStep[]
    ↓
ModularEditorLayout (gerencia steps)
    ↓
StepCanvas (renderiza blocos modulares)
    ↓
Componentes modulares (QuizIntroHeaderBlock, TextBlock, etc)
    ↓
PropertiesPanel (edita propriedades)
    ↓
crud.saveFunnel() → Salva no banco
```

---

## 📝 TIPO DE DADOS

```typescript
// EditableQuizStep = QuizStep & { id: string }
type EditableQuizStep = {
    id: string;
    type: 'intro' | 'question' | 'strategic-question' | 'transition' | 'result' | 'offer';
    
    // Intro
    title?: string;
    subtitle?: string;
    description?: string;
    
    // Question
    questionText?: string;
    options?: Array<{
        id: string;
        text: string;
        value?: string;
        points?: number;
    }>;
    
    // Result
    resultTitle?: string;
    resultDescription?: string;
    
    // Offer
    offerMap?: Record<string, any>;
    
    // Common
    image?: string;
    nextStep?: string;
    meta?: Record<string, any>;
}
```

---

## 🎨 PRÓXIMOS PASSOS

### **1. Adaptar StepCanvas para EditableQuizStep**

O `StepCanvas` precisa:
- Receber `step: EditableQuizStep` diretamente
- Extrair "blocos virtuais" do step (título, descrição, botões, etc)
- Renderizar cada "propriedade" como um bloco modular

### **2. Criar mapeamento de propriedades → blocos**

```typescript
// Exemplo para step tipo 'intro'
{
    title → QuizIntroHeaderBlock
    subtitle → TextBlock
    description → TextBlock  
    image → ImageBlock
    button → ButtonBlock
}

// Para step tipo 'question'
{
    questionText → QuizQuestionBlock
    options[] → QuizOptionsBlock
    image → ImageBlock
}
```

### **3. PropertiesPanel edita step diretamente**

```typescript
// Quando usuário edita title no painel
const updateStepProperty = (property: string, value: any) => {
    setSteps(prev => prev.map(s => 
        s.id === currentStep.id 
            ? { ...s, [property]: value }
            : s
    ));
};
```

---

## 🚀 IMPLEMENTAÇÃO IMEDIATA

Agora que a estrutura de dados está correta, precisamos:

1. ✅ **ModularEditorLayout** carrega `crud.currentFunnel.quizSteps`
2. 🔲 **StepCanvas** recebe step completo e renderiza componentes
3. 🔲 **useStepBlocks** converte properties do step em blocos virtuais
4. 🔲 **PropertiesPanel** edita properties do step
5. 🔲 **handleSave** persiste no banco via CRUD

---

## 📦 ARQUIVOS ATUALIZADOS

- ✅ `src/editor/components/ModularEditorLayout.tsx` - Agora usa `useUnifiedCRUD()`
- 🔲 `src/editor/hooks/useStepBlocks.ts` - Precisa adaptar para EditableQuizStep
- 🔲 `src/editor/components/StepCanvas.tsx` - Precisa receber EditableQuizStep
- 🔲 `src/editor/components/PropertiesPanel.tsx` - Precisa editar properties do step

---

**🔥 AGORA SIM OS DADOS ESTÃO CARREGANDO DO BANCO!**

Recarregue a página e veja os logs no console:
```
🔍 DEBUG - crud.currentFunnel: {...}
🔍 DEBUG - quizSteps: [...]
✅ Carregou X steps do banco
```
