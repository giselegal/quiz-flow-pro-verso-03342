/**
 * Function to get an optimized image URL
 *
 * @param originalUrl - The original image URL
 * @param options - Optimization options
 * @returns Optimized image URL
 */
const getOptimizedImageUrl = (
  originalUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    priority?: 'high' | 'medium' | 'low';
  } = {}
): string => {
  // If no image URL provided, return empty string
  if (!originalUrl) return '';

  // Default options with improved defaults
  const width = options.width || 800;
  const height = options.height || 0;
  // Adjust quality based on priority
  const priority = options.priority || 'medium';
  let quality = options.quality;

  if (!quality) {
    switch (priority) {
      case 'high':
        quality = 90;
        break;
      case 'medium':
        quality = 80;
        break;
      case 'low':
        quality = 65;
        break;
      default:
        quality = 80;
    }
  }

  const format = options.format || 'auto';

  // For Cloudinary URLs
  if (originalUrl.includes('cloudinary.com')) {
    // Extract base URL and transformation string (if any)
    const baseUrlParts = originalUrl.split('/upload/');
    if (baseUrlParts.length < 2) return originalUrl;

    // Create transformation string with improved settings
    let transformations = `f_${format},q_${quality}`;
    if (width > 0) transformations += `,w_${width}`;
    if (height > 0) transformations += `,h_${height}`;

    // Add dpr_auto for better display on high DPI devices
    transformations += ',dpr_auto';

    // Return optimized cloudinary URL
    return `${baseUrlParts[0]}/upload/${transformations}/${baseUrlParts[1]}`;
  }
  // For local images
  else if (originalUrl.startsWith('/')) {
    // Enhanced parameter approach for local images
    return `${originalUrl}?w=${width}&q=${quality}${height ? `&h=${height}` : ''}&f=${format}`;
  }

  // For other URLs (fallback)
  return originalUrl;
};

export default getOptimizedImageUrl;
