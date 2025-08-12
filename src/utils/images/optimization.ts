import { ImageOptimizationOptions } from './types';

/**
 * Otimiza URLs do Cloudinary aplicando transformações para melhor qualidade e performance
 * @param url URL da imagem do Cloudinary
 * @param options Opções de otimização
 * @returns URL otimizada
 */
export const optimizeCloudinaryUrl = (
  url: string,
  options: ImageOptimizationOptions = {}
): string => {
  if (!url || !url.includes('cloudinary.com')) return url;

  // Configurações padrão
  const { width, height, quality = 85, format = 'auto', crop = false } = options;

  // Extrair partes da URL do Cloudinary
  const parts = url.split('/image/upload/');
  if (parts.length !== 2) return url;

  // Verificar se a URL já tem transformações
  const hasTransformations = /f_auto|q_auto|w_\d+/.test(parts[1]);
  if (hasTransformations) return url;

  // Construir parâmetros de transformação
  const transformations = [];

  // Formato (webp, avif, etc)
  transformations.push(`f_${format}`);

  // Qualidade
  if (quality) {
    transformations.push(`q_${quality}`);
  }

  // Dimensões
  if (width) {
    transformations.push(`w_${width}`);
  }

  if (height) {
    transformations.push(`h_${height}`);
  }

  // Modo de corte
  if (crop) {
    transformations.push('c_fill');
  }

  // Otimizar para retina display
  transformations.push('dpr_auto');

  // Construir URL final
  const transformString = transformations.join(',');
  return `${parts[0]}/image/upload/${transformString}/${parts[1]}`;
};

/**
 * Obtém uma imagem otimizada com várias opções
 * @param url URL da imagem original
 * @param options Opções de otimização
 * @returns URL otimizada
 */
export const getOptimizedImage = (url: string, options: ImageOptimizationOptions = {}): string => {
  return optimizeCloudinaryUrl(url, options);
};

/**
 * Obtém um placeholder de baixa qualidade para uma imagem
 * @param url URL da imagem original
 * @returns URL para o placeholder de baixa qualidade
 */
export const getLowQualityPlaceholder = (url: string): string => {
  if (!url) return '';

  return optimizeCloudinaryUrl(url, {
    width: 20,
    height: 20,
    quality: 10,
    format: 'auto',
    crop: true,
  });
};

/**
 * Obter URL otimizada para uma imagem
 * @param url URL da imagem original
 * @param width Largura desejada
 * @param height Altura desejada (opcional)
 * @returns URL otimizada
 */
export const getOptimizedImageUrl = (url: string, width: number, height?: number): string => {
  const options: ImageOptimizationOptions = {
    width,
    quality: 85,
    format: 'auto',
  };

  if (height) {
    options.height = height;
  }

  return optimizeCloudinaryUrl(url, options);
};

/**
 * Obtém sources para imagem responsiva
 * @param url URL da imagem
 * @param widths Array de larguras para os breakpoints
 * @returns Array de sources para uso em picture/source
 */
export const getResponsiveImageSources = (
  url: string,
  widths: number[] = [640, 768, 1024, 1280, 1536]
): Array<{ srcset: string; width: number }> => {
  return widths.map(width => ({
    srcset: getOptimizedImageUrl(url, width),
    width,
  }));
};

/**
 * Otimiza URLs do Cloudinary aplicando transformações para melhor qualidade e performance
 * @param url URL da imagem do Cloudinary
 * @param options Opções de otimização
 * @returns URL otimizada
 */
export const optimizeImageUrl = (url: string, options: ImageOptimizationOptions = {}) => {
  const { quality = 80, width, height, format = 'auto', crop = false } = options;

  // Simplified optimization logic
  const params = new URLSearchParams();

  if (quality !== 80) params.append('q', quality.toString());
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  if (format !== 'auto') params.append('f', format);
  if (crop) params.append('c', 'fill');

  const paramString = params.toString();
  return paramString ? `${url}?${paramString}` : url;
};
