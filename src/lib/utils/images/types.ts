// @ts-nocheck
export interface ImageMetadata {
  url: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
  quality?: number;
  natural?: { width: number; height: number };
  display?: { width: number; height: number };
}

export interface ImageCacheEntry {
  url: string;
  timestamp: number;
  metadata: ImageMetadata;
  blob?: Blob;
  lastAccessed?: number;
  loadStatus?: 'loading' | 'loaded' | 'error';
}

export interface ImageSettings {
  quality: number;
  format: 'webp' | 'jpeg' | 'png' | 'auto';
  maxWidth?: number;
  maxHeight?: number;
  width?: number;
  height?: number;
  crop?: boolean;
  responsive?: boolean;
}

export interface ImageOptimizationOptions {
  quality?: number;
  width?: number;
  height?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'auto';
  crop?: boolean;
}

export interface PreloadOptions {
  quality?: number;
  batchSize?: number;
  onProgress?: (loaded: number, total: number) => void;
  onComplete?: () => void;
  format?: string;
  timeout?: number;
}

export interface PreloadImageDefinition {
  src: string;
  id: string;
  alt?: string;
  category?: string;
  preloadPriority?: number;
}

export interface ImageAnalysis {
  dimensions: {
    width: number;
    height: number;
    natural?: { width: number; height: number };
    display?: { width: number; height: number };
  };
  format: string;
  size: number;
  quality: number;
  isOptimized?: boolean;
  isResponsive?: boolean;
  suggestedImprovements?: string[];
}

export interface ImageDiagnosticResult {
  url: string;
  status: 'success' | 'error' | 'loading';
  analysis?: ImageAnalysis;
  error?: string;
  loadTime?: number;
  summary?: {
    totalImages: number;
    optimizedImages: number;
    totalSize: number;
    potentialSavings: number;
    totalImagesRendered?: number;
    totalImagesWithIssues?: number;
    totalDownloadedBytes?: number;
    estimatedPerformanceImpact?: number;
  };
  detailedIssues?: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    recommendation: string;
    url?: string;
    dimensions?: {
      width: number;
      height: number;
      natural?: { width: number; height: number };
      display?: { width: number; height: number };
    };
    issues?: any[];
  }>;
}

export interface FixBlurryImagesOptions {
  quality?: number;
  upscaleFactor?: number;
  sharpening?: boolean;
  autoDetect?: boolean;
}
