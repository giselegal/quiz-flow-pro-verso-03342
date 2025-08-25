// Script de teste DnD
// Coloque no console do browser para testar

window.__DND_DEBUG = true;

// Verificar se DndContext existe
console.log('🔍 DndContext Elements:', document.querySelectorAll('[data-dnd-context]'));

// Verificar draggables
console.log('🔍 Draggable Elements:', document.querySelectorAll('[data-dnd-kit-draggable-handle]'));

// Verificar droppables
console.log('🔍 Droppable Elements:', document.querySelectorAll('[data-dnd-kit-droppable]'));

// Verificar se há elementos com pointer-events: none
const elementsWithPointerEventsNone = [];
const allElements = document.querySelectorAll('*');
allElements.forEach(el => {
  const style = window.getComputedStyle(el);
  if (style.pointerEvents === 'none') {
    elementsWithPointerEventsNone.push(el);
  }
});
console.log('🔍 Elements with pointer-events: none:', elementsWithPointerEventsNone);

// Verificar overlays com z-index alto
const elementsWithHighZIndex = [];
allElements.forEach(el => {
  const style = window.getComputedStyle(el);
  const zIndex = parseInt(style.zIndex);
  if (zIndex > 100) {
    elementsWithHighZIndex.push({ element: el, zIndex });
  }
});
console.log('🔍 Elements with high z-index:', elementsWithHighZIndex);

// Testar eventos de mouse em draggables
const draggables = document.querySelectorAll('[data-dnd-kit-draggable-handle]');
draggables.forEach(draggable => {
  draggable.addEventListener('mousedown', e => {
    console.log('✅ MouseDown capturado em draggable:', e.target);
  });
  draggable.addEventListener('dragstart', e => {
    console.log('✅ DragStart capturado:', e.target);
  });
});

console.log('🎯 Debug setup completo! Tente arrastar um componente.');
