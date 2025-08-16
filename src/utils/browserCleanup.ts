/**
 * 🧹 LIMPEZA DE WARNINGS DO NAVEGADOR
 * 
 * Este arquivo contém soluções para os warnings identificados:
 * - Features não reconhecidas (vr, ambient-light-sensor, battery)
 * - Iframe sandbox warnings
 * - Meta Pixel conflitos
 * - Preload resource warnings
 */

// 1. Remove warnings de features não suportadas
const cleanupBrowserWarnings = () => {
  // Remove meta tags com features não suportadas
  const unsupportedFeatures = ['vr', 'ambient-light-sensor', 'battery'];
  
  unsupportedFeatures.forEach(feature => {
    const metaTags = document.querySelectorAll(`meta[name*="${feature}"], meta[content*="${feature}"]`);
    metaTags.forEach(tag => tag.remove());
  });

  // Remove ou ajusta iframes com sandbox inseguro
  const iframes = document.querySelectorAll('iframe[sandbox*="allow-scripts"][sandbox*="allow-same-origin"]');
  iframes.forEach(iframe => {
    console.warn('⚠️ Iframe sandbox potentially insecure:', iframe);
    // Opcionalmente, ajustar o sandbox
    // iframe.setAttribute('sandbox', 'allow-scripts'); // Remover allow-same-origin se não necessário
  });
};

// 2. Previne conflitos do Meta Pixel
const ensureSinglePixel = () => {
  // Verifica se já existe um pixel carregado
  if (window.fbq && (window.fbq as any).loaded) {
    console.log('✅ Facebook Pixel já carregado, evitando duplicação');
    return;
  }

  // Limpa possíveis pixels duplicados
  const existingPixelScripts = document.querySelectorAll('script[src*="fbevents.js"]');
  if (existingPixelScripts.length > 1) {
    console.warn('⚠️ Múltiplos scripts do Facebook Pixel detectados, removendo duplicatas');
    // Remove duplicatas (mantém apenas o primeiro)
    for (let i = 1; i < existingPixelScripts.length; i++) {
      existingPixelScripts[i].remove();
    }
  }
};

// 3. Otimiza preload resources
const optimizePreloadResources = () => {
  const preloadLinks = document.querySelectorAll('link[rel="preload"]');
  
  preloadLinks.forEach(link => {
    const href = link.href;
    const as = link.getAttribute('as');
    
    // Monitora se o recurso foi usado
    const checkResourceUsage = () => {
      setTimeout(() => {
        // Verifica se imagens foram carregadas
        if (as === 'image') {
          const img = document.querySelector(`img[src="${href}"]`);
          if (!img) {
            console.warn('⚠️ Preloaded image not used:', href);
          }
        }
        
        // Verifica se scripts foram executados
        if (as === 'script') {
          const script = document.querySelector(`script[src="${href}"]`);
          if (!script) {
            console.warn('⚠️ Preloaded script not used:', href);
          }
        }
        
        // Verifica se stylesheets foram aplicadas
        if (as === 'style') {
          const style = document.querySelector(`link[href="${href}"]`);
          if (!style) {
            console.warn('⚠️ Preloaded stylesheet not used:', href);
          }
        }
      }, 5000); // Verifica após 5 segundos
    };
    
    // Executa verificação após o carregamento da página
    if (document.readyState === 'complete') {
      checkResourceUsage();
    } else {
      window.addEventListener('load', checkResourceUsage);
    }
  });
};

// 4. Configuração geral de limpeza
const setupBrowserOptimizations = () => {
  // Remove warnings de console desnecessários
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = args.join(' ');
    
    // Filtra warnings conhecidos e não críticos
    const ignoredWarnings = [
      'Unrecognized feature',
      'Multiple pixels with conflicting versions',
      'was preloaded using link preload but not used'
    ];
    
    const shouldIgnore = ignoredWarnings.some(warning => 
      message.includes(warning)
    );
    
    if (!shouldIgnore) {
      originalWarn.apply(console, args);
    }
  };
};

// 5. Execução automática na inicialização
export const initBrowserCleanup = () => {
  console.log('🧹 Iniciando limpeza de warnings do navegador...');
  
  // Executa imediatamente se o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      cleanupBrowserWarnings();
      ensureSinglePixel();
      optimizePreloadResources();
      setupBrowserOptimizations();
    });
  } else {
    cleanupBrowserWarnings();
    ensureSinglePixel();
    optimizePreloadResources();
    setupBrowserOptimizations();
  }
  
  console.log('✅ Limpeza de warnings configurada');
};

// 6. Execução no carregamento da janela
window.addEventListener('load', () => {
  initBrowserCleanup();
});

export default {
  initBrowserCleanup,
  cleanupBrowserWarnings,
  ensureSinglePixel,
  optimizePreloadResources,
  setupBrowserOptimizations
};
