# 🔍 DEBUG: Por que não funciona na prática?

## ❌ Problemas Identificados

### 1. **Drop Zone pode não estar visível**
```tsx
// BlockRow.tsx linha 45-60
className={cn(
    'h-3 -my-1.5 relative transition-all duration-200 border-2 rounded',
    isOver
        ? 'bg-blue-100 border-blue-400 border-dashed'
        : 'border-transparent hover:bg-blue-50 hover:border-blue-300 hover:border-dashed'
)}
```

**Problema**: 
- `h-3` é muito pequeno (12px)
- `-my-1.5` pode estar colapsando com margens
- `border-transparent` torna invisível quando não hover

### 2. **Cálculo de blockIndex pode estar errado**
```tsx
// BlockRow.tsx linha 86
const blockIndex = allBlocks.filter(b => !b.parentId).findIndex(b => b.id === block.id);
```

**Problema**:
- Filtra blocos sem parentId PRIMEIRO
- Depois busca o índice no array filtrado
- Isso pode gerar índices errados!

**Exemplo**:
```javascript
allBlocks = [
  { id: 'a', parentId: null, order: 0 },  // índice real: 0
  { id: 'b', parentId: 'a', order: 1 },   // (child - ignorar)
  { id: 'c', parentId: null, order: 2 }   // índice real: 2
]

// Cálculo atual para bloco 'c':
allBlocks.filter(b => !b.parentId) // [a, c]
  .findIndex(b => b.id === 'c')     // retorna 1 ❌

// Mas o índice real no array original é 2! ✅
```

### 3. **Drop Zone ID pode não estar sendo detectado**
```tsx
// QuizModularProductionEditor.tsx linha 1207-1217
if (over.id && String(over.id).startsWith('drop-before-')) {
    const targetBlockId = String(over.id).replace('drop-before-', '');
    const targetBlockIndex = currentStep.blocks.findIndex(b => b.id === targetBlockId && !b.parentId);
    if (targetBlockIndex >= 0) {
        insertPosition = targetBlockIndex; // Inserir ANTES do bloco
        console.log(`🎯 Drop zone detectado: inserindo ANTES do bloco ${targetBlockId} na posição ${insertPosition}`);
    }
}
```

**Problema**:
- Busca `targetBlockId` em `currentStep.blocks`
- Mas também filtra por `!b.parentId`
- Se o bloco tem parentId, não funciona!

### 4. **DndContext pode não envolver os drop zones**

Preciso verificar se o DndContext do QuizModularProductionEditor envolve os BlockRow e seus DropZones.

---

## ✅ Soluções

### Solução 1: Tornar Drop Zone mais visível
```tsx
<div
    ref={setNodeRef}
    className={cn(
        'h-8 -my-2 relative transition-all duration-200 border-2 rounded-md', // Aumentar de h-3 para h-8
        isOver
            ? 'bg-blue-100 border-blue-400 border-dashed'
            : 'bg-gray-50 border-gray-300 border-dashed opacity-40 hover:opacity-100 hover:bg-blue-50 hover:border-blue-400' // Sempre visível!
    )}
>
```

### Solução 2: Corrigir cálculo de blockIndex
```tsx
// Usar o índice real no array original, não no filtrado
const blockIndex = allBlocks.findIndex(b => b.id === block.id);
```

### Solução 3: Simplificar detecção no handleDragEnd
```tsx
if (over.id && String(over.id).startsWith('drop-before-')) {
    const targetBlockId = String(over.id).replace('drop-before-', '');
    const targetBlockIndex = currentStep.blocks.findIndex(b => b.id === targetBlockId); // Remover filtro parentId
    if (targetBlockIndex >= 0) {
        insertPosition = targetBlockIndex;
        console.log(`🎯 Drop zone detectado: inserindo ANTES do bloco ${targetBlockId} na posição ${insertPosition}`);
    }
}
```

### Solução 4: Adicionar logs para debug
```tsx
console.log('🎯 DROP EVENT:', {
    activeId: active.id,
    overId: over?.id,
    isDropZone: String(over?.id || '').startsWith('drop-before-'),
    currentStepBlocks: currentStep?.blocks.length
});
```

---

## 🧪 Como Testar

1. **Abrir DevTools (F12)**
2. **Ir para Console**
3. **Arrastar um componente da biblioteca**
4. **Verificar logs**:
   ```
   🎯 DROP EVENT: {
     activeId: "lib:heading",
     overId: "drop-before-step1-block1",
     isDropZone: true,
     currentStepBlocks: 3
   }
   🎯 Drop zone detectado: inserindo ANTES do bloco step1-block1 na posição 0
   ```

5. **Verificar se o bloco foi inserido na posição correta**

---

## 📋 Checklist de Verificação

- [ ] Drop zones estão VISÍVEIS no canvas (borda tracejada cinza)
- [ ] Ao arrastar da biblioteca, drop zones ficam AZUIS
- [ ] Console mostra "🎯 DROP EVENT" quando solto
- [ ] Console mostra "🎯 Drop zone detectado"
- [ ] Bloco é inserido na POSIÇÃO CORRETA
- [ ] Order dos blocos é recalculado corretamente

---

## 🚨 Problemas Comuns

### "Não vejo as drop zones"
→ Aumentar altura e tornar sempre visíveis (ver Solução 1)

### "Drop zones aparecem mas não funciona"
→ Verificar logs no console (ver Solução 4)

### "Bloco é inserido na posição errada"
→ Corrigir cálculo de índice (ver Solução 2 e 3)

### "Nada acontece ao soltar"
→ Verificar se DndContext envolve os componentes

---

## 🔧 Aplicar Correções

Execute o script de correção:
```bash
node apply-drag-drop-fixes.js
```

Ou aplique manualmente as soluções acima.
