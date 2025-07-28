// Teste para verificar se os erros de context foram corrigidos
console.log('🔍 Testando se os erros de context foram corrigidos...');

// Função para verificar se há erros no console
function checkForErrors() {
  let hasErrors = false;
  let hasContextErrors = false;
  let hasDragDropErrors = false;
  
  // Interceptar erros do console
  const originalError = console.error;
  const originalWarn = console.warn;
  
  const errors = [];
  const warnings = [];
  
  console.error = function(...args) {
    errors.push(args.join(' '));
    originalError.apply(console, args);
  };
  
  console.warn = function(...args) {
    warnings.push(args.join(' '));
    originalWarn.apply(console, args);
  };
  
  // Aguardar um tempo para capturar erros
  setTimeout(() => {
    console.log('\n📊 Relatório de Erros:');
    
    errors.forEach((error, index) => {
      console.log(`❌ Erro ${index + 1}: ${error}`);
      
      if (error.includes('useContext') || error.includes('reading \'useContext\'')) {
        hasContextErrors = true;
      }
      
      if (error.includes('drag drop context') || error.includes('Expected drag drop context')) {
        hasDragDropErrors = true;
      }
      
      hasErrors = true;
    });
    
    warnings.forEach((warning, index) => {
      console.log(`⚠️ Warning ${index + 1}: ${warning}`);
    });
    
    console.log('\n📋 Resumo dos Testes:');
    
    if (!hasContextErrors) {
      console.log('✅ Nenhum erro de useContext detectado');
    } else {
      console.log('❌ Ainda há erros de useContext');
    }
    
    if (!hasDragDropErrors) {
      console.log('✅ Nenhum erro de drag drop context detectado');
    } else {
      console.log('❌ Ainda há erros de drag drop context');
    }
    
    if (!hasErrors) {
      console.log('🎉 SUCESSO: Nenhum erro crítico detectado!');
    } else {
      console.log('⚠️ Ainda há erros para investigar');
    }
    
    // Verificar se os componentes estão carregando
    const editorElements = {
      dndProvider: document.querySelector('[data-react-dnd-provider]') || document.querySelector('.droppable-canvas'),
      sidebar: document.querySelector('[role="tablist"]') || document.querySelector('.sidebar'),
      canvas: document.querySelector('[data-testid="droppable-canvas"]') || document.querySelector('.canvas'),
      buttons: document.querySelectorAll('button').length
    };
    
    console.log('\n🔧 Elementos da Interface:');
    console.log(`- Sidebar encontrada: ${!!editorElements.sidebar}`);
    console.log(`- Canvas encontrado: ${!!editorElements.canvas}`);
    console.log(`- Botões encontrados: ${editorElements.buttons}`);
    
    // Restaurar console original
    console.error = originalError;
    console.warn = originalWarn;
    
    return {
      hasContextErrors,
      hasDragDropErrors,
      hasErrors,
      totalErrors: errors.length,
      totalWarnings: warnings.length,
      editorElements
    };
  }, 3000);
}

// Executar teste
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkForErrors);
} else {
  checkForErrors();
}

// Testar elementos específicos que estavam falhando
setTimeout(() => {
  console.log('\n🔍 Teste adicional - Verificando elementos específicos:');
  
  // Verificar se existe DnD context
  try {
    const React = window.React;
    if (React) {
      console.log('✅ React disponível globalmente');
    } else {
      console.log('❌ React não encontrado globalmente');
    }
  } catch (e) {
    console.log('❌ Erro ao acessar React:', e.message);
  }
  
  // Verificar se há Tabs do Radix UI
  const tabsElements = document.querySelectorAll('[role="tablist"], [data-radix-collection-item]');
  console.log(`📊 Elementos Tabs encontrados: ${tabsElements.length}`);
  
  // Verificar se há elementos de drag and drop
  const dndElements = document.querySelectorAll('[draggable], [data-dnd-type]');
  console.log(`🔀 Elementos DnD encontrados: ${dndElements.length}`);
  
}, 5000);
