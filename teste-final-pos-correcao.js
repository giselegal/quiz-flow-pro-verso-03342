// TESTE FINAL: Após correção UnifiedPreviewEngine-drag.tsx
// Execute no console do browser em http://localhost:8082/editor-unified

console.log('🔧 TESTE FINAL PÓS-CORREÇÃO');
console.log('============================');

// 1. Verificar URL
console.log('🌐 URL:', window.location.href);
console.log('Deveria ser: http://localhost:8082/editor-unified');

// 2. Aguardar um momento para React renderizar
setTimeout(() => {
  console.log('\n🔍 DIAGNÓSTICO COMPLETO:');

  // Verificar estrutura DnD
  const draggables = document.querySelectorAll('[draggable="true"], [data-dnd-kit-draggable-id]');
  const droppables = document.querySelectorAll('[data-dnd-kit-droppable-id]');
  const canvas = document.querySelector(
    '.unified-editor-canvas, [data-dnd-kit-droppable-id="canvas"]'
  );
  const sidebar = document.querySelector('input[placeholder*="Buscar"]');
  const sidebarItems = document.querySelectorAll(
    '.sidebar [draggable="true"], .sidebar [data-dnd-kit-draggable-id]'
  );
  const canvasBlocks = document.querySelectorAll(
    '.unified-editor-canvas [data-block-id], .unified-editor-canvas .block'
  );

  console.log('📊 CONTADORES:');
  console.log(`Draggables: ${draggables.length}`);
  console.log(`Droppables: ${droppables.length}`);
  console.log(`Canvas encontrado: ${canvas ? '✅' : '❌'}`);
  console.log(`Sidebar encontrada: ${sidebar ? '✅' : '❌'}`);
  console.log(`Items sidebar: ${sidebarItems.length}`);
  console.log(`Blocos canvas: ${canvasBlocks.length}`);

  // 3. Verificar logs específicos
  console.log('\n📋 LOGS ESPERADOS:');
  console.log('Procure por estes logs acima:');
  console.log('- "🎯 EnhancedComponentsSidebar renderizando"');
  console.log('- "🧩 AVAILABLE_COMPONENTS carregados: X"');
  console.log('- "🧩 DraggableComponentItem renderizado: X"');
  console.log('- "📊 Categorias processadas: [...]"');

  // 4. Diagnóstico final
  console.log('\n🎯 RESULTADO FINAL:');

  if (draggables.length > 0 && droppables.length > 0 && canvas && sidebar) {
    console.log('✅ SUCESSO: Drag & Drop estrutura completa!');
    console.log('   ✅ Sidebar com componentes draggables');
    console.log('   ✅ Canvas droppable detectado');
    console.log('   ✅ Sistema DnD configurado');
    console.log('\n🎮 TESTE AGORA:');
    console.log('   1. Arraste um componente da sidebar');
    console.log('   2. Solte no canvas');
    console.log('   3. Verifique se aparece no canvas');
  } else if (sidebar && !draggables.length) {
    console.log('⚠️ PARCIAL: Sidebar existe mas sem draggables');
    console.log('   Possível causa: AVAILABLE_COMPONENTS vazio');
    console.log('   Verifique logs de "🧩 AVAILABLE_COMPONENTS carregados"');
  } else {
    console.log('❌ PROBLEMA PERSISTE');
    console.log(`   Draggables: ${draggables.length}`);
    console.log(`   Droppables: ${droppables.length}`);
    console.log(`   Canvas: ${canvas ? 'OK' : 'FALHA'}`);
    console.log(`   Sidebar: ${sidebar ? 'OK' : 'FALHA'}`);
  }

  // 5. Informações de debug adicionais
  if (draggables.length > 0) {
    console.log('\n🧩 PRIMEIROS DRAGGABLES:');
    Array.from(draggables)
      .slice(0, 3)
      .forEach((el, i) => {
        console.log(`  [${i}]:`, el.textContent?.substring(0, 30) + '...');
      });
  }

  if (canvasBlocks.length > 0) {
    console.log('\n📦 BLOCOS NO CANVAS:');
    Array.from(canvasBlocks)
      .slice(0, 3)
      .forEach((el, i) => {
        console.log(`  [${i}]:`, el.textContent?.substring(0, 30) + '...');
      });
  }
}, 1000);

console.log('\n⏳ Aguardando 1 segundo para análise completa...');
