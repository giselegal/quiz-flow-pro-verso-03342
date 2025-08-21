// 🔧 DEBUG: Teste simples de drag and drop
// Execute no console do navegador para verificar se os elementos estão configurados

function debugDragAndDrop() {
  console.log('🔧 === DEBUG DRAG AND DROP ===');
  
  // Verificar se DraggableComponentItem está presente
  const sidebarItems = document.querySelectorAll('[data-rbd-draggable-id], [id^="sidebar-item-"], .component-drag-item');
  console.log('📋 Sidebar Items encontrados:', sidebarItems.length);
  sidebarItems.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.tagName} - ID: ${item.id} - Classes: ${item.className}`);
  });

  // Verificar se Canvas dropzone está presente
  const dropzones = document.querySelectorAll('[data-rbd-droppable-id], [id*="canvas"], [id*="dropzone"]');
  console.log('🎯 Dropzones encontradas:', dropzones.length);
  dropzones.forEach((zone, index) => {
    console.log(`  ${index + 1}. ${zone.tagName} - ID: ${zone.id} - Classes: ${zone.className}`);
  });

  // Verificar se há elementos sortable no canvas
  const sortableItems = document.querySelectorAll('[data-rbd-draggable-id], .preview-block-wrapper, .sortable-block');
  console.log('🔄 Sortable Items encontrados:', sortableItems.length);
  sortableItems.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.tagName} - ID: ${item.id} - Classes: ${item.className}`);
  });

  // Verificar se há event listeners
  const hasMouseListeners = Array.from(sidebarItems).some(item => {
    return getEventListeners && getEventListeners(item).mousedown?.length > 0;
  });
  console.log('🖱️ Mouse listeners detectados:', hasMouseListeners);

  console.log('🔍 Instruções de teste:');
  console.log('1. Tente arrastar um item da sidebar');
  console.log('2. Abra Network tab e veja se há requests');
  console.log('3. Verifique console para logs de DRAG START/END');
  
  return {
    sidebarItems: sidebarItems.length,
    dropzones: dropzones.length,
    sortableItems: sortableItems.length,
    hasMouseListeners
  };
}

// Auto-executar
debugDragAndDrop();
