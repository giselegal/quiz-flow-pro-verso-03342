// 🔍 DIAGNÓSTICO CRÍTICO - Comunicação entre Colunas
// Execute no Console do Browser: http://localhost:8082/editor-unified

console.log('🚨 === DIAGNÓSTICO CRÍTICO COLUNAS ===');

// 1. VERIFICAR ESTRUTURA FÍSICA
console.log('📍 1. Verificando estrutura física...');
const sidebar = document.querySelector('.components-sidebar');
const canvas = document.querySelector('.unified-editor-canvas');
const stageManager = document.querySelector('.unified-editor-sidebar');
const propertiesPanel = document.querySelectorAll('.unified-editor-sidebar')[1];

console.log('   └── Sidebar Componentes:', !!sidebar);
console.log('   └── Canvas Principal:', !!canvas);
console.log('   └── Stage Manager:', !!stageManager);
console.log('   └── Properties Panel:', !!propertiesPanel);

// 2. VERIFICAR ELEMENTOS DnD
console.log('📍 2. Verificando elementos DnD...');
const draggables = document.querySelectorAll('[data-dnd-kit-draggable-id]');
const droppables = document.querySelectorAll('[data-dnd-kit-droppable-id]');

console.log('   └── Draggables encontrados:', draggables.length);
draggables.forEach((el, i) => {
  console.log(`       ${i+1}. ID: ${el.getAttribute('data-dnd-kit-draggable-id')}`);
  console.log(`          Dentro da sidebar: ${sidebar?.contains(el)}`);
});

console.log('   └── Droppables encontrados:', droppables.length);
droppables.forEach((el, i) => {
  console.log(`       ${i+1}. ID: ${el.getAttribute('data-dnd-kit-droppable-id')}`);
  console.log(`          Dentro do canvas: ${canvas?.contains(el)}`);
});

// 3. VERIFICAR CONTEXTO DnD COMUM
console.log('📍 3. Verificando contexto DnD...');
const container = document.querySelector('.unified-editor-container');
const dndContext = container || document.body;

console.log('   └── Container comum:', !!container);
console.log('   └── Sidebar no contexto:', dndContext?.contains(sidebar));
console.log('   └── Canvas no contexto:', dndContext?.contains(canvas));

// 4. VERIFICAR CSS INTERFERÊNCIA
console.log('📍 4. Verificando CSS que pode interferir...');
const elementsToCheck = [
  {name: 'Sidebar', element: sidebar},
  {name: 'Canvas', element: canvas},
  {name: 'Preview Container', element: document.querySelector('.preview-container')},
  {name: 'Preview Frame', element: document.querySelector('.preview-frame')}
];

elementsToCheck.forEach(({name, element}) => {
  if (element) {
    const style = window.getComputedStyle(element);
    const problemas = [];
    
    if (style.pointerEvents === 'none') problemas.push('pointer-events: none');
    if (style.overflow === 'hidden') problemas.push('overflow: hidden');
    if (style.userSelect === 'none') problemas.push('user-select: none');
    if (style.touchAction !== 'auto') problemas.push(`touch-action: ${style.touchAction}`);
    
    console.log(`   └── ${name}:`, problemas.length ? problemas : '✅ OK');
  }
});

// 5. TESTE DE POSICIONAMENTO
console.log('📍 5. Testando posicionamento entre colunas...');
if (sidebar && canvas) {
  const sidebarRect = sidebar.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();
  
  console.log('   └── Sidebar posição:', {
    left: sidebarRect.left,
    top: sidebarRect.top,
    width: sidebarRect.width,
    height: sidebarRect.height
  });
  
  console.log('   └── Canvas posição:', {
    left: canvasRect.left,
    top: canvasRect.top,
    width: canvasRect.width,
    height: canvasRect.height
  });
  
  const distance = Math.sqrt(
    Math.pow(canvasRect.left - sidebarRect.right, 2) + 
    Math.pow(canvasRect.top - sidebarRect.top, 2)
  );
  
  console.log(`   └── Distância entre colunas: ${distance}px`);
  console.log(`   └── Canvas à direita da sidebar: ${canvasRect.left > sidebarRect.right}`);
}

// 6. VERIFICAR EVENT LISTENERS
console.log('📍 6. Verificando event listeners...');
const firstDraggable = document.querySelector('[data-dnd-kit-draggable-id]');
if (firstDraggable) {
  console.log('   └── Primeiro draggable encontrado:', firstDraggable.getAttribute('data-dnd-kit-draggable-id'));
  
  // Verificar se tem event listeners
  const hasListeners = firstDraggable.onmousedown || 
                      firstDraggable.ontouchstart ||
                      firstDraggable.ondragstart;
  console.log('   └── Tem event listeners diretos:', !!hasListeners);
  
  // Verificar cursor
  const cursor = window.getComputedStyle(firstDraggable).cursor;
  console.log('   └── Cursor:', cursor);
  
  // Verificar se é draggable
  console.log('   └── Atributo draggable:', firstDraggable.draggable);
} else {
  console.log('   └── ❌ Nenhum elemento draggable encontrado!');
}

// 7. TESTE MANUAL DE COMUNICAÇÃO
window.testColunasCommunication = () => {
  console.log('🧪 === TESTE MANUAL COMUNICAÇÃO ===');
  
  const draggable = document.querySelector('[data-dnd-kit-draggable-id]');
  const droppable = document.querySelector('[data-dnd-kit-droppable-id="canvas-dropzone"]');
  
  if (!draggable) {
    console.log('❌ Draggable não encontrado');
    return false;
  }
  
  if (!droppable) {
    console.log('❌ Droppable canvas não encontrado');
    return false;
  }
  
  console.log('✅ Ambos elementos encontrados');
  console.log('📍 Draggable:', draggable.getAttribute('data-dnd-kit-draggable-id'));
  console.log('📍 Droppable:', droppable.getAttribute('data-dnd-kit-droppable-id'));
  
  // Destacar visualmente os elementos
  draggable.style.outline = '3px solid green';
  droppable.style.outline = '3px solid red';
  
  console.log('🎨 Elementos destacados: Verde=Draggable, Vermelho=Droppable');
  
  // Simular evento de drag simples
  console.log('🎬 Simulando evento de drag...');
  
  const dragRect = draggable.getBoundingClientRect();
  const dropRect = droppable.getBoundingClientRect();
  
  // MouseDown no draggable
  const mouseDown = new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
    clientX: dragRect.left + dragRect.width / 2,
    clientY: dragRect.top + dragRect.height / 2
  });
  
  draggable.dispatchEvent(mouseDown);
  console.log('   └── 1. MouseDown disparado no draggable');
  
  // MouseMove para iniciar drag
  setTimeout(() => {
    const mouseMove1 = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: dragRect.left + dragRect.width / 2 + 10,
      clientY: dragRect.top + dragRect.height / 2 + 10
    });
    
    document.dispatchEvent(mouseMove1);
    console.log('   └── 2. MouseMove iniciado (10px)');
    
    // MouseMove sobre o droppable
    setTimeout(() => {
      const mouseMove2 = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX: dropRect.left + dropRect.width / 2,
        clientY: dropRect.top + dropRect.height / 2
      });
      
      document.dispatchEvent(mouseMove2);
      console.log('   └── 3. MouseMove sobre droppable');
      
      // MouseUp para finalizar
      setTimeout(() => {
        const mouseUp = new MouseEvent('mouseup', {
          bubbles: true,
          cancelable: true,
          clientX: dropRect.left + dropRect.width / 2,
          clientY: dropRect.top + dropRect.height / 2
        });
        
        document.dispatchEvent(mouseUp);
        console.log('   └── 4. MouseUp finalizado');
        
        // Verificar resultado após 1 segundo
        setTimeout(() => {
          console.log('🎯 === RESULTADO DO TESTE ===');
          
          // Remover outline
          draggable.style.outline = '';
          droppable.style.outline = '';
          
          // Verificar se novos blocos foram adicionados
          const newBlocks = document.querySelectorAll('.preview-block-wrapper, .block-content');
          console.log(`📦 Blocos encontrados após teste: ${newBlocks.length}`);
          
          if (newBlocks.length > 0) {
            console.log('✅ SUCESSO! Comunicação funcionou!');
          } else {
            console.log('❌ FALHA! Nenhum bloco adicionado');
            console.log('🔍 Verificar se handleDragEnd foi chamado no console');
          }
        }, 1000);
        
      }, 100);
    }, 100);
  }, 100);
  
  return true;
};

// 8. VERIFICAR SCROLL E OVERFLOW
console.log('📍 8. Verificando scroll e overflow...');
const scrollableElements = document.querySelectorAll('[style*="overflow"], .overflow-auto, .overflow-hidden');
console.log(`   └── Elementos com overflow: ${scrollableElements.length}`);
scrollableElements.forEach((el, i) => {
  const style = window.getComputedStyle(el);
  console.log(`       ${i+1}. overflow: ${style.overflow}, element: ${el.className.slice(0, 30)}`);
});

console.log('🎮 === EXECUTE testColunasCommunication() PARA TESTAR ===');
console.log('Ou arraste manualmente da sidebar verde para o canvas vermelho');
