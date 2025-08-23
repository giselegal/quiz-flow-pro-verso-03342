// 🧪 TESTE DE DRAG & DROP - Console Debug
// Cole este código no console do navegador (F12) para depurar

console.log('🧪 INICIANDO TESTE DE DRAG & DROP');

// 1. Verificar se DndContext está ativo
const dndElements = document.querySelectorAll(
  '[data-rbd-droppable-id], [data-testid*="drag"], [draggable="true"]'
);
console.log('🔍 Elementos draggable encontrados:', dndElements.length);

// 2. Verificar componentes DraggableComponentItem
const sidebarItems = document.querySelectorAll('[data-testid*="component"], .draggable-component');
console.log('🧩 Items da sidebar:', sidebarItems.length);

// 3. Verificar canvas drop zone
const dropZones = document.querySelectorAll('[data-testid="canvas-dropzone"], .droppable');
console.log('🎯 Drop zones:', dropZones.length);

// 4. Verificar eventos de mouse
document.addEventListener('mousedown', e => {
  console.log('🖱️ MouseDown em:', e.target);
});

document.addEventListener('dragstart', e => {
  console.log('🚀 DragStart:', e.target, e.dataTransfer);
});

document.addEventListener('dragover', e => {
  console.log('🎯 DragOver:', e.target);
});

console.log('✅ Teste configurado. Tente arrastar um componente agora!');
