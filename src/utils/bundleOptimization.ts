// Bundle optimization utilities for better performance

// Dynamic import with error handling and retry logic
export const dynamicImport = async <T = any>(
  importFn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await importFn();
    } catch (error) {
      console.warn(`[Bundle] Import failed, attempt ${i + 1}/${retries}:`, error);
      
      if (i === retries - 1) {
        throw error;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  
  throw new Error('All import attempts failed');
};

// Preload critical chunks
export const preloadChunk = (chunkName: string) => {
  const link = document.createElement('link');
  link.rel = 'modulepreload';
  link.href = `/assets/${chunkName}`;
  document.head.appendChild(link);
};

// Monitor bundle performance
export const trackBundlePerformance = () => {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    const jsResources = resources.filter(resource => 
      resource.name.includes('.js') && 
      !resource.name.includes('node_modules')
    );

    const bundleMetrics = {
      totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
      jsLoadTime: jsResources.reduce((total, resource) => 
        total + (resource.responseEnd - resource.fetchStart), 0
      ),
      largestJS: jsResources.reduce((largest, resource) => 
        resource.transferSize > largest.transferSize ? resource : largest, 
        jsResources[0] || { transferSize: 0, name: 'none' }
      )
    };

    console.log('[Bundle Performance]:', bundleMetrics);
    return bundleMetrics;
  }
};

// Tree shaking helper - mark unused exports
export const markUnused = (exportName: string, moduleName: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[Tree Shaking] Unused export detected: ${exportName} from ${moduleName}`);
  }
};

// Code splitting utilities
export const splitRoutes = {
  // Main pages
  ResultPage: () => dynamicImport(() => import('@/pages/ResultPage')),
  EditorPage: () => dynamicImport(() => import('@/pages/admin/EditorPage')),
  
  // Editor components
  SchemaDrivenEditor: () => dynamicImport(() => import('@/components/editor/SchemaDrivenEditorResponsive')),
  
  // Large components that exist
  // PropertyPanel: () => dynamicImport(() => import('@/components/editor/PropertyPanel')),
  // ComponentsSidebar: () => dynamicImport(() => import('@/components/editor/sidebar/ComponentsSidebar')),
  
  // Modals and overlays (to be created when needed)
  // ImageBankModal: () => dynamicImport(() => import('@/components/editor/modals/ImageBankModal')),
  // TemplateModal: () => dynamicImport(() => import('@/components/editor/modals/TemplateModal'))
};

// Bundle analyzer helper
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    // This would work with rollup-plugin-visualizer in production
    console.log('[Bundle] Use `npm run analyze` to see bundle composition');
  }
};