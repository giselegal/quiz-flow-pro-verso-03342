// 🔍 DEBUG SCRIPT PARA DRAG & DROP
// Execute no console do navegador para diagnosticar problemas

console.log('🚀 INICIANDO DIAGNÓSTICO DRAG & DROP...\n');

// 1. Verificar se @dnd-kit está carregado
const dndKitModules = Object.keys(window).filter(
  key => key.includes('dnd') || key.includes('Dnd') || key.includes('DND')
);
console.log('📦 Módulos @dnd-kit encontrados:', dndKitModules);

// 2. Verificar elementos draggables
const draggableElements = document.querySelectorAll(
  '[data-rbd-draggable-id], [data-testid*="draggable"], .draggable, [draggable="true"]'
);
console.log('🧩 Elementos draggables encontrados:', draggableElements.length);
draggableElements.forEach((el, i) => {
  console.log(`  ${i + 1}. ${el.tagName} - classes: ${el.className}`);
});

// 3. Verificar elementos droppable
const droppableElements = document.querySelectorAll(
  '[data-testid*="dropzone"], .dropzone, [data-testid*="canvas"]'
);
console.log('🎯 Elementos droppable encontrados:', droppableElements.length);
droppableElements.forEach((el, i) => {
  console.log(`  ${i + 1}. ${el.tagName} - classes: ${el.className}`);
});

// 4. Verificar DndContext na árvore React
const findReactFiber = dom => {
  const key = Object.keys(dom).find(key => key.startsWith('__reactFiber'));
  return dom[key];
};

const rootElement = document.getElementById('root');
if (rootElement) {
  console.log('⚛️ React Root encontrado');
  const fiber = findReactFiber(rootElement);
  if (fiber) {
    console.log('🔧 React Fiber disponível para debug');
  }
}

// 5. Testar eventos de mouse
console.log('\n🖱️ TESTE DE EVENTOS:');
console.log('Execute: testDragEvents() para testar eventos de mouse nos componentes');

window.testDragEvents = function () {
  const firstDraggable = document.querySelector('.draggable, [draggable="true"]');
  if (firstDraggable) {
    console.log('🧪 Testando eventos no primeiro elemento draggable...');

    // Simular mousedown
    const mouseDownEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });

    firstDraggable.addEventListener('mousedown', e => {
      console.log('✅ mousedown capturado!', e);
    });

    firstDraggable.dispatchEvent(mouseDownEvent);

    setTimeout(() => {
      // Simular mousemove
      const mouseMoveEvent = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX: 150,
        clientY: 150,
      });
      document.dispatchEvent(mouseMoveEvent);
      console.log('✅ mousemove disparado');

      setTimeout(() => {
        // Simular mouseup
        const mouseUpEvent = new MouseEvent('mouseup', {
          bubbles: true,
          cancelable: true,
          clientX: 200,
          clientY: 200,
        });
        document.dispatchEvent(mouseUpEvent);
        console.log('✅ mouseup disparado');
      }, 100);
    }, 100);
  } else {
    console.log('❌ Nenhum elemento draggable encontrado para teste');
  }
};

// 6. Verificar console logs do app
console.log('\n📊 LOGS DO APLICATIVO:');
console.log('Procure por logs com 🧩, 🔧, 🚀, 🎯 nos próximos eventos...');

// 7. Informações do CSS
const stylesWithCursor = Array.from(document.styleSheets).flatMap(sheet => {
  try {
    return Array.from(sheet.cssRules).filter(
      rule =>
        rule.style &&
        rule.style.cursor &&
        (rule.style.cursor.includes('grab') || rule.style.cursor.includes('move'))
    );
  } catch (e) {
    return [];
  }
});

console.log('👆 Regras CSS com cursor grab/move:', stylesWithCursor.length);

console.log('\n🎯 DIAGNÓSTICO COMPLETO!\n');
console.log('Next steps:');
console.log('1. Teste arrastar um componente da sidebar');
console.log('2. Verifique os logs que aparecem no console');
console.log('3. Execute testDragEvents() se necessário');
