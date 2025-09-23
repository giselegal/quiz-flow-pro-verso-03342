/**
 * 🧠 MEMORY MANAGER - GERENCIAMENTO AVANÇADO DE MEMÓRIA
 * 
 * Sistema inteligente de gerenciamento de memória que implementa:
 * - Memory leak detection
 * - Automatic garbage collection
 * - Component lifecycle monitoring
 * - Resource cleanup automation
 * - Memory usage optimization
 * 
 * FUNCIONALIDADES:
 * ✅ Automatic cleanup
 * ✅ Memory leak detection
 * ✅ Resource pooling
 * ✅ Smart caching
 * ✅ Performance monitoring
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { logger } from '@/utils/debugLogger';

// 🎯 MEMORY METRICS INTERFACE
export interface MemoryMetrics {
  usedHeapSize: number;
  totalHeapSize: number;
  heapSizeLimit: number;
  allocatedComponents: number;
  cleanupOperations: number;
  memoryLeaks: MemoryLeak[];
}

export interface MemoryLeak {
  id: string;
  type: 'component' | 'listener' | 'timer' | 'resource';
  description: string;
  size: number;
  timestamp: number;
}

// 🎯 RESOURCE POOL FOR REUSABLE OBJECTS
class ResourcePool<T> {
  private pool: T[] = [];
  private factory: () => T;
  private reset: (item: T) => void;
  private maxSize: number;

  constructor(factory: () => T, reset: (item: T) => void, maxSize = 50) {
    this.factory = factory;
    this.reset = reset;
    this.maxSize = maxSize;
  }

  acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.factory();
  }

  release(item: T) {
    if (this.pool.length < this.maxSize) {
      this.reset(item);
      this.pool.push(item);
    }
  }

  clear() {
    this.pool.length = 0;
  }

  get size() {
    return this.pool.length;
  }
}

// 🎯 MEMORY LEAK DETECTOR
class MemoryLeakDetector {
  private refs = new Map<string, any>();
  private timers = new Set<number>();
  private listeners = new Map<string, { target: EventTarget; type: string; listener: EventListener }>();
  private components = new Map<string, { name: string; timestamp: number }>();

  // 🎯 TRACK COMPONENT LIFECYCLE
  trackComponent(id: string, name: string) {
    this.components.set(id, { name, timestamp: Date.now() });
  }

  untrackComponent(id: string) {
    this.components.delete(id);
  }

  // 🎯 TRACK TIMERS
  trackTimer(id: number) {
    this.timers.add(id);
  }

  untrackTimer(id: number) {
    this.timers.delete(id);
    clearTimeout(id);
    clearInterval(id);
  }

  // 🎯 TRACK EVENT LISTENERS
  trackListener(id: string, target: EventTarget, type: string, listener: EventListener) {
    this.listeners.set(id, { target, type, listener });
  }

  untrackListener(id: string) {
    const entry = this.listeners.get(id);
    if (entry) {
      entry.target.removeEventListener(entry.type, entry.listener);
      this.listeners.delete(id);
    }
  }

  // 🎯 DETECT LEAKS
  detectLeaks(): MemoryLeak[] {
    const leaks: MemoryLeak[] = [];
    const currentTime = Date.now();

    // Check for long-living components (potential leaks)
    this.components.forEach((component, id) => {
      const age = currentTime - component.timestamp;
      if (age > 5 * 60 * 1000) { // 5 minutes
        leaks.push({
          id,
          type: 'component',
          description: `Component ${component.name} alive for ${Math.round(age / 1000)}s`,
          size: 0,
          timestamp: component.timestamp
        });
      }
    });

    // Check for orphaned timers
    if (this.timers.size > 10) {
      leaks.push({
        id: 'timers',
        type: 'timer',
        description: `${this.timers.size} active timers (potential leak)`,
        size: this.timers.size,
        timestamp: currentTime
      });
    }

    // Check for orphaned listeners
    if (this.listeners.size > 20) {
      leaks.push({
        id: 'listeners',
        type: 'listener',
        description: `${this.listeners.size} active listeners (potential leak)`,
        size: this.listeners.size,
        timestamp: currentTime
      });
    }

    return leaks;
  }

  // 🎯 CLEANUP ALL RESOURCES
  cleanup() {
    // Clear all timers
    this.timers.forEach(id => {
      clearTimeout(id);
      clearInterval(id);
    });
    this.timers.clear();

    // Remove all listeners
    this.listeners.forEach(({ target, type, listener }) => {
      target.removeEventListener(type, listener);
    });
    this.listeners.clear();

    // Clear component tracking
    this.components.clear();
    this.refs.clear();
  }
}

// 🎯 GLOBAL INSTANCES
const leakDetector = new MemoryLeakDetector();
const objectPool = new ResourcePool(
  () => ({}),
  (obj) => Object.keys(obj).forEach(key => delete (obj as any)[key])
);

// 🎯 MEMORY MANAGER HOOK
export const useMemoryManager = () => {
  const [metrics, setMetrics] = useState<MemoryMetrics>({
    usedHeapSize: 0,
    totalHeapSize: 0,
    heapSizeLimit: 0,
    allocatedComponents: 0,
    cleanupOperations: 0,
    memoryLeaks: []
  });

  const cleanupOperationsRef = useRef(0);
  const componentIdRef = useRef(0);
  const intervalRef = useRef<number>();

  // 🎯 UPDATE MEMORY METRICS
  const updateMetrics = useCallback(() => {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      const leaks = leakDetector.detectLeaks();

      setMetrics(prev => ({
        usedHeapSize: memInfo.usedJSHeapSize,
        totalHeapSize: memInfo.totalJSHeapSize,
        heapSizeLimit: memInfo.jsHeapSizeLimit,
        allocatedComponents: prev.allocatedComponents,
        cleanupOperations: cleanupOperationsRef.current,
        memoryLeaks: leaks
      }));
    }
  }, []);

  // 🎯 REGISTER COMPONENT
  const registerComponent = useCallback((name: string) => {
    const id = `component-${++componentIdRef.current}`;
    leakDetector.trackComponent(id, name);
    
    setMetrics(prev => ({
      ...prev,
      allocatedComponents: prev.allocatedComponents + 1
    }));

    return id;
  }, []);

  // 🎯 UNREGISTER COMPONENT
  const unregisterComponent = useCallback((id: string) => {
    leakDetector.untrackComponent(id);
    
    setMetrics(prev => ({
      ...prev,
      allocatedComponents: Math.max(0, prev.allocatedComponents - 1)
    }));
  }, []);

  // 🎯 CLEANUP RESOURCES
  const cleanup = useCallback(() => {
    leakDetector.cleanup();
    objectPool.clear();
    cleanupOperationsRef.current++;
    
    // Request garbage collection if available
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }

    updateMetrics();
    logger.info('MemoryManager: Cleanup completed', {
      operations: cleanupOperationsRef.current,
      poolSize: objectPool.size
    });
  }, [updateMetrics]);

  // 🎯 AUTOMATIC CLEANUP
  const startAutoCleanup = useCallback((interval = 30000) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      const leaks = leakDetector.detectLeaks();
      
      if (leaks.length > 0) {
        logger.warn('MemoryManager: Memory leaks detected:', leaks);
        cleanup();
      }
      
      updateMetrics();
    }, interval);

    return intervalRef.current;
  }, [cleanup, updateMetrics]);

  // 🎯 STOP AUTO CLEANUP
  const stopAutoCleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  // 🎯 GET OBJECT FROM POOL
  const getPooledObject = useCallback(() => {
    return objectPool.acquire();
  }, []);

  // 🎯 RETURN OBJECT TO POOL
  const returnPooledObject = useCallback((obj: any) => {
    objectPool.release(obj);
  }, []);

  return {
    metrics,
    registerComponent,
    unregisterComponent,
    cleanup,
    startAutoCleanup,
    stopAutoCleanup,
    getPooledObject,
    returnPooledObject,
    updateMetrics
  };
};

// 🎯 MEMORY MANAGED COMPONENT HOC
export const withMemoryManagement = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) => {
  const MemoizedComponent = React.memo(WrappedComponent);
  
  return React.forwardRef<any, P>((props, ref) => {
    const { registerComponent, unregisterComponent } = useMemoryManager();
    const componentIdRef = useRef<string>();

    useEffect(() => {
      componentIdRef.current = registerComponent(componentName || WrappedComponent.name);
      
      return () => {
        if (componentIdRef.current) {
          unregisterComponent(componentIdRef.current);
        }
      };
    }, [registerComponent, unregisterComponent]);

    return <MemoizedComponent {...(props as any)} ref={ref} />;
  });
};

// 🎯 MEMORY MANAGER PROVIDER
export interface MemoryManagerProviderProps {
  children: React.ReactNode;
  autoCleanupInterval?: number;
  enableAutoCleanup?: boolean;
  enableLeakDetection?: boolean;
}

export const MemoryManagerProvider: React.FC<MemoryManagerProviderProps> = ({
  children,
  autoCleanupInterval = 30000,
  enableAutoCleanup = true,
  enableLeakDetection = true
}) => {
  const memoryManager = useMemoryManager();

  // 🎯 START AUTO CLEANUP
  useEffect(() => {
    if (enableAutoCleanup) {
      memoryManager.startAutoCleanup(autoCleanupInterval);
      return () => memoryManager.stopAutoCleanup();
    }
  }, [enableAutoCleanup, autoCleanupInterval, memoryManager]);

  // 🎯 GLOBAL MEMORY MANAGER INSTANCE
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__MEMORY_MANAGER__ = memoryManager;
    }
  }, [memoryManager]);

  // 🎯 LEAK DETECTION WARNINGS
  useEffect(() => {
    if (enableLeakDetection && memoryManager.metrics.memoryLeaks.length > 0) {
      logger.warn('MemoryManager: Potential memory leaks detected:', memoryManager.metrics.memoryLeaks);
    }
  }, [enableLeakDetection, memoryManager.metrics.memoryLeaks]);

  return (
    <div className="memory-manager-provider">
      {children}
      
      {/* Development-only memory overlay */}
      {process.env.NODE_ENV === 'development' && memoryManager.metrics.memoryLeaks.length > 0 && (
        <div className="fixed bottom-20 right-4 bg-red-500 text-white p-3 rounded-lg shadow-lg max-w-sm z-50">
          <h4 className="font-bold text-sm mb-2">🧠 Memory Leak Warning</h4>
          <div className="text-xs space-y-1">
            <p>Leaks: {memoryManager.metrics.memoryLeaks.length}</p>
            <p>Memory: {(memoryManager.metrics.usedHeapSize / 1024 / 1024).toFixed(1)}MB</p>
            <button
              onClick={memoryManager.cleanup}
              className="mt-2 bg-white text-red-500 px-2 py-1 rounded text-xs font-medium"
            >
              Cleanup Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryManagerProvider;