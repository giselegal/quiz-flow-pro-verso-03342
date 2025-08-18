/**
 * Otimizações de design para o Funil 2
 * Remove elementos problemáticos e melhora consistência visual
 */

export const optimizeFunnel2Design = () => {
  // Aguardar carregamento completo do DOM
  const applyOptimizations = () => {
    // 1. Remover bloco fixo do cabeçalho
    removeFixedHeaderBlock();

    // 2. Limpar elementos desnecessários dos botões
    cleanButtonElements();

    // 3. Corrigir inconsistências de cores (remover roxo)
    fixColorInconsistencies();

    // 4. Ajustar proporções das imagens
    adjustImageProportions();

    // 5. Remover imagens não estratégicas
    removeNonStrategicImages();

    console.log('Otimizações de design do Funil 2 aplicadas');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyOptimizations);
  } else {
    applyOptimizations();
  }
};

const removeFixedHeaderBlock = () => {
  // Remover elementos de cabeçalho fixo que atrapalham
  const fixedHeaders = document.querySelectorAll(
    '.fixed-header, .sticky-header, [style*="position: fixed"]'
  );
  fixedHeaders.forEach(header => {
    if (header.closest('.funnel-2') || header.closest('[data-funnel="2"]')) {
      header.style.position = 'relative';
      header.style.top = 'auto';
      header.style.zIndex = 'auto';
    }
  });

  // Remover blocos desnecessários no topo
  const headerBlocks = document.querySelectorAll('.header-block, .top-banner');
  headerBlocks.forEach(block => {
    if (block.closest('.funnel-2') && !block.classList.contains('essential')) {
      block.style.display = 'none';
    }
  });
};

const cleanButtonElements = () => {
  // Limpar botões CTA removendo elementos desnecessários
  const ctaButtons = document.querySelectorAll('.cta-button, .btn-primary, [class*="button"]');

  ctaButtons.forEach(button => {
    if (!button.closest('.funnel-2')) return;

    // Remover ícones desnecessários
    const unnecessaryIcons = button.querySelectorAll('.icon, .arrow, .decoration');
    unnecessaryIcons.forEach(icon => {
      if (!icon.classList.contains('essential-icon')) {
        icon.remove();
      }
    });

    // Simplificar texto do botão
    const textElements = button.querySelectorAll('.button-text, .btn-text');
    textElements.forEach(text => {
      text.style.fontWeight = '600';
      text.style.fontSize = '16px';
    });

    // Remover elementos decorativos
    const decorations = button.querySelectorAll('.sparkle, .glow, .pulse');
    decorations.forEach(dec => dec.remove());
  });
};

const fixColorInconsistencies = () => {
  // Mapear cores roxas para a paleta consistente
  const colorMap = {
    '#8B5CF6': '#B89B7A', // Roxo para bege principal
    '#7C3AED': '#A0926B', // Roxo escuro para bege escuro
    '#A855F7': '#B89B7A', // Roxo claro para bege
    purple: '#B89B7A',
    violet: '#B89B7A',
  };

  // Corrigir elementos com cores roxas
  const elements = document.querySelectorAll('*');
  elements.forEach(el => {
    if (!el.closest('.funnel-2')) return;

    const computedStyle = window.getComputedStyle(el);

    // Corrigir cor de fundo
    Object.keys(colorMap).forEach(oldColor => {
      if (
        computedStyle.backgroundColor.includes(oldColor) ||
        el.style.backgroundColor.includes(oldColor)
      ) {
        el.style.backgroundColor = colorMap[oldColor];
      }

      if (computedStyle.color.includes(oldColor) || el.style.color.includes(oldColor)) {
        el.style.color = colorMap[oldColor];
      }

      if (computedStyle.borderColor.includes(oldColor) || el.style.borderColor.includes(oldColor)) {
        el.style.borderColor = colorMap[oldColor];
      }
    });
  });
};

const adjustImageProportions = () => {
  const images = document.querySelectorAll('.funnel-2 img, [data-funnel="2"] img');

  images.forEach(img => {
    // Definir proporções adequadas baseadas no contexto
    if (img.closest('.hero-section')) {
      // Imagens hero - proporção 16:9
      img.style.aspectRatio = '16 / 9';
      img.style.objectFit = 'cover';
      img.style.width = '100%';
      img.style.maxHeight = '400px';
    } else if (img.closest('.feature-section')) {
      // Imagens de features - proporção quadrada
      img.style.aspectRatio = '1 / 1';
      img.style.objectFit = 'cover';
      img.style.width = '100%';
      img.style.maxWidth = '200px';
    } else if (img.closest('.testimonial')) {
      // Fotos de depoimentos - circular
      img.style.aspectRatio = '1 / 1';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '50%';
      img.style.width = '80px';
      img.style.height = '80px';
    } else {
      // Outras imagens - proporção padrão
      img.style.aspectRatio = '4 / 3';
      img.style.objectFit = 'cover';
      img.style.width = '100%';
    }
  });
};

const removeNonStrategicImages = () => {
  // Lista de seletores para imagens não estratégicas
  const nonStrategicSelectors = [
    '.decorative-image',
    '.background-pattern',
    '.filler-image',
    '[alt*="decoration"]',
    '[alt*="filler"]',
    '.stock-photo:not(.testimonial-photo)',
    '.generic-image',
  ];

  // Remover imagens decorativas desnecessárias
  nonStrategicSelectors.forEach(selector => {
    const images = document.querySelectorAll(`.funnel-2 ${selector}`);
    images.forEach(img => {
      // Manter apenas se for essencial
      if (
        !img.classList.contains('essential') &&
        !img.closest('.hero-section') &&
        !img.closest('.testimonial')
      ) {
        img.style.display = 'none';
      }
    });
  });

  // Limitar quantidade de imagens por seção
  const sections = document.querySelectorAll('.funnel-2 .section, .funnel-2 [class*="section"]');
  sections.forEach(section => {
    const images = section.querySelectorAll('img:not(.essential):not(.testimonial-photo)');

    // Manter apenas as 2 primeiras imagens por seção (exceto hero e depoimentos)
    if (
      !section.classList.contains('hero-section') &&
      !section.classList.contains('testimonials')
    ) {
      images.forEach((img, index) => {
        if (index >= 2) {
          img.style.display = 'none';
        }
      });
    }
  });

  // Otimizar carregamento das imagens mantidas
  const remainingImages = document.querySelectorAll('.funnel-2 img:not([style*="display: none"])');
  remainingImages.forEach(img => {
    img.loading = 'lazy';
    img.decoding = 'async';
  });
};

// Aplicar ajustes responsivos
const applyResponsiveAdjustments = () => {
  const mediaQuery = window.matchMedia('(max-width: 768px)');

  const handleMobileAdjustments = e => {
    if (e.matches) {
      // Ajustes para mobile
      const images = document.querySelectorAll('.funnel-2 img');
      images.forEach(img => {
        img.style.maxHeight = '250px';
      });
    }
  };

  mediaQuery.addListener(handleMobileAdjustments);
  handleMobileAdjustments(mediaQuery);
};

// Executar ajustes responsivos
document.addEventListener('DOMContentLoaded', applyResponsiveAdjustments);
