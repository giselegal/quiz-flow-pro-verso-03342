// @ts-nocheck
// Image checking and analysis utilities

/**
 * Analyzes an image URL to extract optimization parameters and provide suggestions
 * @param url The image URL to analyze
 * @returns Analysis details including format, quality, width, and suggestions
 */
export const analyzeImageUrl = (url: string) => {
  // Default return structure
  const result = {
    url,
    format: 'unknown',
    quality: 'unknown',
    width: 'unknown',
    height: 'unknown',
    transformations: [] as string[],
    suggestions: [] as string[],
  };

  // Validate URL
  if (!url || typeof url !== 'string') {
    result.suggestions.push('Invalid URL provided');
    return result;
  }

  // Check if it's a Cloudinary URL
  if (url.includes('cloudinary.com')) {
    // Extract transformations from URL
    const transformMatch = url.match(/\/upload\/([^\/]+)\//);
    if (transformMatch && transformMatch[1]) {
      // Split the transformation string by commas
      const transforms = transformMatch[1].split(',');
      result.transformations = transforms;

      // Extract format information
      const formatTransform = transforms.find(t => t.startsWith('f_'));
      if (formatTransform) {
        result.format = formatTransform.replace('f_', '');
      } else {
        result.suggestions.push('Add f_auto parameter for automatic format optimization');
      }

      // Extract quality information
      const qualityTransform = transforms.find(t => t.startsWith('q_'));
      if (qualityTransform) {
        result.quality = qualityTransform.replace('q_', '');

        // Check if quality is too high
        if (result.quality !== 'auto' && parseInt(result.quality as string, 10) > 85) {
          result.suggestions.push(
            'Consider using q_auto or reducing quality to 85 for better performance'
          );
        }
      } else {
        result.suggestions.push('Add q_auto parameter for automatic quality optimization');
      }

      // Extract width information
      const widthTransform = transforms.find(t => t.startsWith('w_'));
      if (widthTransform) {
        result.width = widthTransform.replace('w_', '');
      } else {
        result.suggestions.push('Add width parameter to avoid loading unnecessarily large images');
      }

      // Check for other optimal parameters
      if (!transforms.some(t => t.startsWith('dpr_'))) {
        result.suggestions.push('Add dpr_auto for responsive device pixel ratio handling');
      }
    } else {
      result.suggestions.push('No transformations found in URL. Add optimization parameters.');
    }
  } else {
    // Not a Cloudinary URL
    result.suggestions.push(
      'Not a Cloudinary URL. Consider using Cloudinary for better optimization.'
    );

    // Check for common image formats in the URL
    if (url.includes('.jpg') || url.includes('.jpeg')) {
      result.format = 'jpg';
    } else if (url.includes('.png')) {
      result.format = 'png';
      result.suggestions.push(
        'PNG format detected. Consider using WebP or AVIF for better compression.'
      );
    } else if (url.includes('.gif')) {
      result.format = 'gif';
      result.suggestions.push(
        'GIF format detected. Consider using video formats for animated content.'
      );
    } else if (url.includes('.webp')) {
      result.format = 'webp';
    } else if (url.includes('.svg')) {
      result.format = 'svg';
    }
  }

  return result;
};

/**
 * Checks if an image is likely too large for its display size
 * @param naturalWidth Natural width of the image
 * @param naturalHeight Natural height of the image
 * @param displayWidth Display width of the image
 * @param displayHeight Display height of the image
 * @returns Boolean indicating if the image is oversized
 */
export const isOversizedImage = (
  naturalWidth: number,
  naturalHeight: number,
  displayWidth: number,
  displayHeight: number
): boolean => {
  // Consider device pixel ratio for retina displays
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  // Allow for images up to 1.5x the display size (accounting for DPR)
  const optimalWidth = displayWidth * dpr * 1.5;
  const optimalHeight = displayHeight * dpr * 1.5;

  return naturalWidth > optimalWidth || naturalHeight > optimalHeight;
};

export default {
  analyzeImageUrl,
  isOversizedImage,
};
