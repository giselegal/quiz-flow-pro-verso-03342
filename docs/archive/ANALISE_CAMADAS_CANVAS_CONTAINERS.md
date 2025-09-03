// ANÁLISE DETALHADA: Camadas Canvas e Containers no EditorUnified
// Data: August 21, 2025

## 🔍 ESTRUTURA ATUAL DAS CAMADAS

### 📊 HIERARQUIA COMPLETA:

```
EditorUnified.tsx
├── DndContext (raiz do drag & drop)
│   ├── SortableContext (items: blockIds)
│   │   ├── PreviewProvider
│   │   │   ├── UnifiedQuizStepLoader
│   │   │   ├── div.unified-editor-container
│   │   │   │   ├── header.unified-editor-header
│   │   │   │   ├── div.flex (layout principal)
│   │   │   │   │   ├── aside.unified-editor-sidebar (stage manager)
│   │   │   │   │   ├── aside.components-sidebar (componentes)
│   │   │   │   │   ├── main.unified-editor-canvas [DROPPABLE]
│   │   │   │   │   │   ├── div.absolute (feedback visual drop)
│   │   │   │   │   │   ├── div.absolute (background pattern)
│   │   │   │   │   │   ├── UnifiedPreviewEngine-drag.tsx
│   │   │   │   │   │   │   ├── div.preview-header (EDITOR MODE ONLY)
│   │   │   │   │   │   │   ├── div.preview-container.bg-white.min-h-screen
│   │   │   │   │   │   │   │   ├── div.blocks-container.space-y-6.py-4
│   │   │   │   │   │   │   │   │   ├── SortableContext (items: blockIds)
│   │   │   │   │   │   │   │   │   │   ├── SortablePreviewBlockWrapper[] [SORTABLE]
│   │   │   │   │   │   │   │   │   │   │   ├── UniversalBlockRenderer
│   │   │   │   │   │   │   ├── PreviewDebugPanel (DEV ONLY)
│   │   │   │   │   ├── aside.unified-editor-sidebar (properties)
```

## 🎯 MODO EDIÇÃO vs MODO PRODUÇÃO

### MODE = 'edit' (Edição):

- ✅ `preview-header` VISÍVEL
- ✅ `showOutlines: true`
- ✅ `showIds: true` (se flags ativo)
- ✅ `enableInteraction: true`
- ✅ `showErrors: true`
- ✅ Drag & Drop ATIVO (useSortable disabled: false)
- ✅ Debug info VISÍVEL

### MODE = 'preview' (Preview):

- ❌ `preview-header` OCULTO
- ❌ `showOutlines: false`
- ❌ `showIds: false`
- ✅ `enableInteraction: true`
- ❌ `showErrors: false`
- ❌ Drag & Drop DESABILITADO (useSortable disabled: true)
- ❌ Debug info OCULTO

### MODE = 'production' (Produção):

- ❌ `preview-header` OCULTO
- ❌ `showOutlines: false`
- ❌ `showIds: false`
- ✅ `enableInteraction: true`
- ❌ `showErrors: false`
- ❌ Drag & Drop DESABILITADO
- ❌ Debug info OCULTO

## 🚨 PROBLEMAS IDENTIFICADOS

### 1. **DUPLICAÇÃO DE SORTABLECONTEXT**

```typescript
// NIVEL 1: EditorUnified.tsx linha ~142
<SortableContext items={blockIds} strategy={verticalListSortingStrategy}>

// NIVEL 2: UnifiedPreviewEngine-drag.tsx linha ~196
<SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
```

❌ **PROBLEMA**: SortableContext duplo pode causar conflitos

### 2. **DROPPABLE NO NÍVEL ERRADO**

```typescript
// EditorUnified.tsx - main tag
<main ref={setCanvasDroppableRef} className="unified-editor-canvas">
  <UnifiedPreviewEngine />
</main>
```

❌ **PROBLEMA**: Droppable está no container, não no canvas interno

### 3. **CONTAINERS ANINHADOS DESNECESSÁRIOS**

```typescript
// UnifiedPreviewEngine-drag.tsx
<div className="preview-container bg-white min-h-screen">
  <div className="blocks-container space-y-6 py-4">
    <SortableContext>
```

⚠️ **POSSÍVEL PROBLEMA**: Containers intermediários podem interferir

### 4. **INCONSISTÊNCIA DE ESTILOS**

```css
/* EditorUnified main */
.unified-editor-canvas {
  background: gradient-to-b from-slate-50/50 to-white;
}

/* UnifiedPreviewEngine container */
.preview-container {
  background: white;
  min-height: 100vh;
}
```

❌ **PROBLEMA**: Backgrounds conflitantes

## 🔧 CORREÇÕES SUGERIDAS

### PRIORIDADE ALTA:

1. **Remover SortableContext duplicado**
2. **Mover droppable para o container correto**
3. **Unificar estilos de background**

### PRIORIDADE MÉDIA:

4. **Simplificar hierarquia de containers**
5. **Garantir consistência entre modos**

### PRIORIDADE BAIXA:

6. **Otimizar classes CSS**
7. **Melhorar debug info**
