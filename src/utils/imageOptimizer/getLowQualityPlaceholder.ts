/**
 * Function to get a low quality image placeholder URL
 *
 * @param originalUrl - The original image URL
 * @returns Low quality placeholder image URL
 */
const getLowQualityPlaceholder = (originalUrl: string): string => {
  // If no image URL provided, return empty string
  if (!originalUrl) return '';

  // For Cloudinary URLs
  if (originalUrl.includes('cloudinary.com')) {
    // Extract base URL and transformation string (if any)
    const baseUrlParts = originalUrl.split('/upload/');
    if (baseUrlParts.length < 2) return originalUrl;

    // Improved transformation for better placeholders
    // Better quality/size balance for placeholder
    const transformations = 'f_auto,q_10,w_30,e_blur:800';

    // Return low quality placeholder URL
    return `${baseUrlParts[0]}/upload/${transformations}/${baseUrlParts[1]}`;
  }
  // For local images
  else if (originalUrl.startsWith('/')) {
    // Enhanced parameter approach for local images
    return `${originalUrl}?w=30&q=10&blur=800`;
  }

  // For other URLs (fallback)
  return originalUrl;
};

export default getLowQualityPlaceholder;
