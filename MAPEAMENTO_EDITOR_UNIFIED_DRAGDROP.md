# 🔍 MAPEAMENTO COMPLETO - Editor Unified e Problema Drag & Drop

## 📐 ESTRUTURA ATUAL DO EDITOR UNIFIED

### 🏗️ **HIERARQUIA DE COMPONENTES:**

```
EditorUnified.tsx
├── DndContext ✅
│   ├── SortableContext ✅
│   │   ├── PreviewProvider
│   │   │   ├── UnifiedQuizStepLoader
│   │   │   ├── HEADER (BrandLogo + EditorControlsManager)
│   │   │   ├── LAYOUT PRINCIPAL (flex)
│   │   │   │   ├── COLUNA 1: EditorStageManager (w-72) ❌ NÃO TEM DnD
│   │   │   │   ├── COLUNA 2: EnhancedComponentsSidebar (w-80) ✅ DRAGGABLE
│   │   │   │   ├── COLUNA 3: UnifiedPreviewEngine (flex-1) ✅ DROPPABLE
│   │   │   │   └── COLUNA 4: EditorPropertiesPanel (w-80) ❌ NÃO TEM DnD
│   │   │   └── MODAIS (FunnelSettingsPanel, SaveTemplateModal)
```

---

## 🚨 PROBLEMAS IDENTIFICADOS

### ❌ **PROBLEMA #1: ISOLAMENTO ENTRE COLUNAS**

As colunas estão **FISICAMENTE SEPARADAS** mas **LOGICAMENTE CONECTADAS** apenas pelo DndContext:

```tsx
{
  /* LAYOUT COM 4 COLUNAS SEPARADAS */
}
<div className="flex h-[calc(100vh-120px)]">
  {/* COLUNA 1: EditorStageManager - NÃO PARTICIPA DO DnD */}
  <aside className="w-72">
    <EditorStageManager /> ❌ Não tem DnD
  </aside>

  {/* COLUNA 2: EnhancedComponentsSidebar - FONTE DO DRAG */}
  <aside className="components-sidebar w-80">
    <EnhancedComponentsSidebar /> ✅ Tem useDraggable
  </aside>

  {/* COLUNA 3: UnifiedPreviewEngine - DESTINO DO DROP */}
  <main className="flex-1">
    <UnifiedPreviewEngine /> ✅ Tem useDroppable
  </main>

  {/* COLUNA 4: EditorPropertiesPanel - NÃO PARTICIPA DO DnD */}
  <aside className="w-80">
    <EditorPropertiesPanel /> ❌ Não tem DnD
  </aside>
</div>;
```

### ❌ **PROBLEMA #2: POSSÍVEL INTERFERÊNCIA CSS**

```css
/* POSSÍVEIS INTERFERÊNCIAS: */
.components-sidebar {
  background: white/95;
  backdrop-blur-sm;           /* Pode interferir com eventos */
  border-r: border-brand;
  shadow-sm;
}

.unified-editor-canvas {
  overflow: hidden;           /* Pode cortar área de drop */
  position: relative;
}

.preview-container {
  overflow: auto;             /* Pode interferir com scroll durante drag */
  position: relative;
  height: 100%;
  padding: 2rem;              /* Padding pode afetar posicionamento */
}
```

### ❌ **PROBLEMA #3: ANINHAMENTO PROFUNDO**

```
DndContext
└── SortableContext
    └── PreviewProvider
        └── div.unified-editor-container
            └── header
            └── div.flex (LAYOUT PRINCIPAL)
                ├── aside (EditorStageManager)
                ├── aside.components-sidebar
                │   └── div.h-full.flex.flex-col
                │       └── div.flex-1.overflow-hidden
                │           └── EnhancedComponentsSidebar ✅ DRAGGABLE
                └── main.unified-editor-canvas
                    └── div.preview-container
                        └── div.mx-auto.max-w-5xl
                            └── div.preview-frame
                                └── UnifiedPreviewEngine ✅ DROPPABLE
```

**O problema pode estar no ANINHAMENTO PROFUNDO entre DRAGGABLE e DROPPABLE!**

---

## 🔧 DIAGNÓSTICO DETALHADO

### **1. VERIFICAR COMUNICAÇÃO ENTRE COLUNAS**

```javascript
// Execute no Console:
console.log('🔍 === DIAGNÓSTICO COLUNAS ===');

// Verificar se componentes existem
const sidebar = document.querySelector('.components-sidebar');
const canvas = document.querySelector('.unified-editor-canvas');
const draggables = document.querySelectorAll('[data-dnd-kit-draggable-id]');
const droppables = document.querySelectorAll('[data-dnd-kit-droppable-id]');

console.log('Sidebar encontrada:', !!sidebar);
console.log('Canvas encontrado:', !!canvas);
console.log('Draggables encontrados:', draggables.length);
console.log('Droppables encontrados:', droppables.length);

// Verificar se estão dentro do DndContext
const dndContext =
  document.querySelector('[data-dnd-kit-context]') || sidebar?.closest('.unified-editor-container');
console.log('DndContext comum:', !!dndContext);
console.log('Sidebar dentro do contexto:', dndContext?.contains(sidebar));
console.log('Canvas dentro do contexto:', dndContext?.contains(canvas));
```

### **2. VERIFICAR CSS QUE PODE INTERFERIR**

```javascript
// Execute no Console:
const elementsToCheck = [
  '.components-sidebar',
  '.unified-editor-canvas',
  '.preview-container',
  '.preview-frame',
];

elementsToCheck.forEach(selector => {
  const el = document.querySelector(selector);
  if (el) {
    const style = window.getComputedStyle(el);
    console.log(`🎨 ${selector}:`, {
      pointerEvents: style.pointerEvents,
      overflow: style.overflow,
      position: style.position,
      zIndex: style.zIndex,
      transform: style.transform,
    });
  }
});
```

### **3. TESTAR COMUNICAÇÃO DIRETA**

```javascript
// Execute no Console:
window.testCommunication = () => {
  console.log('🔗 === TESTE DE COMUNICAÇÃO ===');

  // Encontrar primeiro draggable
  const draggable = document.querySelector('[data-dnd-kit-draggable-id]');
  const droppable = document.querySelector('[data-dnd-kit-droppable-id]');

  if (!draggable || !droppable) {
    console.log('❌ Elementos não encontrados');
    return;
  }

  console.log('✅ Elementos encontrados:');
  console.log('   Draggable:', draggable.getAttribute('data-dnd-kit-draggable-id'));
  console.log('   Droppable:', droppable.getAttribute('data-dnd-kit-droppable-id'));

  // Verificar distância entre elementos
  const dragRect = draggable.getBoundingClientRect();
  const dropRect = droppable.getBoundingClientRect();

  console.log('📏 Posições:');
  console.log('   Draggable:', { x: dragRect.left, y: dragRect.top });
  console.log('   Droppable:', { x: dropRect.left, y: dropRect.top });
  console.log(
    '   Distância:',
    Math.sqrt(Math.pow(dropRect.left - dragRect.left, 2) + Math.pow(dropRect.top - dragRect.top, 2))
  );

  return { draggable, droppable, dragRect, dropRect };
};
```

---

## 🎯 HIPÓTESES SOBRE O PROBLEMA

### **HIPÓTESE #1: OVERFLOW HIDDEN**

```css
.unified-editor-canvas {
  overflow: hidden; /* Pode estar cortando a área de drop */
}
```

### **HIPÓTESE #2: ANINHAMENTO PROFUNDO**

O drag precisa "viajar" através de muitas camadas:

```
DRAG: sidebar > div > div > EnhancedComponentsSidebar
DROP: main > div > div > div > UnifiedPreviewEngine
```

### **HIPÓTESE #3: Z-INDEX CONFLICTS**

Diferentes camadas podem ter z-index conflitantes

### **HIPÓTESE #4: EVENT BUBBLING**

Eventos podem estar sendo interceptados por elementos intermediários

---

## 🔧 CORREÇÕES PROPOSTAS

### **CORREÇÃO #1: SIMPLIFICAR ESTRUTURA**

```tsx
// Mover DndContext mais próximo dos elementos
<div className="flex">
  <DndContext>
    <SortableContext>
      <aside>
        <EnhancedComponentsSidebar />  <!-- DIRETO -->
      </aside>
      <main>
        <UnifiedPreviewEngine />       <!-- DIRETO -->
      </main>
    </SortableContext>
  </DndContext>
</div>
```

### **CORREÇÃO #2: REMOVER OVERFLOW HIDDEN**

```css
.unified-editor-canvas {
  /* overflow: hidden; */ /* REMOVER */
  overflow: visible; /* ADICIONAR */
}
```

### **CORREÇÃO #3: DEBUG VISUAL**

```tsx
// Adicionar outline visual para debug
<UnifiedPreviewEngine
  style={{
    outline: '2px solid red', // Debug: área droppable
    minHeight: '500px',
  }}
/>
```

---

## 🎮 **PRÓXIMAS AÇÕES**

1. **Execute os scripts de diagnóstico** no console
2. **Verifique se elementos são encontrados**
3. **Teste comunicação direta** entre colunas
4. **Aplique correções propostas** uma por vez
5. **Monitore console** para logs de drag/drop

**O problema parece estar na ESTRUTURA FÍSICA das colunas, não na lógica do DnD!** 🎯
