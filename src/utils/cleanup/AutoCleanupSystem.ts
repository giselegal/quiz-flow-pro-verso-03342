/**
 * 🧹 SISTEMA DE AUTO-CLEANUP
 * 
 * Sistema automatizado para limpeza de event listeners,
 * timers, observers e outros recursos que podem causar memory leaks
 * 
 * FUNCIONALIDADES:
 * ✅ Auto-cleanup de event listeners
 * ✅ Cleanup de timers e intervals 
 * ✅ Cleanup de observers (Intersection, Resize, Mutation)
 * ✅ Cleanup de subscriptions
 * ✅ Memory leak prevention
 * ✅ Performance monitoring
 */

// Removido imports não utilizados - serão readicionados quando necessário

// ✅ TIPOS DE RECURSOS GERENCIADOS
export type CleanupResourceType =
  | 'event-listener'
  | 'timer'
  | 'interval'
  | 'observer'
  | 'subscription'
  | 'custom';

export interface CleanupResource {
  id: string;
  type: CleanupResourceType;
  name: string;
  cleanup: () => void;
  createdAt: number;
  componentId?: string;
  metadata?: Record<string, any>;
}

export interface CleanupStats {
  totalResources: number;
  resourcesByType: Record<CleanupResourceType, number>;
  totalCleaned: number;
  cleanedByType: Record<CleanupResourceType, number>;
  memoryFreed: number;
  lastCleanup: number;
}

/**
 * 🎯 GERENCIADOR GLOBAL DE CLEANUP
 */
export class AutoCleanupManager {
  private static instance: AutoCleanupManager;
  private resources = new Map<string, CleanupResource>();
  private cleanupHistory: CleanupResource[] = [];
  private stats: CleanupStats = {
    totalResources: 0,
    resourcesByType: {
      'event-listener': 0,
      'timer': 0,
      'interval': 0,
      'observer': 0,
      'subscription': 0,
      'custom': 0
    },
    totalCleaned: 0,
    cleanedByType: {
      'event-listener': 0,
      'timer': 0,
      'interval': 0,
      'observer': 0,
      'subscription': 0,
      'custom': 0
    },
    memoryFreed: 0,
    lastCleanup: 0
  };

  static getInstance(): AutoCleanupManager {
    if (!AutoCleanupManager.instance) {
      AutoCleanupManager.instance = new AutoCleanupManager();
    }
    return AutoCleanupManager.instance;
  }

  /**
   * Registrar um recurso para cleanup automático
   */
  register(resource: Omit<CleanupResource, 'id' | 'createdAt'>): string {
    const id = `${resource.type}-${resource.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const fullResource: CleanupResource = {
      ...resource,
      id,
      createdAt: Date.now()
    };

    this.resources.set(id, fullResource);
    this.stats.totalResources++;
    this.stats.resourcesByType[resource.type]++;

    console.debug(`🧹 Resource registered:`, {
      id,
      type: resource.type,
      name: resource.name,
      componentId: resource.componentId
    });

    return id;
  }

  /**
   * Cleanup manual de um recurso específico
   */
  cleanup(resourceId: string): boolean {
    const resource = this.resources.get(resourceId);

    if (!resource) {
      console.warn(`⚠️ Resource not found for cleanup: ${resourceId}`);
      return false;
    }

    try {
      resource.cleanup();

      this.resources.delete(resourceId);
      this.cleanupHistory.push(resource);
      this.stats.totalCleaned++;
      this.stats.cleanedByType[resource.type]++;
      this.stats.lastCleanup = Date.now();

      console.debug(`✅ Resource cleaned:`, {
        id: resourceId,
        type: resource.type,
        name: resource.name,
        age: Date.now() - resource.createdAt
      });

      return true;
    } catch (error) {
      console.error(`❌ Failed to cleanup resource ${resourceId}:`, error);
      return false;
    }
  }

  /**
   * Cleanup automático por componente
   */
  cleanupComponent(componentId: string): number {
    let cleanedCount = 0;

    const componentResources = Array.from(this.resources.values())
      .filter(resource => resource.componentId === componentId);

    for (const resource of componentResources) {
      if (this.cleanup(resource.id)) {
        cleanedCount++;
      }
    }

    console.info(`🧹 Component cleanup completed:`, {
      componentId,
      resourcesCleaned: cleanedCount
    });

    return cleanedCount;
  }

  /**
   * Cleanup automático por tipo
   */
  cleanupByType(type: CleanupResourceType): number {
    let cleanedCount = 0;

    const typeResources = Array.from(this.resources.values())
      .filter(resource => resource.type === type);

    for (const resource of typeResources) {
      if (this.cleanup(resource.id)) {
        cleanedCount++;
      }
    }

    console.info(`🧹 Type cleanup completed:`, {
      type,
      resourcesCleaned: cleanedCount
    });

    return cleanedCount;
  }

  /**
   * Cleanup automático por idade dos recursos
   */
  cleanupByAge(maxAgeMs: number = 5 * 60 * 1000): number { // 5 minutos default
    let cleanedCount = 0;
    const now = Date.now();

    const oldResources = Array.from(this.resources.values())
      .filter(resource => (now - resource.createdAt) > maxAgeMs);

    for (const resource of oldResources) {
      if (this.cleanup(resource.id)) {
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.info(`🧹 Age-based cleanup completed:`, {
        maxAgeMs,
        resourcesCleaned: cleanedCount
      });
    }

    return cleanedCount;
  }

  /**
   * Cleanup completo de todos os recursos
   */
  cleanupAll(): number {
    let cleanedCount = 0;
    const allResourceIds = Array.from(this.resources.keys());

    for (const resourceId of allResourceIds) {
      if (this.cleanup(resourceId)) {
        cleanedCount++;
      }
    }

    console.info(`🧹 Complete cleanup finished:`, {
      resourcesCleaned: cleanedCount
    });

    return cleanedCount;
  }

  /**
   * Obter estatísticas de cleanup
   */
  getStats(): CleanupStats {
    return {
      ...this.stats,
      totalResources: this.resources.size
    };
  }

  /**
   * Obter recursos ativos
   */
  getActiveResources(): CleanupResource[] {
    return Array.from(this.resources.values());
  }

  /**
   * Obter histórico de cleanup
   */
  getCleanupHistory(): CleanupResource[] {
    return [...this.cleanupHistory];
  }
}

// ✅ INSTÂNCIA SINGLETON
export const cleanupManager = AutoCleanupManager.getInstance();

// ✅ HELPERS PARA TIPOS ESPECÍFICOS DE RECURSOS

/**
 * Helper para event listeners
 */
export const registerEventListener = (
  element: EventTarget,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions,
  componentId?: string
): string => {
  element.addEventListener(event, handler, options);

  return cleanupManager.register({
    type: 'event-listener',
    name: `${element.constructor.name}.${event}`,
    componentId,
    metadata: { event, options },
    cleanup: () => {
      element.removeEventListener(event, handler, options);
    }
  });
};

/**
 * Helper para timers
 */
export const registerTimer = (
  callback: () => void,
  delay: number,
  componentId?: string
): string => {
  const timerId = setTimeout(callback, delay);

  return cleanupManager.register({
    type: 'timer',
    name: `setTimeout-${delay}ms`,
    componentId,
    metadata: { delay },
    cleanup: () => {
      clearTimeout(timerId);
    }
  });
};

/**
 * Helper para intervals
 */
export const registerInterval = (
  callback: () => void,
  interval: number,
  componentId?: string
): string => {
  const intervalId = setInterval(callback, interval);

  return cleanupManager.register({
    type: 'interval',
    name: `setInterval-${interval}ms`,
    componentId,
    metadata: { interval },
    cleanup: () => {
      clearInterval(intervalId);
    }
  });
};

/**
 * Helper para Intersection Observer
 */
export const registerIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit,
  componentId?: string
): { observer: IntersectionObserver; cleanupId: string } => {
  const observer = new IntersectionObserver(callback, options);

  const cleanupId = cleanupManager.register({
    type: 'observer',
    name: 'IntersectionObserver',
    componentId,
    metadata: { options },
    cleanup: () => {
      observer.disconnect();
    }
  });

  return { observer, cleanupId };
};

/**
 * Helper para Resize Observer
 */
export const registerResizeObserver = (
  callback: ResizeObserverCallback,
  componentId?: string
): { observer: ResizeObserver; cleanupId: string } => {
  const observer = new ResizeObserver(callback);

  const cleanupId = cleanupManager.register({
    type: 'observer',
    name: 'ResizeObserver',
    componentId,
    metadata: {},
    cleanup: () => {
      observer.disconnect();
    }
  });

  return { observer, cleanupId };
};

/**
 * Helper para Mutation Observer
 */
export const registerMutationObserver = (
  callback: MutationCallback,
  options?: MutationObserverInit,
  componentId?: string
): { observer: MutationObserver; cleanupId: string } => {
  const observer = new MutationObserver(callback);

  const cleanupId = cleanupManager.register({
    type: 'observer',
    name: 'MutationObserver',
    componentId,
    metadata: { options },
    cleanup: () => {
      observer.disconnect();
    }
  });

  return { observer, cleanupId };
};

// ✅ AUTO-CLEANUP TIMER (executa periodicamente)
let autoCleanupTimer: NodeJS.Timeout | null = null;

export const startAutoCleanup = (intervalMs: number = 2 * 60 * 1000): void => { // 2 minutos default
  if (autoCleanupTimer) {
    clearInterval(autoCleanupTimer);
  }

  autoCleanupTimer = setInterval(() => {
    const cleaned = cleanupManager.cleanupByAge();
    if (cleaned > 0) {
      console.info(`🧹 Auto-cleanup executed: ${cleaned} resources cleaned`);
    }
  }, intervalMs);

  console.info(`�� Auto-cleanup started: running every ${intervalMs}ms`);
};

export const stopAutoCleanup = (): void => {
  if (autoCleanupTimer) {
    clearInterval(autoCleanupTimer);
    autoCleanupTimer = null;
    console.info(`🧹 Auto-cleanup stopped`);
  }
};

// ✅ INICIAR AUTO-CLEANUP AUTOMATICAMENTE
if (typeof window !== 'undefined') {
  startAutoCleanup();

  // Cleanup ao sair da página
  window.addEventListener('beforeunload', () => {
    const cleaned = cleanupManager.cleanupAll();
    console.info(`🧹 Page unload cleanup: ${cleaned} resources cleaned`);
  });
}

export default cleanupManager;
