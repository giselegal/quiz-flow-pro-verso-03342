#!/bin/bash

# 🕵️ EXECUTOR DE TESTES PARA DETECTAR PONTOS CEGOS
# Executa testes no browser para identificar problemas no drag & drop

echo "🕵️ === EXECUTOR DE TESTES DE PONTOS CEGOS ==="
echo ""

# Verificar se o servidor está rodando
echo "🔍 Verificando servidor..."
if curl -s http://localhost:8082 > /dev/null; then
    echo "✅ Servidor rodando em localhost:8082"
else
    echo "❌ Servidor não está rodando!"
    echo "Execute: npm run dev"
    exit 1
fi

echo ""
echo "🎯 INSTRUÇÕES PARA EXECUÇÃO DOS TESTES:"
echo ""
echo "1. Abra o browser em: http://localhost:8082/editor-unified"
echo "2. Abra o DevTools (F12) e vá para a aba Console"
echo "3. Execute os comandos abaixo para detectar pontos cegos:"
echo ""

echo "📋 COMANDO 1 - Carregar script de testes:"
echo "// Cole este código no console:"
cat > /tmp/teste-pontos-cegos-inline.js << 'EOF'
// 🕵️ DETECTOR DE PONTOS CEGOS - INLINE
console.log('🕵️ === DETECTOR DE PONTOS CEGOS CARREGADO ===');

// Função principal para detectar todos os pontos cegos
function detectarPontosCegos() {
  console.log('🔍 === INICIANDO DETECÇÃO DE PONTOS CEGOS ===');
  
  const resultados = {
    dndKit: {},
    elementos: {},
    eventos: {},
    css: {},
    estado: {},
    funcionalidade: {}
  };
  
  // 1. Verificar @dnd-kit elements
  console.log('\n🔍 1. Verificando elementos @dnd-kit...');
  const draggables = document.querySelectorAll('[data-dnd-kit-draggable-id]');
  const droppables = document.querySelectorAll('[data-dnd-kit-droppable-id]');
  
  resultados.dndKit = {
    draggables: draggables.length,
    droppables: droppables.length,
    dndContext: !!document.querySelector('[data-dnd-kit]')
  };
  
  console.log(`   └── Draggables: ${draggables.length}`);
  console.log(`   └── Droppables: ${droppables.length}`);
  console.log(`   └── DndContext: ${resultados.dndKit.dndContext}`);
  
  // 2. Verificar elementos específicos
  console.log('\n🔍 2. Verificando elementos específicos...');
  const sidebar = document.querySelector('.components-sidebar');
  const canvas = document.querySelector('[data-dnd-kit-droppable-id="canvas-dropzone"]');
  const editorContainer = document.querySelector('.editor-unified-container');
  
  resultados.elementos = {
    sidebar: !!sidebar,
    canvas: !!canvas,
    editorContainer: !!editorContainer
  };
  
  console.log(`   └── Sidebar: ${!!sidebar}`);
  console.log(`   └── Canvas dropzone: ${!!canvas}`);
  console.log(`   └── Editor container: ${!!editorContainer}`);
  
  // 3. Verificar CSS que pode interferir
  console.log('\n🔍 3. Verificando CSS interferente...');
  const cssProblems = [];
  
  if (sidebar) {
    const sidebarStyle = getComputedStyle(sidebar);
    if (sidebarStyle.overflow === 'hidden') {
      cssProblems.push('Sidebar: overflow hidden');
    }
    if (sidebarStyle.pointerEvents === 'none') {
      cssProblems.push('Sidebar: pointer-events none');
    }
  }
  
  if (canvas) {
    const canvasStyle = getComputedStyle(canvas);
    if (canvasStyle.pointerEvents === 'none') {
      cssProblems.push('Canvas: pointer-events none');
    }
  }
  
  resultados.css = { problemas: cssProblems };
  
  if (cssProblems.length > 0) {
    console.log('⚠️ Problemas CSS encontrados:');
    cssProblems.forEach(p => console.log(`     - ${p}`));
  } else {
    console.log('✅ Nenhum problema CSS detectado');
  }
  
  // 4. Teste funcional básico
  console.log('\n🔍 4. Testando funcionalidade básica...');
  
  if (draggables.length > 0 && canvas) {
    console.log('✅ Elementos necessários presentes');
    resultados.funcionalidade.elementosPresentes = true;
    
    // Verificar se o primeiro draggable está visível
    const firstDraggable = draggables[0];
    const rect = firstDraggable.getBoundingClientRect();
    const visivel = rect.width > 0 && rect.height > 0;
    
    resultados.funcionalidade.primeiroElementoVisivel = visivel;
    console.log(`   └── Primeiro draggable visível: ${visivel}`);
    
    if (visivel) {
      console.log(`   └── Dimensões: ${rect.width}x${rect.height}`);
      console.log(`   └── Posição: ${rect.left}, ${rect.top}`);
    }
  } else {
    console.log('❌ Elementos necessários ausentes');
    resultados.funcionalidade.elementosPresentes = false;
  }
  
  // 5. Verificar eventos de drag
  console.log('\n🔍 5. Verificando eventos de drag...');
  let dragEventDetected = false;
  
  // Adicionar listener temporário
  const dragListener = () => {
    dragEventDetected = true;
    console.log('✅ Evento de drag detectado!');
  };
  
  document.addEventListener('dragstart', dragListener);
  document.addEventListener('dragend', dragListener);
  
  resultados.eventos = { listenerAdicionado: true };
  
  // 6. Resumo final
  console.log('\n📊 === RESUMO DOS RESULTADOS ===');
  console.log(JSON.stringify(resultados, null, 2));
  
  // 7. Análise de pontos cegos
  console.log('\n🎯 === ANÁLISE DE PONTOS CEGOS ===');
  
  const pontosCegos = [];
  
  if (resultados.dndKit.draggables === 0) {
    pontosCegos.push('❌ CRÍTICO: Nenhum elemento draggable encontrado');
  }
  
  if (resultados.dndKit.droppables === 0) {
    pontosCegos.push('❌ CRÍTICO: Nenhum elemento droppable encontrado');
  }
  
  if (!resultados.dndKit.dndContext) {
    pontosCegos.push('❌ CRÍTICO: DndContext não encontrado');
  }
  
  if (!resultados.elementos.canvas) {
    pontosCegos.push('❌ CRÍTICO: Canvas dropzone não encontrado');
  }
  
  if (resultados.css.problemas.length > 0) {
    pontosCegos.push('⚠️ CSS pode estar interferindo');
  }
  
  if (!resultados.funcionalidade.elementosPresentes) {
    pontosCegos.push('❌ CRÍTICO: Elementos necessários ausentes');
  }
  
  if (!resultados.funcionalidade.primeiroElementoVisivel) {
    pontosCegos.push('⚠️ Primeiro elemento draggable não está visível');
  }
  
  if (pontosCegos.length === 0) {
    console.log('🎉 NENHUM PONTO CEGO DETECTADO! Sistema parece estar funcionando.');
    console.log('💡 Se drag & drop não funciona, pode ser um problema de:');
    console.log('   - Configuração do sensor (distance)');
    console.log('   - handleDragEnd não sendo chamado');
    console.log('   - Estado não sendo atualizado');
  } else {
    console.log('🚨 PONTOS CEGOS DETECTADOS:');
    pontosCegos.forEach(ponto => console.log(`   ${ponto}`));
  }
  
  return resultados;
}

// Função para teste interativo
function testeInterativo() {
  console.log('\n🎮 === TESTE INTERATIVO INICIADO ===');
  
  const firstDraggable = document.querySelector('[data-dnd-kit-draggable-id]');
  const canvas = document.querySelector('[data-dnd-kit-droppable-id="canvas-dropzone"]');
  
  if (!firstDraggable || !canvas) {
    console.log('❌ Elementos necessários não encontrados para teste');
    return false;
  }
  
  console.log('✅ Elementos encontrados, simulando drag & drop...');
  
  // Contar blocos iniciais
  const blocosIniciais = document.querySelectorAll('.preview-block-wrapper').length;
  console.log(`Blocos iniciais no canvas: ${blocosIniciais}`);
  
  // Simular sequência de eventos @dnd-kit
  const rect = firstDraggable.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();
  
  // 1. PointerDown
  const pointerDown = new PointerEvent('pointerdown', {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height / 2,
    button: 0,
  });
  
  firstDraggable.dispatchEvent(pointerDown);
  console.log('   1. PointerDown disparado');
  
  // 2. PointerMove para iniciar drag (> 8px)
  setTimeout(() => {
    const pointerMove = new PointerEvent('pointermove', {
      bubbles: true,
      cancelable: true,
      pointerId: 1,
      clientX: rect.left + rect.width / 2 + 15,
      clientY: rect.top + rect.height / 2 + 15,
    });
    
    document.dispatchEvent(pointerMove);
    console.log('   2. PointerMove > 8px (iniciar drag)');
    
    // 3. PointerMove sobre canvas
    setTimeout(() => {
      const pointerMoveCanvas = new PointerEvent('pointermove', {
        bubbles: true,
        cancelable: true,
        pointerId: 1,
        clientX: canvasRect.left + canvasRect.width / 2,
        clientY: canvasRect.top + canvasRect.height / 2,
      });
      
      document.dispatchEvent(pointerMoveCanvas);
      console.log('   3. PointerMove sobre canvas');
      
      // 4. PointerUp (drop)
      setTimeout(() => {
        const pointerUp = new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          clientX: canvasRect.left + canvasRect.width / 2,
          clientY: canvasRect.top + canvasRect.height / 2,
        });
        
        document.dispatchEvent(pointerUp);
        console.log('   4. PointerUp (finalizar drop)');
        
        // 5. Verificar resultado
        setTimeout(() => {
          const blocosFinais = document.querySelectorAll('.preview-block-wrapper').length;
          console.log(`Blocos finais no canvas: ${blocosFinais}`);
          
          if (blocosFinais > blocosIniciais) {
            console.log('🎉 SUCESSO! Drag & Drop funcionou!');
            console.log('✅ Novo bloco foi adicionado ao canvas');
          } else {
            console.log('💡 PONTO CEGO ENCONTRADO:');
            console.log('   - Drag & Drop não adicionou novo bloco');
            console.log('   - Verificar handleDragEnd');
            console.log('   - Verificar atualização de estado');
            console.log('   - Verificar console para erros');
          }
        }, 1000);
      }, 200);
    }, 200);
  }, 200);
  
  return true;
}

// Disponibilizar funções globalmente
window.detectarPontosCegos = detectarPontosCegos;
window.testeInterativo = testeInterativo;

console.log('🎯 === COMANDOS DISPONÍVEIS ===');
console.log('detectarPontosCegos() - Detectar pontos cegos no sistema');
console.log('testeInterativo() - Fazer teste real de drag & drop');
console.log('');
console.log('🚀 Execute detectarPontosCegos() para começar!');
EOF

echo ""
echo "📋 COPIE E COLE NO CONSOLE:"
echo "────────────────────────────────────────"
cat /tmp/teste-pontos-cegos-inline.js
echo "────────────────────────────────────────"
echo ""

echo "📋 COMANDO 2 - Executar detecção:"
echo "detectarPontosCegos()"
echo ""

echo "📋 COMANDO 3 - Executar teste interativo:"
echo "testeInterativo()"
echo ""

echo "🎯 PLANO DE TESTES:"
echo "1. Execute detectarPontosCegos() primeiro"
echo "2. Analise os resultados e pontos cegos detectados"
echo "3. Execute testeInterativo() para testar funcionalidade"
echo "4. Se testeInterativo() falhar, o ponto cego está na lógica do handleDragEnd"
echo "5. Se testeInterativo() funcionar, o ponto cego está na interface do usuário"
echo ""

echo "📊 MÉTRICAS ESPERADAS:"
echo "✅ draggables > 0 (componentes na sidebar)"
echo "✅ droppables > 0 (canvas dropzone)"
echo "✅ dndContext = true"
echo "✅ elementos presentes = true"
echo "✅ CSS sem problemas"
echo ""

echo "🎯 Execute os comandos no console e reporte os resultados!"

# Limpeza
rm -f /tmp/teste-pontos-cegos-inline.js
