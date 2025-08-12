// @ts-nocheck
/**
 * Funções utilitárias para otimização, gerenciamento e manipulação de imagens
 */

/**
 * Otimiza URL do Cloudinary
 * @param url URL original do Cloudinary
 * @param options Opções de otimização
 * @returns URL otimizada para o Cloudinary
 */
export const optimizeCloudinaryUrl = (
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'avif';
    crop?: 'fill' | 'fit' | 'limit';
  } = {}
): string => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  // Opções padrão de otimização com melhor equilíbrio qualidade/tamanho
  const defaults = {
    width: 0,
    height: 0,
    quality: 85,
    format: 'auto' as const,
    crop: 'fill' as const,
  };

  const settings = { ...defaults, ...options };

  // Extrai partes da URL base para lidar com URLs com transformações existentes
  const baseUrlParts = url.split('/upload/');
  if (baseUrlParts.length !== 2) return url;

  // Extrai qualquer caminho após o ID da versão (vXXXXXX)
  const secondPart = baseUrlParts[1];
  const parts = secondPart.split('/');

  // Verifica se já existem transformações
  const hasTransformations =
    parts[0].includes('_') || parts[0].includes(',') || parts[0].startsWith('f_');

  // Constrói string de transformação
  let transformations = `f_${settings.format}`;

  if (settings.quality) {
    transformations += `,q_${settings.quality}`;
  }

  if (settings.width && settings.height) {
    transformations += `,c_${settings.crop},w_${settings.width},h_${settings.height}`;
  } else if (settings.width) {
    transformations += `,w_${settings.width}`;
  } else if (settings.height) {
    transformations += `,h_${settings.height}`;
  }

  // Aplica transformações à URL com tratamento adequado de transformações existentes
  if (hasTransformations) {
    // URL já tem transformações, substitui-as
    return `${baseUrlParts[0]}/upload/${transformations}/${parts.slice(1).join('/')}`;
  } else {
    // URL não tem transformações, adiciona-as
    return `${baseUrlParts[0]}/upload/${transformations}/${secondPart}`;
  }
};

/**
 * Cria URL de placeholder de baixa qualidade para carregamento progressivo
 * @param url URL original da imagem
 * @param options Opções como largura e qualidade
 * @returns URL de placeholder de baixa qualidade
 */
export const getLowQualityPlaceholder = (
  url: string,
  options: { width?: number; quality?: number } = {}
): string => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const { width = 40, quality = 30 } = options;

  // Extrai partes da URL base
  const baseUrlParts = url.split('/upload/');
  if (baseUrlParts.length !== 2) return url;

  // Limpa o caminho do arquivo, removendo transformações existentes se houver
  let filePath = baseUrlParts[1];

  // Se há transformações existentes, remove para aplicar as nossas
  if (filePath.includes('/')) {
    const parts = filePath.split('/');
    // Se o primeiro parte contém transformações (tem vírgulas ou underscores), pula ela
    if (parts[0].includes(',') || parts[0].includes('_')) {
      filePath = parts.slice(1).join('/');
    }
  }

  // Cria um placeholder otimizado de tamanho pequeno com blur
  return `${baseUrlParts[0]}/upload/f_auto,q_${quality},w_${width},e_blur:200/${filePath}`;
};

/**
 * Interface para fontes de imagem responsiva
 */
interface ResponsiveImageSource {
  srcSet: string;
  sizes: string;
}

/**
 * Gera fontes de imagem responsivas com diferentes tamanhos
 * @param url URL base da imagem
 * @param sizes Array de tamanhos de largura para gerar
 * @returns Objeto com atributos srcset e sizes para imagens responsivas
 */
export const getResponsiveImageSources = (
  url: string,
  sizes: number[] = [320, 640, 960, 1280]
): ResponsiveImageSource => {
  if (!url || !url.includes('cloudinary.com')) {
    return { srcSet: url, sizes: '100vw' };
  }

  const srcSet = sizes
    .map(size => {
      const optimizedUrl = optimizeCloudinaryUrl(url, {
        width: size,
        quality: 85,
        format: 'auto',
      });
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');

  return {
    srcSet,
    sizes: '(max-width: 768px) 100vw, 50vw',
  };
};

// Define sistema de cache para evitar carregamentos duplicados
const preloadedImages = new Set<string>();

/**
 * Verifica se uma imagem já foi pré-carregada
 * @param url URL da imagem para verificar
 * @returns Booleano indicando se a imagem já está pré-carregada
 */
export const isImagePreloaded = (url: string): boolean => {
  const optimizedUrl = optimizeCloudinaryUrl(url, {
    quality: 85,
    format: 'auto',
  });
  return preloadedImages.has(optimizedUrl);
};

/**
 * Pré-carrega próximas imagens de perguntas
 * @param nextQuestionImages Array de URLs de imagens para a próxima pergunta
 */
export const preloadNextQuestionImages = (nextQuestionImages: string[]): void => {
  if (!nextQuestionImages || nextQuestionImages.length === 0) {
    return;
  }

  nextQuestionImages.forEach(url => {
    const optimizedUrl = optimizeCloudinaryUrl(url, {
      quality: 85,
      format: 'auto',
    });
    if (!preloadedImages.has(optimizedUrl)) {
      const img = new Image();
      img.onload = () => preloadedImages.add(optimizedUrl);
      img.src = optimizedUrl;
    }
  });
};

/**
 * Verifica o suporte do navegador a formatos modernos de imagem
 * @returns Objeto com flags de suporte
 */
export const checkImageFormatSupport = (): { webp: boolean; avif: boolean } => {
  const result = { webp: false, avif: false };

  // Verifica suporte a WebP (versão simplificada)
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
      result.webp = true;
    }
  }

  return result;
};

/**
 * Obtém o formato ideal com base no suporte do navegador
 * @returns Melhor formato disponível
 */
export const getOptimalImageFormat = (): 'auto' | 'webp' | 'avif' => {
  const support = checkImageFormatSupport();

  if (support.avif) return 'avif';
  if (support.webp) return 'webp';
  return 'auto'; // Padrão para auto que normalmente servirá JPEG
};

/**
 * Normaliza URLs do Cloudinary removendo codificação desnecessária de caracteres especiais
 * @param url URL do Cloudinary com possível codificação
 * @returns URL normalizada sem codificação desnecessária
 */
export const normalizeCloudinaryUrl = (url: string): string => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  // Mapeamento de caracteres codificados para versões normais
  const charMap: Record<string, string> = {
    '%C3%81': 'Á', // Á
    '%C3%82': 'Â', // Â
    '%C3%89': 'É', // É
    '%C3%8A': 'Ê', // Ê
    '%C3%8D': 'Í', // Í
    '%C3%93': 'Ó', // Ó
    '%C3%94': 'Ô', // Ô
    '%C3%9A': 'Ú', // Ú
    '%C3%87': 'Ç', // Ç
    '%C3%A0': 'à', // à
    '%C3%A1': 'á', // á
    '%C3%A2': 'â', // â
    '%C3%A3': 'ã', // ã
    '%C3%A7': 'ç', // ç
    '%C3%A9': 'é', // é
    '%C3%AA': 'ê', // ê
    '%C3%AD': 'í', // í
    '%C3%B3': 'ó', // ó
    '%C3%B4': 'ô', // ô
    '%C3%BA': 'ú', // ú
    '%C3%BC': 'ü', // ü
    '%20': '_', // Espaço para underscore (melhor para URLs)
  };

  let normalizedUrl = url;

  // Aplicar substituições
  Object.entries(charMap).forEach(([encoded, decoded]) => {
    normalizedUrl = normalizedUrl.replace(new RegExp(encoded, 'g'), decoded);
  });

  return normalizedUrl;
};
