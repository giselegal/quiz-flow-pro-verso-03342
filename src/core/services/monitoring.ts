/**
 * 📈 Canonical Services Monitoring
 * Coleta de métricas simples de adoção e uso dos serviços canônicos.
 */

export class CanonicalServicesMonitor {
  private static calls = 0;
  private static legacyCalls = 0;
  private static registry: Array<{ service: string; method: string; at: number }> = [];

  static trackUsage(service: string, method: string) {
    this.calls++;
    this.registry.push({ service, method, at: Date.now() });
    // Hook para integrar analytics no futuro
    if (typeof window !== 'undefined') {
      (window as any).__canonicalMonitor = {
        calls: this.calls,
        legacyCalls: this.legacyCalls,
        registry: this.registry.slice(-100),
      };
    }
    // Log leve (pode ser desligado pelo consumidor)
    // console.log(`[CANONICAL] ${service}.${method}`);
  }

  static trackLegacyBridge(service: string, method: string) {
    this.legacyCalls++;
    this.trackUsage(`${service  }(legacy)`, method);
  }

  static getAdoptionRate(): number {
    const total = this.calls + this.legacyCalls;
    if (total === 0) return 0;
    // % de chamadas canônicas vs totais
    return Math.round((this.calls / total) * 100);
  }

  /** Retorna estatísticas agregadas de uso para dashboards/devtools */
  static getStats() {
    const totalCanonical = this.calls;
    const totalLegacy = this.legacyCalls;
    const adoptionRate = this.getAdoptionRate();
    const recent = this.registry.slice(-50);
    return { totalCanonical, totalLegacy, adoptionRate, recent };
  }
}
