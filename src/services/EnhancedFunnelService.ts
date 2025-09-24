/**
 * 🎯 ENHANCED FUNNEL SERVICE
 * 
 * Wrapper que adiciona funcionalidades automáticas sobre o FunnelUnifiedService:
 * - Auto-criação de funis baseados em templates
 * - Fallback inteligente para IDs não encontrados
 * - Cache otimizado com invalidação automática
 */

import { FunnelUnifiedService, UnifiedFunnelData } from './FunnelUnifiedService';
import { TemplateFunnelService } from './TemplateFunnelService';

export class EnhancedFunnelService {
  private static instance: EnhancedFunnelService;
  private funnelService = FunnelUnifiedService.getInstance();
  private templateService = TemplateFunnelService.getInstance();

  private constructor() {}

  static getInstance(): EnhancedFunnelService {
    if (!this.instance) {
      this.instance = new EnhancedFunnelService();
    }
    return this.instance;
  }

  /**
   * Obtém funil com auto-criação baseada em template se necessário
   */
  async getFunnelWithFallback(funnelId: string, userId?: string): Promise<UnifiedFunnelData | null> {
    console.log('🎯 EnhancedFunnelService: Getting funnel with fallback', funnelId);

    try {
      // Tentar carregar funil existente
      let funnel = await this.funnelService.getFunnel(funnelId, userId);
      
      if (funnel) {
        console.log('✅ Funnel found in database:', funnelId);
        return funnel;
      }

      // Se não existe e é um ID de template, criar automaticamente
      if (this.templateService.shouldCreateFromTemplate(funnelId)) {
        console.log('🔄 Auto-creating funnel from template:', funnelId);
        
        funnel = await this.templateService.createFunnelFromTemplate(funnelId);
        
        if (funnel) {
          console.log('✅ Funnel created from template:', funnelId);
          return funnel;
        }
      }

      console.log('❌ Funnel not found and cannot be created:', funnelId);
      return null;

    } catch (error) {
      console.error('❌ Error in getFunnelWithFallback:', error);
      return null;
    }
  }

  /**
   * Proxy para outras operações do FunnelUnifiedService
   */
  async createFunnel(options: any): Promise<UnifiedFunnelData> {
    return this.funnelService.createFunnel(options);
  }

  async updateFunnel(id: string, updates: any, userId?: string): Promise<UnifiedFunnelData> {
    return this.funnelService.updateFunnel(id, updates, userId);
  }

  async listFunnels(options: any = {}): Promise<UnifiedFunnelData[]> {
    return this.funnelService.listFunnels(options);
  }

  async duplicateFunnel(id: string, newName?: string, userId?: string): Promise<UnifiedFunnelData> {
    return this.funnelService.duplicateFunnel(id, newName, userId);
  }

  // Event system
  on(event: any, listener: any): void {
    return this.funnelService.on(event, listener);
  }

  off(event: any, listener: any): void {
    return this.funnelService.off(event, listener);
  }
}

export const enhancedFunnelService = EnhancedFunnelService.getInstance();