/**
 * TODO: TypeScript Migration - Deadline: Janeiro 2025
 * - [ ] Tipa    appLogger.info('Console warnings cleanup active');
  }
};

// Enhanced drag and drop debugging
export const dragDropDebugger = {
  logDragStart: (data: DragEventData) => {adamente parâmetros dos debuggers (DragData, PerformanceData)
 * - [ ] Criar interfaces para dados de drag & drop
 * - [ ] Substituir console.* por logger com níveis apropriados
 * - [ ] Adicionar types para performance monitoring
 * - [ ] Separar responsabilidades (console cleanup vs drag debug vs performance)
 */

import { appLogger } from './logger';

// Tipos mínimos para migração
interface DragEventData {
  id?: string;
  type?: string;
  blockType?: string;
  activeId?: string;
  overId?: string;
  activeType?: string;
  overType?: string;
  success?: boolean;
  [key: string]: any; // TODO: especificar propriedades exatas
}

// Console warnings cleanup and development utilities
export const cleanupConsoleWarnings = (): void => {
  // Suppress known non-critical warnings in development
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    appLogger.info('Initializing console warnings cleanup');

    // Store original console methods
    const originalWarn = console.warn;

    // Override console.warn to filter out known harmless warnings
    console.warn = (...args) => {
      const message = args.join(' ');

      // Filter out known non-critical warnings
      const ignoredWarnings = [
        'Unrecognized feature:',
        'was preloaded using link preload but not used',
        'iframe which has both allow-scripts and allow-same-origin',
        "[Violation] 'setTimeout' handler took",
        "[Violation] 'requestAnimationFrame' callback took",
        'Strategy 4: No clear indicators found',
        'Max reconnect attempts',
        'The resource https://www.facebook.com',
        'px.ads.linkedin.com/collect',
        'Failed to load resource: net::ERR_CONNECTION_CLOSED',
        'lovableproject.com',
        'Failed to load resource: the server responded with a status of 412',
        "WebSocket connection to 'wss://",
        'failed:',
        'createOrJoinSocket',
        "Failed to execute 'addAll' on 'Cache'",
        'Request failed',
        'service-worker.js',
        "Cannot access 'E' before initialization",
        'forms-B8WT14Rn.js',
        'forms-Ba1JuZFL.js',
        'contentScript.bundle.js',
        '[vite] connecting...',
        'Strategy 4: No clear indicators found, assuming All tab',
      ];

      const shouldIgnore = ignoredWarnings.some(warning => message.includes(warning));

      if (!shouldIgnore) {
        originalWarn.apply(console, args);
      }
    };

    console.log('�� Console warnings cleanup active');
  }
};

// Enhanced drag and drop debugging
export const dragDropDebugger = {
  logDragStart: (data: any) => {
    console.group('🟢 Drag Start Event');
    console.log('Active ID:', data.id);
    console.log('Active Type:', data.type);
    console.log('Block Type:', data.blockType);
    console.log('Full Data:', data);
    console.groupEnd();
  },

  logDragEnd: (data: DragEventData) => {
    console.group('🔄 Drag End Event');
    console.log('Active ID:', data.activeId);
    console.log('Over ID:', data.overId);
    console.log('Active Type:', data.activeType);
    console.log('Over Type:', data.overType);
    console.log('Success:', data.success);
    console.groupEnd();
  },
};

// Performance monitoring for drag and drop
export const performanceMonitor = {
  startTiming: (label: string) => {
    if (typeof performance !== 'undefined') {
      performance.mark(`${label}-start`);
    }
  },

  endTiming: (label: string) => {
    if (typeof performance !== 'undefined') {
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);

      const measure = performance.getEntriesByName(label)[0];
      if (measure && measure.duration > 16) {
        appLogger.warn(`Performance: ${label} took ${measure.duration.toFixed(2)}ms`);
      }
    }
  },
};

// Initialize cleanup on app start
if (typeof window !== 'undefined') {
  cleanupConsoleWarnings();
  appLogger.info('Performance optimizations active');
}
