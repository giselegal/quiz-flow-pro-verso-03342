// Script para testar o botão salvar do editor
console.log('🧪 TESTE DO BOTÃO SALVAR - EDITOR');
console.log('=================================');

// Aguardar o React carregar
setTimeout(() => {
  console.log('\n📋 PASSO 1: Verificar se estamos na página correta');
  const currentPath = window.location.pathname;
  console.log(`🔍 Página atual: ${currentPath}`);

  // Procurar por botões salvar
  console.log('\n📋 PASSO 2: Procurar botões salvar');
  const buttons = document.querySelectorAll('button');
  const saveButtons = [];

  buttons.forEach((btn, index) => {
    const text = btn.textContent?.toLowerCase() || '';
    const hasIcon = btn.querySelector('svg');
    
    if (text.includes('salvar') || text.includes('save')) {
      saveButtons.push({
        element: btn,
        text: btn.textContent,
        disabled: btn.disabled,
        className: btn.className,
        hasIcon: !!hasIcon,
        index: index
      });
    }
  });

  console.log(`🔍 Encontrados ${saveButtons.length} botões de salvar:`);
  saveButtons.forEach((btn, i) => {
    console.log(`  ${i + 1}. "${btn.text}" - ${btn.disabled ? 'DESABILITADO' : 'HABILITADO'}`);
    console.log(`     Classes: ${btn.className}`);
    console.log(`     Ícone: ${btn.hasIcon ? 'Sim' : 'Não'}`);
    
    // Destacar visualmente o botão
    btn.element.style.border = '3px solid #00ff00';
    btn.element.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
  });

  console.log('\n📋 PASSO 3: Verificar o estado do editor');
  
  // Verificar se há contexto React
  const reactRoot = document.querySelector('#root');
  if (reactRoot && reactRoot._reactInternalFiber) {
    console.log('✅ React detectado');
  } else {
    console.log('⚠️ React não detectado ou não carregado');
  }

  // Verificar localStorage para dados do editor
  const localStorageKeys = Object.keys(localStorage).filter(key => 
    key.includes('funnel') || key.includes('editor')
  );
  
  console.log(`📦 LocalStorage (${localStorageKeys.length} chaves relacionadas):`);
  localStorageKeys.forEach(key => {
    console.log(`  - ${key}: ${localStorage.getItem(key)?.substring(0, 100)}...`);
  });

  console.log('\n📋 PASSO 4: Testar clique no botão salvar');
  if (saveButtons.length > 0) {
    const mainSaveButton = saveButtons[0];
    console.log(`🎯 Testando clique no botão: "${mainSaveButton.text}"`);
    
    if (!mainSaveButton.disabled) {
      // Adicionar listener de clique para capturar eventos
      mainSaveButton.element.addEventListener('click', (e) => {
        console.log('🔄 Clique detectado no botão salvar');
        console.log('Event details:', e);
      });
      
      // Simular clique
      console.log('⚡ Simulando clique...');
      mainSaveButton.element.click();
      
      // Verificar mudanças após 2 segundos
      setTimeout(() => {
        console.log('\n📋 PASSO 5: Verificar resultado após clique');
        
        // Verificar console para logs de salvamento
        console.log('🔍 Procure por logs de salvamento no console');
        
        // Verificar se houve mudanças no localStorage
        const newLocalStorageKeys = Object.keys(localStorage).filter(key => 
          key.includes('funnel') || key.includes('editor')
        );
        
        if (newLocalStorageKeys.length > localStorageKeys.length) {
          console.log('✅ Novas entradas detectadas no localStorage');
        } else {
          console.log('⚠️ Nenhuma nova entrada no localStorage');
        }
        
        // Verificar notificações/toasts
        const toasts = document.querySelectorAll('[data-radix-toast-viewport]');
        if (toasts.length > 0) {
          console.log('✅ Toast/notificação detectada');
        } else {
          console.log('⚠️ Nenhum toast/notificação detectada');
        }
        
        console.log('\n✅ TESTE CONCLUÍDO');
        console.log('================');
        
      }, 2000);
      
    } else {
      console.log('❌ Botão está desabilitado - não é possível testar');
    }
  } else {
    console.log('❌ Nenhum botão salvar encontrado');
  }

}, 3000);
