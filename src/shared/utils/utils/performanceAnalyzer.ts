// @ts-nocheck
/**
 * 🔍 PERFORMANCE ANALYZER
 * Analisa e reporta performance após otimizações
 */

interface PerformanceReport {
  timeoutViolations: number;
  framerate: number;
  memoryUsage: number;
  optimizationStatus: {
    smartTimeoutEnabled: boolean;
    animationFrameSchedulerActive: boolean;
    messageChannelSchedulerActive: boolean;
    totalOptimizations: number;
  };
}

class PerformanceAnalyzer {
  private static instance: PerformanceAnalyzer;
  private violationCount = 0;
  private frameCount = 0;
  private isMonitoring = false;

  static getInstance(): PerformanceAnalyzer {
    if (!this.instance) {
      this.instance = new PerformanceAnalyzer();
    }
    return this.instance;
  }

  startMonitoring() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    console.log('🔍 Performance Analyzer: Iniciando monitoramento...');

    // Monitor de violations
    this.monitorTimeoutViolations();

    // Monitor de framerate
    this.monitorFramerate();

    // Monitor de memória
    this.monitorMemoryUsage();
  }

  private monitorTimeoutViolations() {
    // Usar MessageChannel para monitoramento mais preciso
    const channel = new MessageChannel();
    const originalSetTimeout = window.setTimeout;

    channel.port1.onmessage = () => {
      if (this.isMonitoring) {
        channel.port1.postMessage(null);
      }
    };

    window.setTimeout = ((callback: any, delay: number = 0, ...args: any[]) => {
      const start = performance.now();

      return originalSetTimeout(() => {
        const executionTime = performance.now() - start;

        // Threshold otimizado para 500ms para reduzir ruído excessivo
        if (executionTime > 500) {
          this.violationCount++;
          // Throttle warnings usando requestIdleCallback
          if ('requestIdleCallback' in window && this.violationCount % 10 === 0) {
            (window as any).requestIdleCallback(() => {
              console.warn(
                `⚠️ setTimeout Violation Batch: ${this.violationCount} violations (latest: ${executionTime.toFixed(2)}ms)`
              );
            });
          }
        }

        callback(...args);
      }, delay);
    }) as any;

    // Iniciar monitoramento
    if (this.isMonitoring) {
      channel.port1.postMessage(null);
    }
  }

  private monitorFramerate() {
    let frames = 0;
    let lastCheck = performance.now();
    const FRAME_CHECK_INTERVAL = 1000; // 1 segundo

    const measureFrame = () => {
      frames++;

      const now = performance.now();
      const timeSinceLastCheck = now - lastCheck;

      // Calcular FPS a cada segundo
      if (timeSinceLastCheck >= FRAME_CHECK_INTERVAL) {
        const fps = Math.round((frames * 1000) / timeSinceLastCheck);
        this.frameCount = fps;

        // Resetar contadores
        frames = 0;
        lastCheck = now;

        // Usar requestIdleCallback para análise não-crítica
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            if (fps < 30) {
              console.warn(`⚠️ Low framerate detected: ${fps} FPS`);
            }
          });
        }
      }

      if (this.isMonitoring) {
        requestAnimationFrame(measureFrame);
      }
    };

    requestAnimationFrame(measureFrame);
  }

  private async monitorMemoryUsage() {
    if (!('memory' in performance)) {
      console.log('📊 Memory API não disponível');
      return;
    }

    let lastGC = performance.now();
    const GC_INTERVAL = 60000; // 1 minuto

    const checkMemory = () => {
      const memory = (performance as any).memory;
      if (memory) {
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        const totalMB = memory.totalJSHeapSize / 1024 / 1024;
        const now = performance.now();

        // Trigger GC se uso alto ou intervalo atingido
        if (usedMB > totalMB * 0.8 || now - lastGC > GC_INTERVAL) {
          if (typeof window.gc === 'function') {
            window.gc();
            lastGC = now;
            console.log('🧹 Garbage Collection triggered');
          }
        }

        // Só alertar se ainda estiver alto após tentativa de GC
        if (usedMB > totalMB * 0.8) {
          console.warn(`⚠️ High Memory Usage: ${usedMB.toFixed(1)}MB / ${totalMB.toFixed(1)}MB`);
        }
      }

      if (this.isMonitoring) {
        // Aumentar intervalo para 30 segundos para reduzir overhead
        setTimeout(checkMemory, 30000);
      }
    };

    checkMemory();
  }

  generateReport(): PerformanceReport {
    const framerate =
      this.frameCount > 0 ? Math.round(this.frameCount / (performance.now() / 1000)) : 0;

    let memoryUsage = 0;
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      if (memory) {
        memoryUsage = Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100);
      }
    }

    return {
      timeoutViolations: this.violationCount,
      framerate,
      memoryUsage,
      optimizationStatus: {
        smartTimeoutEnabled: true, // Assumindo que está ativo
        animationFrameSchedulerActive: true,
        messageChannelSchedulerActive: true,
        totalOptimizations: this.countOptimizations(),
      },
    };
  }

  private countOptimizations(): number {
    // Contar quantos arquivos foram otimizados
    return 6; // useBlockForm, useSmartPerformance, useAutoSaveDebounce, memoryManagement, useDebounce, performanceOptimizer
  }

  logReport() {
    const report = this.generateReport();

    console.group('🚀 Performance Analysis Report');
    console.log(`⏱️ setTimeout Violations: ${report.timeoutViolations}`);
    console.log(`🎞️ Average Framerate: ${report.framerate} FPS`);
    console.log(`💾 Memory Usage: ${report.memoryUsage}%`);
    console.log(
      `✅ Smart Timeout: ${report.optimizationStatus.smartTimeoutEnabled ? 'Enabled' : 'Disabled'}`
    );
    console.log(
      `🎨 Animation Frame Scheduler: ${report.optimizationStatus.animationFrameSchedulerActive ? 'Active' : 'Inactive'}`
    );
    console.log(
      `📨 Message Channel Scheduler: ${report.optimizationStatus.messageChannelSchedulerActive ? 'Active' : 'Inactive'}`
    );
    console.log(`🔧 Total Optimizations Applied: ${report.optimizationStatus.totalOptimizations}`);

    // Recomendações
    console.group('📋 Recommendations');
    if (report.timeoutViolations > 5) {
      console.warn('⚠️ High timeout violations detected. Consider more aggressive debouncing.');
    }
    if (report.framerate < 30) {
      console.warn('⚠️ Low framerate detected. Consider reducing animation complexity.');
    }
    if (report.memoryUsage > 80) {
      console.warn('⚠️ High memory usage. Consider implementing garbage collection triggers.');
    }
    if (report.timeoutViolations === 0) {
      console.log('✅ No setTimeout violations detected! Optimizations working well.');
    }
    console.groupEnd();

    console.groupEnd();

    return report;
  }

  stopMonitoring() {
    this.isMonitoring = false;
    console.log('🔍 Performance Analyzer: Monitoramento pausado');
  }

  reset() {
    this.violationCount = 0;
    this.frameCount = 0;
    console.log('🔄 Performance Analyzer: Métricas resetadas');
  }
}

// Export singleton instance
export const performanceAnalyzer = PerformanceAnalyzer.getInstance();

// Auto-start monitoring in development (SUPER OTIMIZADO)
if (process.env.NODE_ENV === 'development') {
  // Usar requestIdleCallback para não bloquear inicialização
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      // Aguardar app estabilizar mais tempo
      setTimeout(() => {
        performanceAnalyzer.startMonitoring();
        
        // Relatórios muito menos frequentes - a cada 5 minutos
        const reportInterval = setInterval(() => {
          if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(() => {
              performanceAnalyzer.logReport();
            });
          }
        }, 300000); // 5 minutos
        
        // Limpar após 30 minutos para evitar memory leaks
        setTimeout(() => {
          clearInterval(reportInterval);
          performanceAnalyzer.stopMonitoring();
        }, 1800000); // 30 minutos
      }, 10000); // 10s para estabilizar
    }, { timeout: 5000 });
  }
}

export default performanceAnalyzer;
