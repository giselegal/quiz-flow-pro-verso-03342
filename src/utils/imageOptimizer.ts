/**
 * Image optimization utility functions
 */

/**
 * Optimize image quality
 * @param url The image URL
 * @param quality Quality level (1-100)
 * @returns Optimized image URL
 */
export function optimizeImageQuality(url: string, quality: number = 85): string {
  if (!url) return url;

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
    console.error('Error optimizing image quality:', error);
    return url;
  }
}

/**
 * Resize image to specific dimensions
 * @param url The image URL
 * @param width Desired width
 * @param height Desired height
 * @returns Resized image URL
 */
export function resizeImage(url: string, width: number, height?: number): string {
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
