// 🕵️ DETECTOR DE PONTOS CEGOS SIMPLIFICADO
// Cole este código no console do browser em: http://localhost:8082/editor-unified

console.log('🕵️ === DETECTOR DE PONTOS CEGOS CARREGADO ===');

function detectarPontosCegos() {
  console.log('🔍 === INICIANDO DETECÇÃO ===');
  
  // 1. Elementos DnD
  const draggables = document.querySelectorAll('[data-dnd-kit-draggable-id]');
  const droppables = document.querySelectorAll('[data-dnd-kit-droppable-id]');
  const dndContext = document.querySelector('[data-dnd-kit]');
  
  console.log(`✅ Draggables: ${draggables.length}`);
  console.log(`✅ Droppables: ${droppables.length}`);
  console.log(`✅ DndContext: ${!!dndContext}`);
  
  // 2. Elementos principais
  const sidebar = document.querySelector('.components-sidebar');
  const canvas = document.querySelector('[data-dnd-kit-droppable-id="canvas-dropzone"]');
  const editor = document.querySelector('.editor-unified-container');
  
  console.log(`✅ Sidebar: ${!!sidebar}`);
  console.log(`✅ Canvas: ${!!canvas}`);
  console.log(`✅ Editor: ${!!editor}`);
  
  // 3. Primeiro draggable visível?
  if (draggables.length > 0) {
    const first = draggables[0];
    const rect = first.getBoundingClientRect();
    const visible = rect.width > 0 && rect.height > 0;
    console.log(`✅ Primeiro draggable visível: ${visible}`);
    if (visible) {
      console.log(`   Dimensões: ${rect.width}x${rect.height}`);
    }
  }
  
  // 4. Análise final
  const pontosCegos = [];
  
  if (draggables.length === 0) pontosCegos.push('❌ Nenhum draggable');
  if (droppables.length === 0) pontosCegos.push('❌ Nenhum droppable');
  if (!dndContext) pontosCegos.push('❌ Sem DndContext');
  if (!canvas) pontosCegos.push('❌ Sem canvas dropzone');
  
  console.log('\n🎯 === RESULTADO ===');
  if (pontosCegos.length === 0) {
    console.log('🎉 NENHUM PONTO CEGO CRÍTICO!');
    console.log('💡 Se DnD não funciona, teste: testeInterativo()');
  } else {
    console.log('🚨 PONTOS CEGOS ENCONTRADOS:');
    pontosCegos.forEach(p => console.log(`   ${p}`));
  }
  
  return {
    draggables: draggables.length,
    droppables: droppables.length,
    dndContext: !!dndContext,
    canvas: !!canvas,
    pontosCegos
  };
}

function testeInterativo() {
  console.log('🎮 === TESTE INTERATIVO ===');
  
  const draggable = document.querySelector('[data-dnd-kit-draggable-id]');
  const canvas = document.querySelector('[data-dnd-kit-droppable-id="canvas-dropzone"]');
  
  if (!draggable || !canvas) {
    console.log('❌ Elementos necessários não encontrados');
    return false;
  }
  
  // Contar blocos iniciais
  const blocosIniciais = document.querySelectorAll('.preview-block-wrapper').length;
  console.log(`Blocos iniciais: ${blocosIniciais}`);
  
  // Simular drag real
  const rectDrag = draggable.getBoundingClientRect();
  const rectCanvas = canvas.getBoundingClientRect();
  
  // PointerDown
  draggable.dispatchEvent(new PointerEvent('pointerdown', {
    bubbles: true, pointerId: 1,
    clientX: rectDrag.left + rectDrag.width/2,
    clientY: rectDrag.top + rectDrag.height/2
  }));
  console.log('1. PointerDown ✅');
  
  // PointerMove (>8px para ativar drag)
  setTimeout(() => {
    document.dispatchEvent(new PointerEvent('pointermove', {
      bubbles: true, pointerId: 1,
      clientX: rectDrag.left + rectDrag.width/2 + 15,
      clientY: rectDrag.top + rectDrag.height/2 + 15
    }));
    console.log('2. PointerMove (iniciar) ✅');
    
    // PointerMove sobre canvas
    setTimeout(() => {
      document.dispatchEvent(new PointerEvent('pointermove', {
        bubbles: true, pointerId: 1,
        clientX: rectCanvas.left + rectCanvas.width/2,
        clientY: rectCanvas.top + rectCanvas.height/2
      }));
      console.log('3. PointerMove (canvas) ✅');
      
      // PointerUp (drop)
      setTimeout(() => {
        document.dispatchEvent(new PointerEvent('pointerup', {
          bubbles: true, pointerId: 1,
          clientX: rectCanvas.left + rectCanvas.width/2,
          clientY: rectCanvas.top + rectCanvas.height/2
        }));
        console.log('4. PointerUp (drop) ✅');
        
        // Verificar resultado
        setTimeout(() => {
          const blocosFinais = document.querySelectorAll('.preview-block-wrapper').length;
          console.log(`Blocos finais: ${blocosFinais}`);
          
          if (blocosFinais > blocosIniciais) {
            console.log('🎉 SUCESSO! Drag & Drop funcionou!');
          } else {
            console.log('💡 PONTO CEGO: DnD não adicionou bloco');
            console.log('   → Verificar handleDragEnd no console');
            console.log('   → Verificar erros JavaScript');
          }
        }, 1000);
      }, 200);
    }, 200);
  }, 200);
  
  return true;
}

// Disponibilizar globalmente
window.detectarPontosCegos = detectarPontosCegos;
window.testeInterativo = testeInterativo;

console.log('🎯 === COMANDOS DISPONÍVEIS ===');
console.log('detectarPontosCegos() - Detectar pontos cegos');
console.log('testeInterativo() - Testar drag & drop real');
console.log('');
console.log('🚀 Execute detectarPontosCegos() primeiro!');
