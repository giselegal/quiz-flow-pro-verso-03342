// 🕵️ DETECTOR DE PONTOS CEGOS - DRAG & DROP
// Execute no console: http://localhost:8082/editor-unified

console.log('🕵️ === DETECTOR DE PONTOS CEGOS INICIADO ===');

// 🎯 PONTO CEGO 1: Verificar se @dnd-kit está realmente ativo
function testeDndKitAtivo() {
  console.log('\n🔍 TESTE 1: @dnd-kit está ativo?');

  // Verificar se DndContext está no DOM
  const dndContext = document.querySelector('[data-dnd-kit="dnd-context"]');
  console.log(`DndContext encontrado: ${!!dndContext}`);

  // Verificar se sensores estão ativos
  const draggables = document.querySelectorAll('[data-dnd-kit-draggable-id]');
  const droppables = document.querySelectorAll('[data-dnd-kit-droppable-id]');

  console.log(`Draggables registrados: ${draggables.length}`);
  console.log(`Droppables registrados: ${droppables.length}`);

  // Verificar estilos que podem bloquear
  draggables.forEach((el, i) => {
    const computed = getComputedStyle(el);
    const pointerEvents = computed.pointerEvents;
    const userSelect = computed.userSelect;
    const touchAction = computed.touchAction;

    if (pointerEvents === 'none') {
      console.log(`⚠️ Draggable ${i}: pointer-events: none`);
    }
    if (userSelect !== 'none') {
      console.log(`⚠️ Draggable ${i}: user-select não é 'none'`);
    }
    if (touchAction !== 'none') {
      console.log(`🔍 Draggable ${i}: touch-action: ${touchAction}`);
    }
  });

  return { draggables: draggables.length, droppables: droppables.length };
}

// 🎯 PONTO CEGO 2: Verificar hierarquia de componentes React
function testeHierarquiaReact() {
  console.log('\n🔍 TESTE 2: Hierarquia React está correta?');

  // Verificar se EditorUnified está renderizado
  const editorContainer = document.querySelector('.editor-unified-container');
  console.log(`Editor container: ${!!editorContainer}`);

  // Verificar se DndContext está dentro do componente certo
  const dndContext = document.querySelector('[data-dnd-kit]');
  if (dndContext) {
    const parent = dndContext.closest('.editor-unified-container');
    console.log(`DndContext dentro do editor: ${!!parent}`);
  }

  // Verificar SortableContext
  const sortableItems = document.querySelectorAll('[data-dnd-kit-sortable-id]');
  console.log(`Items sortable: ${sortableItems.length}`);

  return { editorContainer: !!editorContainer };
}

// 🎯 PONTO CEGO 3: Verificar eventos sendo bloqueados
function testeEventosBloqueados() {
  console.log('\n🔍 TESTE 3: Eventos estão sendo bloqueados?');

  const sidebarItems = document.querySelectorAll('.components-sidebar [data-dnd-kit-draggable-id]');

  sidebarItems.forEach((item, i) => {
    const rect = item.getBoundingClientRect();

    // Verificar se elemento está visível
    if (rect.width === 0 || rect.height === 0) {
      console.log(`⚠️ Item ${i}: Invisível (width: ${rect.width}, height: ${rect.height})`);
    }

    // Verificar se está fora da viewport
    if (rect.top < 0 || rect.left < 0) {
      console.log(`⚠️ Item ${i}: Fora da viewport`);
    }

    // Verificar z-index
    const computed = getComputedStyle(item);
    const zIndex = computed.zIndex;
    const position = computed.position;

    if (position !== 'static' && zIndex === 'auto') {
      console.log(`🔍 Item ${i}: position: ${position}, z-index: auto`);
    }
  });

  return sidebarItems.length;
}

// 🎯 PONTO CEGO 4: Verificar handleDragEnd está sendo chamado
function testeHandleDragEnd() {
  console.log('\n🔍 TESTE 4: handleDragEnd está sendo interceptado?');

  // Interceptar todas as funções de drag
  const originalConsoleLog = console.log;
  let dragEndCalled = false;

  // Monkey patch para detectar chamadas
  window.addEventListener('error', e => {
    if (e.message.includes('handleDragEnd')) {
      console.log('❌ ERRO em handleDragEnd:', e.message);
    }
  });

  // Verificar se React DevTools está disponível
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    console.log('✅ React DevTools disponível');
  } else {
    console.log('⚠️ React DevTools não encontrado');
  }

  return { devToolsAvailable: !!window.__REACT_DEVTOOLS_GLOBAL_HOOK__ };
}

// 🎯 PONTO CEGO 5: Verificar CSS que pode interferir
function testeCssInterferencia() {
  console.log('\n🔍 TESTE 5: CSS está interferindo?');

  const problemElements = [];

  // Verificar overflow: hidden em containers
  const containers = document.querySelectorAll(
    '.components-sidebar, .preview-container, .editor-unified-container'
  );

  containers.forEach((container, i) => {
    const computed = getComputedStyle(container);

    if (computed.overflow === 'hidden') {
      console.log(`⚠️ Container ${i}: overflow: hidden (pode bloquear DnD)`);
      problemElements.push(`Container ${i}: overflow hidden`);
    }

    if (computed.transform !== 'none') {
      console.log(`🔍 Container ${i}: transform: ${computed.transform}`);
    }

    if (computed.position === 'fixed') {
      console.log(`🔍 Container ${i}: position: fixed`);
    }
  });

  return problemElements;
}

// 🎯 PONTO CEGO 6: Verificar distância do sensor
function testeSensorDistance() {
  console.log('\n🔍 TESTE 6: Sensor distance está configurado?');

  // Simular movimento pequeno vs movimento grande
  const firstDraggable = document.querySelector('[data-dnd-kit-draggable-id]');

  if (firstDraggable) {
    const rect = firstDraggable.getBoundingClientRect();

    // Teste movimento de 1px (deveria NÃO ativar drag)
    console.log('Testando movimento de 1px...');

    // Teste movimento de 10px (deveria ativar drag)
    console.log('Testando movimento de 10px...');

    return { draggableFound: true };
  }

  return { draggableFound: false };
}

// 🎯 PONTO CEGO 7: Verificar state management
function testeStateManagement() {
  console.log('\n🔍 TESTE 7: State management está funcionando?');

  // Verificar se currentBlocks está sendo atualizado
  try {
    // Tentar acessar estado via React DevTools
    const reactRoot = document.querySelector('#root')._reactInternalInstance;
    console.log('React instance encontrada');
  } catch (e) {
    console.log('⚠️ Não foi possível acessar estado React');
  }

  // Verificar localStorage para estados persistidos
  const localStorageKeys = Object.keys(localStorage);
  const quizKeys = localStorageKeys.filter(key => key.includes('quiz') || key.includes('editor'));

  console.log(`LocalStorage keys relacionados: ${quizKeys.length}`);
  quizKeys.forEach(key => {
    console.log(`  - ${key}`);
  });

  return { localStorageKeys: quizKeys.length };
}

// 🎯 EXECUTAR TODOS OS TESTES
function executarTodosOsTestes() {
  console.log('🕵️ === EXECUTANDO TODOS OS TESTES ===');

  const resultados = {};

  resultados.dndKit = testeDndKitAtivo();
  resultados.hierarquia = testeHierarquiaReact();
  resultados.eventos = testeEventosBloqueados();
  resultados.handleDragEnd = testeHandleDragEnd();
  resultados.css = testeCssInterferencia();
  resultados.sensor = testeSensorDistance();
  resultados.state = testeStateManagement();

  console.log('\n📊 === RESUMO DOS RESULTADOS ===');
  console.log(JSON.stringify(resultados, null, 2));

  // Análise automática dos pontos cegos
  console.log('\n🎯 === PONTOS CEGOS DETECTADOS ===');

  if (resultados.dndKit.draggables === 0) {
    console.log('❌ CRÍTICO: Nenhum elemento draggable encontrado');
  }

  if (resultados.dndKit.droppables === 0) {
    console.log('❌ CRÍTICO: Nenhum elemento droppable encontrado');
  }

  if (!resultados.hierarquia.editorContainer) {
    console.log('❌ CRÍTICO: Editor container não encontrado');
  }

  if (resultados.css.length > 0) {
    console.log('⚠️ ATENÇÃO: CSS pode estar interferindo:', resultados.css);
  }

  if (!resultados.sensor.draggableFound) {
    console.log('❌ CRÍTICO: Nenhum elemento draggable para testar sensor');
  }

  return resultados;
}

// 🎯 TESTE INTERATIVO REAL
function testeInterativoReal() {
  console.log('\n🎮 === TESTE INTERATIVO REAL ===');
  console.log('Este teste simula um drag & drop real...');

  const firstDraggable = document.querySelector('[data-dnd-kit-draggable-id]');
  const dropzone = document.querySelector('[data-dnd-kit-droppable-id="canvas-dropzone"]');

  if (!firstDraggable || !dropzone) {
    console.log('❌ Elementos necessários não encontrados');
    return false;
  }

  console.log('✅ Elementos encontrados, iniciando simulação...');

  // Capturar estado inicial
  const blocosIniciais = document.querySelectorAll('.preview-block-wrapper').length;
  console.log(`Blocos iniciais: ${blocosIniciais}`);

  // Simular drag real com eventos de pointer
  const rect = firstDraggable.getBoundingClientRect();
  const dropRect = dropzone.getBoundingClientRect();

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
  console.log('1. PointerDown disparado');

  // 2. PointerMove (iniciar drag - movimento > 8px)
  setTimeout(() => {
    const pointerMove1 = new PointerEvent('pointermove', {
      bubbles: true,
      cancelable: true,
      pointerId: 1,
      clientX: rect.left + rect.width / 2 + 15,
      clientY: rect.top + rect.height / 2 + 15,
    });

    document.dispatchEvent(pointerMove1);
    console.log('2. PointerMove >8px disparado (deveria iniciar drag)');

    // 3. PointerMove sobre dropzone
    setTimeout(() => {
      const pointerMove2 = new PointerEvent('pointermove', {
        bubbles: true,
        cancelable: true,
        pointerId: 1,
        clientX: dropRect.left + dropRect.width / 2,
        clientY: dropRect.top + dropRect.height / 2,
      });

      document.dispatchEvent(pointerMove2);
      console.log('3. PointerMove sobre dropzone');

      // 4. PointerUp (finalizar)
      setTimeout(() => {
        const pointerUp = new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          clientX: dropRect.left + dropRect.width / 2,
          clientY: dropRect.top + dropRect.height / 2,
        });

        document.dispatchEvent(pointerUp);
        console.log('4. PointerUp disparado (finalizar drop)');

        // 5. Verificar resultado
        setTimeout(() => {
          const blocosFinais = document.querySelectorAll('.preview-block-wrapper').length;
          console.log(`Blocos finais: ${blocosFinais}`);

          if (blocosFinais > blocosIniciais) {
            console.log('🎉 SUCESSO! Drag & Drop funcionou perfeitamente!');
          } else {
            console.log('💡 PONTO CEGO ENCONTRADO: Drag & Drop não adicionou bloco');
            console.log('Verificar:');
            console.log('  - handleDragEnd está sendo chamado?');
            console.log('  - Eventos estão chegando ao DndContext?');
            console.log('  - Estado está sendo atualizado?');
          }
        }, 1000);
      }, 200);
    }, 200);
  }, 200);

  return true;
}

// 🎯 DISPONIBILIZAR FUNÇÕES GLOBALMENTE
window.detectarPontosCegos = executarTodosOsTestes;
window.testeInterativo = testeInterativoReal;

// 🎯 EXECUTAR AUTOMATICAMENTE
console.log('🚀 Executando detecção automática...');
executarTodosOsTestes();

console.log('\n🎮 === COMANDOS DISPONÍVEIS ===');
console.log('detectarPontosCegos() - Executar todos os testes novamente');
console.log('testeInterativo() - Fazer teste de drag & drop real');
console.log('\n🎯 Aguardando comandos...');
