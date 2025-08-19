/**
 * 📊 SERVIÇO DE MONITORAMENTO - FASE 3
 *
 * Sistema de monitoramento em tempo real para tracking de performance,
 * compatibilidade e health do sistema quiz
 */

import { useSystemValidation } from '@/testing/SystemValidation';
import { useFeatureFlags } from '@/utils/FeatureFlagManager';
import { useEffect, useState } from 'react';

export interface SystemMetrics {
  performance: {
    loadTime: number;
    renderTime: number;
    memoryUsage: number;
    bundleSize: number;
  };
  compatibility: {
    validationScore: number;
    lastValidation: string;
    failedTests: string[];
  };
  user: {
    completionRate: number;
    errorRate: number;
    averageTime: number;
    abandonmentPoints: string[];
  };
  system: {
    activeSystem: 'unified' | 'legacy';
    uptime: number;
    errorCount: number;
    warningCount: number;
  };
}

/**
 * 📈 Serviço de monitoramento
 */
export class MonitoringService {
  private static instance: MonitoringService;
  private metrics: Partial<SystemMetrics> = {};
  private listeners: Array<(metrics: SystemMetrics) => void> = [];
  private validationInterval?: number;

  private constructor() {
    this.startMonitoring();
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  /**
   * 🚀 Iniciar monitoramento
   */
  private startMonitoring() {
    // Monitorar performance
    this.trackPerformance();

    // Monitorar sistema
    this.trackSystemHealth();

    // Validação periódica (apenas em produção com flag ativa)
    const flags = useFeatureFlags();
    if (flags.shouldValidateCompatibility()) {
      this.startPeriodicValidation();
    }

    console.log('📊 Sistema de monitoramento inicializado');
  }

  /**
   * ⚡ Monitorar performance
   */
  private trackPerformance() {
    // Load time
    const loadTime = performance.now();

    // Memory usage (se disponível)
    const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;

    // Render time (aproximado)
    const renderTime =
      performance.getEntriesByType('measure').find(entry => entry.name === 'React')?.duration || 0;

    this.updateMetrics({
      performance: {
        loadTime,
        renderTime,
        memoryUsage,
        bundleSize: this.estimateBundleSize(),
      },
    });
  }

  /**
   * 🏥 Monitorar saúde do sistema
   */
  private trackSystemHealth() {
    const flags = useFeatureFlags();
    const startTime = Date.now();

    this.updateMetrics({
      system: {
        activeSystem: flags.shouldUseUnifiedSystem() ? 'unified' : 'legacy',
        uptime: Date.now() - startTime,
        errorCount: this.getErrorCount(),
        warningCount: this.getWarningCount(),
      },
    });
  }

  /**
   * 🧪 Validação periódica
   */
  private startPeriodicValidation() {
    const runValidation = async () => {
      try {
        const { runValidationSuite } = useSystemValidation();
        const report = await runValidationSuite();

        this.updateMetrics({
          compatibility: {
            validationScore: report.compatibilityScore,
            lastValidation: new Date().toISOString(),
            failedTests: report.results.filter(r => !r.passed).map(r => r.testName),
          },
        });

        // Auto-rollback se score muito baixo
        if (report.compatibilityScore < 70) {
          console.warn('🚨 Score de compatibilidade muito baixo:', report.compatibilityScore);
          this.triggerAlert('compatibility_critical', { score: report.compatibilityScore });
        }
      } catch (error) {
        console.error('❌ Erro na validação periódica:', error);
      }
    };

    // Executar imediatamente
    runValidation();

    // Repetir a cada 10 minutos
    this.validationInterval = window.setInterval(runValidation, 10 * 60 * 1000);
  }

  /**
   * 📊 Atualizar métricas
   */
  private updateMetrics(newMetrics: Partial<SystemMetrics>) {
    this.metrics = { ...this.metrics, ...newMetrics };

    // Notificar listeners
    this.listeners.forEach(listener => {
      listener(this.metrics as SystemMetrics);
    });

    // Log em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Métricas atualizadas:', newMetrics);
    }
  }

  /**
   * 🔔 Trigger de alerta
   */
  private triggerAlert(type: string, data: any) {
    console.warn(`🚨 ALERTA ${type}:`, data);

    // Enviar para serviço de monitoramento externo (se configurado)
    if (process.env.VITE_MONITORING_ENDPOINT) {
      fetch(process.env.VITE_MONITORING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data, timestamp: new Date().toISOString() }),
      }).catch(console.error);
    }
  }

  /**
   * 📈 Métodos auxiliares
   */
  private estimateBundleSize(): number {
    // Estimativa baseada em recursos carregados
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    return scripts.length * 100; // Estimativa aproximada em KB
  }

  private getErrorCount(): number {
    // Capturar erros via window.onerror
    return (window as any).__errorCount || 0;
  }

  private getWarningCount(): number {
    // Capturar warnings do console
    return (window as any).__warningCount || 0;
  }

  /**
   * 🎯 API pública
   */
  getMetrics(): SystemMetrics {
    return this.metrics as SystemMetrics;
  }

  addListener(callback: (metrics: SystemMetrics) => void) {
    this.listeners.push(callback);
  }

  removeListener(callback: (metrics: SystemMetrics) => void) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  stop() {
    if (this.validationInterval) {
      clearInterval(this.validationInterval);
    }
  }

  /**
   * 📊 Métricas específicas
   */
  trackUserEvent(event: string, data?: any) {
    console.log(`👤 Evento do usuário: ${event}`, data);

    // Atualizar métricas de usuário
    // Implementar tracking de jornada, abandono, etc.
  }

  trackError(error: Error, context?: any) {
    console.error('❌ Erro capturado:', error, context);

    // Incrementar contador de erros
    (window as any).__errorCount = ((window as any).__errorCount || 0) + 1;

    this.triggerAlert('system_error', {
      message: error.message,
      stack: error.stack,
      context,
    });
  }

  trackPerformanceMark(name: string, value: number) {
    console.log(`⚡ Performance ${name}:`, value);

    // Atualizar métricas de performance específicas
  }
}

/**
 * 🎯 Hook para monitoramento
 */
export const useMonitoring = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const monitoring = MonitoringService.getInstance();

  useEffect(() => {
    const updateMetrics = (newMetrics: SystemMetrics) => {
      setMetrics(newMetrics);
    };

    monitoring.addListener(updateMetrics);
    setMetrics(monitoring.getMetrics());

    return () => {
      monitoring.removeListener(updateMetrics);
    };
  }, [monitoring]);

  const trackEvent = (event: string, data?: any) => {
    monitoring.trackUserEvent(event, data);
  };

  const trackError = (error: Error, context?: any) => {
    monitoring.trackError(error, context);
  };

  const trackPerformance = (name: string, value: number) => {
    monitoring.trackPerformanceMark(name, value);
  };

  return {
    metrics,
    trackEvent,
    trackError,
    trackPerformance,
  };
};

// Capturar erros globais
if (typeof window !== 'undefined') {
  window.onerror = (message, source, lineno, colno, error) => {
    const monitoring = MonitoringService.getInstance();
    monitoring.trackError(error || new Error(String(message)), {
      source,
      lineno,
      colno,
    });
    return false;
  };

  window.addEventListener('unhandledrejection', event => {
    const monitoring = MonitoringService.getInstance();
    monitoring.trackError(new Error(event.reason), { type: 'unhandledrejection' });
  });
}

export default MonitoringService;
