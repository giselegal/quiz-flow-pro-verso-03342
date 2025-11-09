/**
 * 🚧 STUB SERVICE - UnifiedDataService
 * 
 * Serviço temporário para desbloquear build.
 * TODO: Implementar integração completa com Supabase.
 */

export interface UnifiedFunnel {
  id: string;
  name: string;
  status?: string;
  [key: string]: any;
}

export interface DashboardMetrics {
  totalFunnels: number;
  activeFunnels: number;
  totalViews: number;
  conversions: number;
}

export class UnifiedDataService {
  private static cache: Map<string, any> = new Map();

  static async saveFunnel(funnelData: Partial<UnifiedFunnel>): Promise<UnifiedFunnel> {
    console.warn('⚠️ UnifiedDataService.saveFunnel() stub called');
    return { id: funnelData.id || 'stub-id', name: funnelData.name || 'Stub Funnel', ...funnelData };
  }

  static async getFunnels(): Promise<UnifiedFunnel[]> {
    console.warn('⚠️ UnifiedDataService.getFunnels() stub called');
    return [];
  }

  static async deleteFunnel(funnelId: string): Promise<boolean> {
    console.warn('⚠️ UnifiedDataService.deleteFunnel() stub called');
    return true;
  }

  static async getDashboardMetrics(): Promise<DashboardMetrics> {
    console.warn('⚠️ UnifiedDataService.getDashboardMetrics() stub called');
    return {
      totalFunnels: 0,
      activeFunnels: 0,
      totalViews: 0,
      conversions: 0,
    };
  }

  static clearAllCache(): void {
    this.cache.clear();
  }
}
