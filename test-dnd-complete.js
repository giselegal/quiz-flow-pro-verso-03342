// ✅ SCRIPT DE TESTE DEFINITIVO PARA O DRAG & DROP
// Cole isso no console do navegador em http://localhost:8081/editor

console.log('🔍 INICIANDO DIAGNÓSTICO COMPLETO DO DnD...');

// 1. Verificar se há elementos draggables
const draggables = document.querySelectorAll('[data-dnd-kit-draggable-handle]');
console.log('🧩 Elementos draggables encontrados:', draggables.length);
draggables.forEach((el, i) => {
  console.log(`  ${i + 1}. ID: ${el.id}`, el);
});

// 2. Verificar se há elementos droppables
const droppables = document.querySelectorAll('[data-dnd-kit-droppable]');
console.log('🎯 Elementos droppables encontrados:', droppables.length);
droppables.forEach((el, i) => {
  console.log(`  ${i + 1}. ID: ${el.id}`, el);
});

// 3. Verificar se há DndContext
const dndContext = document.querySelector('[data-dnd-context]');
console.log('📦 DndContext encontrado:', !!dndContext, dndContext);

// 4. Verificar eventos de mouse em draggables
if (draggables.length > 0) {
  const firstDraggable = draggables[0];

  // Testar mousedown
  firstDraggable.addEventListener('mousedown', e => {
    console.log('✅ MouseDown capturado no primeiro draggable!', e);
  });

  // Testar dragstart nativo
  firstDraggable.addEventListener('dragstart', e => {
    console.log('✅ DragStart nativo capturado!', e);
  });

  console.log('🎧 Event listeners adicionados ao primeiro draggable. Tente arrastar!');
} else {
  console.warn(
    '❌ Nenhum elemento draggable encontrado! Verifique a renderização dos componentes.'
  );
}

// 5. Verificar CSS que pode interferir
const elementsWithPointerEventsNone = [];
document.querySelectorAll('*').forEach(el => {
  const style = window.getComputedStyle(el);
  if (style.pointerEvents === 'none') {
    elementsWithPointerEventsNone.push(el);
  }
});
console.log('⚠️ Elementos com pointer-events: none:', elementsWithPointerEventsNone.length);

// 6. Ativar debug global
window.__DND_DEBUG = true;
console.log('🎯 Debug ativado globalmente!');

// 7. Verificar se há overlays que podem interferir
const highZIndexElements = [];
document.querySelectorAll('*').forEach(el => {
  const style = window.getComputedStyle(el);
  const zIndex = parseInt(style.zIndex);
  if (zIndex > 100) {
    highZIndexElements.push({ element: el, zIndex });
  }
});
console.log('📊 Elementos com z-index alto:', highZIndexElements);

console.log('✅ DIAGNÓSTICO COMPLETO! Agora tente arrastar um componente e verifique os logs.');
