/**
 * Configuração de preview otimizada para evitar erros de React
 */

// Verificações de integridade do React
if (typeof window !== 'undefined') {
  // Verifica se React está carregado corretamente
  const checkReact = () => {
    const ReactGlobal = (window as any).React;
    
    if (!ReactGlobal) {
      console.error('React is not loaded properly');
      return false;
    }
    
    if (!ReactGlobal.forwardRef) {
      console.error('React.forwardRef is undefined - potential module loading issue');
      return false;
    }
    
    return true;
  };

  // Verifica React quando a página carrega
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      if (!checkReact()) {
        console.log('Attempting to reload page due to React loading issues...');
        window.location.reload();
      }
    }, 1000);
  });

  // Log de debug para troubleshooting
  console.log('🔍 Preview config loaded - React integrity check enabled');
}

export {};
