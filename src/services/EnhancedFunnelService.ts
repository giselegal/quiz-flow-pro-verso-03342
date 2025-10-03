/**
 * 🎯 ENHANCED FUNNEL SERVICE - FASE 1 & 7: FALLBACK INTELIGENTE
 * 
 * Wrapper que adiciona funcionalidades automáticas sobre o FunnelUnifiedService:
 * - Auto-criação de funis baseados em templates
 * - Fallback inteligente para IDs não encontrados
 * - Cache otimizado com invalidação automática
 * - Sistema de templates robusto
 */

import { FunnelUnifiedService, UnifiedFunnelData } from './FunnelUnifiedService';
import { TemplateFunnelService } from './TemplateFunnelService';

export class EnhancedFunnelService {
  private static instance: EnhancedFunnelService;
  private funnelService = FunnelUnifiedService.getInstance();
  private templateService = TemplateFunnelService.getInstance();
  private cache = new Map<string, UnifiedFunnelData>();

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

    // Check cache first
    const cached = this.cache.get(funnelId);
    if (cached) {
      console.log('✅ Funnel found in cache:', funnelId);
      return cached;
    }

    try {
      // Tentar carregar funil existente
      let funnel = await this.funnelService.getFunnel(funnelId, userId);
      
      if (funnel) {
        console.log('✅ Funnel found in database:', funnelId);
        this.cache.set(funnelId, funnel);
        return funnel;
      }

      // Se não existe e é um ID de template, criar automaticamente
      if (this.templateService.shouldCreateFromTemplate(funnelId)) {
        console.log('🔄 Auto-creating funnel from template:', funnelId);
        
        funnel = await this.templateService.createFunnelFromTemplate(funnelId);
        
        if (funnel) {
          console.log('✅ Funnel created from template:', funnelId);
          this.cache.set(funnelId, funnel);
          return funnel;
        }
      }

      // Fallback: criar funil básico se não existe
      funnel = await this.createFallbackFunnel(funnelId);
      if (funnel) {
        this.cache.set(funnelId, funnel);
      }

      return funnel;
    } catch (error) {
      console.error('❌ Error in getFunnelWithFallback:', error);
      
      // Em caso de erro, tentar criar fallback
      const fallback = await this.createFallbackFunnel(funnelId);
      if (fallback) {
        this.cache.set(funnelId, fallback);
      }
      
      return fallback;
    }
  }

  /**
   * FASE 1: Criar funil fallback quando não existe
   */
  async createFallbackFunnel(funnelId: string): Promise<UnifiedFunnelData | null> {
    try {
      console.log('🔄 Creating fallback funnel:', funnelId);

      const fallbackFunnel: UnifiedFunnelData = {
        id: funnelId,
        name: `Funil ${funnelId}`,
        description: 'Funil criado automaticamente',
        userId: 'anonymous',
        context: {} as any,
        isPublished: false,
        version: 1,
        settings: {
          theme: 'modern-elegant',
          totalSteps: 21,
          allowBackward: true,
          saveProgress: true
        },
        pages: Array.from({ length: 21 }, (_, index) => ({
          id: `${funnelId}-step-${index + 1}`,
          funnel_id: funnelId,
          page_type: 'question',
          page_order: index + 1,
          title: `Etapa ${index + 1}`,
          blocks: [],
          metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save fallback to database
      await this.funnelService.createFunnel(fallbackFunnel);
      
      console.log('✅ Fallback funnel created successfully:', funnelId);
      return fallbackFunnel;
    } catch (error) {
      console.error('❌ Error creating fallback funnel:', error);
      return null;
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Update cache entry
   */
  updateCache(funnelId: string, funnel: UnifiedFunnelData): void {
    this.cache.set(funnelId, funnel);
  }
}

export const enhancedFunnelService = EnhancedFunnelService.getInstance();