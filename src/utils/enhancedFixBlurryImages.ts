// @ts-nocheck
import { FixBlurryImagesOptions } from './images/types';

interface FixedImage {
  element: HTMLImageElement;
  originalSrc: string;
  optimizedSrc: string;
}

/**
 * Corrige imagens embaçadas em páginas de introdução e quiz
 * @param rootElement Elemento raiz opcional para escopo da correção
 * @param opts Opções de configuração
 * @returns Array de elementos de imagem corrigidos
 */
export function fixBlurryIntroQuizImages(
  rootElement?: HTMLElement,
  opts?: FixBlurryImagesOptions
): HTMLImageElement[] {
  const options = {
    quality: 85,
    format: 'auto',
    skipOptimized: true,
    forceOptimize: false,
    debug: false,
    placeholderColor: '#f8f5f2',
    ...opts,
  };

  const targetElement = rootElement || document.body;
  const fixedImages: HTMLImageElement[] = [];

  try {
    // Primeiro, encontre todas as imagens no documento ou elemento raiz
    const images = targetElement.querySelectorAll('img');

    if (options.debug) {
      console.log(`[fixBlurryIntroQuizImages] Analisando ${images.length} imagens`);
    }

    // Para cada imagem, verifique se precisa ser otimizada
    images.forEach(img => {
      // Ignore imagens já processadas
      if (img.dataset.optimized === 'true' && !options.forceOptimize) {
        if (options.debug) {
          console.log(`[fixBlurryIntroQuizImages] Imagem já otimizada: ${img.src}`);
        }
        return;
      }

      // Verifique se é uma imagem relevante para intro ou quiz
      const isIntroImage =
        img.classList.contains('intro-image') ||
        img.closest('[data-section="intro"]') ||
        img.id === 'lcp-image';

      const isQuizImage =
        img.classList.contains('quiz-image') ||
        img.closest('[data-section="quiz"]') ||
        img.closest('.quiz-option-image');

      if (!isIntroImage && !isQuizImage) {
        return;
      }

      // Aplique otimização de imagem (exemplo simplificado)
      const originalSrc = img.src;

      // Verifique se a imagem já tem um tamanho menor (aproximado)
      const shouldOptimize =
        options.forceOptimize || !originalSrc.includes('w_') || !originalSrc.includes('q_');

      if (shouldOptimize) {
        // Aplicar otimização de imagem
        const newSrc = applyOptimizations(originalSrc, options);
        img.src = newSrc;
        img.dataset.optimized = 'true';

        fixedImages.push(img);

        if (options.debug) {
          console.log(`[fixBlurryIntroQuizImages] Imagem otimizada:`, {
            original: originalSrc,
            optimized: newSrc,
          });
        }
      }
    });

    if (options.debug) {
      console.log(`[fixBlurryIntroQuizImages] Total de imagens otimizadas: ${fixedImages.length}`);
    }
  } catch (error) {
    console.error('[fixBlurryIntroQuizImages] Erro ao otimizar imagens:', error);
  }

  return fixedImages;
}

// Função auxiliar para aplicar otimizações à URL da imagem
function applyOptimizations(imageUrl: string, options: FixBlurryImagesOptions): string {
  // Implementação simplificada
  if (!imageUrl) return imageUrl;

  try {
    // Se for uma URL do Cloudinary, otimize adequadamente
    if (imageUrl.includes('cloudinary.com')) {
      // Adicione parâmetros de otimização Cloudinary
      const hasExistingTransformations = imageUrl.includes('/upload/');

      if (hasExistingTransformations) {
        // Inserir após /upload/
        return imageUrl.replace(/\/upload\//, `/upload/q_${options.quality},f_auto/`);
      }
    }

    // Retorna URL original se não conseguir otimizar
    return imageUrl;
  } catch (error) {
    console.error('[applyOptimizations] Erro ao otimizar URL:', error);
    return imageUrl;
  }
}

// Export for compatibility with import syntax in other files
export const fixBlurryImages = fixBlurryIntroQuizImages;

// Export default for compatibility with previous versions
export default fixBlurryIntroQuizImages;
