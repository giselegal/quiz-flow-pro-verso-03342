/**
 * TODO: TypeScript Migration - Deadline: Janeiro 2025
 * - [ ] Expandir interface PreloadResource com metadata adicional
 * - [ ] Criar enum para resource types e priorities
 * - [ ] Implementar error handling e retry logic para preload failures
 * - [ ] Adicionar métodos para cleanup de preloaded resources
 * - [ ] Substituir console.log temporário por implementação real + logger
 */

import { appLogger } from './logger';

// Simplified preload resources utility

export interface PreloadResource {
  url: string;
  type: 'image' | 'font' | 'style' | 'script';
  priority?: 'high' | 'low';
}

export const preloadResources = (resources: PreloadResource[]): void => {
  appLogger.debug('Preloading resources', { count: resources.length });

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
  appLogger.info('Initializing resource preloading');
  // TODO: Implementar preloading baseado em route predictions
};

export const setupRouteChangePreloading = (): void => {
  appLogger.info('Setting up route change preloading');
  // TODO: Implementar preloading inteligente baseado em histórico de navegação
};

export default preloadResources;
