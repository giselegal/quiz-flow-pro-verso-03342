// ✅ TESTE AUTOMÁTICO COMPLETO DO DnD
// Execute no console: copy(script); await eval(script);

const script = `
console.clear();
console.log('🚀 INICIANDO TESTE AUTOMÁTICO COMPLETO DO DnD');
console.log('⏰ Timestamp:', new Date().toISOString());

// Ativar debug global
window.__DND_DEBUG = true;

async function runDnDTests() {
  console.log('\\n📋 FASE 1: Verificação de Elementos');
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const draggables = document.querySelectorAll('[data-dnd-kit-draggable-handle]');
  const droppables = document.querySelectorAll('[data-dnd-kit-droppable]');
  const forceItems = document.querySelectorAll('[data-force-draggable]');
  const dndItems = document.querySelectorAll('.dnd-draggable-item');
  
  console.log('✅ Draggables (DnD Kit):', draggables.length);
  console.log('✅ Droppables (DnD Kit):', droppables.length);
  console.log('✅ Force Draggables:', forceItems.length);
  console.log('✅ CSS Draggables:', dndItems.length);
  
  if (draggables.length === 0) {
    console.error('❌ ERRO CRÍTICO: Nenhum elemento draggable encontrado!');
    return false;
  }
  
  console.log('\\n📋 FASE 2: Teste de Eventos');
  
  // Testar primeiro draggable
  const firstDraggable = draggables[0];
  console.log('🎯 Testando primeiro draggable:', firstDraggable.id);
  
  let mouseDownCaptured = false;
  let dragStartCaptured = false;
  
  const mouseDownHandler = () => {
    mouseDownCaptured = true;
    console.log('✅ MouseDown capturado!');
  };
  
  const dragStartHandler = () => {
    dragStartCaptured = true;
    console.log('✅ DragStart capturado!');
  };
  
  firstDraggable.addEventListener('mousedown', mouseDownHandler, { once: true });
  firstDraggable.addEventListener('dragstart', dragStartHandler, { once: true });
  
  // Simular clique
  console.log('🖱️ Simulando mousedown...');
  const rect = firstDraggable.getBoundingClientRect();
  const mouseEvent = new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height / 2,
    button: 0
  });
  
  firstDraggable.dispatchEvent(mouseEvent);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('\\n📋 FASE 3: Resultados dos Testes');
  console.log('MouseDown capturado:', mouseDownCaptured ? '✅' : '❌');
  console.log('DragStart capturado:', dragStartCaptured ? '✅' : '❌');
  
  console.log('\\n📋 FASE 4: Análise de CSS');
  
  const elementsWithPointerEventsNone = [];
  document.querySelectorAll('*').forEach(el => {
    const style = window.getComputedStyle(el);
    if (style.pointerEvents === 'none' && el.getBoundingClientRect().width > 0) {
      elementsWithPointerEventsNone.push(el.tagName);
    }
  });
  
  console.log('⚠️ Elementos com pointer-events: none:', elementsWithPointerEventsNone.length);
  
  console.log('\\n📋 FASE 5: Instruções Finais');
  console.log('🎮 AGORA TENTE ARRASTAR MANUALMENTE:');
  console.log('   1. O item TESTE Force Wrapper (amarelo)');
  console.log('   2. O item TESTE Normal (azul)');
  console.log('   3. Qualquer componente da lista');
  console.log('');
  console.log('📊 Observe o monitor no canto superior direito da tela');
  console.log('🔍 Verifique se aparecem logs de drag no console');
  
  return mouseDownCaptured;
}

runDnDTests().then(success => {
  console.log('\\n🏁 TESTE COMPLETO FINALIZADO');
  console.log('Status:', success ? '✅ PARCIALMENTE FUNCIONANDO' : '❌ PROBLEMAS DETECTADOS');
});
`;

console.log('📋 Script de teste criado. Execute:');
console.log('await eval(\\`' + script.replace(/`/g, '\\`') + '\\`)');

// Auto-executar se possível
if (typeof window !== 'undefined') {
  eval(script);
}
