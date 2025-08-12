import { ImageSettings, ImageOptimizationOptions } from './types';

/**
 * Otimiza URLs do Cloudinary aplicando transformações para imagens.
 *
 * @param url URL da imagem do Cloudinary
 * @param settings Configurações de otimização (qualidade, formato, etc)
 * @returns URL otimizada
 */
export const optimizeCloudinaryUrl = (
  url: string,
  settings: ImageSettings = { quality: 75, format: 'auto', responsive: false }
): string => {
  if (!url) return '';
  if (!url.includes('cloudinary.com')) return url;

  // Define configurações padrão com qualidade reduzida para melhor performance
  const {
    quality = 75, // Reduzido de 85 para 75 para melhorar desempenho
    format = 'auto',
    width,
    height,
    crop = 'limit',
  } = settings;

  // Detecta se a URL já tem transformações
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  const baseUrlParts = parts;
  const secondPart = baseUrlParts[1];
  const hasTransformations = secondPart.includes('/') && !/v\d+\//.test(secondPart.split('/')[0]); // Distingue transforms de version strings

  // Constrói a string de transformação
  let transformations = `f_${format === 'auto' ? 'auto' : format},q_${quality}`;

  // Adiciona crop mode se especificado
  if (crop) {
    transformations += `,c_${crop}`;
  }

  // Adiciona dimensões se especificadas
  if (width) {
    transformations += `,w_${width}`;
  }

  if (height) {
    transformations += `,h_${height}`;
  }

  // Aplica transformações à URL com tratamento adequado
  if (hasTransformations) {
    // URL já tem transformações, substitui-as
    return `${baseUrlParts[0]}/upload/${transformations}/${parts.slice(1).join('/')}`;
  } else {
    // URL não tem transformações, adiciona-as
    return `${baseUrlParts[0]}/upload/${transformations}/${secondPart}`;
  }
};

/**
 * Gera uma URL de placeholder de baixa qualidade para imagens do Cloudinary
 * Versão aprimorada para melhor qualidade visual dos placeholders
 *
 * @param url URL original da imagem
 * @param options Opções de largura e qualidade do placeholder
 */
export const getLowQualityPlaceholder = (
  url: string,
  options: { width?: number; quality?: number } = {}
): string => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  // Melhorou a qualidade dos placeholders para evitar embaçamento excessivo
  const { width = 40, quality = 30 } = options; // Reduziu qualidade de 35 para 30

  // Extrai partes base da URL
  const baseUrlParts = url.split('/upload/');
  if (baseUrlParts.length !== 2) return url;

  // Extrai o nome do arquivo (sem considerar parâmetros de transformação)
  const pathParts = baseUrlParts[1].split('/');
  const fileName = pathParts[pathParts.length - 1];

  // Cria um placeholder otimizado com parâmetros aprimorados
  // Usa um efeito de blur mais leve para melhorar a visibilidade
  return `${baseUrlParts[0]}/upload/f_auto,q_${quality},w_${width},e_blur:800/${fileName}`;
};

/**
 * Obtém uma URL de imagem otimizada com dimensões explícitas
 *
 * @param url URL original da imagem
 * @param options Opções de largura, altura e qualidade
 */
export const getOptimizedImageUrl = (
  url: string,
  options: { width?: number; height?: number; quality?: number } = {}
): string => {
  if (!url || !url.includes('cloudinary.com')) return url;

  // Extrai partes base da URL
  const baseUrlParts = url.split('/upload/');
  if (baseUrlParts.length !== 2) return url;

  const { width = 800, height, quality = 70 } = options; // Reduzido de 80 para 70

  // Constrói string de transformação
  let transformations = `f_auto,q_${quality},w_${width}`;
  if (height) {
    transformations += `,h_${height}`;
  }

  // Extrai componentes do caminho
  const pathParts = baseUrlParts[1].split('/');
  const fileName = pathParts[pathParts.length - 1];

  // Retorna URL construída
  return `${baseUrlParts[0]}/upload/${transformations}/${fileName}`;
};

/**
 * Otimiza uma imagem com configurações específicas
 *
 * @param url URL da imagem
 * @param settings Configurações de otimização
 */
export const getOptimizedImage = (url: string, settings?: ImageSettings): string => {
  if (!url) return '';
  return optimizeCloudinaryUrl(url, settings);
};

/**
 * Gera URLs para imagens responsivas (diferentRes tamanhos de tela)
 *
 * @param url URL base da imagem
 * @param widths Array de larguras para diferentes breakpoints
 * @param options Opções adicionais
 */
export const getResponsiveImageSources = (
  url: string,
  widths: number[] = [640, 768, 1024, 1280],
  options: { quality?: number } = {}
): string[] => {
  if (!url || !url.includes('cloudinary.com')) return [url];

  const { quality = 80 } = options;

  return widths.map(width => getOptimizedImageUrl(url, { width, quality }));
};
