// 🚨 DIAGNÓSTICO ESPECÍFICO - Erro Firestore & Canvas Vazio
// Execute no console: http://localhost:8082/editor-unified

console.log('🚨 === DIAGNÓSTICO DE ERRO FIRESTORE ===');

function diagnosticarCanvas() {
  console.log('🔍 === INICIANDO DIAGNÓSTICO COMPLETO ===');
  
  // 1. Verificar elementos DnD básicos
  const draggables = document.querySelectorAll('[data-dnd-kit-draggable-id]');
  const droppables = document.querySelectorAll('[data-dnd-kit-droppable-id]');
  const dndContext = document.querySelector('[data-dnd-kit]');
  
  console.log('\n📊 ELEMENTOS DND:');
  console.log(`   Draggables: ${draggables.length}`);
  console.log(`   Droppables: ${droppables.length}`);
  console.log(`   DndContext: ${!!dndContext}`);
  
  // 2. Verificar componentes específicos
  const sidebar = document.querySelector('.components-sidebar');
  const canvas = document.querySelector('[data-dnd-kit-droppable-id="canvas-dropzone"]');
  const canvasBlocks = document.querySelectorAll('.preview-block-wrapper');
  const sidebarItems = document.querySelectorAll('.components-sidebar [data-dnd-kit-draggable-id]');
  
  console.log('\n🧩 COMPONENTES:');
  console.log(`   Sidebar encontrada: ${!!sidebar}`);
  console.log(`   Canvas encontrado: ${!!canvas}`);
  console.log(`   Items na sidebar: ${sidebarItems.length}`);
  console.log(`   Blocos no canvas: ${canvasBlocks.length}`);
  
  // 3. Verificar estado vazio específicos
  const emptyStates = [
    document.querySelector('.empty-preview-state'),
    document.querySelector('[class*="canvas-vazio"]'),
    document.querySelector('[class*="Canvas vazio"]'),
    document.querySelector('[class*="empty"]')
  ].filter(Boolean);
  
  console.log('\n🏜️ ESTADOS VAZIOS:');
  console.log(`   Estados vazios encontrados: ${emptyStates.length}`);
  emptyStates.forEach((el, i) => {
    console.log(`     ${i + 1}. ${el.className}`);
    console.log(`        Texto: "${el.textContent?.trim().substring(0, 50)}..."`);
  });
  
  // 4. Verificar erros específicos do console
  const consoleLogs = [];
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn
  };
  
  console.log('\n🚨 CHECKLIST DE PROBLEMAS:');
  
  // Problema 1: Firestore
  if (performance.getEntriesByName('firestore.googleapis.com').length > 0) {
    console.log('   ❌ ERRO FIRESTORE DETECTADO na rede');
  } else {
    console.log('   ✅ Sem erros Firestore detectados');
  }
  
  // Problema 2: Canvas vazio
  if (canvasBlocks.length === 0 && emptyStates.length > 0) {
    console.log('   ❌ CANVAS VAZIO - useEditor() não retornou blocos');
  } else if (canvasBlocks.length > 0) {
    console.log(`   ✅ Canvas tem ${canvasBlocks.length} blocos`);
  } else {
    console.log('   ⚠️ Canvas estado indefinido');
  }
  
  // Problema 3: Sidebar vazia
  if (sidebarItems.length === 0) {
    console.log('   ❌ SIDEBAR VAZIA - Componentes não carregaram');
  } else {
    console.log(`   ✅ Sidebar tem ${sidebarItems.length} componentes`);
  }
  
  // Problema 4: DnD não configurado
  if (!dndContext) {
    console.log('   ❌ DND CONTEXT NÃO ENCONTRADO');
  } else if (draggables.length === 0) {
    console.log('   ❌ DND SEM ELEMENTOS DRAGGABLES');
  } else if (droppables.length === 0) {
    console.log('   ❌ DND SEM ELEMENTOS DROPPABLES');
  } else {
    console.log('   ✅ DnD configurado corretamente');
  }
  
  // 5. Diagnóstico final
  console.log('\n🎯 === DIAGNÓSTICO FINAL ===');
  
  if (sidebarItems.length === 0) {
    console.log('🚨 PROBLEMA PRINCIPAL: Sidebar vazia');
    console.log('💡 CAUSA PROVÁVEL: EnhancedComponentsSidebar não renderizou');
    console.log('🔧 AÇÃO: Verificar se sidebar está carregando componentes');
  } else if (canvasBlocks.length === 0 && emptyStates.length > 0) {
    console.log('🚨 PROBLEMA PRINCIPAL: Canvas vazio');
    console.log('💡 CAUSA PROVÁVEL: useEditor() retornou currentBlocks = []');
    console.log('🔧 AÇÃO: Verificar conexão Firestore ou usar dados mock');
  } else if (draggables.length > 0 && droppables.length > 0) {
    console.log('🎉 ELEMENTOS PRESENTES: Drag & drop deveria funcionar');
    console.log('💡 TESTE: Execute testeInterativoCompleto()');
  } else {
    console.log('❓ PROBLEMA DESCONHECIDO');
    console.log('🔧 AÇÃO: Analisar logs de erro específicos');
  }
  
  return {
    draggables: draggables.length,
    droppables: droppables.length,
    sidebarItems: sidebarItems.length,
    canvasBlocks: canvasBlocks.length,
    emptyStates: emptyStates.length,
    dndContext: !!dndContext
  };
}

function testeInterativoCompleto() {
  console.log('\n🎮 === TESTE INTERATIVO COMPLETO ===');
  
  const draggable = document.querySelector('[data-dnd-kit-draggable-id]');
  const canvas = document.querySelector('[data-dnd-kit-droppable-id="canvas-dropzone"]');
  
  if (!draggable) {
    console.log('❌ FALHA: Nenhum elemento draggable encontrado');
    console.log('🔧 VERIFICAR: Sidebar não carregou componentes');
    return false;
  }
  
  if (!canvas) {
    console.log('❌ FALHA: Canvas droppable não encontrado');
    console.log('🔧 VERIFICAR: useDroppable não funcionou no EditorUnified');
    return false;
  }
  
  console.log('✅ Elementos encontrados, iniciando teste...');
  
  // Contador de blocos inicial
  const blocosIniciais = document.querySelectorAll('.preview-block-wrapper').length;
  console.log(`📊 Blocos iniciais no canvas: ${blocosIniciais}`);
  
  // Informações dos elementos
  const rectDrag = draggable.getBoundingClientRect();
  const rectCanvas = canvas.getBoundingClientRect();
  
  console.log(`📍 Draggable: ${draggable.getAttribute('data-dnd-kit-draggable-id')}`);
  console.log(`📍 Canvas: ${canvas.getAttribute('data-dnd-kit-droppable-id')}`);
  console.log(`📐 Draggable size: ${rectDrag.width}x${rectDrag.height}`);
  console.log(`📐 Canvas size: ${rectCanvas.width}x${rectCanvas.height}`);
  
  // Simular sequência completa de drag & drop
  console.log('\n🎬 Simulando eventos...');
  
  // 1. PointerDown
  const pointerDown = new PointerEvent('pointerdown', {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    clientX: rectDrag.left + rectDrag.width / 2,
    clientY: rectDrag.top + rectDrag.height / 2,
    button: 0,
  });
  
  draggable.dispatchEvent(pointerDown);
  console.log('   1. ✅ PointerDown disparado');
  
  // 2. PointerMove para iniciar drag (movimento > 8px)
  setTimeout(() => {
    const pointerMove1 = new PointerEvent('pointermove', {
      bubbles: true,
      cancelable: true,
      pointerId: 1,
      clientX: rectDrag.left + rectDrag.width / 2 + 15,
      clientY: rectDrag.top + rectDrag.height / 2 + 15,
    });
    
    document.dispatchEvent(pointerMove1);
    console.log('   2. ✅ PointerMove inicial (>8px)');
    
    // 3. PointerMove sobre canvas
    setTimeout(() => {
      const pointerMove2 = new PointerEvent('pointermove', {
        bubbles: true,
        cancelable: true,
        pointerId: 1,
        clientX: rectCanvas.left + rectCanvas.width / 2,
        clientY: rectCanvas.top + rectCanvas.height / 2,
      });
      
      document.dispatchEvent(pointerMove2);
      console.log('   3. ✅ PointerMove sobre canvas');
      
      // 4. PointerUp (finalizar drop)
      setTimeout(() => {
        const pointerUp = new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          clientX: rectCanvas.left + rectCanvas.width / 2,
          clientY: rectCanvas.top + rectCanvas.height / 2,
        });
        
        document.dispatchEvent(pointerUp);
        console.log('   4. ✅ PointerUp (drop)');
        
        // 5. Verificar resultado após delay
        setTimeout(() => {
          const blocosFinais = document.querySelectorAll('.preview-block-wrapper').length;
          
          console.log('\n🎯 === RESULTADO DO TESTE ===');
          console.log(`📊 Blocos iniciais: ${blocosIniciais}`);
          console.log(`📊 Blocos finais: ${blocosFinais}`);
          
          if (blocosFinais > blocosIniciais) {
            console.log('🎉 SUCESSO! Drag & Drop funcionou perfeitamente!');
            console.log('✅ Novo bloco foi adicionado ao canvas');
          } else {
            console.log('💡 PONTO CEGO ENCONTRADO:');
            console.log('   ❌ Drag & Drop não adicionou novo bloco');
            console.log('   🔍 VERIFICAR:');
            console.log('     - handleDragEnd está sendo chamado?');
            console.log('     - addBlock está funcionando?');
            console.log('     - Estado currentBlocks está atualizando?');
            console.log('     - Erros no console?');
          }
        }, 1500); // Delay maior para aguardar possível re-render
      }, 200);
    }, 200);
  }, 200);
  
  return true;
}

// Adicionar ao escopo global
window.diagnosticarCanvas = diagnosticarCanvas;
window.testeInterativoCompleto = testeInterativoCompleto;

console.log('\n🎯 === COMANDOS DISPONÍVEIS ===');
console.log('diagnosticarCanvas() - Diagnóstico completo do canvas');
console.log('testeInterativoCompleto() - Teste completo de drag & drop');
console.log('');
console.log('🚀 Execute diagnosticarCanvas() primeiro para identificar o problema!');

// Auto-executar diagnóstico inicial
console.log('\n🔄 Executando diagnóstico automático...');
diagnosticarCanvas();
