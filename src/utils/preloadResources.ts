// @ts-nocheck
// Simplified preload resources utility

export interface PreloadResource {
  url: string;
  type: 'image' | 'font' | 'style' | 'script';
  priority?: 'high' | 'low';
}

export const preloadResources = (resources: PreloadResource[]): void => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.url;

    if (resource.priority) {
      (link as any).fetchPriority = resource.priority;
    }

    switch (resource.type) {
      case 'image':
        link.as = 'image';
        break;
      case 'font':
        link.as = 'font';
        link.crossOrigin = 'anonymous';
        break;
      case 'style':
        link.as = 'style';
        break;
      case 'script':
        link.as = 'script';
        break;
    }

    document.head.appendChild(link);
  });
};

export const preloadImage = (url: string, priority?: 'high' | 'low'): void => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = 'image';

  if (priority) {
    (link as any).fetchPriority = priority;
  }

  document.head.appendChild(link);
};

export const initializeResourcePreloading = (): void => {
  console.log('Would initialize resource preloading');
};

export const setupRouteChangePreloading = (): void => {
  console.log('Would setup route change preloading');
};

export default preloadResources;
