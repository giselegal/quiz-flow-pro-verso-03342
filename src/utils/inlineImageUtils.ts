// @ts-nocheck
/**
 * Utility functions for inline image optimization
 */

/**
 * Gera uma versão extremamente pequena da imagem para uso como base64 inline
 * permitindo renderização instantânea enquanto a imagem principal carrega
 *
 * @param baseUrl URL base do Cloudinary
 * @param imageId ID da imagem
 * @returns URL da imagem tiny otimizada para base64
 */
export const getTinyBase64ImageUrl = (baseUrl: string, imageId: string): string => {
  // Configurada para ser extremamente leve - apenas 10px e baixa qualidade
  return `${baseUrl}f_webp,q_1,w_10,h_10,c_limit,e_blur:200/${imageId}.webp`;
};

/**
 * Carrega uma imagem super-tiny como base64 para renderização instantânea
 * como background antes da imagem principal
 *
 * @param imageUrl URL da imagem tiny
 * @returns Promise com string base64
 */
export const loadTinyImageAsBase64 = async (imageUrl: string): Promise<string> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('[ImageLoader] Failed to load tiny image:', error);
    return '';
  }
};

/**
 * Gera URL otimizada para carregar imagens do Cloudinary com parâmetros específicos
 *
 * @param baseUrl URL base do Cloudinary
 * @param imageId ID da imagem
 * @param format Formato (avif, webp, etc)
 * @param width Largura da imagem
 * @param quality Qualidade da imagem (1-100)
 * @returns URL otimizada
 */
export const getOptimizedImageUrl = (
  baseUrl: string,
  imageId: string,
  format: string,
  width: number,
  quality: number
): string => {
  // Configuração otimizada para performance e qualidade
  return `${baseUrl}f_${format},q_${quality},w_${width},c_limit,dpr_auto,fl_progressive,fl_lossy${width > 300 ? ',e_sharpen:30' : ''}/${imageId}.${format}`;
};

/**
 * Gera URL super-otimizada para preload inicial (LCP crítico)
 *
 * @param baseUrl URL base do Cloudinary
 * @param imageId ID da imagem
 * @param format Formato da imagem
 * @param width Largura da imagem
 * @returns URL otimizada para preload
 */
export const getTinyImageUrl = (
  baseUrl: string,
  imageId: string,
  format: string,
  width: number
): string => {
  // Baixa qualidade, baixa resolução para carregamento instantâneo
  return `${baseUrl}f_${format},q_30,w_${width},c_limit,dpr_1.0/${imageId}.${format}`;
};
