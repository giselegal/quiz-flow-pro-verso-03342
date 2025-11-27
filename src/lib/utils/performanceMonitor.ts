/**
 * 📊 Performance Monitor
 * 
 * Utilitário para medir e comparar performance de operações críticas
 */

import { appLogger } from './logger';

export interface PerformanceMetric {
  label: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface PerformanceStats {
  count: number;
  avg: number;
  min: number;
  max: number;
  median: number;
  p95: number;
  p99: number;
}

/**
 * Monitor de performance para operações críticas
 */
export class PerformanceMonitor {
  private metrics = new Map<string, PerformanceMetric[]>();
  private maxMetricsPerLabel = 100; // Limitar histórico

  /**
   * Medir duração de uma função síncrona ou assíncrona
   */
  async measure<T>(
    label: string,
    fn: () => T | Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const start = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - start;
      
      this.recordMetric(label, duration, metadata);
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric(label, duration, { ...metadata, error: true });
      throw error;
    }
  }

  /**
   * Iniciar medição manual
   */
  start(label: string): () => void {
    const start = performance.now();
    
    return (metadata?: Record<string, any>) => {
      const duration = performance.now() - start;
      this.recordMetric(label, duration, metadata);
    };
  }

  /**
   * Registrar métrica
   */
  private recordMetric(
    label: string,
    duration: number,
    metadata?: Record<string, any>
  ): void {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }

    const metrics = this.metrics.get(label)!;
    
    metrics.push({
      label,
      duration,
      timestamp: Date.now(),
      metadata,
    });

    // Limitar tamanho do histórico
    if (metrics.length > this.maxMetricsPerLabel) {
      metrics.shift();
    }

    // Log em dev mode
    if (import.meta.env.DEV) {
      const color = duration < 100 ? 'green' : duration < 500 ? 'orange' : 'red';
      appLogger.debug(
        `⏱️ [${label}] ${duration.toFixed(2)}ms`,
        { data: [metadata], color }
      );
    }
  }

  /**
   * Obter estatísticas de uma métrica
   */
  getStats(label: string): PerformanceStats | null {
    const metrics = this.metrics.get(label);
    if (!metrics || metrics.length === 0) return null;

    const durations = metrics.map(m => m.duration).sort((a, b) => a - b);
    
    const sum = durations.reduce((a, b) => a + b, 0);
    const avg = sum / durations.length;
    const min = durations[0];
    const max = durations[durations.length - 1];
    
    const median = this.percentile(durations, 50);
    const p95 = this.percentile(durations, 95);
    const p99 = this.percentile(durations, 99);

    return {
      count: durations.length,
      avg,
      min,
      max,
      median,
      p95,
      p99,
    };
  }

  /**
   * Calcular percentil
   */
  private percentile(sortedValues: number[], percentile: number): number {
    const index = Math.ceil((percentile / 100) * sortedValues.length) - 1;
    return sortedValues[Math.max(0, index)];
  }

  /**
   * Comparar duas métricas
   */
  compare(labelA: string, labelB: string): void {
    const statsA = this.getStats(labelA);
    const statsB = this.getStats(labelB);

    if (!statsA || !statsB) {
      console.warn('⚠️ Métricas insuficientes para comparação');
      return;
    }

    const improvement = ((statsA.avg - statsB.avg) / statsA.avg) * 100;

    console.log(`\n📊 Comparação: ${labelA} vs ${labelB}\n`);
    console.table({
      [labelA]: {
        avg: `${statsA.avg.toFixed(2)}ms`,
        min: `${statsA.min.toFixed(2)}ms`,
        max: `${statsA.max.toFixed(2)}ms`,
        p95: `${statsA.p95.toFixed(2)}ms`,
        count: statsA.count,
      },
      [labelB]: {
        avg: `${statsB.avg.toFixed(2)}ms`,
        min: `${statsB.min.toFixed(2)}ms`,
        max: `${statsB.max.toFixed(2)}ms`,
        p95: `${statsB.p95.toFixed(2)}ms`,
        count: statsB.count,
      },
    });

    console.log(`\n${improvement > 0 ? '✅' : '❌'} Melhoria: ${improvement.toFixed(1)}%\n`);
  }

  /**
   * Obter todas as métricas
   */
  getAll(): Map<string, PerformanceMetric[]> {
    return this.metrics;
  }

  /**
   * Obter métricas recentes (últimos N)
   */
  getRecent(label: string, count: number = 10): PerformanceMetric[] {
    const metrics = this.metrics.get(label);
    if (!metrics) return [];

    return metrics.slice(-count);
  }

  /**
   * Limpar métricas de uma label específica
   */
  clear(label?: string): void {
    if (label) {
      this.metrics.delete(label);
    } else {
      this.metrics.clear();
    }
  }

  /**
   * Exportar métricas para análise externa
   */
  export(): string {
    const data: Record<string, PerformanceStats> = {};

    this.metrics.forEach((_, label) => {
      const stats = this.getStats(label);
      if (stats) {
        data[label] = stats;
      }
    });

    return JSON.stringify(data, null, 2);
  }

  /**
   * Alertar se métrica ultrapassar threshold
   */
  alert(label: string, thresholdMs: number, callback: (metric: PerformanceMetric) => void): void {
    const metrics = this.metrics.get(label);
    if (!metrics) return;

    const recent = metrics[metrics.length - 1];
    if (recent && recent.duration > thresholdMs) {
      callback(recent);
    }
  }

  /**
   * Criar relatório resumido
   */
  report(): void {
    console.log('\n📊 Performance Report\n');

    const report: Record<string, any> = {};

    this.metrics.forEach((_, label) => {
      const stats = this.getStats(label);
      if (stats) {
        report[label] = {
          'Avg (ms)': stats.avg.toFixed(2),
          'Min (ms)': stats.min.toFixed(2),
          'Max (ms)': stats.max.toFixed(2),
          'P95 (ms)': stats.p95.toFixed(2),
          'Samples': stats.count,
        };
      }
    });

    console.table(report);
  }
}

// Singleton global
export const perfMonitor = new PerformanceMonitor();

// Helpers para dev mode
if (import.meta.env.DEV) {
  (window as any).perfMonitor = perfMonitor;
  
  console.log('💡 Performance Monitor disponível no console:');
  console.log('  - perfMonitor.report() - Relatório completo');
  console.log('  - perfMonitor.getStats("label") - Stats de uma operação');
  console.log('  - perfMonitor.compare("labelA", "labelB") - Comparar duas operações');
  console.log('  - perfMonitor.export() - Exportar JSON');
}
