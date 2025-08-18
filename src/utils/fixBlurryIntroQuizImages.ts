// @ts-nocheck
/**
 * Utilitário otimizado para corrigir imagens borradas na seção de introdução do quiz
 * Versão 2.0 - Otimizada para desempenho
 */

// Interface para armazenamento de cache para evitar processamento repetido
interface ImageCacheRecord {
  original: string;
  optimized: string;
  processed: boolean;
}

// Cache para evitar processamento repetitivo de URLs já otimizadas
const processedImagesCache: Record<string, ImageCacheRecord> = {};

/**
 * Otimiza URL da imagem Cloudinary sem manipulação DOM repetitiva
 * @param originalUrl URL original da imagem
 * @returns URL otimizada
 */
const optimizeCloudinaryUrl = (originalUrl: string): string => {
  // Verificar cache para evitar reprocessamento
  if (processedImagesCache[originalUrl]?.optimized) {
    return processedImagesCache[originalUrl].optimized;
  }

  let optimizedUrl = originalUrl;

  // Remover parâmetros de blur que possam existir
  if (optimizedUrl.includes('e_blur')) {
    optimizedUrl = optimizedUrl.replace(/[,/]e_blur:[0-9]+/g, '');
  }

  // Otimizar nível de qualidade (equilíbrio entre qualidade e desempenho)
  if (optimizedUrl.includes('q_')) {
    optimizedUrl = optimizedUrl.replace(/q_[0-9]+/g, 'q_75');
  } else if (optimizedUrl.includes('/upload/')) {
    optimizedUrl = optimizedUrl.replace('/upload/', '/upload/q_75,');
  }

  // Aplicar otimizações de formato e resolução em lote
  const optimizations: { [key: string]: string } = {
    f_auto: '/upload/f_auto,',
    dpr_auto: '/upload/dpr_auto,',
    'e_sharpen:50': '/upload/e_sharpen:50,',
  };

  // Aplicar cada otimização apenas se necessária
  Object.entries(optimizations).forEach(([key, replacement]) => {
    if (!optimizedUrl.includes(key)) {
      optimizedUrl = optimizedUrl.replace('/upload/', replacement);
    }
  });

  // Salvar no cache para uso futuro
  processedImagesCache[originalUrl] = {
    original: originalUrl,
    optimized: optimizedUrl,
    processed: true,
  };

  return optimizedUrl;
};

// Função principal para corrigir imagens borradas - versão otimizada
export const fixBlurryIntroQuizImages = (): number => {
  // Evitar logs desnecessários em produção
  const isDevEnvironment =
    process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';

  if (isDevEnvironment) {
    console.log('Iniciando correção de imagens...');
  }

  // Usar seletores específicos e limitar escopo para melhor desempenho
  const quizIntroImages = document.querySelectorAll<HTMLImageElement>(
    '.quiz-intro img, [data-section="intro"] img, .quiz-intro-image'
  );
  let count = 0;

  if (quizIntroImages.length === 0) {
    return 0;
  }

  // Processar em lotes para evitar bloqueio do thread principal
  const processImageBatch = (
    images: NodeListOf<HTMLImageElement>,
    startIdx: number,
    batchSize: number
  ): void => {
    const endIdx = Math.min(startIdx + batchSize, images.length);

    for (let i = startIdx; i < endIdx; i++) {
      const img = images[i];
      const src = img.src;

      // Processar apenas imagens Cloudinary não otimizadas
      if (src && src.includes('cloudinary.com') && !processedImagesCache[src]?.processed) {
        const highQualitySrc = optimizeCloudinaryUrl(src);

        // Aplicar mudanças apenas se necessário
        if (highQualitySrc !== src) {
          img.src = highQualitySrc;

          // Remover filtros CSS causando embaçamento
          img.style.filter = '';
          img.classList.remove('blur', 'placeholder', 'lazy-load');

          // Usar decoding="async" em vez de sync para não bloquear o thread principal
          if (!img.hasAttribute('decoding')) {
            img.decoding = 'async';
          }

          count++;
        }
      }
    }

    // Processar o próximo lote se houver mais imagens
    if (endIdx < images.length) {
      requestAnimationFrame(() => {
        processImageBatch(images, endIdx, batchSize);
      });
    } else if (isDevEnvironment) {
      console.log(`Correção finalizada: ${count} imagens otimizadas`);
    }
  };

  // Iniciar processamento com lotes de 5 imagens para não bloquear o thread
  processImageBatch(quizIntroImages, 0, 5);

  return count;
};

/**
 * Função para determinar se o dispositivo tem limitações de desempenho
 * Ajusta o comportamento para economizar recursos em dispositivos menos potentes
 */
const isLowPerformanceDevice = (): boolean => {
  const memory = (navigator as any).deviceMemory;
  if (memory && memory < 4) return true;

  const cpuCores = navigator.hardwareConcurrency;
  if (cpuCores && cpuCores < 4) return true;

  return false;
};

/**
 * Função otimizada para inicializar a correção de imagens
 * no momento mais apropriado do ciclo de vida da página
 */
export const initializeImageFixer = (): void => {
  // Verificar se devemos aplicar otimização com base no dispositivo
  const isLowPerformance = isLowPerformanceDevice();

  // Função que será chamada para iniciar a correção
  const runFixer = () => {
    // Em dispositivos de baixo desempenho, atrasar ainda mais para priorizar interatividade
    if (isLowPerformance) {
      // Usar requestIdleCallback se disponível, com fallback para setTimeout
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(
          () => {
            fixBlurryIntroQuizImages();
          },
          { timeout: 3000 }
        );
      } else {
        setTimeout(fixBlurryIntroQuizImages, 2000);
      }
    } else {
      // Em dispositivos normais, usar requestAnimationFrame para o próximo frame disponível
      requestAnimationFrame(() => {
        fixBlurryIntroQuizImages();
      });
    }
  };

  // Estratégia de inicialização baseada no estado do documento
  if (document.readyState === 'loading') {
    // Executar apenas após o carregamento do DOM, não durante o parsing
    window.addEventListener('DOMContentLoaded', () => {
      // Adiar para não competir com renderização inicial
      setTimeout(runFixer, isLowPerformance ? 1500 : 500);
    });
  } else if (document.readyState === 'interactive' || document.readyState === 'complete') {
    // Caso já esteja carregado, adiar para priorizar interatividade
    setTimeout(runFixer, isLowPerformance ? 1000 : 300);
  }
};

// Expor a função globalmente para acesso externo, mas com nome mais descritivo
declare global {
  interface Window {
    optimizeQuizImages: typeof fixBlurryIntroQuizImages;
  }
}

// Registrar função com nome mais descritivo no objeto window
if (typeof window !== 'undefined') {
  window.optimizeQuizImages = fixBlurryIntroQuizImages;
}

// Iniciar o processo apenas se estivermos no navegador
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  initializeImageFixer();
}

export default fixBlurryIntroQuizImages;
