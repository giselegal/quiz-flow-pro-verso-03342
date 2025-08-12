import { preloadCriticalImages, getLowQualityPlaceholder } from '@/utils/imageManager';

/**
 * Pré-carrega imagens de antes e depois para melhorar a experiência do usuário
 * @param transformations Array de transformações com URLs de imagens antes/depois
 */
export const preloadTransformationImages = (transformations: any[]) => {
  if (!transformations || !Array.isArray(transformations) || transformations.length === 0) {
    console.warn('Não foi possível pré-carregar imagens de transformação: dados inválidos');
    return;
  }

  // Pré-carregar a primeira transformação imediatamente com alta prioridade
  if (transformations[0]) {
    const firstTransformation = transformations[0];

    // Antes pré-carrega com alta prioridade
    if (firstTransformation.beforeImage) {
      const imgBefore = new Image();
      imgBefore.src = `${firstTransformation.beforeImage}?q=85&f=auto&w=400&e_sharpen:60`;
      imgBefore.fetchPriority = 'high';
      imgBefore.decoding = 'sync'; // Decodificação síncrona para a primeira imagem
    }

    // Depois pré-carrega com alta prioridade
    if (firstTransformation.afterImage) {
      const imgAfter = new Image();
      imgAfter.src = `${firstTransformation.afterImage}?q=85&f=auto&w=400&e_sharpen:60`;
      imgAfter.fetchPriority = 'high';
      imgAfter.decoding = 'sync'; // Decodificação síncrona para a primeira imagem
    }
  }

  // Em segundo plano, pré-carregue as outras transformações
  setTimeout(() => {
    for (let i = 1; i < transformations.length; i++) {
      const transformation = transformations[i];

      if (transformation.beforeImage) {
        const imgBefore = new Image();
        imgBefore.src = `${transformation.beforeImage}?q=85&f=auto&w=400`;
        imgBefore.decoding = 'async'; // Decodificação assíncrona para as demais
      }

      if (transformation.afterImage) {
        const imgAfter = new Image();
        imgAfter.src = `${transformation.afterImage}?q=85&f=auto&w=400`;
        imgAfter.decoding = 'async'; // Decodificação assíncrona para as demais
      }
    }
  }, 2000); // Atraso para priorizar o carregamento inicial
};

/**
 * Melhora a qualidade da URL de uma imagem do Cloudinary
 * @param url URL da imagem do Cloudinary
 * @returns URL otimizada
 */
export const getHighQualityImageUrl = (url: string) => {
  if (!url || !url.includes('cloudinary.com')) return url;

  // Remove qualquer transformação existente que possa estar causando baixa qualidade
  if (url.includes('/upload/')) {
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      // Extrair a versão se existir
      const versionMatch = parts[1].match(/^v\d+\//);
      const version = versionMatch ? versionMatch[0] : '';

      // Extrair o path após a versão ou usar todo o path se não houver versão
      const path = version ? parts[1].substring(version.length) : parts[1];

      // Aplicar transformações de alta qualidade
      return `${parts[0]}/upload/${version}f_auto,q_85,e_sharpen:60/${path}`;
    }
  }

  return url;
};

/**
 * Corrige problemas comuns em imagens embaçadas
 * @param imageElement Elemento DOM da imagem
 */
export const fixBlurryImage = (imageElement: HTMLImageElement) => {
  if (!imageElement || !imageElement.src) return;

  const currentSrc = imageElement.src;
  const newSrc = getHighQualityImageUrl(currentSrc);

  if (newSrc !== currentSrc) {
    const tempImg = new Image();
    tempImg.onload = () => {
      imageElement.src = newSrc;
      console.log('Imagem corrigida:', newSrc);
    };
    tempImg.src = newSrc;
  }
};
