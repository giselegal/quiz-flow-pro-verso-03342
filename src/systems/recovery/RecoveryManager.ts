/**
 * 🔄 RECOVERY MANAGER - FASE 4
 * 
 * Sistema avançado de recuperação com:
 * - Retry mechanisms automáticos para falhas
 * - Graceful degradation para problemas de rede
 * - Advanced error recovery com state reconstruction
 * - Performance analytics e telemetria detalhada
 */

import { PerformanceOptimizer } from '@/utils/performanceOptimizer';
import { intelligentCache } from '../cache/IntelligentCacheSystem';
import { unifiedQuizStorage } from '@/services/core/UnifiedQuizStorage';
import { StorageService } from '@/services/core/StorageService';

export interface RecoveryContext {
  operation: string;
  timestamp: number;
  attemptCount: number;
  maxAttempts: number;
  lastError?: Error;
  metadata?: any;
}

export interface TelemetryEvent {
  type: 'error' | 'recovery' | 'performance' | 'user-action';
  category: string;
  action: string;
  timestamp: number;
  duration?: number;
  metadata?: any;
  userId?: string;
  sessionId: string;
}

export interface RecoveryStrategy {
  name: string;
  condition: (error: Error, context: RecoveryContext) => boolean;
  recover: (error: Error, context: RecoveryContext) => Promise<boolean>;
  priority: number;
}

export class RecoveryManager {
  private recoveryStrategies: RecoveryStrategy[] = [];
  private activeRecoveries = new Map<string, RecoveryContext>();
  private telemetryBuffer: TelemetryEvent[] = [];
  private sessionId = this.generateSessionId();
  private networkStatus: 'online' | 'offline' | 'slow' = 'online';
  private telemetryFlushTimer: number | null = null;

  constructor() {
    this.setupRecoveryStrategies();
    this.setupNetworkDetection();
    this.setupErrorHandling();
    this.startTelemetryFlushing();
  }

  /**
   * 🔄 EXECUTE WITH RECOVERY - Executa operação com recovery automático
   */
  async executeWithRecovery<T>(
    operation: string,
    executor: () => Promise<T>,
    options: {
      maxAttempts?: number;
      backoffMultiplier?: number;
      timeout?: number;
      fallback?: () => Promise<T>;
      metadata?: any;
    } = {}
  ): Promise<T> {
    const {
      maxAttempts = 3,
      backoffMultiplier = 2,
      timeout = 10000,
      fallback,
      metadata = {}
    } = options;

    const context: RecoveryContext = {
      operation,
      timestamp: Date.now(),
      attemptCount: 0,
      maxAttempts,
      metadata
    };

    this.activeRecoveries.set(operation, context);

    while (context.attemptCount < maxAttempts) {
      context.attemptCount++;
      
      try {
        const startTime = performance.now();
        
        // Executar com timeout
        const result = await this.withTimeout(executor(), timeout);
        
        const duration = performance.now() - startTime;
        
        // Telemetria de sucesso
        this.recordTelemetry({
          type: 'performance',
          category: 'operation',
          action: operation,
          timestamp: Date.now(),
          duration,
          metadata: { attempt: context.attemptCount, success: true }
        });

        this.activeRecoveries.delete(operation);
        return result;
        
      } catch (error) {
        context.lastError = error as Error;
        
        // Telemetria de erro
        this.recordTelemetry({
          type: 'error',
          category: 'operation',
          action: operation,
          timestamp: Date.now(),
          metadata: {
            attempt: context.attemptCount,
            error: (error as Error).message,
            stack: (error as Error).stack
          }
        });

        // Tentar estratégias de recovery
        const recovered = await this.attemptRecovery(error as Error, context);
        
        if (recovered) {
          this.recordTelemetry({
            type: 'recovery',
            category: 'auto-recovery',
            action: operation,
            timestamp: Date.now(),
            metadata: { attempt: context.attemptCount, success: true }
          });
          
          // Tentar novamente após recovery
          continue;
        }

        // Se é a última tentativa e tem fallback
        if (context.attemptCount >= maxAttempts && fallback) {
          try {
            const result = await fallback();
            
            this.recordTelemetry({
              type: 'recovery',
              category: 'fallback',
              action: operation,
              timestamp: Date.now(),
              metadata: { success: true }
            });
            
            this.activeRecoveries.delete(operation);
            return result;
          } catch (fallbackError) {
            console.error(`[Recovery] Fallback failed for ${operation}:`, fallbackError);
          }
        }

        // Se não é a última tentativa, esperar com backoff
        if (context.attemptCount < maxAttempts) {
          const delay = Math.min(1000 * Math.pow(backoffMultiplier, context.attemptCount - 1), 10000);
          await this.sleep(delay);
        }
      }
    }

    this.activeRecoveries.delete(operation);
    throw new Error(`Operation ${operation} failed after ${maxAttempts} attempts. Last error: ${context.lastError?.message}`);
  }

  /**
   * 🏥 GRACEFUL DEGRADATION - Degradação graciosa baseada no estado da rede
   */
  async gracefulDegrade<T>(
    primaryOperation: () => Promise<T>,
    degradedOperation: () => Promise<T>,
    offlineOperation?: () => Promise<T>
  ): Promise<T> {
    try {
      // Tentar operação primária se rede está boa
      if (this.networkStatus === 'online') {
        return await primaryOperation();
      }
      
      // Operação degradada se rede lenta
      if (this.networkStatus === 'slow') {
        this.recordTelemetry({
          type: 'performance',
          category: 'degradation',
          action: 'slow-network',
          timestamp: Date.now()
        });
        
        return await degradedOperation();
      }
      
      // Operação offline se disponível
      if (this.networkStatus === 'offline' && offlineOperation) {
        this.recordTelemetry({
          type: 'performance',
          category: 'degradation',
          action: 'offline-mode',
          timestamp: Date.now()
        });
        
        return await offlineOperation();
      }
      
      // Fallback para operação degradada
      return await degradedOperation();
      
    } catch (error) {
      // Em caso de falha, tentar próximo nível
      if (offlineOperation && this.networkStatus !== 'offline') {
        return await offlineOperation();
      }
      throw error;
    }
  }

  /**
   * 🔧 STATE RECONSTRUCTION - Reconstrução de estado após erro crítico
   */
  async reconstructState(): Promise<boolean> {
    try {
      this.recordTelemetry({
        type: 'recovery',
        category: 'state-reconstruction',
        action: 'start',
        timestamp: Date.now()
      });

      // 1. Recuperar dados do cache
      const cachedData = await intelligentCache.get('unified-quiz-data');
      
      // 2. Recuperar dados do storage
      const storageData = unifiedQuizStorage.loadData();
      
      // 3. Recuperar backup do localStorage
      const backupData = StorageService.safeGetJSON('quiz-backup');
      
      // 4. Escolher melhor fonte de dados
      const bestData = this.selectBestDataSource([cachedData, storageData, backupData]);
      
      if (bestData) {
        // 5. Reconstruir estado
        await this.restoreApplicationState(bestData);
        
        this.recordTelemetry({
          type: 'recovery',
          category: 'state-reconstruction',
          action: 'success',
          timestamp: Date.now(),
          metadata: { dataSource: this.identifyDataSource(bestData) }
        });
        
        return true;
      }
      
      return false;
      
    } catch (error) {
      this.recordTelemetry({
        type: 'error',
        category: 'state-reconstruction',
        action: 'failed',
        timestamp: Date.now(),
        metadata: { error: (error as Error).message }
      });
      
      return false;
    }
  }

  /**
   * 📊 TELEMETRIA - Sistema avançado de telemetria
   */
  recordTelemetry(event: Omit<TelemetryEvent, 'sessionId'>): void {
    const telemetryEvent: TelemetryEvent = {
      ...event,
      sessionId: this.sessionId
    };
    
    this.telemetryBuffer.push(telemetryEvent);
    
    // Limite do buffer
    if (this.telemetryBuffer.length > 100) {
      this.telemetryBuffer.shift();
    }
    
    // Log críticos imediatamente
    if (event.type === 'error') {
      console.error(`[Telemetry] ${event.category}:${event.action}`, event.metadata);
    }
  }

  /**
   * 📈 ANALYTICS - Obter métricas de performance
   */
  getPerformanceMetrics(): {
    errorRate: number;
    recoveryRate: number;
    averageOperationTime: number;
    networkStatus: string;
    activeRecoveries: number;
  } {
    const recentEvents = this.telemetryBuffer.filter(
      event => Date.now() - event.timestamp < 300000 // Últimos 5 minutos
    );
    
    const errors = recentEvents.filter(e => e.type === 'error');
    const recoveries = recentEvents.filter(e => e.type === 'recovery');
    const operations = recentEvents.filter(e => e.type === 'performance');
    
    const averageTime = operations.reduce((sum, op) => sum + (op.duration || 0), 0) / 
                      Math.max(operations.length, 1);
    
    return {
      errorRate: errors.length / Math.max(recentEvents.length, 1),
      recoveryRate: recoveries.length / Math.max(errors.length, 1),
      averageOperationTime: averageTime,
      networkStatus: this.networkStatus,
      activeRecoveries: this.activeRecoveries.size
    };
  }

  // ==================== MÉTODOS PRIVADOS ====================

  private setupRecoveryStrategies(): void {
    // Estratégia para erros de rede
    this.recoveryStrategies.push({
      name: 'network-retry',
      priority: 1,
      condition: (error) => error.message.includes('fetch') || error.message.includes('network'),
      recover: async (error, context) => {
        if (this.networkStatus === 'offline') {
          await this.waitForOnline();
        }
        return true;
      }
    });

    // Estratégia para quota exceeded
    this.recoveryStrategies.push({
      name: 'storage-cleanup',
      priority: 2,
      condition: (error) => error.name === 'QuotaExceededError',
      recover: async () => {
        await this.cleanStorageQuota();
        return true;
      }
    });

    // Estratégia para dados corrompidos
    this.recoveryStrategies.push({
      name: 'data-reconstruction',
      priority: 3,
      condition: (error) => error.message.includes('corrupt') || error.message.includes('invalid'),
      recover: async () => {
        return await this.reconstructState();
      }
    });
  }

  private async attemptRecovery(error: Error, context: RecoveryContext): Promise<boolean> {
    const applicableStrategies = this.recoveryStrategies
      .filter(strategy => strategy.condition(error, context))
      .sort((a, b) => a.priority - b.priority);

    for (const strategy of applicableStrategies) {
      try {
        console.log(`[Recovery] Attempting strategy: ${strategy.name}`);
        const success = await strategy.recover(error, context);
        
        if (success) {
          console.log(`[Recovery] Strategy ${strategy.name} succeeded`);
          return true;
        }
      } catch (strategyError) {
        console.warn(`[Recovery] Strategy ${strategy.name} failed:`, strategyError);
      }
    }

    return false;
  }

  private setupNetworkDetection(): void {
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      // Detectar status online/offline
      window.addEventListener('online', () => {
        this.networkStatus = 'online';
        this.recordTelemetry({
          type: 'performance',
          category: 'network',
          action: 'online',
          timestamp: Date.now()
        });
      });

      window.addEventListener('offline', () => {
        this.networkStatus = 'offline';
        this.recordTelemetry({
          type: 'performance',
          category: 'network',
          action: 'offline',
          timestamp: Date.now()
        });
      });

      // Detectar rede lenta (estimativa baseada em navigator.connection)
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          const checkNetworkSpeed = () => {
            const effectiveType = connection.effectiveType;
            this.networkStatus = effectiveType === 'slow-2g' || effectiveType === '2g' ? 'slow' : 'online';
          };
          
          connection.addEventListener('change', checkNetworkSpeed);
          checkNetworkSpeed();
        }
      }
    }
  }

  private setupErrorHandling(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.recordTelemetry({
        type: 'error',
        category: 'global',
        action: 'unhandled-error',
        timestamp: Date.now(),
        metadata: {
          message: event.error?.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });

    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.recordTelemetry({
        type: 'error',
        category: 'global',
        action: 'unhandled-rejection',
        timestamp: Date.now(),
        metadata: {
          reason: event.reason?.toString()
        }
      });
    });
  }

  private startTelemetryFlushing(): void {
    this.telemetryFlushTimer = PerformanceOptimizer.scheduleInterval(() => {
      this.flushTelemetry();
    }, 60000, 'timeout') as number; // Flush a cada minuto
  }

  private async flushTelemetry(): Promise<void> {
    if (this.telemetryBuffer.length === 0) return;

    try {
      // Salvar telemetria localmente
      const telemetryData = [...this.telemetryBuffer];
      StorageService.safeSetJSON('telemetry-buffer', telemetryData);
      
      // Em implementação futura: enviar para servidor analytics
      console.log('[Telemetry] Flushed', telemetryData.length, 'events');
      
      // Limpar buffer após flush
      this.telemetryBuffer.length = 0;
      
    } catch (error) {
      console.warn('[Telemetry] Flush failed:', error);
    }
  }

  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        PerformanceOptimizer.schedule(() => {
          reject(new Error(`Operation timed out after ${timeoutMs}ms`));
        }, timeoutMs, 'timeout');
      })
    ]);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
      PerformanceOptimizer.schedule(() => resolve(), ms, 'timeout');
    });
  }

  private async waitForOnline(): Promise<void> {
    return new Promise(resolve => {
      if (this.networkStatus === 'online') {
        resolve();
        return;
      }
      
      const checkOnline = () => {
        if (this.networkStatus === 'online') {
          resolve();
        } else {
          PerformanceOptimizer.schedule(checkOnline, 1000, 'timeout');
        }
      };
      
      checkOnline();
    });
  }

  private async cleanStorageQuota(): Promise<void> {
    // Limpar cache antigo
    const keys = Object.keys(localStorage);
    const oldKeys = keys.filter(key => {
      const item = localStorage.getItem(key);
      if (!item) return false;
      
      try {
        const parsed = JSON.parse(item);
        return parsed.timestamp && Date.now() - parsed.timestamp > 86400000; // 24 horas
      } catch {
        return false;
      }
    });
    
    oldKeys.forEach(key => localStorage.removeItem(key));
    
    // Limpar cache do sistema
    intelligentCache.cleanup(true);
  }

  private selectBestDataSource(sources: any[]): any {
    return sources
      .filter(source => source && typeof source === 'object')
      .sort((a, b) => {
        // Preferir dados mais recentes
        const aTime = a.metadata?.lastUpdated || a.lastUpdated || 0;
        const bTime = b.metadata?.lastUpdated || b.lastUpdated || 0;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      })[0];
  }

  private identifyDataSource(data: any): string {
    if (data.metadata?.version) return 'unified-storage';
    if (data.selections) return 'cache';
    return 'backup';
  }

  private async restoreApplicationState(data: any): Promise<void> {
    // Restaurar no unified storage
    if (data.selections && data.formData) {
      unifiedQuizStorage.saveData(data);
    }
    
    // Notificar componentes da restauração
    window.dispatchEvent(new CustomEvent('state-restored', { detail: data }));
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 🧹 CLEANUP - Limpeza de recursos
   */
  destroy(): void {
    if (this.telemetryFlushTimer) {
      PerformanceOptimizer.cancelInterval(this.telemetryFlushTimer);
    }
    
    this.activeRecoveries.clear();
    this.telemetryBuffer.length = 0;
    this.recoveryStrategies.length = 0;
  }
}

// Singleton instance
export const recoveryManager = new RecoveryManager();
export default recoveryManager;