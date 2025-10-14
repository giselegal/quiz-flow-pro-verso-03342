/**
 * 🎯 CONSOLIDATED TEMPLATE SERVICE - ÚNICA FONTE DE TEMPLATES
 * 
 * Substitui e unifica:
 * - UnifiedTemplateService
 * - HybridTemplateService  
 * - TemplateFunnelService
 * - templateService
 * - stepTemplateService
 */

import { BaseUnifiedService, ServiceConfig } from './UnifiedServiceManager';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { Block } from '@/types/editor';

// ============================================================================
// INTERFACES
// ============================================================================

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  stepCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isOfficial: boolean;
  usageCount: number;
}

export interface TemplateStep {
  stepNumber: number;
  blocks: Block[];
  metadata: {
    type: string;
    validation?: any;
    behavior?: any;
  };
}

export interface FullTemplate extends TemplateMetadata {
  steps: TemplateStep[];
  globalConfig: {
    theme: any;
    navigation: any;
    analytics: any;
  };
}

// ============================================================================
// CONSOLIDATED TEMPLATE SERVICE
// ============================================================================

export class ConsolidatedTemplateService extends BaseUnifiedService {
  private static readonly CONFIG: ServiceConfig = {
    name: 'ConsolidatedTemplateService',
    priority: 1,
    cacheTTL: 10 * 60 * 1000, // 10 minutos
    retryAttempts: 3,
    timeout: 5000
  };

  private loadedTemplates = new Map<string, FullTemplate>();
  private preloadingPromises = new Map<string, Promise<FullTemplate | null>>();

  constructor() {
    super(ConsolidatedTemplateService.CONFIG);
  }

  getName(): string {
    return 'ConsolidatedTemplateService';
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Verificar se consegue carregar template básico
      const testTemplate = await this.getTemplate('quiz21StepsComplete');
      return testTemplate !== null;
    } catch {
      return false;
    }
  }

  /**
   * 🎯 GET TEMPLATE - Método principal unificado
   */
  async getTemplate(templateId: string): Promise<FullTemplate | null> {
    return this.executeWithMetrics(async () => {
      // 1. Verificar cache
      const cached = this.getCached<FullTemplate>(templateId);
      if (cached) {
        console.log(`⚡ Template cache hit: ${templateId}`);
        return cached;
      }

      // 2. Verificar se já está carregando
      if (this.preloadingPromises.has(templateId)) {
        return await this.preloadingPromises.get(templateId)!;
      }

      // 3. Iniciar carregamento
      const loadPromise = this.loadTemplateInternal(templateId);
      this.preloadingPromises.set(templateId, loadPromise);

      try {
        const template = await loadPromise;
        if (template) {
          this.setCached(templateId, template);
          this.loadedTemplates.set(templateId, template);
        }
        return template;
      } finally {
        this.preloadingPromises.delete(templateId);
      }
    }, 'getTemplate');
  }

  /**
   * 🔄 LOAD TEMPLATE INTERNAL - Carregamento com fallbacks
   */
  private async loadTemplateInternal(templateId: string): Promise<FullTemplate | null> {
    const loadMethods = [
      () => this.loadFromRegistry(templateId),
      () => this.loadFromTypeScript(templateId),
      () => this.loadFromJSON(templateId),
      () => this.generateFallback(templateId)
    ];

    for (const loadMethod of loadMethods) {
      try {
        const template = await loadMethod();
        if (template) {
          console.log(`✅ Template carregado: ${templateId}`);
          return template;
        }
      } catch (error) {
        console.warn(`⚠️ Método de carregamento falhou para ${templateId}:`, error);
      }
    }

    console.error(`❌ Falha ao carregar template: ${templateId}`);
    return null;
  }

  /**
   * 📋 LOAD FROM REGISTRY
   */
  private async loadFromRegistry(templateId: string): Promise<FullTemplate | null> {
    try {
      const { loadFullTemplate } = await import('@/templates/registry');
      const registryTemplate = await loadFullTemplate(templateId);
      if (registryTemplate) {
        // Convert registry template to our format
        return this.convertRegistryTemplate(registryTemplate, templateId);
      }
      return null;
    } catch (error) {
      console.warn('Registry load failed:', error);
      return null;
    }
  }

  /**
   * 📋 LOAD FROM TYPESCRIPT
   */
  private async loadFromTypeScript(templateId: string): Promise<FullTemplate | null> {
    try {
      if (templateId === 'quiz21StepsComplete') {
        return this.convertLegacyTemplate(QUIZ_STYLE_21_STEPS_TEMPLATE, templateId);
      }
      return null;
    } catch (error) {
      console.warn('TypeScript load failed:', error);
      return null;
    }
  }

  /**
   * 📋 LOAD FROM JSON
   */
  private async loadFromJSON(templateId: string): Promise<FullTemplate | null> {
    try {
      // Tentar carregar JSON específico
      const response = await fetch(`/templates/${templateId}.json`);
      if (response.ok) {
        const jsonData = await response.json();
        return this.convertJSONTemplate(jsonData, templateId);
      }
      return null;
    } catch (error) {
      console.warn('JSON load failed:', error);
      return null;
    }
  }

  /**
   * 🎨 GENERATE FALLBACK
   */
  private generateFallback(templateId: string): FullTemplate {
    const stepNumber = this.extractStepNumber(templateId);

    return {
      id: templateId,
      name: `Template ${templateId}`,
      description: `Template gerado automaticamente`,
      category: 'generated',
      version: '1.0.0',
      stepCount: 1,
      tags: ['generated', 'fallback'],
      createdAt: new Date(),
      updatedAt: new Date(),
      isOfficial: false,
      usageCount: 0,
      steps: [{
        stepNumber,
        blocks: this.generateDefaultBlocks(stepNumber),
        metadata: {
          type: 'fallback',
          validation: { required: false },
          behavior: { autoAdvance: false }
        }
      }],
      globalConfig: {
        theme: { primaryColor: '#007bff' },
        navigation: { allowBack: true },
        analytics: { enabled: false }
      }
    };
  }

  /**
   * 🧱 GENERATE DEFAULT BLOCKS
   */
  private generateDefaultBlocks(stepNumber: number): Block[] {
    const baseContent = { text: '', placeholder: '' };

    switch (stepNumber) {
      case 1:
        return [
          {
            id: 'intro-1',
            type: 'text',
            content: baseContent,
            order: 0,
            properties: { text: 'Bem-vindo!' }
          },
          {
            id: 'name-input-1',
            type: 'form-input',
            content: baseContent,
            order: 1,
            properties: { placeholder: 'Seu nome' }
          },
          {
            id: 'start-btn-1',
            type: 'button',
            content: baseContent,
            order: 2,
            properties: { text: 'Começar' }
          }
        ];
      case 20:
        return [
          {
            id: 'result-header-20',
            type: 'text',
            content: baseContent,
            order: 0,
            properties: { text: 'Seu Resultado' }
          },
          {
            id: 'style-reveal-20',
            type: 'result-display',
            content: baseContent,
            order: 1,
            properties: {}
          },
          {
            id: 'offer-20',
            type: 'button',
            content: baseContent,
            order: 2,
            properties: {}
          }
        ];
      case 21:
        return [
          {
            id: 'sales-hero-21',
            type: 'text',
            content: baseContent,
            order: 0,
            properties: { text: 'Oferta Especial' }
          },
          {
            id: 'timer-21',
            type: 'countdown-inline',
            content: baseContent,
            order: 1,
            properties: {}
          },
          {
            id: 'cta-21',
            type: 'button',
            content: baseContent,
            order: 2,
            properties: { text: 'Garantir Agora' }
          }
        ];
      default:
        return [
          {
            id: `question-${stepNumber}`,
            type: 'text',
            content: baseContent,
            order: 0,
            properties: { text: `Pergunta ${stepNumber}` }
          },
          {
            id: `options-${stepNumber}`,
            type: 'options-grid',
            content: baseContent,
            order: 1,
            properties: {}
          },
          {
            id: `next-${stepNumber}`,
            type: 'button',
            content: baseContent,
            order: 2,
            properties: { text: 'Continuar' }
          }
        ];
    }
  }

  /**
   * 🔄 CONVERSION METHODS
   */
  private convertRegistryTemplate(registryTemplate: any, templateId: string): FullTemplate {
    return {
      id: templateId,
      name: registryTemplate.name || templateId,
      description: registryTemplate.description || '',
      category: registryTemplate.category || 'registry',
      version: registryTemplate.version || '1.0.0',
      stepCount: registryTemplate.stepCount || 1,
      tags: registryTemplate.tags || [],
      createdAt: registryTemplate.createdAt || new Date(),
      updatedAt: registryTemplate.updatedAt || new Date(),
      isOfficial: registryTemplate.isOfficial || false,
      usageCount: registryTemplate.usageCount || 0,
      steps: registryTemplate.steps || [],
      globalConfig: registryTemplate.globalConfig || {
        theme: { primaryColor: '#007bff' },
        navigation: { allowBack: true },
        analytics: { enabled: false }
      }
    };
  }

  private convertLegacyTemplate(legacyTemplate: any, templateId: string): FullTemplate {
    return {
      id: templateId,
      name: legacyTemplate.name || templateId,
      description: legacyTemplate.description || '',
      category: 'quiz',
      version: '1.0.0',
      stepCount: legacyTemplate.pages?.length || 21,
      tags: ['quiz', 'legacy'],
      createdAt: new Date(),
      updatedAt: new Date(),
      isOfficial: true,
      usageCount: 0,
      steps: legacyTemplate.pages?.map((page: any, index: number) => ({
        stepNumber: index + 1,
        blocks: page.blocks || [],
        metadata: {
          type: page.type || 'step',
          validation: page.validation,
          behavior: page.behavior
        }
      })) || [],
      globalConfig: legacyTemplate.config || {
        theme: { primaryColor: '#007bff' },
        navigation: { allowBack: true },
        analytics: { enabled: true }
      }
    };
  }

  private convertJSONTemplate(jsonData: any, templateId: string): FullTemplate {
    return {
      id: templateId,
      name: jsonData.name || templateId,
      description: jsonData.description || '',
      category: jsonData.category || 'custom',
      version: jsonData.version || '1.0.0',
      stepCount: jsonData.steps?.length || 1,
      tags: jsonData.tags || [],
      createdAt: new Date(jsonData.createdAt) || new Date(),
      updatedAt: new Date(jsonData.updatedAt) || new Date(),
      isOfficial: jsonData.isOfficial || false,
      usageCount: jsonData.usageCount || 0,
      steps: jsonData.steps || [],
      globalConfig: jsonData.globalConfig || {}
    };
  }

  /**
   * 🔍 UTILITY METHODS
   */
  private extractStepNumber(templateId: string): number {
    const match = templateId.match(/step-?(\d+)/i);
    return match ? parseInt(match[1], 10) : 1;
  }

  /**
   * 🎯 PUBLIC API METHODS
   */
  async getStepBlocks(stepId: string): Promise<Block[]> {
    const template = await this.getTemplate(stepId);
    if (!template) return [];

    const stepNumber = this.extractStepNumber(stepId);
    const step = template.steps.find(s => s.stepNumber === stepNumber);
    return step?.blocks || [];
  }

  async preloadCriticalTemplates(): Promise<void> {
    const criticalTemplates = [
      'quiz21StepsComplete',
      'step-1', 'step-2', 'step-12', 'step-20', 'step-21'
    ];

    console.log('🚀 Preloading critical templates...');
    const startTime = performance.now();

    const preloadPromises = criticalTemplates.map(async (templateId) => {
      try {
        await this.getTemplate(templateId);
        console.log(`✅ Preloaded: ${templateId}`);
      } catch (error) {
        console.warn(`⚠️ Failed to preload ${templateId}:`, error);
      }
    });

    await Promise.allSettled(preloadPromises);

    const duration = performance.now() - startTime;
    console.log(`🎯 Preload completed in ${duration.toFixed(2)}ms`);
  }

  /**
   * 📊 GET CACHE STATS
   */
  getCacheStats() {
    const hitRate = this.loadedTemplates.size > 0 ?
      ((this.loadedTemplates.size / (this.loadedTemplates.size + this.preloadingPromises.size)) * 100).toFixed(1) : '0';

    return {
      loaded: this.loadedTemplates.size,
      preloading: this.preloadingPromises.size,
      hitRate: `${hitRate}%`,
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  private estimateMemoryUsage(): string {
    const templates = Array.from(this.loadedTemplates.values());
    const totalSize = templates.reduce((acc, template) => {
      return acc + JSON.stringify(template).length;
    }, 0);
    return `${(totalSize / 1024).toFixed(2)} KB`;
  }
}

// ============================================================================
// EXPORT SINGLETON
// ============================================================================

export const consolidatedTemplateService = new ConsolidatedTemplateService();

// Auto-preload críticos
if (typeof window !== 'undefined') {
  setTimeout(() => {
    consolidatedTemplateService.preloadCriticalTemplates().catch(console.error);
  }, 200);
}

export default consolidatedTemplateService;