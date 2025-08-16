/**
 * 🧹 BROWSER WARNINGS CLEANUP
 * Script para limpar e suprimir warnings desnecessários do navegador
 */

export interface BrowserWarning {
  type: 'feature' | 'iframe' | 'pixel' | 'preload';
  message: string;
  severity: 'low' | 'medium' | 'high';
  solution?: string;
}

/**
 * Lista de warnings conhecidos que podem ser suprimidos
 */
const KNOWN_WARNINGS: BrowserWarning[] = [
  {
    type: 'feature',
    message: 'Unrecognized feature: \'vr\'',
    severity: 'low',
    solution: 'Remove feature from permissions policy'
  },
  {
    type: 'feature', 
    message: 'Unrecognized feature: \'ambient-light-sensor\'',
    severity: 'low',
    solution: 'Remove feature from permissions policy'
  },
  {
    type: 'feature',
    message: 'Unrecognized feature: \'battery\'',
    severity: 'low',
    solution: 'Remove feature from permissions policy'
  },
  {
    type: 'iframe',
    message: 'An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing',
    severity: 'medium',
    solution: 'Review iframe sandbox configuration'
  },
  {
    type: 'pixel',
    message: '[Meta Pixel] - Multiple pixels with conflicting versions were detected',
    severity: 'low',
    solution: 'Consolidate Facebook Pixel instances'
  },
  {
    type: 'preload',
    message: 'The resource <URL> was preloaded using link preload but not used within a few seconds',
    severity: 'low',
    solution: 'Review preload strategy'
  }
];

/**
 * Limpa warnings de features não reconhecidas
 */
export const cleanUnrecognizedFeatures = (): void => {
  try {
    // Remove meta tags com features não suportadas
    const metaTags = document.querySelectorAll('meta[http-equiv="Permissions-Policy"]');
    metaTags.forEach(meta => {
      const content = meta.getAttribute('content') || '';
      const cleanContent = content
        .replace(/vr=\(\)[,\s]*/g, '')
        .replace(/ambient-light-sensor=\(\)[,\s]*/g, '')
        .replace(/battery=\(\)[,\s]*/g, '')
        .replace(/,\s*$/, '') // Remove trailing comma
        .replace(/^\s*,/, ''); // Remove leading comma
      
      if (cleanContent !== content) {
        meta.setAttribute('content', cleanContent);
        console.log('🧹 Cleaned unrecognized features from Permissions-Policy');
      }
    });
  } catch (error) {
    console.warn('Failed to clean unrecognized features:', error);
  }
};

/**
 * Limpa configurações problemáticas de iframe
 */
export const cleanIframeSandbox = (): void => {
  try {
    const iframes = document.querySelectorAll('iframe[sandbox]');
    iframes.forEach(iframe => {
      const sandbox = iframe.getAttribute('sandbox') || '';
      
      // Se tem tanto allow-scripts quanto allow-same-origin, é potencialmente inseguro
      if (sandbox.includes('allow-scripts') && sandbox.includes('allow-same-origin')) {
        console.warn('🔒 Iframe with potentially unsafe sandbox detected:', iframe);
        
        // Opcional: remover allow-same-origin se não for crítico
        // const safeSandbox = sandbox.replace(/allow-same-origin\s*/g, '').trim();
        // iframe.setAttribute('sandbox', safeSandbox);
      }
    });
  } catch (error) {
    console.warn('Failed to clean iframe sandbox:', error);
  }
};

/**
 * Limpa múltiplos pixels do Facebook
 */
export const cleanFacebookPixels = (): void => {
  try {
    // Verifica se há múltiplas instâncias do fbq
    if (typeof window !== 'undefined' && (window as any).fbq) {
      const fbq = (window as any).fbq;
      
      // Log do status do pixel
      console.log('📊 Facebook Pixel status:', {
        loaded: fbq.loaded,
        version: fbq.version,
        queueLength: fbq.queue?.length || 0
      });
      
      // Não há muito que possamos fazer aqui além de logar
      // O warning geralmente vem de scripts externos carregando o pixel
    }
  } catch (error) {
    console.warn('Failed to clean Facebook pixels:', error);
  }
};

/**
 * Otimiza estratégia de preload
 */
export const optimizePreloadStrategy = (): void => {
  try {
    const preloadLinks = document.querySelectorAll('link[rel="preload"]');
    
    preloadLinks.forEach(link => {
      const href = link.getAttribute('href');
      const as = link.getAttribute('as');
      
      // Adiciona timeout para preloads não críticos
      if (as === 'image' && href) {
        // Verifica se a imagem foi usada após um delay
        setTimeout(() => {
          const isUsed = document.querySelector(`img[src="${href}"]`) || 
                        document.querySelector(`[style*="${href}"]`);
          
          if (!isUsed) {
            console.log('📱 Preloaded resource not used quickly:', href);
            // Opcional: remover o preload se não for usado
            // link.remove();
          }
        }, 3000);
      }
    });
  } catch (error) {
    console.warn('Failed to optimize preload strategy:', error);
  }
};

/**
 * Suprime warnings específicos do console (cuidadosamente)
 */
export const suppressKnownWarnings = (): void => {
  try {
    // Backup dos métodos originais
    const originalWarn = console.warn;
    const originalError = console.error;
    
    // Lista de padrões de warning para suprimir
    const suppressPatterns = [
      /Unrecognized feature: '(vr|ambient-light-sensor|battery)'/,
      /Multiple pixels with conflicting versions/,
      /preloaded using link preload but not used/
    ];
    
    // Override console.warn
    console.warn = (...args) => {
      const message = args.join(' ');
      const shouldSuppress = suppressPatterns.some(pattern => pattern.test(message));
      
      if (!shouldSuppress) {
        originalWarn.apply(console, args);
      } else {
        // Log suppressed warning in development
        if (process.env.NODE_ENV === 'development') {
          console.log('🔕 Suppressed warning:', message.substring(0, 100) + '...');
        }
      }
    };
    
    // Override console.error para warnings específicos
    console.error = (...args) => {
      const message = args.join(' ');
      const shouldSuppress = suppressPatterns.some(pattern => pattern.test(message));
      
      if (!shouldSuppress) {
        originalError.apply(console, args);
      }
    };
  } catch (error) {
    console.warn('Failed to suppress known warnings:', error);
  }
};

/**
 * Executa todas as limpezas de warning
 */
export const cleanupBrowserWarnings = (): void => {
  console.log('🧹 Starting browser warnings cleanup...');
  
  // Executa limpezas imediatamente
  cleanUnrecognizedFeatures();
  cleanIframeSandbox();
  cleanFacebookPixels();
  
  // Suprimir warnings conhecidos (apenas em desenvolvimento)
  if (process.env.NODE_ENV === 'development') {
    suppressKnownWarnings();
  }
  
  // Otimizar preloads após DOM carregar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizePreloadStrategy);
  } else {
    optimizePreloadStrategy();
  }
  
  console.log('✅ Browser warnings cleanup completed');
};

/**
 * Relatório de warnings conhecidos
 */
export const getWarningsReport = (): BrowserWarning[] => {
  return KNOWN_WARNINGS;
};

/**
 * Executa limpeza automática quando o módulo é importado
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  cleanupBrowserWarnings();
}
