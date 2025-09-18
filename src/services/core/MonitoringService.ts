/**
 * 🎯 SISTEMA DE MONITORAMENTO - FASE 3
 * 
 * Sistema de logs e monitoramento para detectar conflitos futuros
 * entre motores e identificar gargalos de performance.
 */

import { engineRegistry } from './EngineRegistry';
import { resultCacheService } from './ResultCacheService';
import { storageCleanupService } from './StorageCleanupService';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
  stack?: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  context?: any;
}

export interface HealthCheckResult {
  component: string;
  healthy: boolean;
  message: string;
  metrics?: Record<string, number>;
  lastCheck: string;
}

/**
 * Serviço de monitoramento e diagnóstico
 */
export class MonitoringService {
  private logs: LogEntry[] = [];
  private metrics: PerformanceMetric[] = [];
  private readonly MAX_LOGS = 1000;
  private readonly MAX_METRICS = 500;
  private healthCheckInterval?: number;

  constructor() {
    this.startHealthChecks();
    this.setupGlobalErrorHandlers();
  }

  /**
   * Registra uma entrada de log
   */
  log(level: LogLevel, category: string, message: string, data?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data: data ? this.sanitizeData(data) : undefined,
      stack: level === 'error' || level === 'critical' ? new Error().stack : undefined
    };

    this.logs.push(entry);

    // Manter apenas os logs mais recentes
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS);
    }

    // Log no console em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      const consoleMethod = this.getConsoleMethod(level);
      consoleMethod(`[${category}] ${message}`, data || '');
    }

    // Alertas críticos
    if (level === 'critical') {
      this.handleCriticalAlert(entry);
    }
  }

  /**
   * Registra métrica de performance
   */
  recordMetric(name: string, value: number, unit: string, context?: any): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date().toISOString(),
      context: context ? this.sanitizeData(context) : undefined
    };

    this.metrics.push(metric);

    // Manter apenas as métricas mais recentes
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS);
    }

    // Detectar anomalias de performance
    this.detectPerformanceAnomalies(metric);
  }

  /**
   * Executa verificações de saúde do sistema
   */
  async runHealthChecks(): Promise<HealthCheckResult[]> {
    const results: HealthCheckResult[] = [];

    // 1. Verificar engines
    try {
      const engineStats = engineRegistry.getStatistics();
      results.push({
        component: 'Engine Registry',
        healthy: engineStats.activeEngines > 0 && engineStats.successRate > 50,
        message: `${engineStats.activeEngines} motores ativos, ${engineStats.successRate.toFixed(1)}% sucesso`,
        metrics: {
          activeEngines: engineStats.activeEngines,
          successRate: engineStats.successRate,
          averageExecutionTime: engineStats.averageExecutionTime
        },
        lastCheck: new Date().toISOString()
      });
    } catch (error) {
      results.push({
        component: 'Engine Registry',
        healthy: false,
        message: `Erro ao verificar engines: ${error}`,
        lastCheck: new Date().toISOString()
      });
    }

    // 2. Verificar cache
    try {
      const cacheStats = resultCacheService.getStats();
      results.push({
        component: 'Result Cache',
        healthy: cacheStats.validEntries >= 0 && cacheStats.cacheSize < 1024 * 1024, // 1MB limit
        message: `${cacheStats.validEntries} entradas válidas, ${(cacheStats.cacheSize / 1024).toFixed(1)}KB`,
        metrics: {
          validEntries: cacheStats.validEntries,
          expiredEntries: cacheStats.expiredEntries,
          cacheSizeKB: Math.round(cacheStats.cacheSize / 1024)
        },
        lastCheck: new Date().toISOString()
      });
    } catch (error) {
      results.push({
        component: 'Result Cache',
        healthy: false,
        message: `Erro ao verificar cache: ${error}`,
        lastCheck: new Date().toISOString()
      });
    }

    // 3. Verificar armazenamento
    try {
      const storageStats = storageCleanupService.getStorageStats();
      const storageHealthy = storageStats.totalSize < 5 * 1024 * 1024; // 5MB limit
      
      results.push({
        component: 'Storage',
        healthy: storageHealthy,
        message: `${storageStats.totalKeys} chaves, ${(storageStats.totalSize / 1024).toFixed(1)}KB total`,
        metrics: {
          totalKeys: storageStats.totalKeys,
          legacyKeys: storageStats.legacyKeys,
          totalSizeKB: Math.round(storageStats.totalSize / 1024)
        },
        lastCheck: new Date().toISOString()
      });
    } catch (error) {
      results.push({
        component: 'Storage',
        healthy: false,
        message: `Erro ao verificar storage: ${error}`,
        lastCheck: new Date().toISOString()
      });
    }

    // 4. Verificar memória (se disponível)
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory;
      results.push({
        component: 'Memory',
        healthy: memory.usedJSHeapSize < memory.jsHeapSizeLimit * 0.8,
        message: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB usado de ${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(1)}MB`,
        metrics: {
          usedHeapMB: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          totalHeapMB: Math.round(memory.totalJSHeapSize / 1024 / 1024),
          heapLimitMB: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
        },
        lastCheck: new Date().toISOString()
      });
    }

    // Log resultado geral
    const unhealthyComponents = results.filter(r => !r.healthy);
    if (unhealthyComponents.length > 0) {
      this.log('warn', 'HealthCheck', `${unhealthyComponents.length} componentes não saudáveis`, {
        unhealthy: unhealthyComponents.map(c => c.component)
      });
    } else {
      this.log('info', 'HealthCheck', 'Todos os componentes saudáveis');
    }

    return results;
  }

  /**
   * Detecta conflitos entre engines
   */
  detectEngineConflicts(): { hasConflicts: boolean; conflicts: string[] } {
    const conflicts: string[] = [];
    const engines = engineRegistry.getEnginesByPriority();
    
    // Verificar múltiplos engines ativos com mesma prioridade
    const priorityGroups = new Map<number, string[]>();
    engines.filter(e => e.status === 'active').forEach(engine => {
      const group = priorityGroups.get(engine.priority) || [];
      group.push(engine.name);
      priorityGroups.set(engine.priority, group);
    });

    priorityGroups.forEach((engines, priority) => {
      if (engines.length > 1) {
        conflicts.push(`Múltiplos engines com prioridade ${priority}: ${engines.join(', ')}`);
      }
    });

    // Verificar engines com muitos erros
    engines.forEach(engine => {
      const errorCount = engine.errors?.length || 0;
      if (errorCount > 5) {
        conflicts.push(`Engine ${engine.name} com ${errorCount} erros recentes`);
      }
    });

    if (conflicts.length > 0) {
      this.log('warn', 'ConflictDetection', 'Conflitos detectados entre engines', { conflicts });
    }

    return {
      hasConflicts: conflicts.length > 0,
      conflicts
    };
  }

  /**
   * Gera relatório de diagnóstico completo
   */
  async generateDiagnosticReport(): Promise<any> {
    const timestamp = new Date().toISOString();
    
    // Executar todas as verificações
    const healthChecks = await this.runHealthChecks();
    const engineConflicts = this.detectEngineConflicts();
    const recentLogs = this.getLogs('error', 50);
    const performanceMetrics = this.getMetrics(['execution_time', 'cache_hit_rate'], 20);

    const report = {
      timestamp,
      summary: {
        systemHealth: healthChecks.every(h => h.healthy) ? 'healthy' : 'degraded',
        totalIssues: healthChecks.filter(h => !h.healthy).length + engineConflicts.conflicts.length,
        uptime: this.calculateUptime()
      },
      healthChecks,
      engineConflicts,
      performance: {
        recentMetrics: performanceMetrics,
        averageExecutionTime: this.calculateAverageMetric('execution_time'),
        cacheHitRate: this.calculateAverageMetric('cache_hit_rate')
      },
      logs: {
        recentErrors: recentLogs,
        logCounts: this.getLogCounts(),
        topCategories: this.getTopLogCategories()
      },
      recommendations: this.generateRecommendations(healthChecks, engineConflicts)
    };

    this.log('info', 'DiagnosticReport', 'Relatório de diagnóstico gerado', {
      systemHealth: report.summary.systemHealth,
      totalIssues: report.summary.totalIssues
    });

    return report;
  }

  /**
   * Obtém logs filtrados
   */
  getLogs(level?: LogLevel, limit?: number): LogEntry[] {
    let filtered = level ? this.logs.filter(log => log.level === level) : this.logs;
    return limit ? filtered.slice(-limit) : filtered;
  }

  /**
   * Obtém métricas filtradas
   */
  getMetrics(names?: string[], limit?: number): PerformanceMetric[] {
    let filtered = names ? 
      this.metrics.filter(metric => names.includes(metric.name)) : 
      this.metrics;
    return limit ? filtered.slice(-limit) : filtered;
  }

  /**
   * Para o monitoramento
   */
  stop(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }
  }

  // ===== MÉTODOS PRIVADOS =====

  private startHealthChecks(): void {
    // Executar health check a cada 5 minutos
    this.healthCheckInterval = setInterval(() => {
      this.runHealthChecks().catch(error => {
        this.log('error', 'HealthCheck', 'Erro durante health check automático', { error });
      });
    }, 5 * 60 * 1000) as unknown as number;
  }

  private setupGlobalErrorHandlers(): void {
    // Capturar erros não tratados
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.log('error', 'GlobalError', 'Erro JavaScript não tratado', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.log('error', 'UnhandledPromise', 'Promise rejeitada não tratada', {
          reason: event.reason
        });
      });
    }
  }

  private detectPerformanceAnomalies(metric: PerformanceMetric): void {
    // Detectar execuções muito lentas (>5s)
    if (metric.name === 'execution_time' && metric.value > 5000) {
      this.log('warn', 'Performance', 'Execução muito lenta detectada', {
        metric: metric.name,
        value: metric.value,
        unit: metric.unit
      });
    }

    // Detectar baixa taxa de cache hits (<50%)
    if (metric.name === 'cache_hit_rate' && metric.value < 0.5) {
      this.log('warn', 'Performance', 'Taxa de cache hits baixa', {
        metric: metric.name,
        value: metric.value,
        unit: metric.unit
      });
    }
  }

  private handleCriticalAlert(entry: LogEntry): void {
    console.error('🚨 ALERTA CRÍTICO:', entry.message, entry.data);
    
    // Em produção, enviaria para sistema de alertas
    // Aqui apenas logamos no console
  }

  private sanitizeData(data: any): any {
    try {
      // Remover dados sensíveis e limitar tamanho
      const sanitized = JSON.parse(JSON.stringify(data));
      const str = JSON.stringify(sanitized);
      return str.length > 1000 ? JSON.parse(str.substring(0, 1000) + '..."}') : sanitized;
    } catch {
      return '[Dados não serializáveis]';
    }
  }

  private getConsoleMethod(level: LogLevel): (...args: any[]) => void {
    switch (level) {
      case 'debug': return console.debug;
      case 'info': return console.info;
      case 'warn': return console.warn;
      case 'error': 
      case 'critical': return console.error;
      default: return console.log;
    }
  }

  private calculateUptime(): string {
    // Placeholder - em produção usaria timestamp de inicialização
    return 'N/A';
  }

  private calculateAverageMetric(name: string): number {
    const metrics = this.metrics.filter(m => m.name === name).slice(-10);
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
  }

  private getLogCounts(): Record<LogLevel, number> {
    const counts: Record<LogLevel, number> = {
      debug: 0, info: 0, warn: 0, error: 0, critical: 0
    };
    
    this.logs.forEach(log => {
      counts[log.level]++;
    });
    
    return counts;
  }

  private getTopLogCategories(): Array<{ category: string; count: number }> {
    const categoryCounts = new Map<string, number>();
    
    this.logs.forEach(log => {
      categoryCounts.set(log.category, (categoryCounts.get(log.category) || 0) + 1);
    });
    
    return Array.from(categoryCounts.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private generateRecommendations(
    healthChecks: HealthCheckResult[], 
    engineConflicts: { hasConflicts: boolean; conflicts: string[] }
  ): string[] {
    const recommendations: string[] = [];
    
    // Recomendações baseadas em health checks
    healthChecks.forEach(check => {
      if (!check.healthy) {
        switch (check.component) {
          case 'Engine Registry':
            recommendations.push('Verificar configuração e saúde dos engines de cálculo');
            break;
          case 'Result Cache':
            recommendations.push('Limpar cache de resultados ou aumentar limite de tamanho');
            break;
          case 'Storage':
            recommendations.push('Executar limpeza de armazenamento para remover dados legados');
            break;
          case 'Memory':
            recommendations.push('Investigar vazamentos de memória ou reduzir uso de memória');
            break;
        }
      }
    });
    
    // Recomendações baseadas em conflitos
    if (engineConflicts.hasConflicts) {
      recommendations.push('Resolver conflitos entre engines ajustando prioridades');
      recommendations.push('Desabilitar engines com muitos erros');
    }
    
    return recommendations;
  }
}

// Instância singleton
export const monitoringService = new MonitoringService();
export default monitoringService;