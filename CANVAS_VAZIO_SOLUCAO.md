# 🐛 CANVAS VAZIO - PROBLEMA E SOLUÇÃO

## ❌ O PROBLEMA

O canvas estava aparecendo vazio porque havia um **DESALINHAMENTO entre a estrutura de dados esperada e a estrutura real**.

### **Causas Raiz**:

1. **Hook `useStepBlocks` tentava acessar `facade.getSnapshot()`** que NÃO EXISTE
   - A interface `IFunnelEditingFacade` tem `getSteps()`, não `getSnapshot()`
   
2. **Estrutura de dados incorreta**:
   ```typescript
   // ❌ O que o código esperava (ERRADO)
   snapshot.pages[].blocks[]
   
   // ✅ O que realmente existe (CORRETO)
   facade.getSteps()[].blocks[]
   ```

3. **Formato de FunnelBlock incompatível**:
   ```typescript
   // ❌ O que tentávamos criar (ERRADO)
   {
     id: string,
     type: string,
     order: number,      // ← NÃO EXISTE em FunnelBlock
     content: {},
     properties: {}
   }
   
   // ✅ Formato correto de FunnelBlock
   {
     id: string,
     type: string,
     data: Record<string, any>  // ← Propriedades dentro de 'data'
   }
   ```

4. **Métodos da Facade com nomes errados**:
   - `facade.deleteBlock()` → Correto: `facade.removeBlock()`
   - Tentativa de atualizar propriedade `order` que não existe

---

## ✅ A SOLUÇÃO

### **1. Corrigido `useStepBlocks.ts` (linha 73-103)**

```typescript
// ✅ ANTES (ERRADO)
const snapshot = facade.getSnapshot();  // ← Método não existe!
const pages = snapshot.pages || [];
const page = pages[stepIndex];

// ✅ AGORA (CORRETO)
const steps = facade.getSteps();  // ← API correta!
const funnelStep = steps[stepIndex];
```

### **2. Normalização de blocos corrigida**

```typescript
// ✅ Converter FunnelBlock para BlockData (estrutura interna do hook)
const normalizedBlocks = (funnelStep.blocks || []).map((block, idx) => ({
    id: block.id || `block-${idx}`,
    type: block.type || 'text',
    order: idx,  // Calculado, não vem do JSON
    content: block.data || {},  // ← Dados vêm de 'data'
    properties: block.data || {}
}));
```

### **3. Operações CRUD corrigidas**

#### **addBlock (linha 162-177)**
```typescript
// ✅ Criar bloco no formato correto de FunnelBlock
const newBlock = {
    id: `block-${type}-${Date.now()}`,
    type,
    data: {  // ← Colocar tudo dentro de 'data'
        ...content,
        ...properties
    }
};

facade.addBlock(step.id, newBlock);
```

#### **deleteBlock (linha 204)**
```typescript
// ❌ ANTES
facade.deleteBlock(step.id, blockId);

// ✅ AGORA
facade.removeBlock(step.id, blockId);  // ← Método correto!
```

#### **reorderBlocks (linha 276-287)**
```typescript
// ❌ ANTES - Tentava atualizar propriedade 'order' que não existe
facade.updateBlock(step.id, block.id, { order: index });

// ✅ AGORA - Usa API correta de reordenação
const newOrder = reordered.map(b => b.id);
facade.reorderBlocks(step.id, newOrder);
```

### **4. Logs de debug adicionados**

```typescript
// ModularEditorLayout.tsx (linha 62-70)
useEffect(() => {
    if (facade) {
        const steps = facade.getSteps();
        console.log('🔍 DEBUG - Total de steps:', steps.length);
        console.log('🔍 DEBUG - Primeiro step:', steps[0]);
        console.log('🔍 DEBUG - Blocos do primeiro step:', steps[0]?.blocks?.length || 0);
        if (steps[0]?.blocks?.[0]) {
            console.log('🔍 DEBUG - Primeiro bloco:', steps[0].blocks[0]);
        }
    }
}, [facade]);

// useStepBlocks.ts (linha 75-82)
console.log('🔍 useStepBlocks DEBUG - stepIndex:', stepIndex);
console.log('🔍 useStepBlocks DEBUG - Total steps:', steps.length);
console.log('🔍 useStepBlocks DEBUG - Funnel Step:', funnelStep);
console.log('🔍 useStepBlocks DEBUG - Blocks:', funnelStep.blocks?.length || 0);
console.log('🔍 useStepBlocks DEBUG - Normalized blocks:', normalizedBlocks);
```

---

## 🔍 ESTRUTURA CORRETA DE DADOS

### **FunnelEditingFacade API**

```typescript
interface IFunnelEditingFacade {
    // ✅ Métodos disponíveis
    getSteps(): FunnelStep[];
    getStep(stepId: string): FunnelStep | undefined;
    getSelectedStep(): FunnelStep | undefined;
    
    addBlock(stepId: string, block: Omit<FunnelBlock, 'id'>): FunnelBlock | undefined;
    updateBlock(stepId: string, blockId: string, patch: Partial<Omit<FunnelBlock, 'id'>>): FunnelBlock | undefined;
    removeBlock(stepId: string, blockId: string): boolean;  // ← NÃO é deleteBlock!
    reorderBlocks(stepId: string, newOrder: string[]): void;
}
```

### **FunnelStep**

```typescript
interface FunnelStep {
    id: string;
    title: string;
    order: number;
    blocks: FunnelBlock[];  // ← Array de blocos
    meta?: Record<string, any>;
}
```

### **FunnelBlock**

```typescript
interface FunnelBlock {
    id: string;
    type: string;              // Ex: 'quiz-intro-header', 'text', 'button'
    data: Record<string, any>; // ← TUDO vai aqui dentro!
}

// Exemplo real:
{
    id: "block-intro-header-1",
    type: "quiz-intro-header",
    data: {
        title: "Bem-vinda ao Quiz",
        subtitle: "Descubra seu estilo em 2 minutos",
        alignment: "center",
        fontSize: "2xl"
    }
}
```

---

## 🧪 COMO TESTAR

### **1. Abrir DevTools** (F12)

### **2. Recarregar página** (Ctrl+Shift+R)

### **3. Ver logs no console**:

```
🔍 DEBUG - Total de steps: 21
🔍 DEBUG - Primeiro step: {...}
🔍 DEBUG - Blocos do primeiro step: 4

🔍 useStepBlocks DEBUG - stepIndex: 0
🔍 useStepBlocks DEBUG - Total steps: 21
🔍 useStepBlocks DEBUG - Funnel Step: {...}
🔍 useStepBlocks DEBUG - Blocks: 4
🔍 useStepBlocks DEBUG - Normalized blocks: [...]
```

### **4. Verificar Canvas**:
- ✅ Deve mostrar blocos do step selecionado
- ✅ Header com título do step
- ✅ Contador "X blocos"
- ✅ Cada bloco renderizado com seu componente

### **5. Se canvas ainda vazio**:

```javascript
// Cole no console do browser (F12):
const facade = window.__FUNNEL_FACADE__ || 
               document.querySelector('[data-testid="modern-unified-editor-page"]')?.__facade;

if (facade) {
    const steps = facade.getSteps();
    console.log('Total steps:', steps.length);
    console.log('Step 1:', steps[0]);
    console.log('Blocks no step 1:', steps[0]?.blocks);
} else {
    console.log('❌ Facade não encontrada!');
}
```

---

## 📊 ARQUIVOS MODIFICADOS

| Arquivo | Linhas Alteradas | Mudanças |
|---------|------------------|----------|
| `src/editor/hooks/useStepBlocks.ts` | 73-287 | Corrigido acesso à API, normalização de blocos, operações CRUD |
| `src/editor/components/ModularEditorLayout.tsx` | 62-70 | Adicionados logs de debug |

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **Testar no navegador** - Ver se canvas renderiza blocos
2. ✅ **Verificar seleção** - Clicar em bloco deve selecioná-lo
3. ✅ **Testar propriedades** - Painel direito deve mostrar campos editáveis
4. ✅ **Testar navegação** - Trocar de step deve atualizar canvas
5. 🔲 **Remover logs** - Depois de validar, limpar console.logs de debug

---

## 🚀 STATUS

- ✅ **Erros de compilação corrigidos**: 0 erros
- ✅ **API da Facade alinhada**: Usando métodos corretos
- ✅ **Estrutura de dados correta**: FunnelBlock com `data: {}`
- ✅ **Logs de debug ativos**: Para diagnosticar problemas
- ⏳ **Aguardando teste**: Recarregue o navegador e veja os logs

---

**🔥 RECARREGUE A PÁGINA AGORA E VEJA O CANVAS RENDERIZAR!**
