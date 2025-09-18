/**
 * Script para substituição imediata de imagens embaçadas
 * Este script detecta e substitui imagens embaçadas assim que são carregadas
 * Versão 1.1 - Correção otimizada com prevenção de erros e detecção de placeholders
 */

// Configurações
const IMAGE_QUALITY = 75; // Reduzido de 95 para 75 para melhorar performance
const MIN_IMAGE_WIDTH = 1200; // Largura mínima para garantir nitidez
const DEBUG_MODE = false; // Ativar logs de depuração

/**
 * Remove parâmetros de blur e aplicar alta qualidade a uma URL de imagem
 */
function getHighQualityUrl(url) {
  if (!url) return url;

  try {
    // Se não for uma URL do Cloudinary, retornar sem alterações
    if (!url.includes('cloudinary.com') && !url.includes('res.cloudinary.com')) {
      return url;
    }

    let newUrl = url;

    // 1. Remover parâmetros de blur
    if (newUrl.includes('e_blur')) {
      newUrl = newUrl.replace(/[,/]e_blur:[0-9]+/g, '');
    }

    // 2. Substituir qualidade baixa por alta qualidade
    if (newUrl.includes('q_')) {
      newUrl = newUrl.replace(/q_[0-9]+/g, `q_${IMAGE_QUALITY}`);
    } else if (newUrl.includes('/upload/')) {
      // Adicionar parâmetro de qualidade se não existir
      newUrl = newUrl.replace('/upload/', `/upload/q_${IMAGE_QUALITY},`);
    }

    // 3. Garantir formato automático para melhor qualidade
    if (!newUrl.includes('f_auto')) {
      newUrl = newUrl.replace('/upload/', '/upload/f_auto,');
    }

    // 4. Se a largura for muito pequena (placeholder), aumentar
    const widthMatch = newUrl.match(/w_[0-9]+/);
    if (widthMatch && parseInt(widthMatch[0].replace('w_', ''), 10) < 100) {
      newUrl = newUrl.replace(/w_[0-9]+/, `w_${MIN_IMAGE_WIDTH}`);
    }

    // 5. Adicionar nitidez para melhorar a qualidade percebida
    if (!newUrl.includes('e_sharpen')) {
      newUrl = newUrl.replace('/upload/', '/upload/e_sharpen:60,');
    }

    // 6. Adicionar DPR automático para telas de alta densidade
    if (!newUrl.includes('dpr_')) {
      newUrl = newUrl.replace('/upload/', '/upload/dpr_auto,');
    }

    return newUrl;
  } catch (error) {
    if (DEBUG_MODE) {
      console.error('Erro ao processar URL de imagem:', error);
    }
    return url; // Em caso de erro, retornar a URL original
  }
}

/**
 * Substitui imediatamente a URL da imagem por uma versão de alta qualidade
 */
function fixBlurryImage(img) {
  // Ignorar imagens que não têm src ou que estão em um SVG
  if (!img.src || img.closest('svg')) {
    return false;
  }

  try {
    // Salvar a URL original
    const originalSrc = img.src;

    // Verificar se a imagem já tem um atributo de alta qualidade
    if (img.getAttribute('data-high-quality-fixed') === 'true') {
      return false;
    }

    // Obter URL de alta qualidade
    const highQualitySrc = getHighQualityUrl(originalSrc);

    // Se houver diferença, substituir
    if (highQualitySrc !== originalSrc) {
      // Substituir imediatamente
      img.src = highQualitySrc;

      // Marcar a imagem como já corrigida
      img.setAttribute('data-high-quality-fixed', 'true');

      // Remover classes e estilos de embaçamento
      img.style.filter = 'none';
      img.classList.remove('blur', 'placeholder', 'blur-up', 'lazy-load', 'loading');

      // Desativar lazy loading para imagens críticas visíveis
      if (img.loading === 'lazy' && isInViewport(img)) {
        img.loading = 'eager';
        if ('fetchpriority' in img) {
          img.fetchpriority = 'high';
        }
      }

      // Remover também de elementos pais que podem ter blur
      if (img.parentElement) {
        if (img.parentElement.classList.contains('blur-wrapper')) {
          img.parentElement.classList.remove('blur-wrapper');
        }
        img.parentElement.style.filter = 'none';
      }

      // Retornar que a imagem foi corrigida
      return true;
    }

    // A imagem já estava boa
    return false;
  } catch (error) {
    if (DEBUG_MODE) {
      console.error('Erro ao corrigir imagem:', error);
    }
    return false;
  }
}

/**
 * Verificar se o elemento está na viewport (parte visível da tela)
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Corrige todas as imagens na página
 */
function fixAllBlurryImages() {
  const images = document.querySelectorAll('img');
  let fixedCount = 0;

  images.forEach(img => {
    // Verificar se a imagem está com erro
    if (img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
      handleImageError(img);
    } else if (fixBlurryImage(img)) {
      fixedCount++;
    }

    // Adicionar handler de erro para imagens que falham posteriormente
    if (!img.hasAttribute('data-error-handled')) {
      img.setAttribute('data-error-handled', 'true');
      img.addEventListener('error', function () {
        handleImageError(this);
      });
    }
  });

  return fixedCount;
}

/**
 * Lida com erros de carregamento de imagem
 */
function handleImageError(img) {
  // Não processar novamente imagens já tratadas para erro
  if (img.hasAttribute('data-error-fixed')) return;

  // Marcar como tratada
  img.setAttribute('data-error-fixed', 'true');

  const src = img.src;
  if (DEBUG_MODE) {
    console.error(`Erro ao carregar imagem: ${src}`);
  }

  // Tentar corrigir a URL (remover parâmetros de transformação que podem estar causando o erro)
  if (src && src.includes('cloudinary.com')) {
    try {
      // Versão simplificada da URL
      const simplifiedUrl = getSimplifiedCloudinaryUrl(src);
      if (simplifiedUrl !== src) {
        img.src = simplifiedUrl;
        return; // Tentativa de correção aplicada
      }

      // Se não conseguimos simplificar, tentar versão de fallback
      if (img.hasAttribute('data-fallback-src')) {
        img.src = img.getAttribute('data-fallback-src');
      }
    } catch (error) {
      if (DEBUG_MODE) {
        console.error('Erro ao tentar corrigir imagem com erro:', error);
      }
    }
  }
}

/**
 * Simplifica a URL do Cloudinary removendo transformações que podem causar problemas
 */
function getSimplifiedCloudinaryUrl(url) {
  if (!url || !url.includes('cloudinary.com')) return url;

  try {
    // Extrai as partes básicas da URL
    const urlParts = url.split('/upload/');
    if (urlParts.length !== 2) return url;

    const baseUrl = urlParts[0] + '/upload/';
    let path = urlParts[1];

    // Extrai a versão, se existir
    const versionMatch = path.match(/^(v\d+)\//);
    let version = '';
    let finalPath = path;

    if (versionMatch) {
      version = versionMatch[1] + '/';
      finalPath = path.substring(version.length);
    }

    // Remove transformações problemáticas mas mantém formato e qualidade básicos
    const basicTransforms = 'f_auto,q_auto/';

    // Constrói URL simplificada
    return `${baseUrl}${version}${basicTransforms}${finalPath.split('/').pop()}`;
  } catch (error) {
    if (DEBUG_MODE) {
      console.error('Erro ao simplificar URL do Cloudinary:', error);
    }
    return url;
  }
}

/**
 * Observa novas imagens sendo adicionadas à página e corrige-as
 */
function setupImageObserver() {
  // Criar um MutationObserver para detectar novas imagens
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        // Se for uma imagem
        if (node.nodeName === 'IMG') {
          fixBlurryImage(node);
        }
        // Se contiver imagens
        else if (node.querySelectorAll) {
          node.querySelectorAll('img').forEach(img => {
            fixBlurryImage(img);
          });
        }
      });
    });
  });

  // Observar mudanças no documento
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return observer;
}

/**
 * Prevenir placeholders embaçados interceptando requisições de imagem
 */
function preventBlurryPlaceholders() {
  try {
    // Interceptar o método Image.prototype.src
    const originalSet = Object.getOwnPropertyDescriptor(Image.prototype, 'src').set;

    // Substituir pelo nosso método que melhora as URLs
    Object.defineProperty(Image.prototype, 'src', {
      set: function (url) {
        // Aplicar a URL melhorada
        originalSet.call(this, getHighQualityUrl(url));
      },
    });

    // Interceptar também o atributo srcset para imagens responsivas
    const originalSrcsetSet = Object.getOwnPropertyDescriptor(
      HTMLImageElement.prototype,
      'srcset'
    )?.set;
    if (originalSrcsetSet) {
      Object.defineProperty(HTMLImageElement.prototype, 'srcset', {
        set: function (srcset) {
          if (srcset && typeof srcset === 'string') {
            // Melhorar cada URL no srcset
            const newSrcset = srcset
              .split(',')
              .map(src => {
                const [url, descriptor] = src.trim().split(/\s+/);
                return `${getHighQualityUrl(url)} ${descriptor || ''}`.trim();
              })
              .join(', ');

            originalSrcsetSet.call(this, newSrcset);
          } else {
            originalSrcsetSet.call(this, srcset);
          }
        },
      });
    }

    return true;
  } catch (error) {
    if (DEBUG_MODE) {
      console.error('Erro ao configurar prevenção de placeholders:', error);
    }
    return false;
  }
}

// Execução imediata ao carregar
(function () {
  try {
    // 1. Corrigir imagens existentes
    const fixedCount = fixAllBlurryImages();
    if (DEBUG_MODE || fixedCount > 0) {
      console.log(`🔍 Corrigidas ${fixedCount} imagens embaçadas existentes`);
    }

    // 2. Observar novas imagens
    const observer = setupImageObserver();
    if (DEBUG_MODE) {
      console.log('👀 Monitorando novas imagens para correção automática');
    }

    // 3. Evitar placeholders embaçados
    const preventionActive = preventBlurryPlaceholders();
    if (DEBUG_MODE) {
      console.log(
        `🛡️ Prevenção de placeholders embaçados ${preventionActive ? 'ativada' : 'falhou'}`
      );
    }

    // 4. Corrigir novamente após um tempo (garantia)
    setTimeout(() => {
      const additionalFixed = fixAllBlurryImages();
      if (DEBUG_MODE || additionalFixed > 0) {
        console.log(`🔄 Corrigidas mais ${additionalFixed} imagens em uma segunda verificação`);
      }
    }, 1500);

    // 5. Corrigir na mudança de foco da janela (para quando o usuário retorna à aba)
    window.addEventListener('focus', () => {
      setTimeout(() => {
        const focusFixed = fixAllBlurryImages();
        if (DEBUG_MODE && focusFixed > 0) {
          console.log(`👁️ Corrigidas ${focusFixed} imagens após retorno à página`);
        }
      }, 100);
    });

    // 6. Corrigir após carregamento completo da página
    window.addEventListener('load', () => {
      setTimeout(() => {
        const loadFixed = fixAllBlurryImages();
        if (DEBUG_MODE && loadFixed > 0) {
          console.log(`📦 Corrigidas ${loadFixed} imagens após carregamento completo`);
        }
      }, 300);
    });
  } catch (error) {
    console.error('Erro ao inicializar correção de imagens:', error);
  }
})();

// Exportar funções para uso externo
window.ImageFixer = {
  fixBlurryImage,
  fixAllBlurryImages,
  getHighQualityUrl,
};
