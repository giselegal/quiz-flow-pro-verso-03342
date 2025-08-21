// 🔍 SCRIPT DE DEBUG REVERSO - Detecção de Pontos Cegos
// Execute no Console do Browser para encontrar o problema

console.log('🔍 === MAPEAMENTO REVERSO DO DRAG & DROP ===');

// 1. Verificar se DndContext está presente
const dndContextElement = document.querySelector('[data-dnd-context]') || 
                         document.querySelector('[role="application"]') ||
                         document.querySelector('.unified-editor-container');

console.log('📍 1. DndContext detectado:', !!dndContextElement);
if (dndContextElement) {
  console.log('   └── Elemento:', dndContextElement.tagName, dndContextElement.className);
}

// 2. Verificar componentes draggáveis
const draggableItems = document.querySelectorAll('[draggable="true"], [data-dnd-kit-draggable-id]');
console.log('📍 2. Itens draggáveis encontrados:', draggableItems.length);
draggableItems.forEach((item, index) => {
  console.log(`   └── Item ${index}:`, {
    id: item.getAttribute('data-dnd-kit-draggable-id') || item.id,
    draggable: item.draggable,
    element: item.tagName,
    classes: item.className
  });
});

// 3. Verificar áreas de drop
const droppableAreas = document.querySelectorAll('[data-dnd-kit-droppable-id]');
console.log('📍 3. Áreas de drop encontradas:', droppableAreas.length);
droppableAreas.forEach((area, index) => {
  console.log(`   └── Área ${index}:`, {
    id: area.getAttribute('data-dnd-kit-droppable-id'),
    element: area.tagName,
    classes: area.className
  });
});

// 4. Verificar se componentes da sidebar têm event listeners
const sidebarComponents = document.querySelectorAll('.components-sidebar [draggable], .components-sidebar button');
console.log('📍 4. Componentes da sidebar:', sidebarComponents.length);
sidebarComponents.forEach((comp, index) => {
  const hasMouseDown = comp.onmousedown || comp.getAttribute('onmousedown');
  const hasPointerEvents = window.getComputedStyle(comp).pointerEvents;
  console.log(`   └── Componente ${index}:`, {
    hasMouseDown: !!hasMouseDown,
    pointerEvents: hasPointerEvents,
    cursor: window.getComputedStyle(comp).cursor,
    draggable: comp.draggable
  });
});

// 5. Verificar CSS que pode interferir
const problemElements = [];
document.querySelectorAll('*').forEach(el => {
  const style = window.getComputedStyle(el);
  if (style.pointerEvents === 'none' && el.contains(document.querySelector('.components-sidebar'))) {
    problemElements.push({element: el, issue: 'pointer-events: none'});
  }
  if (style.userSelect === 'none' && el.contains(document.querySelector('.components-sidebar'))) {
    problemElements.push({element: el, issue: 'user-select: none'});
  }
});

console.log('📍 5. Elementos problemáticos encontrados:', problemElements.length);
problemElements.forEach((prob, index) => {
  console.log(`   └── Problema ${index}:`, prob.issue, prob.element);
});

// 6. Testar evento de mouse manualmente
const testDrag = () => {
  const firstDraggable = document.querySelector('[data-dnd-kit-draggable-id]');
  if (firstDraggable) {
    console.log('📍 6. Testando evento manual no primeiro draggable...');
    
    // Simular mousedown
    const mouseDownEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100
    });
    
    firstDraggable.dispatchEvent(mouseDownEvent);
    console.log('   └── MouseDown disparado');
    
    // Simular mousemove após 100ms
    setTimeout(() => {
      const mouseMoveEvent = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX: 200,
        clientY: 200
      });
      document.dispatchEvent(mouseMoveEvent);
      console.log('   └── MouseMove disparado');
    }, 100);
    
    // Simular mouseup após 200ms
    setTimeout(() => {
      const mouseUpEvent = new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
        clientX: 300,
        clientY: 300
      });
      document.dispatchEvent(mouseUpEvent);
      console.log('   └── MouseUp disparado');
    }, 200);
  } else {
    console.log('❌ Nenhum elemento draggável encontrado para teste');
  }
};

// 7. Verificar React DevTools
console.log('📍 7. Verificando contextos React...');
if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  console.log('   └── React DevTools disponível');
} else {
  console.log('   └── React DevTools não encontrado');
}

// 8. Verificar se @dnd-kit está carregado
console.log('📍 8. Verificando @dnd-kit...');
if (window.__dndKit || document.querySelector('[data-dnd-kit-context]')) {
  console.log('   └── @dnd-kit detectado');
} else {
  console.log('   └── @dnd-kit pode não estar ativo');
}

console.log('🎯 === EXECUTE testDrag() para testar evento manual ===');
window.testDrag = testDrag;
