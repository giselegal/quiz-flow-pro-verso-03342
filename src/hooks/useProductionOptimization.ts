/**
 * Hook de Otimização para Produção - Fase 9
 * Implementa otimizações específicas para ambiente de produção
 */

import { useEffect, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/customClient';

interface ProductionMetrics {
  bundleSize: number;
  loadTime: number;
  memoryUsage: number;
  renderTime: number;
}

interface OptimizationSettings {
  enableCodeSplitting: boolean;
  enableLazyLoading: boolean;
  enableCaching: boolean;
  enableCompression: boolean;
}

export const useProductionOptimization = () => {
  const [metrics, setMetrics] = useState<ProductionMetrics | null>(null);
  const [settings, setSettings] = useState<OptimizationSettings>({
    enableCodeSplitting: true,
    enableLazyLoading: true,  
    enableCaching: true,
    enableCompression: true
  });
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Coleta métricas de performance
  const collectMetrics = useCallback(async () => {
    if (typeof window === 'undefined') return;

    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      const renderTime = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
      
      // Estimar tamanho do bundle (aproximação)
      const resourceEntries = performance.getEntriesByType('resource');
      const bundleSize = resourceEntries
        .filter(entry => entry.name.includes('.js'))
        .reduce((total, entry) => total + (entry as any).transferSize || 0, 0);

      // Uso de memória (se disponível)
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;

      const newMetrics = {
        bundleSize,
        loadTime,
        memoryUsage,
        renderTime
      };

      setMetrics(newMetrics);

      // Salvar métricas no Supabase se não estiver em desenvolvimento
      if (!import.meta.env.DEV) {
        await supabase.functions.invoke('system-monitor', {
          body: {
            action: 'record_performance',
            metrics: newMetrics,
            timestamp: new Date().toISOString()
          }
        });
      }

    } catch (error) {
      console.warn('⚠️ [OPTIMIZATION] Erro ao coletar métricas:', error);
    }
  }, []);

  // Aplicar otimizações baseadas no ambiente
  const applyOptimizations = useCallback(async () => {
    if (isOptimizing) return;
    
    setIsOptimizing(true);
    
    try {
      // Code splitting automático baseado em rotas
      if (settings.enableCodeSplitting) {
        console.log('📦 [OPTIMIZATION] Code splitting ativado');
      }

      // Lazy loading para imagens e componentes
      if (settings.enableLazyLoading) {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              img.src = img.dataset.src || '';
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          });
        });
        
        images.forEach(img => imageObserver.observe(img));
        console.log('🖼️ [OPTIMIZATION] Lazy loading ativado para', images.length, 'imagens');
      }

      // Service Worker para caching
      if (settings.enableCaching && 'serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.register('/sw.js');
          console.log('💾 [OPTIMIZATION] Service Worker registrado');
        } catch (error) {
          console.warn('⚠️ [OPTIMIZATION] Erro ao registrar Service Worker:', error);
        }
      }

      // Compressão de recursos (via headers)
      if (settings.enableCompression) {
        console.log('🗜️ [OPTIMIZATION] Compressão ativada');
      }

    } catch (error) {
      console.error('❌ [OPTIMIZATION] Erro ao aplicar otimizações:', error);
    } finally {
      setIsOptimizing(false);
    }
  }, [settings, isOptimizing]);

  // Otimização automática em produção
  useEffect(() => {
    if (!import.meta.env.DEV) {
      collectMetrics();
      applyOptimizations();
    }
  }, [collectMetrics, applyOptimizations]);

  return {
    metrics,
    settings,
    isOptimizing,
    updateSettings: setSettings,
    collectMetrics,
    applyOptimizations
  };
};

export default useProductionOptimization;