/**
 * 🚧 STUB SERVICE - EnhancedUnifiedDataService
 * 
 * Serviço temporário para desbloquear build.
 * Este arquivo foi removido mas ainda é referenciado em muitos lugares.
 * TODO: Refatorar todos os imports ou implementar o serviço completo.
 */

export interface RealTimeMetrics {
  totalFunnels: number;
  activeFunnels: number;
  totalViews: number;
  conversions: number;
  conversionRate: number;
  avgCompletionTime: number;
  topPerformingFunnels: Array<{
    id: string;
    name: string;
    conversionRate: number;
    views: number;
  }>;
}

export class EnhancedUnifiedDataService {
  /**
   * Retorna métricas simuladas em tempo real
   * TODO: Implementar integração com dados reais do Supabase
   */
  static async getRealTimeMetrics(): Promise<RealTimeMetrics> {
    console.warn('⚠️ EnhancedUnifiedDataService.getRealTimeMetrics() está usando dados simulados');
    
    return {
      totalFunnels: 0,
      activeFunnels: 0,
      totalViews: 0,
      conversions: 0,
      conversionRate: 0,
      avgCompletionTime: 0,
      topPerformingFunnels: [],
    };
  }
}
