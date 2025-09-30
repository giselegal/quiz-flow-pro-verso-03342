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
import { Block } from '@/types/editor';
import { quizEstiloLoaderGateway } from '@/domain/quiz/gateway';
import type { CanonicalQuizDefinition, CanonicalStep } from '@/domain/quiz/gateway/QuizEstiloLoaderGateway';

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
      // Agora health check baseado no gateway canônico
      const canonical = await quizEstiloLoaderGateway.load();
      return !!canonical?.steps?.length;
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
    // Integração direta: se o templateId solicitado for o canônico (ou pattern step-*), construímos via gateway.
    if (templateId === 'quiz21StepsComplete' || templateId === 'quiz-estilo' || /^step-\d+$/.test(templateId)) {
      try {
        const canonical = await quizEstiloLoaderGateway.load();
        return this.convertCanonicalDefinition(canonical);
      } catch (e) {
        console.warn('⚠️ Falha ao carregar definição canônica, fallback métodos tradicionais', e);
      }
    }

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
  private async loadFromTypeScript(_templateId: string): Promise<FullTemplate | null> {
    // Desativado: anteriormente carregava QUIZ_STYLE_21_STEPS_TEMPLATE.
    return null;
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

  private convertLegacyTemplate(_legacyTemplate: any, templateId: string): FullTemplate {
    // Mantido apenas para compatibilidade de assinatura; não mais usado.
    return this.generateFallback(templateId);
  }

  /**
   * 🔄 Converte definição canônica (gateway) em FullTemplate para consumidores antigos.
   */
  private convertCanonicalDefinition(def: CanonicalQuizDefinition): FullTemplate {
    return {
      id: def.templateId,
      name: 'Quiz Estilo (Canônico)',
      description: `Fonte: ${def.source}`,
      category: 'quiz',
      version: def.version,
      stepCount: def.steps.length,
      tags: ['quiz', 'canonical'],
      createdAt: new Date(),
      updatedAt: new Date(),
      isOfficial: true,
      usageCount: 0,
      steps: def.steps.map((s, index) => this.mapCanonicalStep(s, index)),
      globalConfig: {
        theme: { primaryColor: '#007bff' },
        navigation: { allowBack: true },
        analytics: { enabled: true }
      }
    };
  }

  private mapCanonicalStep(step: CanonicalStep, index: number): TemplateStep {
    return {
      stepNumber: index + 1,
      blocks: this.generateBlocksFromCanonical(step),
      metadata: {
        type: step.kind,
        validation: { requiredSelections: step.requiredSelections },
        behavior: { autoAdvance: step.autoAdvance }
      }
    };
  }

  private generateBlocksFromCanonical(step: CanonicalStep): Block[] {
    // Reuso parcial da lógica de mapStepToBlocks sem importar diretamente (evitar acoplamento cíclico aqui).
    const baseId = step.id;
    switch (step.kind) {
      case 'intro':
        return [{ id: `${baseId}-intro-heading`, type: 'heading', content: {}, order: 0, properties: { text: step.title || 'Bem-vinda!', level: 1 } } as any];
      case 'question':
      case 'strategic-question':
        return [{ id: `${baseId}-question`, type: 'quiz-question-inline', content: {}, order: 0, properties: { title: step.title || 'Pergunta', options: step.options || [], requiredSelections: step.requiredSelections, autoAdvance: step.autoAdvance } } as any];
      case 'transition':
        return [{ id: `${baseId}-transition`, type: 'quiz-transition', content: {}, order: 0, properties: { label: step.title || 'Transição' } } as any];
      case 'result':
        return [{ id: `${baseId}-result`, type: 'quiz-result', content: {}, order: 0, properties: { title: step.title || 'Resultados' } } as any];
      case 'offer':
        return [{ id: `${baseId}-offer`, type: 'quiz-offer', content: {}, order: 0, properties: { title: step.title || 'Oferta' } } as any];
      default:
        return [{ id: `${baseId}-fallback`, type: 'heading', content: {}, order: 0, properties: { text: step.title || baseId } } as any];
    }
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
    console.log('🚀 Preloading canonical quiz steps...');
    const startTime = performance.now();
    try {
      const canonical = await quizEstiloLoaderGateway.load();
      // Carregar representação full (para compat) apenas uma vez
      await this.getTemplate(canonical.templateId);
      console.log(`✅ Canonical template cached: ${canonical.templateId}`);
    } catch (err) {
      console.warn('⚠️ Failed canonical preload', err);
    }
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