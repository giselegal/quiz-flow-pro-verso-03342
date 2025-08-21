// 🔧 CORREÇÃO TEMPORÁRIA - Dados Mock para testar DnD
// Execute no console se currentBlocks estiver vazio devido ao erro Firestore

function adicionarDadosMockParaTeste() {
  console.log('🔧 === ADICIONANDO DADOS MOCK PARA TESTE ===');
  
  // Verificar se já há blocos
  const blocosExistentes = document.querySelectorAll('.preview-block-wrapper').length;
  if (blocosExistentes > 0) {
    console.log('✅ Canvas já tem blocos, não é necessário mock');
    return false;
  }
  
  // Dados mock para teste
  const mockBlocks = [
    {
      id: 'mock-heading-1',
      type: 'HeadingInlineBlock',
      props: {
        text: 'Título de Teste',
        level: 1,
        alignment: 'center'
      }
    },
    {
      id: 'mock-text-1', 
      type: 'TextInlineBlock',
      props: {
        text: 'Este é um texto de teste para verificar o drag & drop.',
        alignment: 'left'
      }
    }
  ];
  
  console.log('📦 Tentando injetar blocos mock...');
  
  // Tentar encontrar o componente React e injetar dados
  try {
    // Método 1: Tentar via React DevTools
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      console.log('🔍 React DevTools disponível');
    }
    
    // Método 2: Simular adição via interface
    console.log('🎯 Simulando adição de componente...');
    
    // Encontrar primeiro componente da sidebar
    const firstSidebarItem = document.querySelector('.components-sidebar [data-dnd-kit-draggable-id]');
    const canvas = document.querySelector('[data-dnd-kit-droppable-id="canvas-dropzone"]');
    
    if (firstSidebarItem && canvas) {
      console.log('✅ Elementos encontrados para simulação');
      console.log('📍 Simulando drag do componente:', firstSidebarItem.getAttribute('data-dnd-kit-draggable-id'));
      
      // Simular drag & drop real
      const rectDrag = firstSidebarItem.getBoundingClientRect();
      const rectCanvas = canvas.getBoundingClientRect();
      
      // PointerDown
      firstSidebarItem.dispatchEvent(new PointerEvent('pointerdown', {
        bubbles: true, pointerId: 1,
        clientX: rectDrag.left + rectDrag.width/2,
        clientY: rectDrag.top + rectDrag.height/2
      }));
      
      setTimeout(() => {
        // PointerMove para iniciar
        document.dispatchEvent(new PointerEvent('pointermove', {
          bubbles: true, pointerId: 1,
          clientX: rectDrag.left + rectDrag.width/2 + 15,
          clientY: rectDrag.top + rectDrag.height/2 + 15
        }));
        
        setTimeout(() => {
          // PointerMove sobre canvas
          document.dispatchEvent(new PointerEvent('pointermove', {
            bubbles: true, pointerId: 1,
            clientX: rectCanvas.left + rectCanvas.width/2,
            clientY: rectCanvas.top + rectCanvas.height/2
          }));
          
          setTimeout(() => {
            // PointerUp (drop)
            document.dispatchEvent(new PointerEvent('pointerup', {
              bubbles: true, pointerId: 1,
              clientX: rectCanvas.left + rectCanvas.width/2,
              clientY: rectCanvas.top + rectCanvas.height/2
            }));
            
            console.log('🎯 Simulação completa!');
            
            setTimeout(() => {
              const novosBlocks = document.querySelectorAll('.preview-block-wrapper').length;
              console.log(`📊 Blocos após simulação: ${novosBlocks}`);
              
              if (novosBlocks > 0) {
                console.log('🎉 SUCESSO! Drag & Drop funcionou com simulação!');
              } else {
                console.log('💡 Simulação não adicionou blocos - problema no handleDragEnd');
              }
            }, 1000);
          }, 100);
        }, 100);
      }, 100);
      
    } else {
      console.log('❌ Elementos não encontrados para simulação');
    }
    
  } catch (error) {
    console.log('❌ Erro ao injetar dados mock:', error);
  }
  
  return true;
}

function verificarEstadoEditor() {
  console.log('🔍 === VERIFICANDO ESTADO DO EDITOR ===');
  
  // Verificar se useEditor retornou dados
  console.log('📊 Elementos encontrados:');
  console.log('  - Sidebar:', !!document.querySelector('.components-sidebar'));
  console.log('  - Canvas:', !!document.querySelector('[data-dnd-kit-droppable-id="canvas-dropzone"]'));
  console.log('  - Editor container:', !!document.querySelector('.editor-unified-container'));
  
  // Verificar estados vazios
  const emptyStates = document.querySelectorAll('[class*="empty"], [class*="vazio"]');
  console.log('  - Estados vazios:', emptyStates.length);
  
  emptyStates.forEach((el, i) => {
    console.log(`    ${i+1}. "${el.textContent?.trim()}" (${el.className})`);
  });
  
  // Verificar se há mensagens de erro específicas
  const errorMessages = document.querySelectorAll('[class*="error"], [class*="erro"]');
  console.log('  - Mensagens de erro:', errorMessages.length);
}

window.adicionarDadosMockParaTeste = adicionarDadosMockParaTeste;
window.verificarEstadoEditor = verificarEstadoEditor;

console.log('🛠️ === CORREÇÃO TEMPORÁRIA CARREGADA ===');
console.log('adicionarDadosMockParaTeste() - Tentar adicionar dados para teste');
console.log('verificarEstadoEditor() - Verificar estado atual do editor');
