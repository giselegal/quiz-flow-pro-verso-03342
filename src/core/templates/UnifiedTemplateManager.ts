/**
 * 🎯 UNIFIED TEMPLATE MANAGER
 * 
 * Gerenciador central que consolida todos os sistemas de templates:
 * - funnelTemplateService (Supabase + fallbacks)
 * - customTemplateService (templates personalizados)
 * - TemplateService (core/funnel/services)
 * - unifiedTemplatesRegistry (registry central)
 * 
 * OBJETIVO: Única fonte de verdade para templates
 */

import { TemplateRegistry, UnifiedTemplate, TEMPLATE_CATEGORIES } from '../../config/unifiedTemplatesRegistry';
import { funnelTemplateService } from '@/services/templates';
import { customTemplateService, CustomTemplate } from '../../services/customTemplateService';
import { templateService } from '../funnel/services/TemplateService';

// ============================================================================
// TIPOS UNIFICADOS
// ============================================================================

export interface UnifiedTemplateData {
  id: string;
  name: string;
  description: string;
  category: string;
  theme: string;
  stepCount: number;
  isOfficial: boolean;
  isCustom: boolean;
  usageCount: number;
  tags: string[];
  features: string[];
  conversionRate: string;
  image: string;
  source: 'registry' | 'supabase' | 'custom' | 'core';
  priority: number;
  createdAt: string;
  updatedAt: string;
  components?: any[];
  templateData?: any;
}

export interface TemplateSearchFilters {
  category?: string;
  isOfficial?: boolean;
  isCustom?: boolean;
  tags?: string[];
  sortBy?: 'name' | 'usageCount' | 'createdAt' | 'updatedAt';
  limit?: number;
}

export interface TemplateCreationOptions {
  name: string;
  description?: string;
  category: string;
  theme?: string;
  stepCount?: number;
  templateId?: string; // Para duplicar template existente
  customData?: any;
}

// ============================================================================
// UNIFIED TEMPLATE MANAGER
// ============================================================================

class UnifiedTemplateManager {
  private static instance: UnifiedTemplateManager;
  private cache: Map<string, UnifiedTemplateData> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutos
  private lastCacheUpdate = 0;

  private constructor() {
    console.log('🎯 UnifiedTemplateManager initialized');
  }

  public static getInstance(): UnifiedTemplateManager {
    if (!UnifiedTemplateManager.instance) {
      UnifiedTemplateManager.instance = new UnifiedTemplateManager();
    }
    return UnifiedTemplateManager.instance;
  }

  // ==========================================================================
  // CORE TEMPLATE OPERATIONS
  // ==========================================================================

  /**
   * Busca todos os templates disponíveis (todas as fontes)
   */
  async getAllTemplates(filters: TemplateSearchFilters = {}): Promise<UnifiedTemplateData[]> {
    console.log('🔍 UnifiedTemplateManager: Buscando todos os templates', filters);

    try {
      // 1. Registry unificado (prioridade máxima)
      const registryTemplates = this.getRegistryTemplates(filters);

      // 2. Templates customizados do usuário
      const customTemplates = await this.getCustomTemplates(filters);

      // 3. Templates do Supabase (com fallback)
      const supabaseTemplates = await this.getSupabaseTemplates(filters);

      // 4. Templates do core/funnel
      const coreTemplates = await this.getCoreTemplates(filters);

      // Consolidar e remover duplicatas (por ID)
      const allTemplates = [
        ...registryTemplates,
        ...customTemplates,
        ...supabaseTemplates,
        ...coreTemplates
      ];

      const uniqueTemplates = this.deduplicateTemplates(allTemplates);

      // Aplicar filtros e ordenação
      const filteredTemplates = this.applyFilters(uniqueTemplates, filters);

      console.log(`✅ UnifiedTemplateManager: ${filteredTemplates.length} templates encontrados`);
      return filteredTemplates;

    } catch (error) {
      console.error('❌ Erro ao buscar templates:', error);
      // Fallback: pelo menos retornar registry
      return this.getRegistryTemplates(filters);
    }
  }

  /**
   * Busca um template específico por ID
   */
  async getTemplateById(id: string): Promise<UnifiedTemplateData | null> {
    console.log('🔍 UnifiedTemplateManager: Buscando template por ID:', id);

    // 1. Verificar cache primeiro
    if (this.cache.has(id)) {
      const cached = this.cache.get(id)!;
      if (Date.now() - this.lastCacheUpdate < this.cacheTimeout) {
        console.log('💾 Cache hit para template:', id);
        return cached;
      }
    }

    try {
      // 2. Buscar em todas as fontes (ordem de prioridade)

      // Registry (maior prioridade)
      const registryTemplate = TemplateRegistry.getById(id);
      if (registryTemplate) {
        const unified = this.convertRegistryToUnified(registryTemplate);
        this.cache.set(id, unified);
        return unified;
      }

      // Custom templates
      const customTemplate = customTemplateService.getCustomTemplate(id);
      if (customTemplate) {
        const unified = this.convertCustomToUnified(customTemplate);
        this.cache.set(id, unified);
        return unified;
      }

      // Supabase templates
      const supabaseTemplate = await funnelTemplateService.getTemplate(id);
      if (supabaseTemplate) {
        const unified = this.convertSupabaseToUnified(supabaseTemplate);
        this.cache.set(id, unified);
        return unified;
      }

      // Core templates
      const coreTemplate = await templateService.getTemplate(id);
      if (coreTemplate) {
        const unified = this.convertCoreToUnified(coreTemplate);
        this.cache.set(id, unified);
        return unified;
      }

      console.log('⚠️ Template não encontrado:', id);
      return null;

    } catch (error) {
      console.error('❌ Erro ao buscar template por ID:', error);
      return null;
    }
  }

  /**
   * Cria um novo funil a partir de um template
   */
  async createFunnelFromTemplate(
    templateId: string,
    funnelName?: string,
    options: { userId?: string; context?: string } = {}
  ): Promise<string | null> {
    console.log('🚀 UnifiedTemplateManager: Criando funil do template:', templateId);

    try {
      const template = await this.getTemplateById(templateId);
      if (!template) {
        throw new Error(`Template não encontrado: ${templateId}`);
      }

      // Delegar para o serviço apropriado baseado na fonte
      let funnelId: string | null = null;

      switch (template.source) {
        case 'registry':
        case 'supabase':
          funnelId = await funnelTemplateService.createFunnelFromTemplate(
            templateId,
            funnelName || `${template.name} - Cópia`
          );
          break;

        case 'custom':
          // Para templates customizados, usar customTemplateService
          const customTemplate = customTemplateService.getCustomTemplate(templateId);
          if (customTemplate) {
            funnelId = await funnelTemplateService.createFunnelFromTemplate(
              templateId,
              funnelName || `${template.name} - Cópia`
            );
          }
          break;

        case 'core':
          // Para templates core, usar templateService
          funnelId = await this.createFunnelFromCoreTemplate(template, funnelName, options);
          break;

        default:
          throw new Error(`Tipo de template não suportado: ${template.source}`);
      }

      if (funnelId) {
        // Incrementar contador de uso
        this.incrementTemplateUsage(templateId);
        console.log(`✅ Funil criado com sucesso: ${funnelId}`);
      }

      return funnelId;

    } catch (error) {
      console.error('❌ Erro ao criar funil do template:', error);
      return null;
    }
  }

  /**
   * Cria um template personalizado
   */
  async createCustomTemplate(options: TemplateCreationOptions): Promise<string | null> {
    console.log('🎨 UnifiedTemplateManager: Criando template customizado:', options);

    try {
      let customTemplateId: string;

      if (options.templateId) {
        // Duplicar template existente
        const sourceTemplate = await this.getTemplateById(options.templateId);
        if (!sourceTemplate) {
          throw new Error(`Template fonte não encontrado: ${options.templateId}`);
        }

        customTemplateId = customTemplateService.duplicateAsCustomTemplate(
          sourceTemplate,
          {
            personalizedName: options.name,
            personalizedDescription: options.description
          },
          {
            createdBy: 'unified-manager'
          }
        );
      } else {
        // Criar template do zero (implementar se necessário)
        throw new Error('Criação de template do zero ainda não implementada');
      }

      // Limpar cache para refletir novo template
      this.clearCache();

      console.log(`✅ Template customizado criado: ${customTemplateId}`);
      return customTemplateId;

    } catch (error) {
      console.error('❌ Erro ao criar template customizado:', error);
      return null;
    }
  }

  /**
   * Remove um template personalizado
   */
  async deleteCustomTemplate(templateId: string): Promise<boolean> {
    console.log('🗑️ UnifiedTemplateManager: Removendo template customizado:', templateId);

    try {
      const success = customTemplateService.deleteCustomTemplate(templateId);

      if (success) {
        this.cache.delete(templateId);
        console.log(`✅ Template customizado removido: ${templateId}`);
      }

      return success;

    } catch (error) {
      console.error('❌ Erro ao remover template customizado:', error);
      return false;
    }
  }

  /**
   * Busca categorias disponíveis
   */
  getCategories(): typeof TEMPLATE_CATEGORIES {
    return TEMPLATE_CATEGORIES;
  }

  /**
   * Incrementa contador de uso do template
   */
  private incrementTemplateUsage(templateId: string): void {
    try {
      // Para templates customizados
      const customTemplate = customTemplateService.getCustomTemplate(templateId);
      if (customTemplate) {
        customTemplateService.recordTemplateUsage(templateId, 'custom');
        return;
      }

      // Para outros templates, apenas log (implementar se necessário)
      console.log(`📊 Uso incrementado para template: ${templateId}`);

    } catch (error) {
      console.error('❌ Erro ao incrementar uso do template:', error);
    }
  }

  // ==========================================================================
  // TEMPLATE SOURCE METHODS
  // ==========================================================================

  private getRegistryTemplates(_filters: TemplateSearchFilters): UnifiedTemplateData[] {
    const registryTemplates = TemplateRegistry.getAll();
    return registryTemplates.map(template => this.convertRegistryToUnified(template));
  }

  private async getCustomTemplates(_filters: TemplateSearchFilters): Promise<UnifiedTemplateData[]> {
    try {
      const customTemplates = customTemplateService.getCustomTemplates();
      return customTemplates.map(template => this.convertCustomToUnified(template));
    } catch (error) {
      console.error('⚠️ Erro ao buscar templates customizados:', error);
      return [];
    }
  }

  private async getSupabaseTemplates(_filters: TemplateSearchFilters): Promise<UnifiedTemplateData[]> {
    try {
      const supabaseTemplates = await funnelTemplateService.getTemplates();
      return supabaseTemplates.map(template => this.convertSupabaseToUnified(template));
    } catch (error) {
      console.error('⚠️ Erro ao buscar templates do Supabase:', error);
      return [];
    }
  }

  private async getCoreTemplates(filters: TemplateSearchFilters): Promise<UnifiedTemplateData[]> {
    try {
      const coreTemplates = await templateService.getTemplates(filters.category);
      return coreTemplates.map(template => this.convertCoreToUnified(template));
    } catch (error) {
      console.error('⚠️ Erro ao buscar templates do core:', error);
      return [];
    }
  }

  // ==========================================================================
  // CONVERSION METHODS
  // ==========================================================================

  private convertRegistryToUnified(template: UnifiedTemplate): UnifiedTemplateData {
    return {
      ...template,
      isCustom: false,
      source: 'registry' as const,
      priority: 1, // Maior prioridade
      components: undefined,
      templateData: undefined,
    };
  }

  private convertCustomToUnified(template: CustomTemplate): UnifiedTemplateData {
    return {
      id: template.id,
      name: template.name,
      description: template.description,
      category: template.category,
      theme: template.theme || 'default',
      stepCount: template.stepCount || 1,
      isOfficial: false,
      isCustom: true,
      usageCount: template.usageCount || 0,
      tags: template.tags || [],
      features: template.features || [],
      conversionRate: '0%',
      image: template.image || '',
      source: 'custom' as const,
      priority: 2,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt || template.createdAt,
      components: (template as any).components || undefined,
      templateData: (template as any).templateData || undefined,
    };
  }

  private convertSupabaseToUnified(template: any): UnifiedTemplateData {
    return {
      id: template.id,
      name: template.name,
      description: template.description || '',
      category: template.category || 'other',
      theme: template.theme || 'default',
      stepCount: template.stepCount || template.step_count || 1,
      isOfficial: template.isOfficial || false,
      isCustom: false,
      usageCount: template.usageCount || 0,
      tags: template.tags || [],
      features: template.features || [],
      conversionRate: template.conversionRate || '0%',
      image: template.image || '',
      source: 'supabase' as const,
      priority: 3,
      createdAt: template.createdAt || template.created_at || new Date().toISOString(),
      updatedAt: template.updatedAt || template.updated_at || new Date().toISOString(),
      components: template.components,
      templateData: template.templateData,
    };
  }

  private convertCoreToUnified(template: any): UnifiedTemplateData {
    return {
      id: template.id,
      name: template.name,
      description: template.description || '',
      category: template.category || 'other',
      theme: template.theme || 'default',
      stepCount: template.stepCount || 1,
      isOfficial: template.isOfficial || false,
      isCustom: false,
      usageCount: template.usageCount || 0,
      tags: template.tags || [],
      features: template.features || [],
      conversionRate: template.conversionRate || '0%',
      image: template.image || '',
      source: 'core' as const,
      priority: 4,
      createdAt: template.createdAt || new Date().toISOString(),
      updatedAt: template.updatedAt || new Date().toISOString(),
      components: template.components,
      templateData: template.templateData,
    };
  }

  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================

  private deduplicateTemplates(templates: UnifiedTemplateData[]): UnifiedTemplateData[] {
    const seen = new Map<string, UnifiedTemplateData>();

    for (const template of templates) {
      const existing = seen.get(template.id);
      if (!existing || template.priority < existing.priority) {
        seen.set(template.id, template);
      }
    }

    return Array.from(seen.values());
  }

  private applyFilters(templates: UnifiedTemplateData[], filters: TemplateSearchFilters): UnifiedTemplateData[] {
    let filtered = [...templates];

    // Filtro por categoria
    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    // Filtro por oficial
    if (filters.isOfficial !== undefined) {
      filtered = filtered.filter(t => t.isOfficial === filters.isOfficial);
    }

    // Filtro por customizado
    if (filters.isCustom !== undefined) {
      filtered = filtered.filter(t => t.isCustom === filters.isCustom);
    }

    // Filtro por tags
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(t =>
        filters.tags!.some(tag => t.tags.includes(tag))
      );
    }

    // Ordenação
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'usageCount':
            return b.usageCount - a.usageCount;
          case 'createdAt':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'updatedAt':
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          default:
            return 0;
        }
      });
    }

    // Limite
    if (filters.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
  }

  private async createFunnelFromCoreTemplate(
    template: UnifiedTemplateData,
    funnelName?: string,
    _options: { userId?: string; context?: string } = {}
  ): Promise<string | null> {
    // Implementação específica para templates do core
    // Por enquanto, delegar para funnelTemplateService
    return await funnelTemplateService.createFunnelFromTemplate(
      template.id,
      funnelName || `${template.name} - Cópia`
    );
  }

  private clearCache(): void {
    this.cache.clear();
    this.lastCacheUpdate = 0;
    console.log('🧹 Cache de templates limpo');
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const unifiedTemplateManager = UnifiedTemplateManager.getInstance();
export default unifiedTemplateManager;
