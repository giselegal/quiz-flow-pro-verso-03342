/**
 * Utilitário para gerenciar CSS crítico para melhorar o First Contentful Paint
 */

/**
 * Injeta CSS crítico diretamente no head
 * @param css CSS crítico a ser injetado
 * @param id Identificador opcional para o CSS crítico
 */
export const injectCriticalCSS = (css: string, id = 'critical') => {
  if (typeof document !== 'undefined') {
    // Verificar se já existe um estilo com este ID
    const existingStyle = document.querySelector(`style[data-critical-id="${id}"]`);
    if (existingStyle) {
      existingStyle.textContent = css;
      return;
    }

    // Criar novo elemento de estilo
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-critical', 'true');
    styleEl.setAttribute('data-critical-id', id);
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    if (process.env.NODE_ENV !== 'production') {
      console.log(`Critical CSS "${id}" injected, ${css.length} chars`);
    }
  }
};

/**
 * Remove CSS crítico injetado quando não for mais necessário
 * @param id Identificador opcional do CSS crítico a remover
 */
export const removeCriticalCSS = (id?: string) => {
  if (typeof document !== 'undefined') {
    const selector = id
      ? `style[data-critical="true"][data-critical-id="${id}"]`
      : 'style[data-critical="true"]';

    const criticalStyles = document.querySelectorAll(selector);
    criticalStyles.forEach(style => {
      style.remove();
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Critical CSS ${id ? `"${id}"` : ''} removed`);
      }
    });
  }
};

/**
 * CSS crítico para carregamento inicial da aplicação
 * Contém apenas os estilos necessários para renderizar o conteúdo acima da dobra
 */
export const initialCriticalCSS = `
/* Estilos críticos para o carregamento inicial */
body {
  margin: 0;
  padding: 0;
  font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(180deg, #FFFFFF 0%, #FBF8F4 100%);
}

/* Spinner de carregamento otimizado */
.loading-spinner {
  width: 40px; /* Reduzido de 48px para 40px */
  height: 40px; /* Reduzido de 48px para 40px */
  border: 3px solid #B89B7A; /* Reduzido de 4px para 3px */
  border-radius: 50%;
  border-top-color: transparent;
  animation: spinner 0.8s linear infinite; /* Reduzido de 1s para 0.8s */
  margin: 0 auto;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

@keyframes spinner {
  to { transform: rotate(360deg); }
}

/* Placeholder de imagem */
.image-placeholder {
  background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
  background-size: 200% 100%;
  animation: shimmer 1.5s linear infinite;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

@keyframes shimmer {
  to { background-position: -200% 0; }
}

/* Animação fade-in para elementos principais */
.fade-in {
  opacity: 0;
  animation: fadeIn 0.5s ease-in forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}
`;

// Use para componentes específicos
export const heroCriticalCSS = `
.hero-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  width: 100%;
  max-width: 64rem;
  margin: 0 auto;
}

.hero-image {
  width: 100%;
  max-width: 32rem;
  height: auto;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
`;

// CSS crítico para página de resultados
export const resultPageCriticalCSS = `
.result-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  min-height: 100vh;
}

.result-header {
  padding: 1.5rem;
  text-align: center;
  width: 100%;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.result-content {
  width: 100%;
  max-width: 64rem;
  padding: 1rem;
  margin: 0 auto;
}
`;

export default {
  injectCriticalCSS,
  removeCriticalCSS,
  initialCriticalCSS,
  heroCriticalCSS,
  resultPageCriticalCSS,
};
