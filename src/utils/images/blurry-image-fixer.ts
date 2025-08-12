/**
 * Utility to identify and fix blurry images, particularly focused on Cloudinary URLs
 */

/**
 * Gets a high quality version of an image URL by optimizing transform parameters
 * @param url The image URL to optimize
 * @returns Optimized URL with better quality parameters
 */
export const getHighQualityImageUrl = (url: string): string => {
  if (!url || typeof url !== 'string') return url;

  // Only process Cloudinary URLs
  if (!url.includes('cloudinary.com')) return url;

  // Parse URL and extract transformations
  const urlParts = url.split('/upload/');
  if (urlParts.length !== 2) return url;

  const baseUrl = urlParts[0];
  const pathParts = urlParts[1].split('/');

  // Check if there are transformations
  const hasTransforms = pathParts[0].includes('_') || pathParts[0].includes(',');

  // If there are existing transformations, we need to parse and modify them
  if (hasTransforms) {
    const transforms = pathParts[0];

    // Remove any blur transformations
    const cleanedTransforms = transforms
      .split(',')
      .filter(t => !t.startsWith('e_blur'))
      .join(',');

    // Add or replace quality parameter with high quality
    let optimizedTransforms = cleanedTransforms;
    if (optimizedTransforms.includes('q_')) {
      // Replace existing quality with higher quality
      optimizedTransforms = optimizedTransforms.replace(/q_\d+/, 'q_85');
    } else {
      // Add quality parameter if not present
      optimizedTransforms += ',q_85';
    }

    // Add sharpening for better clarity
    if (!optimizedTransforms.includes('e_sharpen')) {
      optimizedTransforms += ',e_sharpen:60';
    }

    // Ensure we have automatic format
    if (!optimizedTransforms.includes('f_')) {
      optimizedTransforms += ',f_auto';
    }

    // Construct the new URL
    return `${baseUrl}/upload/${optimizedTransforms}/${pathParts.slice(1).join('/')}`;
  } else {
    // No existing transformations, add optimal quality params
    return `${baseUrl}/upload/f_auto,q_85,e_sharpen:60/${urlParts[1]}`;
  }
};

/**
 * Checks if an image URL appears to be a blurry placeholder
 * @param url The image URL to check
 * @returns True if the URL appears to be a blurry placeholder
 */
export const isLikelyBlurryImage = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;

  // Common indicators of placeholder or blurry images
  const blurryIndicators = [
    'e_blur',
    'q_1',
    'q_10',
    'q_20',
    'q_30',
    'w_20',
    'w_30',
    'w_50',
    'placeholder',
  ];

  return blurryIndicators.some(indicator => url.includes(indicator));
};

/**
 * Scans the page for blurry images in the intro quiz section and replaces them
 * with higher quality versions
 * @returns Statistics about how many images were fixed
 */
export const replaceBlurryIntroImages = (): {
  total: number;
  replaced: number;
} => {
  if (typeof document === 'undefined') {
    return { total: 0, replaced: 0 };
  }

  // Target intro quiz images
  const introImages = document.querySelectorAll('.quiz-intro img');
  let replaced = 0;

  introImages.forEach(img => {
    const imgElement = img as HTMLImageElement;
    const currentSrc = imgElement.src;

    // Check if this image is likely a blurry placeholder
    if (isLikelyBlurryImage(currentSrc) || imgElement.width < 100) {
      const highQualitySrc = getHighQualityImageUrl(currentSrc);

      if (highQualitySrc !== currentSrc) {
        // Load the high quality image
        const newImg = new Image();
        newImg.onload = () => {
          imgElement.src = highQualitySrc;
          replaced++;

          // Remove any blur styling
          imgElement.style.filter = '';
          if (imgElement.parentElement) {
            imgElement.parentElement.style.filter = '';
          }
        };
        newImg.src = highQualitySrc;
      }
    }
  });

  return {
    total: introImages.length,
    replaced,
  };
};

/**
 * Fix blurry images specifically for the quiz intro section
 */
export const fixBlurryIntroQuizImages = (): number => {
  const stats = replaceBlurryIntroImages();
  return stats.replaced;
};

export default {
  getHighQualityImageUrl,
  isLikelyBlurryImage,
  replaceBlurryIntroImages,
  fixBlurryIntroQuizImages,
};
