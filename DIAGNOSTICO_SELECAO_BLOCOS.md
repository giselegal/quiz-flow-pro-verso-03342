# 🔍 DIAGNÓSTICO: Problema de Seleção de Blocos

**Data:** 27 de novembro de 2025  
**Status:** 🔴 EM INVESTIGAÇÃO

---

## 📊 Resultados dos Testes Automatizados

### ✅ Pontos Positivos
- Blocos são renderizados corretamente (7 blocos encontrados)
- Nenhum erro no console
- Nenhum warning de hooks do React
- DOM está estável (sem loops infinitos)
- Performance boa (0 mutações excessivas)

### ❌ Problema Identificado
**Seleção de blocos NÃO funciona**
- Blocos têm `onclick` handler
- Clicks são capturados
- MAS a seleção visual não é aplicada
- `onBlockSelect` parece não estar sendo chamado ou não está propagando

---

## 🔍 Análise do Código

### Fluxo de Seleção Esperado

```
1. Click no bloco (CanvasColumn/SortableBlockItem)
   ↓
2. handleBlockClick() captura evento
   ↓
3. onSelect(blockId) é chamado
   ↓  
4. onBlockSelect prop do CanvasColumn
   ↓
5. Callback inline em QuizModularEditor:
   onBlockSelect={(id) => {
     if (previewMode === 'live') {
       wysiwyg.actions.selectBlock(id);
     }
     handleBlockSelect(id);
   }}
   ↓
6. handleBlockSelect(id) atualiza estado
   ↓
7. setSelectedBlock(id) via unified provider
   ↓
8. Re-render com selectedBlockId atualizado
   ↓
9. Classes visuais aplicadas (border-blue-500, bg-blue-50)
```

### 🚨 Possíveis Pontos de Falha

#### 1. **DnD Sensors Bloqueando Clicks**
Os sensores de `@dnd-kit` podem estar interceptando eventos antes de chegarem ao handler:

```typescript
const pointerSensor = useSensor(PointerSensor, {
  activationConstraint: {
    distance: 5,
    tolerance: 5,
  },
});
```

**Problema**: Se o usuário move o mouse > 5px durante o click, o sensor pode interpretar como início de drag e cancelar o click.

#### 2. **onBlockSelect Não Chegando ao CanvasColumn**
Verificar se a prop está sendo passada corretamente:

```typescript
// Em QuizModularEditor/index.tsx
<CanvasColumnInner
  onBlockSelect={(id) => {  // ✅ Definido inline
    if (previewMode === 'live') {
      wysiwyg.actions.selectBlock(id);
    }
    handleBlockSelect(id);
  }}
/>
```

#### 3. **React.memo Bloqueando Re-render**
O `CanvasColumnInner` tem memo que pode estar bloqueando updates:

```typescript
export default React.memo(CanvasColumnInner, (prev, next) => (
  // ...
  prev.onBlockSelect === next.onBlockSelect &&  // ⚠️ Função inline sempre muda!
  // ...
));
```

**Problema**: Função inline cria nova referência a cada render → memo detecta mudança → mas pode estar causando inconsistência.

#### 4. **SortableBlockItem Não Recebendo onSelect**
Verificar se o `onSelect` está sendo passado corretamente:

```typescript
<SortableBlockItem
  key={b.id}
  block={b}
  onSelect={onBlockSelect}  // ✅ Passando a prop
  // ...
/>
```

---

## 🔧 Correções Implementadas

### 1. Logs Diagnósticos Adicionados

**CanvasColumn/index.tsx:**
```typescript
const handleBlockClick = useCallback((e: React.MouseEvent) => {
  console.log('🎯 [CanvasColumn] CLICK CAPTURADO:', {
    blockId: block.id,
    blockType: block.type,
    hasOnSelect: !!onSelect,
    onSelectType: typeof onSelect
  });
  
  if (!onSelect) {
    console.error('❌ [CanvasColumn] onSelect é undefined!');
    return;
  }
  
  onSelect(block.id);
  console.log('✅ [CanvasColumn] onSelect chamado com sucesso');
}, [block.id, block.type, onSelect]);
```

**QuizModularEditor/index.tsx:**
```typescript
const handleBlockSelect = useCallback((blockId: string | null) => {
  console.log('🎯 [handleBlockSelect] ENTRADA:', { blockId });
  
  if (!blockId) {
    console.log('⚠️  [handleBlockSelect] Limpando seleção');
    setSelectedBlock(null);
    return;
  }
  
  console.log('✅ [handleBlockSelect] Setando selectedBlock:', blockId);
  setSelectedBlock(blockId);
  // ...
}, [setSelectedBlock]);
```

---

## 🧪 Próximos Passos

### Teste Manual no Navegador
1. Abrir `http://localhost:8080/editor?funnel=quiz21StepsComplete&template=quiz21StepsComplete`
2. Abrir DevTools Console (F12)
3. Clicar em um bloco
4. Verificar logs:
   - `🎯 [CanvasColumn] CLICK CAPTURADO`
   - `✅ [CanvasColumn] onSelect chamado`
   - `🎯 [handleBlockSelect] ENTRADA`
   - `✅ [handleBlockSelect] Setando selectedBlock`

### Se Logs Não Aparecem
**Significa que:**
- O handler `handleBlockClick` não está sendo executado
- O DnD está bloqueando eventos
- O elemento não tem o handler anexado

**Soluções:**
1. Desabilitar temporariamente DnD para testar
2. Usar `pointer-events: none` nos elementos internos do bloco
3. Adicionar `e.preventDefault()` antes de `e.stopPropagation()`

### Se Logs Aparecem mas Seleção Não Funciona
**Significa que:**
- O estado está sendo atualizado
- Mas o re-render não está aplicando classes visuais
- Ou o `selectedBlockId` não está chegando corretamente ao componente

**Soluções:**
1. Verificar se `selectedBlockId` prop está sendo passada corretamente
2. Verificar se `isSelected` está sendo calculado corretamente
3. Adicionar log no render de `SortableBlockItem`:
```typescript
console.log('Renderizando bloco:', {
  id: block.id,
  isSelected,
  selectedBlockId
});
```

---

## 🎯 Hipótese Principal

**O problema mais provável é o DnD PointerSensor bloqueando clicks.**

### Solução Proposta

Modificar os sensores para serem mais permissivos com clicks:

```typescript
export function useSafeDndSensors() {
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,      // Aumentar de 5 para 8
      tolerance: 8,     // Aumentar de 5 para 8
      delay: 100,       // ✨ ADICIONAR: delay antes de ativar drag
    },
  });
  
  // ...
}
```

### OU: Usar MouseSensor em vez de PointerSensor

```typescript
import { MouseSensor } from '@dnd-kit/core';

const mouseSensor = useSensor(MouseSensor, {
  activationConstraint: {
    distance: 10,
  },
});
```

`MouseSensor` é menos agressivo que `PointerSensor` e permite clicks normais mais facilmente.

---

## 📝 Checklist de Investigação

- [x] Verificar se blocos são renderizados
- [x] Verificar erros no console
- [x] Verificar warnings de hooks
- [x] Adicionar logs diagnósticos
- [ ] Testar manualmente no navegador
- [ ] Verificar se logs aparecem no console
- [ ] Testar com DnD desabilitado
- [ ] Modificar sensores do DnD
- [ ] Verificar React.memo do CanvasColumn
- [ ] Verificar propagação de onBlockSelect

---

## 🔗 Arquivos Relevantes

- `/src/components/editor/quiz/QuizModularEditor/components/SafeDndContext.tsx` - Configuração dos sensores
- `/src/components/editor/quiz/QuizModularEditor/components/CanvasColumn/index.tsx` - Handler de click
- `/src/components/editor/quiz/QuizModularEditor/index.tsx` - Callback de seleção
- `/src/core/providers/UnifiedEditorProvider.tsx` - Estado global

---

**Aguardando teste manual no navegador para continuar investigação...**
