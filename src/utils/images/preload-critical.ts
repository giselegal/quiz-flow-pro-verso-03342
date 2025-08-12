import { PreloadOptions, PreloadImageDefinition } from './types';

/**
 * Preloads a set of critical images that should be loaded before rendering
 * @param imageUrls Array of image URLs to preload
 * @param options Preload options
 * @returns A Promise that resolves when all images are loaded or rejects on error
 */
export const preloadCriticalImages = (
  imageUrls: string[],
  options: PreloadOptions = {}
): Promise<void> => {
  const {
    quality = 90,
    format = 'auto',
    timeout = 3000, // Now properly typed in PreloadOptions
    onProgress,
    onComplete,
    batchSize = 4,
  } = options;

  if (imageUrls.length === 0) {
    if (onComplete) onComplete();
    return Promise.resolve();
  }

  // Performance measurement
  const startTime = performance.now();
  let loaded = 0;
  const total = imageUrls.length;

  // Create optimized URLs for preloading
  const optimizedUrls = imageUrls.map(url => {
    if (!url.includes('cloudinary.com')) return url;

    // Extract base URL parts
    const baseUrlParts = url.split('/upload/');
    if (baseUrlParts.length !== 2) return url;

    // Add optimization parameters
    return `${baseUrlParts[0]}/upload/f_${format},q_${quality},dpr_auto/${baseUrlParts[1]}`;
  });

  return new Promise((resolve, reject) => {
    // Helper to update progress
    const updateProgress = () => {
      loaded++;
      if (onProgress) onProgress(loaded, total);
      if (loaded === total) {
        const endTime = performance.now();
        const loadTime = (endTime - startTime) / 1000;
        console.log(`[Preload] All ${total} critical images loaded in ${loadTime.toFixed(2)}s`);

        if (onComplete) onComplete();
        resolve();
      }
    };

    // Create a timeout for the entire batch
    const timeoutId = setTimeout(() => {
      console.warn(
        `[Preload] Timeout reached after ${timeout}ms with ${loaded}/${total} images loaded`
      );
      if (onComplete) onComplete();
      resolve(); // Resolve anyway to not block rendering
    }, timeout);

    // Load images in parallel
    optimizedUrls.forEach(url => {
      // Create a new image element
      const img = new Image();

      // Handle successful load
      img.onload = () => {
        updateProgress();
        if (loaded === total) {
          clearTimeout(timeoutId);
        }
      };

      // Handle loading error
      img.onerror = err => {
        console.error(`[Preload] Failed to preload image: ${url.substring(0, 50)}...`, err);
        updateProgress(); // Still count as processed
        if (loaded === total) {
          clearTimeout(timeoutId);
        }
      };

      // Start loading
      img.src = url;
    });
  });
};

/**
 * Preloads only the most critical image on the page for LCP optimization
 * @param imageUrl The URL of the LCP image
 * @param options Preload options
 */
export const preloadLCPImage = (imageUrl: string, options: PreloadOptions = {}): Promise<void> => {
  // Higher quality and priority for LCP image
  const lcpOptions: PreloadOptions = {
    quality: 95,
    format: 'auto',
    timeout: 2000, // Now properly defined in PreloadOptions
    ...options,
  };

  // Create a link preload element for highest priority
  if (typeof document !== 'undefined' && imageUrl) {
    const linkEl = document.createElement('link');
    linkEl.rel = 'preload';
    linkEl.as = 'image';
    linkEl.href = imageUrl;
    linkEl.setAttribute('fetchpriority', 'high');
    document.head.appendChild(linkEl);
  }

  return preloadCriticalImages([imageUrl], lcpOptions);
};

export default {
  preloadCriticalImages,
  preloadLCPImage,
};
