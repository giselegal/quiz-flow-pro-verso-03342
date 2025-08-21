// 🔍 TESTE FINAL - Executar no Console do Browser
// http://localhost:8082/editor-unified

console.log('🎯 === TESTE FINAL DRAG & DROP ===');

// 1. Verificar estrutura DnD
console.log('📍 1. Verificando estrutura DnD...');
const draggables = document.querySelectorAll('[data-dnd-kit-draggable-id]');
const droppables = document.querySelectorAll('[data-dnd-kit-droppable-id]');
console.log(`   └── Draggables: ${draggables.length}`);
console.log(`   └── Droppables: ${droppables.length}`);

// 2. Verificar se componentes da sidebar têm handlers
console.log('📍 2. Verificando componentes da sidebar...');
const sidebarItems = document.querySelectorAll('.components-sidebar [data-dnd-kit-draggable-id]');
console.log(`   └── Items sidebar: ${sidebarItems.length}`);

// 3. Verificar canvas droppable
console.log('📍 3. Verificando canvas droppable...');
const canvas = document.querySelector('[data-dnd-kit-droppable-id="canvas-dropzone"]');
console.log(`   └── Canvas encontrado: ${!!canvas}`);

// 4. Interceptar handleDragEnd para debug
console.log('📍 4. Preparando interceptação de eventos...');
window.dragEvents = [];

// Override handleDragEnd se disponível
if (window.React && window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
  console.log('   └── React DevTools disponível');
}

// 5. Teste manual de drag
window.testDragManual = () => {
  console.log('🧪 === TESTE MANUAL INICIADO ===');

  const firstDraggable = document.querySelector('[data-dnd-kit-draggable-id]');
  const dropzone = document.querySelector('[data-dnd-kit-droppable-id="canvas-dropzone"]');

  if (!firstDraggable) {
    console.log('❌ Nenhum item draggável encontrado');
    return false;
  }

  if (!dropzone) {
    console.log('❌ Canvas dropzone não encontrado');
    return false;
  }

  console.log('✅ Elementos encontrados:');
  console.log('   └── Draggable:', firstDraggable.getAttribute('data-dnd-kit-draggable-id'));
  console.log('   └── Dropzone:', dropzone.getAttribute('data-dnd-kit-droppable-id'));

  // Simular sequência de eventos
  console.log('🎬 Simulando eventos...');

  // MouseDown
  const rect = firstDraggable.getBoundingClientRect();
  const mouseDown = new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height / 2,
    button: 0,
  });

  firstDraggable.dispatchEvent(mouseDown);
  console.log('   └── 1. MouseDown disparado');

  // MouseMove (iniciar drag)
  setTimeout(() => {
    const mouseMove = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: rect.left + rect.width / 2 + 10,
      clientY: rect.top + rect.height / 2 + 10,
    });

    document.dispatchEvent(mouseMove);
    console.log('   └── 2. MouseMove disparado (iniciar drag)');

    // MouseMove sobre o dropzone
    setTimeout(() => {
      const dropRect = dropzone.getBoundingClientRect();
      const mouseMoveOver = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX: dropRect.left + dropRect.width / 2,
        clientY: dropRect.top + dropRect.height / 2,
      });

      document.dispatchEvent(mouseMoveOver);
      console.log('   └── 3. MouseMove sobre dropzone');

      // MouseUp (finalizar drop)
      setTimeout(() => {
        const mouseUp = new MouseEvent('mouseup', {
          bubbles: true,
          cancelable: true,
          clientX: dropRect.left + dropRect.width / 2,
          clientY: dropRect.top + dropRect.height / 2,
        });

        document.dispatchEvent(mouseUp);
        console.log('   └── 4. MouseUp disparado (finalizar drop)');

        // Verificar se funcionou
        setTimeout(() => {
          console.log('🎯 === RESULTADO DO TESTE ===');
          console.log('Verificando se novo bloco foi adicionado...');

          const blocksAfter = document.querySelectorAll('.preview-block-wrapper');
          console.log(`Blocos encontrados: ${blocksAfter.length}`);

          if (blocksAfter.length > 0) {
            console.log('✅ SUCESSO! Drag & Drop funcionou!');
          } else {
            console.log('❌ FALHA: Nenhum bloco adicionado');
            console.log('Verificar console para erros de handleDragEnd');
          }
        }, 500);
      }, 100);
    }, 100);
  }, 100);

  return true;
};

console.log('🎮 === EXECUTE testDragManual() PARA TESTAR ===');
console.log('Ou simplesmente arraste um componente da sidebar para o canvas');

// Adicionar listener para detectar drags reais
document.addEventListener('dragstart', e => {
  console.log('🚀 DRAG START detectado:', e.target);
});

document.addEventListener('dragend', e => {
  console.log('🎯 DRAG END detectado:', e.target);
});
