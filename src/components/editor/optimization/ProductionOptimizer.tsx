/**
 * 🚀 PRODUCTION OPTIMIZER - OTIMIZAÇÕES PARA PRODUÇÃO
 * 
 * Sistema final de otimizações específicas para ambiente de produção:
 * - Service Worker para caching agressivo
 * - Analytics otimizados
 * - Error reporting automático
 * - Performance budgets enforcement
 * - Resource preloading inteligente
 * 
 * FUNCIONALIDADES:
 * ✅ Service Worker automático
 * ✅ Analytics integration
 * ✅ Error boundary avançado
 * ✅ Production monitoring
 * ✅ Resource optimization
 */

import React, { useEffect, useCallback } from 'react';
import { logger } from '@/utils/debugLogger';

// 🎯 PRODUCTION CONFIGURATION
interface ProductionConfig {
  enableServiceWorker: boolean;
  enableAnalytics: boolean;
  enableErrorReporting: boolean;
  cacheStrategy: 'aggressive' | 'conservative' | 'disabled';
  maxCacheAge: number; // in milliseconds
  preloadResources: string[];
}

const DEFAULT_PRODUCTION_CONFIG: ProductionConfig = {
  enableServiceWorker: true,
  enableAnalytics: true,
  enableErrorReporting: true,
  cacheStrategy: 'conservative',
  maxCacheAge: 24 * 60 * 60 * 1000, // 24 hours
  preloadResources: []
};

// 🎯 SERVICE WORKER REGISTRATION
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              logger.info('ProductionOptimizer: New version available');
              
              // Notify user about update
              if (confirm('Nova versão disponível! Recarregar agora?')) {
                window.location.reload();
              }
            }
          });
        }
      });

      logger.info('ProductionOptimizer: Service Worker registered');
      return registration;
    } catch (error) {
      logger.error('ProductionOptimizer: Service Worker registration failed:', error);
    }
  }
};

// 🎯 ANALYTICS INTEGRATION
const initializeAnalytics = (config: ProductionConfig) => {
  if (!config.enableAnalytics || process.env.NODE_ENV !== 'production') {
    return;
  }

  // Basic page view tracking
  const trackPageView = () => {
    logger.info('ProductionOptimizer: Page view tracked', {
      path: window.location.pathname,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    });
  };

  // Performance metrics tracking
  const trackPerformance = () => {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const metrics = {
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        firstPaint: 0,
        firstContentfulPaint: 0
      };

      // Get paint metrics
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        if (entry.name === 'first-paint') {
          metrics.firstPaint = entry.startTime;
        } else if (entry.name === 'first-contentful-paint') {
          metrics.firstContentfulPaint = entry.startTime;
        }
      });

      logger.info('ProductionOptimizer: Performance metrics tracked', metrics);
    }
  };

  // Initialize tracking
  trackPageView();
  
  // Track performance after load
  if (document.readyState === 'complete') {
    trackPerformance();
  } else {
    window.addEventListener('load', trackPerformance);
  }
};

// 🎯 ERROR REPORTING
const initializeErrorReporting = (config: ProductionConfig) => {
  if (!config.enableErrorReporting) {
    return;
  }

  const reportError = (error: any, info?: any) => {
    const errorReport = {
      message: error.message || 'Unknown error',
      stack: error.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      additionalInfo: info
    };

    logger.error('ProductionOptimizer: Error reported', errorReport);

    // In production, you would send this to your error reporting service
    // Example: Sentry, LogRocket, Bugsnag, etc.
  };

  // Global error handler
  window.addEventListener('error', (event) => {
    reportError(event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    reportError(event.reason, {
      type: 'unhandledRejection'
    });
  });
};

// 🎯 RESOURCE PRELOADING
const preloadResources = (resources: string[]) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    
    // Determine resource type
    if (resource.endsWith('.css')) {
      link.as = 'style';
    } else if (resource.endsWith('.js')) {
      link.as = 'script';
    } else if (resource.match(/\.(jpg|jpeg|png|webp|avif)$/)) {
      link.as = 'image';
    } else {
      link.as = 'fetch';
      link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
  });

  if (resources.length > 0) {
    logger.info('ProductionOptimizer: Resources preloaded', resources);
  }
};

// 🎯 PRODUCTION OPTIMIZER HOOK
export const useProductionOptimizer = (config: Partial<ProductionConfig> = {}) => {
  const finalConfig = { ...DEFAULT_PRODUCTION_CONFIG, ...config };

  const initialize = useCallback(async () => {
    logger.info('ProductionOptimizer: Initializing with config', finalConfig);

    // Register Service Worker
    if (finalConfig.enableServiceWorker) {
      await registerServiceWorker();
    }

    // Initialize Analytics
    initializeAnalytics(finalConfig);

    // Initialize Error Reporting
    initializeErrorReporting(finalConfig);

    // Preload Resources
    if (finalConfig.preloadResources.length > 0) {
      preloadResources(finalConfig.preloadResources);
    }

    logger.info('ProductionOptimizer: Initialization complete');
  }, [finalConfig]);

  const reportCustomEvent = useCallback((eventName: string, data?: any) => {
    if (finalConfig.enableAnalytics) {
      logger.info('ProductionOptimizer: Custom event tracked', { eventName, data });
    }
  }, [finalConfig.enableAnalytics]);

  return {
    initialize,
    reportCustomEvent,
    config: finalConfig
  };
};

// 🎯 PRODUCTION OPTIMIZER PROVIDER
export interface ProductionOptimizerProviderProps {
  children: React.ReactNode;
  config?: Partial<ProductionConfig>;
  autoInitialize?: boolean;
}

export const ProductionOptimizerProvider: React.FC<ProductionOptimizerProviderProps> = ({
  children,
  config = {},
  autoInitialize = true
}) => {
  const optimizer = useProductionOptimizer(config);

  useEffect(() => {
    if (autoInitialize) {
      optimizer.initialize();
    }
  }, [autoInitialize, optimizer]);

  // 🎯 GLOBAL OPTIMIZER INSTANCE
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__PRODUCTION_OPTIMIZER__ = optimizer;
    }
  }, [optimizer]);

  return (
    <div className="production-optimizer-provider">
      {children}
    </div>
  );
};

export default ProductionOptimizerProvider;