// ✅ SCRIPT DE TESTE FINAL SIMPLIFICADO
// Cole no console do navegador em http://localhost:8081/editor

console.log('🔍 TESTE DnD FINAL - ', new Date().toISOString());

// Ativar debug
window.__DND_DEBUG = true;

// Aguardar renderização
setTimeout(() => {
  console.log('🔍 Verificando elementos...');

  const draggables = document.querySelectorAll('[data-dnd-kit-draggable-handle]');
  const droppables = document.querySelectorAll('[data-dnd-kit-droppable]');
  const dndItems = document.querySelectorAll('.dnd-draggable-item');

  console.log('📊 RESULTADOS:');
  console.log('  - Draggables (DnD Kit):', draggables.length);
  console.log('  - Droppables (DnD Kit):', droppables.length);
  console.log('  - Items com CSS class:', dndItems.length);

  if (draggables.length > 0) {
    console.log('✅ Elementos DnD encontrados!');
    const first = draggables[0];
    console.log('🎯 Primeiro draggable:', first.id, first);

    // Testar evento
    first.addEventListener(
      'mousedown',
      () => {
        console.log('🖱️ EVENTO MOUSEDOWN FUNCIONANDO!');
      },
      { once: true }
    );

    console.log('🎮 AGORA TENTE ARRASTAR O PRIMEIRO COMPONENTE DA SIDEBAR!');
  } else {
    console.error('❌ PROBLEMA: Nenhum elemento draggable encontrado');
    console.log('🔧 Elementos .ToolbarButton:', document.querySelectorAll('.ToolbarButton').length);
  }
}, 2000);

console.log('⏳ Aguardando 2 segundos para verificar...');
