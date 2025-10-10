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
import { FunnelContext } from '@/core/contexts/FunnelContext';

export class EnhancedFunnelService {
  private static instance: EnhancedFunnelService;
  private funnelService = FunnelUnifiedService.getInstance();
  private templateService = TemplateFunnelService.getInstance();
  private cache = new Map<string, UnifiedFunnelData>();

  private constructor() { }

  static getInstance(): EnhancedFunnelService {
    if (!this.instance) {
      this.instance = new EnhancedFunnelService();
    }
    return this.instance;
  }

  /**
   * Obtém funil com auto-criação baseada em template se necessário
   */
  async getFunnelWithFallback(
    funnelId: string,
    userId?: string,
    context: FunnelContext = FunnelContext.EDITOR
  ): Promise<UnifiedFunnelData | null> {
    console.log('🎯 EnhancedFunnelService: Getting funnel with fallback', funnelId);

    // Check cache first (por contexto)
    const cacheKey = `${context}:${funnelId}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      console.log('✅ Funnel found in cache:', funnelId);
      return cached;
    }

    try {
      // Tentar carregar funil existente
      let funnel = await this.funnelService.getFunnel(funnelId, userId);

      if (funnel) {
        console.log('✅ Funnel found in database:', funnelId);
        this.cache.set(cacheKey, funnel);
        return funnel;
      }

      // Se não existe e é um ID de template, criar automaticamente
      if (this.templateService.shouldCreateFromTemplate(funnelId)) {
        console.log('🔄 Auto-creating funnel from template:', funnelId);

        funnel = await this.templateService.createFunnelFromTemplate(funnelId);

        if (funnel) {
          console.log('✅ Funnel created from template:', funnelId);
          this.cache.set(cacheKey, funnel);
          return funnel;
        }
      }

      // Fallback: criar funil básico se não existe
      funnel = await this.createFallbackFunnel(funnelId, context);
      if (funnel) {
        this.cache.set(cacheKey, funnel);
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
  async createFallbackFunnel(funnelId: string, context: FunnelContext = FunnelContext.EDITOR): Promise<UnifiedFunnelData | null> {
    try {
      console.log('🔄 Creating fallback funnel:', funnelId);

      // 1) Criar funil base usando a API correta
      const created = await this.funnelService.createFunnel({
        name: `Funil ${funnelId}`,
        description: 'Funil criado automaticamente',
        category: 'outros',
        context,
        userId: 'anonymous',
        autoPublish: false
      });

      // 2) Montar dados padrão (settings/pages) e aplicar via update
      const defaultSettings = {
        theme: 'modern-elegant',
        totalSteps: 21,
        allowBackward: true,
        saveProgress: true
      };

      const defaultPages = Array.from({ length: 21 }, (_, index) => ({
        id: `${created.id}-step-${index + 1}`,
        funnel_id: created.id,
        page_type: 'question',
        page_order: index + 1,
        title: `Etapa ${index + 1}`,
        blocks: [],
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const updated = await this.funnelService.updateFunnel(created.id, {
        settings: defaultSettings,
        pages: defaultPages
      });

      console.log('✅ Fallback funnel created successfully:', updated.id);
      return updated;
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