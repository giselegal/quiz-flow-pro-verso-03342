/**
 * 🏥 HEALTH CHECK SERVICE - Phase 3 Implementation
 * Monitoramento de saúde do sistema em tempo real
 */

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    frontend: ServiceHealth;
    supabase: ServiceHealth;
    analytics: ServiceHealth;
    storage: ServiceHealth;
  };
  metrics: {
    responseTime: number;
    memoryUsage: number;
    errorRate: number;
    uptime: number;
  };
}

export interface ServiceHealth {
  status: 'up' | 'down' | 'degraded';
  responseTime?: number;
  lastCheck: string;
  error?: string;
}

class HealthCheckService {
  private static instance: HealthCheckService;
  private checkInterval: NodeJS.Timeout | null = null;
  private healthCallbacks: ((status: HealthStatus) => void)[] = [];

  static getInstance(): HealthCheckService {
    if (!HealthCheckService.instance) {
      HealthCheckService.instance = new HealthCheckService();
    }
    return HealthCheckService.instance;
  }

  /**
   * Iniciar monitoramento contínuo
   */
  startMonitoring(intervalMs: number = 30000) {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(async () => {
      const health = await this.performHealthCheck();
      this.notifyCallbacks(health);
    }, intervalMs);

    console.log('🏥 Health monitoring started');
  }

  /**
   * Parar monitoramento
   */
  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Realizar verificação completa de saúde
   */
  async performHealthCheck(): Promise<HealthStatus> {
    const startTime = performance.now();

    const [frontend, supabase, analytics, storage] = await Promise.allSettled([
      this.checkFrontend(),
      this.checkSupabase(),
      this.checkAnalytics(),
      this.checkStorage()
    ]);

    const responseTime = performance.now() - startTime;

    const services = {
      frontend: frontend.status === 'fulfilled' ? frontend.value : { status: 'down' as const, lastCheck: new Date().toISOString(), error: 'Check failed' },
      supabase: supabase.status === 'fulfilled' ? supabase.value : { status: 'down' as const, lastCheck: new Date().toISOString(), error: 'Check failed' },
      analytics: analytics.status === 'fulfilled' ? analytics.value : { status: 'down' as const, lastCheck: new Date().toISOString(), error: 'Check failed' },
      storage: storage.status === 'fulfilled' ? storage.value : { status: 'down' as const, lastCheck: new Date().toISOString(), error: 'Check failed' }
    };

    const overallStatus = this.calculateOverallStatus(services);

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services,
      metrics: {
        responseTime: Math.round(responseTime),
        memoryUsage: this.getMemoryUsage(),
        errorRate: this.getErrorRate(),
        uptime: this.getUptime()
      }
    };
  }

  /**
   * Verificar saúde do frontend
   */
  private async checkFrontend(): Promise<ServiceHealth> {
    const startTime = performance.now();
    
    try {
      const hasErrors = document.querySelectorAll('[data-error="true"]').length > 0;
      const responseTime = performance.now() - startTime;

      return {
        status: hasErrors ? 'degraded' : 'up',
        responseTime: Math.round(responseTime),
        lastCheck: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'down',
        lastCheck: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Verificar conectividade com Supabase usando edge function
   */
  private async checkSupabase(): Promise<ServiceHealth> {
    const startTime = performance.now();
    
    try {
      // Usar edge function para health check real
      const response = await fetch(
        `https://pwtjuuhchtbzttrzoutw.supabase.co/functions/v1/security-monitor/health-check`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const responseTime = performance.now() - startTime;
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const healthData = await response.json();
      
      return {
        status: healthData.overall_status === 'healthy' ? 'up' : 
                healthData.overall_status === 'degraded' ? 'degraded' : 'down',
        responseTime: Math.round(responseTime),
        lastCheck: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'down',
        lastCheck: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }

  /**
   * Verificar Analytics
   */
  private async checkAnalytics(): Promise<ServiceHealth> {
    try {
      const hasGtag = typeof window.gtag !== 'undefined';
      
      return {
        status: hasGtag ? 'up' : 'degraded',
        lastCheck: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'down',
        lastCheck: new Date().toISOString(),
        error: 'Analytics not loaded'
      };
    }
  }

  /**
   * Verificar Storage/LocalStorage
   */
  private async checkStorage(): Promise<ServiceHealth> {
    try {
      const testKey = '__health_check__';
      localStorage.setItem(testKey, 'test');
      const value = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      return {
        status: value === 'test' ? 'up' : 'down',
        lastCheck: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'down',
        lastCheck: new Date().toISOString(),
        error: 'Storage unavailable'
      };
    }
  }

  /**
   * Calcular status geral
   */
  private calculateOverallStatus(services: HealthStatus['services']): HealthStatus['status'] {
    const statuses = Object.values(services).map(s => s.status);
    
    if (statuses.every(s => s === 'up')) return 'healthy';
    if (statuses.some(s => s === 'down')) return 'unhealthy';
    return 'degraded';
  }

  /**
   * Obter uso de memória
   */
  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return Math.round((performance as any).memory.usedJSHeapSize / (1024 * 1024));
    }
    return 0;
  }

  /**
   * Obter taxa de erro (simulado)
   */
  private getErrorRate(): number {
    const errors = sessionStorage.getItem('error_count');
    return errors ? parseInt(errors) : 0;
  }

  /**
   * Obter uptime
   */
  private getUptime(): number {
    const startTime = sessionStorage.getItem('app_start_time');
    if (startTime) {
      return Math.round((Date.now() - parseInt(startTime)) / 1000);
    }
    return 0;
  }

  /**
   * Registrar callback para mudanças de saúde
   */
  onHealthChange(callback: (status: HealthStatus) => void) {
    this.healthCallbacks.push(callback);
  }

  /**
   * Notificar callbacks
   */
  private notifyCallbacks(status: HealthStatus) {
    this.healthCallbacks.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Health callback error:', error);
      }
    });
  }
}

export const healthCheckService = HealthCheckService.getInstance();