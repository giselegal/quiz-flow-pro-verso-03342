// Image diagnostic utility functions

/**
 * Analyzes an image URL to check for optimization issues
 * @param url The image URL to analyze
 * @returns Analysis results including suggestions
 */
export const analyzeImageUrl = (url: string) => {
  const results = {
    url,
    format: 'unknown',
    quality: 'unknown',
    width: 'unknown',
    height: 'unknown',
    transformations: [] as string[],
    issues: [] as string[],
    suggestions: [] as string[],
  };

  // Check if it's a Cloudinary URL
  if (url.includes('cloudinary.com')) {
    // Extract transformations
    const transformMatch = url.match(/\/upload\/([^\/]+)\//);
    if (transformMatch && transformMatch[1]) {
      const transforms = transformMatch[1].split(',');
      results.transformations = transforms;

      // Check for format
      const formatMatch = transforms.find(t => t.startsWith('f_'));
      if (formatMatch) {
        results.format = formatMatch.replace('f_', '');
      } else {
        results.issues.push('No explicit format specified');
        results.suggestions.push('Add f_auto for automatic format optimization');
      }

      // Check for quality
      const qualityMatch = transforms.find(t => t.startsWith('q_'));
      if (qualityMatch) {
        results.quality = qualityMatch.replace('q_', '');
        if (results.quality === 'auto') {
          // Good practice
        } else {
          const qualityNum = parseInt(results.quality as string);
          if (qualityNum > 85) {
            results.suggestions.push(
              'Consider using q_auto or reducing quality to 85 for better performance'
            );
          }
        }
      } else {
        results.issues.push('No quality parameter specified');
        results.suggestions.push('Add q_auto for automatic quality optimization');
      }

      // Check for width/DPR
      const widthMatch = transforms.find(t => t.startsWith('w_'));
      if (widthMatch) {
        results.width = widthMatch.replace('w_', '');
      } else {
        results.issues.push('No width specified');
        results.suggestions.push('Specify image width to avoid oversized images');
      }

      // Check for DPR
      const dprMatch = transforms.find(t => t.startsWith('dpr_'));
      if (!dprMatch) {
        results.suggestions.push('Add dpr_auto for automatic device pixel ratio handling');
      }
    } else {
      results.issues.push('No transformations found in Cloudinary URL');
      results.suggestions.push(
        'Add optimization parameters like f_auto,q_auto,w_[appropriate width]'
      );
    }
  } else {
    results.issues.push('Not a Cloudinary URL, optimization status unknown');
    results.suggestions.push('Consider using Cloudinary for better image optimization');
  }

  return results;
};

/**
 * Checks all rendered images on the page for optimization issues
 * @returns List of images with potential issues
 */
export const checkRenderedImages = () => {
  if (typeof document === 'undefined') return [];

  const allImages = document.querySelectorAll('img');
  const imageIssues = [];

  for (let i = 0; i < allImages.length; i++) {
    const img = allImages[i];
    const src = img.src;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    const displayWidth = img.width;
    const displayHeight = img.height;

    const issues = [];

    // Check for missing alt text
    if (!img.alt) {
      issues.push('Missing alt text');
    }

    // Check for oversized images (more than 1.5x display size accounting for DPR)
    const dpr = window.devicePixelRatio || 1;
    if (naturalWidth > displayWidth * 1.5 * dpr && displayWidth > 0) {
      issues.push(
        `Oversized: ${naturalWidth}x${naturalHeight} natural size for ${displayWidth}x${displayHeight} display size`
      );
    }

    // Check for lazy loading on above-the-fold images
    const rect = img.getBoundingClientRect();
    const isAboveTheFold = rect.top < window.innerHeight;
    if (isAboveTheFold && img.loading === 'lazy') {
      issues.push('Above-the-fold image using lazy loading');
    }

    // Check for Cloudinary optimization
    if (src.includes('cloudinary.com')) {
      if (!src.includes('f_auto')) {
        issues.push('Missing f_auto parameter for automatic format optimization');
      }
      if (!src.includes('q_auto') && !src.includes('q_')) {
        issues.push('Missing quality parameter');
      }
      if (src.includes('q_100')) {
        issues.push('Using maximum quality (q_100) which is unnecessary for most use cases');
      }
    }

    if (issues.length > 0) {
      imageIssues.push({
        url: src,
        element: img,
        issues,
        dimensions: {
          natural: { width: naturalWidth, height: naturalHeight },
          display: { width: displayWidth, height: displayHeight },
        },
      });
    }
  }

  return imageIssues;
};

/**
 * Generates a comprehensive report about all images on the page
 * @returns Detailed image optimization report
 */
export const generateImageReport = () => {
  if (typeof document === 'undefined') {
    return {
      summary: {
        totalImagesRendered: 0,
        totalImagesWithIssues: 0,
        totalDownloadedBytes: 0,
        estimatedPerformanceImpact: 'Unknown',
      },
      detailedIssues: [],
    };
  }

  const allImages = document.querySelectorAll('img');
  const imageIssues = checkRenderedImages();

  // Calculate total download size (approximate)
  let totalBytes = 0;
  let issueBytes = 0;

  // Return the report
  return {
    summary: {
      totalImagesRendered: allImages.length,
      totalImagesWithIssues: imageIssues.length,
      totalDownloadedBytes: totalBytes,
      estimatedPerformanceImpact: imageIssues.length > 0 ? 'High' : 'Low',
    },
    detailedIssues: imageIssues,
  };
};

export default {
  analyzeImageUrl,
  checkRenderedImages,
  generateImageReport,
};
