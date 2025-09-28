/**
 * ⚡ PERFORMANCE MONITOR - Real-time monitoring
 */

export class PerformanceMonitor {
  private static metrics = {
    cacheHits: 0,
    cacheMisses: 0,
    apiCalls: 0,
    renderTime: 0
  };
  
  static recordCacheHit(): void {
    this.metrics.cacheHits++;
    console.log('💾 Cache hit - Total hits:', this.metrics.cacheHits);
  }
  
  static recordCacheMiss(): void {
    this.metrics.cacheMisses++;
    console.log('💾 Cache miss - Total misses:', this.metrics.cacheMisses);
  }
  
  static recordApiCall(): void {
    this.metrics.apiCalls++;
    console.log('🌐 API call - Total calls:', this.metrics.apiCalls);
  }
  
  static getStats() {
    const hitRate = this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) * 100;
    return {
      ...this.metrics,
      hitRate: isNaN(hitRate) ? 0 : hitRate.toFixed(1) + '%'
    };
  }
}