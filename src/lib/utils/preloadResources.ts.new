/**
 * preloadResources.ts
 * Utilitário para pré-carregar recursos críticos de forma eficiente
 */

/**
 * Pré-carrega scripts JavaScript necessários para melhorar o desempenho inicial
 */
export const preloadCriticalScripts = (): void => {
  const scripts = [
    '/assets/vendor-react-*.js', // React core
    '/assets/vendor-router-*.js', // React Router DOM
    '/assets/main-*.js', // Entrada principal da aplicação
  ];

  // Encontrar e adicionar preload para imagem principal (LCP)
  const preloadMainImage = () => {
    const mainImageURL = "https://res.cloudinary.com/dqljyf76t/image/upload/f_avif,q_75,w_345,c_limit,fl_progressive/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.avif";
    
    // Criar um link de preload para a imagem LCP
    const linkEl = document.createElement('link');
    linkEl.rel = 'preload';
    linkEl.as = 'image';
    linkEl.href = mainImageURL;
    linkEl.fetchpriority = 'high';
    
    // Adicionar ao head se ainda não existir
    const linkExists = Array.from(document.head.querySelectorAll('link[rel="preload"][as="image"]'))
      .some(link => link.getAttribute('href') === mainImageURL);
      
    if (!linkExists) {
      document.head.appendChild(linkEl);
    }
  };

  // Executar preload da imagem LCP imediatamente
  preloadMainImage();

  // Usar requestIdleCallback para pré-carregar scripts não críticos
  const preloadScripts = () => {
    scripts.forEach(scriptPattern => {
      const linkEl = document.createElement('link');
      linkEl.rel = 'modulepreload';
      linkEl.href = scriptPattern.replace('*', '');
      linkEl.as = 'script';
      document.head.appendChild(linkEl);
    });
  };

  // Agendar preload de scripts para depois do LCP
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(preloadScripts, { timeout: 1000 });
  } else {
    setTimeout(preloadScripts, 300);
  }
};

/**
 * Pré-carrega imagens críticas com prioridade alta
 * @param page Página atual para determinar quais imagens pré-carregar
 */
export const preloadCriticalImages = (page: 'home' | 'quiz' | 'result'): void => {
  let imagesToPreload: string[] = [];

  switch (page) {
    case 'home':
      // Imagens da página inicial
      imagesToPreload = [
        'https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_90,w_800/v1699010272/quiz-intro-background.jpg',
      ];
      break;
    case 'quiz':
      // Imagens da primeira pergunta do quiz
      imagesToPreload = [
        'https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_90,w_800/v1699010272/question-1-option-1.jpg',
        'https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_90,w_800/v1699010272/question-1-option-2.jpg',
      ];
      break;
    case 'result':
      // Imagens críticas da página de resultados
      imagesToPreload = [
        'https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_90,w_800/v1699010272/transformation-before.jpg',
        'https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_90,w_800/v1699010272/transformation-after.jpg',
      ];
      break;
  }

  // Pré-carregar imagens com prioridade adequada
  imagesToPreload.forEach(imageUrl => {
    // Para imagens críticas, usar link preload para maior prioridade
    if (page === 'quiz' && imagesToPreload.indexOf(imageUrl) === 0) {
      const linkEl = document.createElement('link');
      linkEl.rel = 'preload';
      linkEl.as = 'image';
      linkEl.href = imageUrl;
      linkEl.fetchpriority = 'high';
      document.head.appendChild(linkEl);
    } else {
      // Para imagens secundárias, usar fetch com prioridade mais baixa
      fetch(imageUrl, { 
        priority: page === 'quiz' ? 'high' : 'auto',
        cache: 'force-cache'
      }).catch(err => console.error('Erro ao pré-carregar imagem:', err));
    }
  });
};

/**
 * Inicializa carregamento antecipado de recursos críticos
 * Deve ser chamado o mais cedo possível no ciclo de vida da aplicação
 */
export const initializeResourcePreloading = (): void => {
  // Carregar scripts críticos imediatamente
  preloadCriticalScripts();
  
  // Adiar o carregamento de imagens para depois que o conteúdo crítico for renderizado
  // mas usando requestIdleCallback para melhor performance
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      const path = window.location.pathname;
      
      if (path === '/' || path === '/index.html') {
        preloadCriticalImages('home');
      } else if (path.includes('/quiz')) {
        preloadCriticalImages('quiz');
      } else if (path.includes('/resultado')) {
        preloadCriticalImages('result');
      }
    }, { timeout: 500 }); // Timeout mais curto para garantir que preload ocorra a tempo
  } else {
    setTimeout(() => {
      const path = window.location.pathname;
      
      if (path === '/' || path === '/index.html') {
        preloadCriticalImages('home');
      } else if (path.includes('/quiz')) {
        preloadCriticalImages('quiz');
      } else if (path.includes('/resultado')) {
        preloadCriticalImages('result');
      }
    }, 100); // Tempo reduzido para preload mais agressivo
  }
};

// Adicionar tratamento para navegação de página (SPA)
export const setupRouteChangePreloading = (): void => {
  // Monitorar mudanças na URL para pré-carregar recursos adequados
  let lastPath = window.location.pathname;
  
  // Verificar periodicamente por alterações na rota (para SPAs)
  setInterval(() => {
    const currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      lastPath = currentPath;
      
      if (currentPath.includes('/quiz')) {
        preloadCriticalImages('quiz');
      } else if (currentPath.includes('/resultado')) {
        preloadCriticalImages('result');
      }
    }
  }, 500);
};

export default {
  preloadCriticalScripts,
  preloadCriticalImages,
  initializeResourcePreloading,
  setupRouteChangePreloading
};
