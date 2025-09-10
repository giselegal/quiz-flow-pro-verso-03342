/**
 * TESTE CRÍTICO FINAL - Execute no console do navegador
 *
 * Este script vai fazer testes diretos nos elementos DOM para verificar
 * se o problema é básico ou complexo
 */
window.testeDnDCritico = function () {
  console.log('🔧 INICIANDO TESTE CRÍTICO DE DnD...');

  // 1. Verificar se os elementos existem
  const draggableItems = document.querySelectorAll(
    '.draggable-component-item, .dnd-draggable-item'
  );
  const dropZones = document.querySelectorAll(
    '[data-rfd-droppable-id], [data-rfd-drop-disabled="false"]'
  );

  console.log('📋 ELEMENTOS ENCONTRADOS:', {
    draggableItems: draggableItems.length,
    dropZones: dropZones.length,
    items: Array.from(draggableItems).map(el => ({
      tagName: el.tagName,
      classes: el.className,
      id: el.id,
      draggable: el.draggable,
      style: {
        pointerEvents: getComputedStyle(el).pointerEvents,
        userSelect: getComputedStyle(el).userSelect,
        position: getComputedStyle(el).position,
        zIndex: getComputedStyle(el).zIndex,
      },
    })),
  });

  // 2. Teste direto de eventos de mouse
  if (draggableItems.length > 0) {
    const primeiroItem = draggableItems[0];
    console.log('🎯 TESTANDO PRIMEIRO ITEM:', primeiroItem);

    // Simular mousedown
    const mouseDownEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
      button: 0,
    });

    console.log('🖱️ Disparando mousedown...');
    primeiroItem.dispatchEvent(mouseDownEvent);

    // Simular mousemove após um delay
    setTimeout(() => {
      const mouseMoveEvent = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX: 150,
        clientY: 150,
        button: 0,
      });

      console.log('🖱️ Disparando mousemove...');
      document.dispatchEvent(mouseMoveEvent);

      // Simular mouseup
      setTimeout(() => {
        const mouseUpEvent = new MouseEvent('mouseup', {
          bubbles: true,
          cancelable: true,
          clientX: 150,
          clientY: 150,
          button: 0,
        });

        console.log('🖱️ Disparando mouseup...');
        document.dispatchEvent(mouseUpEvent);

        console.log('✅ Teste de eventos simulados concluído');
      }, 100);
    }, 100);
  }

  // 3. Verificar se há eventos listeners ativos
  console.log('🎧 VERIFICANDO EVENT LISTENERS...');

  // Tentar acessar listeners (método não padrão, mas útil para debug)
  if (window.getEventListeners) {
    const listeners = window.getEventListeners(document);
    console.log('📡 Document listeners:', listeners);
  }

  // 4. Teste de CSS crítico
  console.log('🎨 VERIFICANDO CSS CRÍTICO...');

  draggableItems.forEach((item, index) => {
    const styles = getComputedStyle(item);
    const problemas = [];

    if (styles.pointerEvents === 'none') problemas.push('pointer-events: none');
    if (styles.userSelect === 'none') problemas.push('user-select: none');
    if (styles.position === 'static') problemas.push('position: static pode interferir');
    if (styles.overflow === 'hidden') problemas.push('overflow: hidden pode interferir');

    if (problemas.length > 0) {
      console.log(`⚠️ Item ${index} tem problemas:`, problemas);
    } else {
      console.log(`✅ Item ${index} CSS OK`);
    }
  });

  // 5. Força aplicar CSS para debug
  console.log('🔧 APLICANDO CSS DE FORÇA...');

  draggableItems.forEach(item => {
    const htmlItem = item;
    htmlItem.style.pointerEvents = 'auto';
    htmlItem.style.userSelect = 'auto';
    htmlItem.style.cursor = 'grab';
    htmlItem.style.border = '2px solid red';
    htmlItem.style.backgroundColor = 'yellow';

    // Adicionar evento direto
    htmlItem.addEventListener('mousedown', e => {
      console.log('🚨 MOUSEDOWN DIRETO CAPTURADO:', {
        target: e.target,
        currentTarget: e.currentTarget,
        button: e.button,
        clientX: e.clientX,
        clientY: e.clientY,
      });

      htmlItem.style.backgroundColor = 'orange';
      htmlItem.style.cursor = 'grabbing';
    });

    htmlItem.addEventListener('mouseup', e => {
      console.log('🚨 MOUSEUP DIRETO CAPTURADO:', e.target);
      htmlItem.style.backgroundColor = 'yellow';
      htmlItem.style.cursor = 'grab';
    });
  });

  console.log('🏁 TESTE CRÍTICO CONCLUÍDO!');
  console.log('👉 Agora tente arrastar os elementos manualmente');
  console.log('👉 Se ainda não funcionar, o problema é na configuração do dnd-kit');

  return {
    draggableItems: draggableItems.length,
    dropZones: dropZones.length,
    testCompleted: true,
  };
};

// Auto-executar
console.log('🔧 CARREGANDO TESTE CRÍTICO...');
console.log('👉 Execute: window.testeDnDCritico() no console para iniciar');

// Também disponibilizar como comando global
window.testCritico = window.testeDnDCritico;
