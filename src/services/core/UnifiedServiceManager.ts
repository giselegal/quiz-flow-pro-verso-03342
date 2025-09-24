/**
 * 🎯 UNIFIED SERVICE MANAGER - FASE 1: CONSOLIDAÇÃO
 * 
 * Gerenciador centralizado que substitui 77 services fragmentados
 * por 12 services essenciais com responsabilidades bem definidas
 */

import { EventEmitter } from 'events';

// ============================================================================
// CORE SERVICE INTERFACES
// ============================================================================

export interface ServiceMetrics {
  callCount: number;
  avgResponseTime: number;
  errorRate: number;
  lastUsed: Date;
}

export interface ServiceConfig {
  name: string;
  priority: number;
  cacheTTL: number;
  retryAttempts: number;
  timeout: number;
}

// ============================================================================
// BASE SERVICE CLASS
// ============================================================================

export abstract class BaseUnifiedService extends EventEmitter {
  protected config: ServiceConfig;
  protected metrics: ServiceMetrics;
  protected cache = new Map<string, { data: any; expires: number }>();

  constructor(config: ServiceConfig) {
    super();
    this.config = config;
    this.metrics = {
      callCount: 0,
      avgResponseTime: 0,
      errorRate: 0,
      lastUsed: new Date()
    };
  }

  protected async executeWithMetrics<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    const startTime = performance.now();
    this.metrics.callCount++;
    
    try {
      const result = await operation();
      const duration = performance.now() - startTime;
      
      this.metrics.avgResponseTime = 
        (this.metrics.avgResponseTime + duration) / 2;
      this.metrics.lastUsed = new Date();
      
      this.emit('operation:success', { operationName, duration });
      return result;
    } catch (error) {
      this.metrics.errorRate = 
        (this.metrics.errorRate + 1) / this.metrics.callCount;
      
      this.emit('operation:error', { operationName, error });
      throw error;
    }
  }

  protected getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached || cached.expires < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    return cached.data;
  }

  protected setCached<T>(key: string, data: T, ttl?: number): void {
    const expires = Date.now() + (ttl || this.config.cacheTTL);
    this.cache.set(key, { data, expires });
  }

  public getMetrics(): ServiceMetrics {
    return { ...this.metrics };
  }

  public clearCache(): void {
    this.cache.clear();
    this.emit('cache:cleared');
  }

  abstract getName(): string;
  abstract healthCheck(): Promise<boolean>;
}

// ============================================================================
// UNIFIED SERVICE MANAGER
// ============================================================================

export class UnifiedServiceManager extends EventEmitter {
  private static instance: UnifiedServiceManager;
  private services = new Map<string, BaseUnifiedService>();

  private constructor() {
    super();
  }

  static getInstance(): UnifiedServiceManager {
    if (!this.instance) {
      this.instance = new UnifiedServiceManager();
    }
    return this.instance;
  }

  /**
   * 🎯 REGISTER SERVICE - Registro unificado de services
   */
  registerService(service: BaseUnifiedService): void {
    const name = service.getName();
    
    if (this.services.has(name)) {
      console.warn(`⚠️ Service ${name} já registrado - substituindo...`);
    }

    this.services.set(name, service);
    
    // Bind service events
    service.on('operation:success', (data) => {
      this.emit('service:operation:success', { service: name, ...data });
    });
    
    service.on('operation:error', (data) => {
      this.emit('service:operation:error', { service: name, ...data });
    });

    console.log(`✅ Service registrado: ${name}`);
  }

  /**
   * 🔍 GET SERVICE - Recuperar service por nome
   */
  getService<T extends BaseUnifiedService>(name: string): T | null {
    return this.services.get(name) as T || null;
  }

  /**
   * 📊 GET ALL METRICS - Métricas consolidadas
   */
  getAllMetrics(): Record<string, ServiceMetrics> {
    const metrics: Record<string, ServiceMetrics> = {};
    
    for (const [name, service] of this.services) {
      metrics[name] = service.getMetrics();
    }
    
    return metrics;
  }

  /**
   * 🏥 HEALTH CHECK - Verificar saúde de todos os services
   */
  async healthCheckAll(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    const checks = Array.from(this.services.entries()).map(async ([name, service]) => {
      try {
        results[name] = await service.healthCheck();
      } catch (error) {
        results[name] = false;
        console.error(`❌ Health check failed for ${name}:`, error);
      }
    });

    await Promise.allSettled(checks);
    return results;
  }

  /**
   * 🧹 CLEANUP - Limpeza de cache e recursos
   */
  cleanup(): void {
    for (const [name, service] of this.services) {
      try {
        service.clearCache();
        service.removeAllListeners();
      } catch (error) {
        console.error(`❌ Erro ao limpar service ${name}:`, error);
      }
    }
    
    this.services.clear();
    this.removeAllListeners();
    console.log('🧹 UnifiedServiceManager limpo');
  }

  /**
   * 📈 GET PERFORMANCE SUMMARY
   */
  getPerformanceSummary(): {
    totalServices: number;
    avgResponseTime: number;
    totalCalls: number;
    avgErrorRate: number;
  } {
    const metrics = this.getAllMetrics();
    const values = Object.values(metrics);
    
    return {
      totalServices: values.length,
      avgResponseTime: values.reduce((sum, m) => sum + m.avgResponseTime, 0) / values.length,
      totalCalls: values.reduce((sum, m) => sum + m.callCount, 0),
      avgErrorRate: values.reduce((sum, m) => sum + m.errorRate, 0) / values.length
    };
  }
}

// ============================================================================
// EXPORT SINGLETON
// ============================================================================

export const serviceManager = UnifiedServiceManager.getInstance();

// Global error handler for unhandled service errors
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    serviceManager.emit('global:unhandled:rejection', event.reason);
  });
}

export default serviceManager;