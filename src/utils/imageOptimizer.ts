/**
 * TODO: TypeScript Migration - Deadline: Janeiro 2025
 * - [ ] Criar interfaces para parâmetros de otimização (OptimizationParams, ResizeParams)
 * - [ ] Implementar enum para provedores de imagens (Cloudinary, AWS, etc.)
 * - [ ] Tipar adequadamente retornos e validar URLs
 * - [ ] Adicionar tratamento robusto de erros com tipos específicos
 * - [ ] Separar transformações por provider em classes especializadas
 */

import { appLogger } from './logger';

// Tipos mínimos para migração
type OptimizedImageUrl = string;
type ImageUrl = string;
type QualityLevel = number; // 1-100

/**
 * Image optimization utility functions
 */

/**
 * Optimize image quality
 */
export function optimizeImageQuality(url: ImageUrl, quality: QualityLevel = 85): OptimizedImageUrl {
  if (!url) return url;

  appLogger.debug('Optimizing image quality', { url, quality });

  try {
    // Handle Cloudinary URLs
    if (url.includes('cloudinary.com')) {
      // Check if URL already has quality parameter
      if (url.includes('q_')) {
        return url.replace(/q_\d+/, `q_${quality}`);
      } else if (url.includes('/upload/')) {
        return url.replace('/upload/', `/upload/q_${quality}/`);
      }
    }

    return url;
  } catch (error) {
    appLogger.error('Error optimizing image quality', { url, quality, error });
    return url;
  }
}

/**
 * Resize image to specific dimensions
 */
export function resizeImage(url: ImageUrl, width: number, height?: number): OptimizedImageUrl {
  if (!url) return url;

  try {
    // Handle Cloudinary URLs
    if (url.includes('cloudinary.com')) {
      const heightParam = height ? `,h_${height}` : '';

      // Check if URL already has width parameter
      if (url.includes('w_')) {
        return url.replace(/w_\d+/, `w_${width}`);
      } else if (url.includes('/upload/')) {
        return url.replace('/upload/', `/upload/w_${width}${heightParam}/`);
      }
    }

    return url;
  } catch (error) {
    console.error('Error resizing image:', error);
    return url;
  }
}

/**
 * Optimize image URL with multiple parameters
 * @param url Image URL
 * @param options Optimization options
 * @returns Optimized URL
 */
export function optimizeImage(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  }
): string {
  if (!url) return url;

  const { width, height, quality = 85, format = 'auto' } = options;

  try {
    // Handle Cloudinary URLs
    if (url.includes('cloudinary.com')) {
      const widthParam = width ? `w_${width},` : '';
      const heightParam = height ? `h_${height},` : '';
      const formatParam = format !== 'auto' ? `f_${format},` : 'f_auto,';
      const qualityParam = `q_${quality}`;

      // Check if URL already has transformation parameters
      if (url.includes('/upload/')) {
        return url.replace(
          '/upload/',
          `/upload/${widthParam}${heightParam}${formatParam}${qualityParam}/`
        );
      }
    }

    return url;
  } catch (error) {
    console.error('Error optimizing image:', error);
    return url;
  }
}

export default {
  optimizeImageQuality,
  resizeImage,
  optimizeImage,
};
