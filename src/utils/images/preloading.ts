// @ts-nocheck
import { type BankImage, getAllImages, getImageById } from '@/data/imageBank';
import { optimizeCloudinaryUrl } from './optimization';
import { PreloadOptions, ImageCacheEntry } from './types';
import { updateImageCache, hasImageWithStatus } from './caching';

/**
 * Verifica se uma imagem já foi pré-carregada
 * @param url URL da imagem para verificar
 * @returns Booleano indicando se a imagem já foi pré-carregada
 */
export const isImagePreloaded = (url: string): boolean => {
  return hasImageWithStatus(url, 'loaded');
};

/**
 * Pré-carrega imagens pelo ID do banco de imagens
 * @param imageIds IDs das imagens para pré-carregar
 * @param options Opções de pré-carregamento
 */
export const preloadImagesByIds = (
  imageIds: string[],
  options: PreloadOptions = {}
): Promise<boolean> => {
  try {
    const images = imageIds
      .map(id => getImageById(id))
      .filter(img => img !== undefined) as BankImage[];

    return preloadImages(images, options);
  } catch (error) {
    console.error('[Image Manager] Erro ao pré-carregar imagens por ID:', error);
    return Promise.resolve(false);
  }
};

/**
 * Pré-carrega imagens por URL
 * @param urls URLs das imagens para pré-carregar
 * @param options Opções de pré-carregamento
 */
export const preloadImagesByUrls = (
  urls: string[],
  options: PreloadOptions = {}
): Promise<boolean> => {
  try {
    const images = urls.map(url => ({
      id: `url-${url.slice(-20)}`, // Generate a simple ID based on URL
      src: url,
      alt: 'Preloaded image',
      category: 'preloaded',
    })) as BankImage[];

    return preloadImages(images, options);
  } catch (error) {
    console.error('[Image Manager] Erro ao pré-carregar imagens por URL:', error);
    return Promise.resolve(false);
  }
};

/**
 * Pré-carrega um conjunto de imagens
 * @param images Array de imagens para pré-carregar
 * @param options Opções de pré-carregamento
 */
export const preloadImages = (
  images: BankImage[],
  options: PreloadOptions = {}
): Promise<boolean> => {
  if (!images || images.length === 0) {
    return Promise.resolve(true);
  }

  const { quality = 85, format = 'auto', onProgress, batchSize = 4 } = options;

  let loaded = 0;
  const total = images.length;

  return new Promise(resolve => {
    // Função para carregar uma imagem
    const loadImage = (src: string): Promise<void> => {
      return new Promise(resolveImage => {
        if (hasImageWithStatus(src, 'loaded')) {
          resolveImage();
          return;
        }

        updateImageCache(src, { url: src, loadStatus: 'loading' });

        // Ensure format is a valid type
        const validFormat = ['webp', 'jpeg', 'png', 'auto'].includes(format as string)
          ? (format as 'webp' | 'jpeg' | 'png' | 'auto')
          : 'auto';

        const optimizedSrc = optimizeCloudinaryUrl(src, {
          quality,
          format: validFormat,
        });
        const img = new Image();

        img.onload = () => {
          updateImageCache(src, { url: src, loadStatus: 'loaded' });
          loaded++;
          if (onProgress) onProgress(loaded, total);
          resolveImage();
        };

        img.onerror = () => {
          console.warn(`[Image Manager] Falha ao carregar imagem: ${src}`);
          updateImageCache(src, { url: src, loadStatus: 'error' });
          loaded++;
          if (onProgress) onProgress(loaded, total);
          resolveImage();
        };

        img.src = optimizedSrc;
      });
    };

    // Carregar imagens em lotes
    const loadBatch = async (batch: BankImage[]): Promise<void> => {
      await Promise.all(batch.map(image => loadImage(image.src)));
    };

    // Dividir em lotes e carregar
    const batches: BankImage[][] = [];
    for (let i = 0; i < images.length; i += batchSize) {
      batches.push(images.slice(i, i + batchSize));
    }

    // Carregar lotes em sequência
    let batchIndex = 0;
    const processNextBatch = () => {
      if (batchIndex >= batches.length) {
        resolve(loaded === total);
        return;
      }

      loadBatch(batches[batchIndex]).then(() => {
        batchIndex++;
        processNextBatch();
      });
    };

    processNextBatch();
  });
};

/**
 * Pré-carrega imagens críticas por categoria
 * @param categoryName Nome da categoria de imagens para pré-carregar
 * @param options Opções de pré-carregamento
 */
export const preloadImagesByCategory = (
  categoryName: string,
  options: PreloadOptions = {}
): Promise<boolean> => {
  try {
    const allImages = getAllImages();
    const categoryImages = allImages.filter(
      img =>
        img.category === categoryName || (img.categories && img.categories.includes(categoryName))
    );

    if (categoryImages.length === 0) {
      console.warn(`[Image Manager] Nenhuma imagem encontrada na categoria '${categoryName}'`);
      return Promise.resolve(false);
    }

    console.log(
      `[Image Manager] Pré-carregando ${categoryImages.length} imagens da categoria '${categoryName}'`
    );
    return preloadImages(categoryImages, options);
  } catch (error) {
    console.error('[Image Manager] Erro ao pré-carregar categoria:', error);
    return Promise.resolve(false);
  }
};

/**
 * Pré-carrega imagens críticas para uma determinada seção ou página
 * @param section Nome da seção ou página para pré-carregar imagens
 * @param options Opções de pré-carregamento
 */
export const preloadCriticalImages = (
  section: string | string[],
  options: PreloadOptions = {}
): Promise<boolean> => {
  // Converter para array se for string única
  const sections = Array.isArray(section) ? section : [section];

  // Configurações para questões estratégicas - ajustamos a qualidade e
  // timeout para otimizar durante as questões que não pontuam
  if (sections.includes('strategic')) {
    options = {
      quality: 80, // Reduzido para economizar largura de banda
      timeout: 5000, // Maior timeout para permitir carregamento em background
      ...options,
    };
  }

  // Configurações específicas para resultados - prioridade máxima e qualidade
  if (sections.includes('results')) {
    options = {
      quality: 85,
      timeout: 3000,
      ...options,
    };
  }

  // Tentar cada método de carregamento em ordem de prioridade
  return preloadBySection(sections, options);
};

/**
 * Função interna para pré-carregar imagens de uma ou mais seções
 */
const preloadBySection = async (
  sections: string[],
  options: PreloadOptions = {}
): Promise<boolean> => {
  try {
    const allImages = getAllImages();

    // Filtrar imagens das seções especificadas
    const sectionImages = allImages.filter(img => {
      if (!img.category) return false;

      // Verificar se a imagem pertence a qualquer uma das seções ou categorias
      return sections.some(
        section =>
          (img.section && img.section === section) ||
          img.category === section ||
          (img.categories && img.categories.includes(section))
      );
    });

    if (sectionImages.length === 0) {
      console.warn(
        `[Image Manager] Nenhuma imagem crítica encontrada para seções: ${sections.join(', ')}`
      );
      return Promise.resolve(false);
    }

    // Ordenar por prioridade
    sectionImages.sort((a, b) => {
      const priorityA = a.priority || 'medium';
      const priorityB = b.priority || 'medium';

      const priorityValues = { high: 3, medium: 2, low: 1 };
      return (
        priorityValues[priorityB as keyof typeof priorityValues] -
        priorityValues[priorityA as keyof typeof priorityValues]
      );
    });

    console.log(
      `[Image Manager] Pré-carregando ${sectionImages.length} imagens críticas para: ${sections.join(', ')}`
    );
    return preloadImages(sectionImages, options);
  } catch (error) {
    console.error('[Image Manager] Erro ao pré-carregar imagens críticas:', error);
    return Promise.resolve(false);
  }
};

/**
 * Obtém URL para imagem de baixa qualidade para carregamento progressivo
 * @param url URL da imagem original
 * @param options Opções adicionais de customização
 * @returns URL para imagem de baixa qualidade
 */
export const getLowQualityImage = (
  url: string,
  options: { width?: number; quality?: number } = {}
): string => {
  if (!url) return '';

  const {
    width = 35, // Aumentado de 30 para 35 para melhor percepção visual
    quality = 25, // Aumentado de 20 para 25 para melhor equilíbrio qualidade/tamanho
  } = options;

  // Para imagens grandes (como banners), aumentamos proporcionalmente a largura do placeholder
  // para evitar desfoque excessivo
  const isLargeImage = url.includes('banner') || url.includes('cover') || url.includes('hero');
  const placeholderWidth = isLargeImage ? width * 1.5 : width;

  return optimizeCloudinaryUrl(url, {
    quality,
    width: placeholderWidth,
    format: 'auto',
    crop: true,
  });
};

/**
 * Pré-carrega uma imagem
 * @param url URL da imagem para pré-carregar
 * @param options Opções de pré-carregamento
 */
export const preloadImage = (url: string, options: PreloadOptions = {}): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    const cacheEntry: Partial<ImageCacheEntry> = {
      url,
      timestamp: Date.now(),
      loadStatus: 'loading',
      metadata: {
        url,
        format: options.format === 'auto' ? 'webp' : options.format || 'webp',
      },
    };

    img.onload = () => {
      cacheEntry.loadStatus = 'loaded';
      resolve();
    };

    img.onerror = () => {
      cacheEntry.loadStatus = 'error';
      reject(new Error(`Failed to preload image: ${url}`));
    };

    img.src = url;
  });
};
