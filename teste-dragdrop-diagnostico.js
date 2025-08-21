// TESTE DE DIAGNÓSTICO: Drag & Drop no Editor Unificado
// Execute no console do browser em http://localhost:8082/editor-unified

console.log('🔍 DIAGNÓSTICO DRAG & DROP - EDITOR UNIFICADO');
console.log('==============================================');

// 1. Verificar se DndContext existe
const dndContext = document.querySelector('[data-dnd-kit-dnd-context]');
console.log('🎯 DndContext encontrado:', !!dndContext);

// 2. Verificar componentes arrastáveis
const draggables = document.querySelectorAll('[data-dnd-kit-draggable-id]');
console.log('🧩 Componentes arrastáveis encontrados:', draggables.length);

if (draggables.length > 0) {
  console.log('📋 Primeiros 3 draggables:');
  Array.from(draggables).slice(0, 3).forEach((el, i) => {
    console.log(`   ${i + 1}. ID: ${el.getAttribute('data-dnd-kit-draggable-id')}`);
  });
}

// 3. Verificar área droppable do canvas
const canvas = document.querySelector('.unified-editor-canvas');
const droppable = document.querySelector('[data-dnd-kit-droppable-id="canvas-dropzone"]');
console.log('🎨 Canvas encontrado:', !!canvas);
console.log('📥 Droppable encontrado:', !!droppable);

if (droppable) {
  console.log('📦 Droppable ID:', droppable.getAttribute('data-dnd-kit-droppable-id'));
}

// 4. Verificar se há blocos no canvas
const blocks = document.querySelectorAll('.preview-container [data-dnd-kit-sortable-id]');
console.log('🧱 Blocos no canvas:', blocks.length);

// 5. Verificar se há eventos sendo disparados
console.log('\n🔧 MONITORAMENTO DE EVENTOS:');
console.log('Tentando adicionar listeners para debug...');

// Listener para mouse events nos draggables
draggables.forEach((el, i) => {
  if (i < 3) { // Apenas os primeiros 3 para não poluir
    const id = el.getAttribute('data-dnd-kit-draggable-id');
    el.addEventListener('mousedown', (e) => {
      console.log(`🖱️ MouseDown no draggable: ${id}`, e.target);
    });
    el.addEventListener('dragstart', (e) => {
      console.log(`🎯 DragStart no draggable: ${id}`, e.dataTransfer);
    });
  }
});

// 6. Verificar estado do editor
const modeIndicator = document.querySelector('[data-mode]');
console.log('🎭 Modo do editor:', modeIndicator?.getAttribute('data-mode') || 'não encontrado');

// 7. Verificar console logs existentes
console.log('\n📝 PROCURANDO LOGS DO SISTEMA:');
console.log('Verifique se há logs do EnhancedComponentsSidebar e DraggableComponentItem');
console.log('Logs esperados: "🎯 EnhancedComponentsSidebar renderizando..." e "🧩 DraggableComponentItem renderizado:"');

// 8. Teste manual
console.log('\n🧪 TESTE MANUAL:');
console.log('1. Tente arrastar um componente da sidebar');
console.log('2. Observe se aparece feedback visual');
console.log('3. Solte sobre o canvas');
console.log('4. Verifique logs no console');

console.log('\n✅ DIAGNÓSTICO CONCLUÍDO');
