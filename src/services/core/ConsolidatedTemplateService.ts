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
import { appLogger } from '@/lib/utils/appLogger';
import { blockRegistry } from '@/core/registry/UnifiedBlockRegistry';
import { processTemplate } from '@/services/TemplateProcessor';
import type { DynamicTemplate } from '@/types/dynamic-template';

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
    timeout: 5000,
  };

  private loadedTemplates = new Map<string, FullTemplate>();
  private preloadingPromises = new Map<string, Promise<FullTemplate | null>>();
  private processedCache = new Map<string, any>();

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
        appLogger.info(`⚡ Template cache hit: ${templateId}`);
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
      // ✅ PRIORIDADE 1: Templates individuais v3.2 com variáveis dinâmicas
      () => this.loadFromJSONV32(templateId),
      // ✅ PRIORIDADE 2: Master JSON v3.0 (fallback legado)
      () => this.loadFromMasterJSON(templateId),
      // PRIORIDADE 3: Templates v3.1 em /templates/blocks/
      () => this.loadFromJSON(templateId),
      // PRIORIDADE 4: Registry consolidado
      () => this.loadFromRegistry(templateId),
      // PRIORIDADE 5: TypeScript legado
      () => this.loadFromTypeScript(templateId),
      // PRIORIDADE 6: Gerar fallback sintético (último recurso)
      () => this.generateFallback(templateId),
    ];

    for (const loadMethod of loadMethods) {
      try {
        const template = await loadMethod();
        if (template) {
          appLogger.info(`✅ Template carregado: ${templateId}`);
          return template;
        }
      } catch (error) {
        appLogger.warn(`⚠️ Método de carregamento falhou para ${templateId}:`, { data: [error] });
      }
    }

    appLogger.error(`❌ Falha ao carregar template: ${templateId}`);
    return null;
  }

  /**
   * 📋 LOAD FROM REGISTRY
   */
  private async loadFromRegistry(templateId: string): Promise<FullTemplate | null> {
    try {
      // Os IDs no formato step-XX não fazem parte do templates/registry.
      // Evitar tentativa de carregar para não poluir o console com warnings.
      if (/^step-\d+$/i.test(templateId)) {
        return null;
      }
      const { loadFullTemplate } = await import('@/templates/registry');
      const registryTemplate = await loadFullTemplate(templateId);
      if (registryTemplate) {
        // Convert registry template to our format
        return this.convertRegistryTemplate(registryTemplate, templateId);
      }
      return null;
    } catch (error) {
      appLogger.warn('Registry load failed:', { data: [error] });
      return null;
    }
  }

  /**
   * 📋 LOAD FROM TYPESCRIPT
   */
  private async loadFromTypeScript(templateId: string): Promise<FullTemplate | null> {
    try {
      // Caso 1: template completo identificado por quiz21StepsComplete
      if (templateId === 'quiz21StepsComplete') {
        // Dynamic import para evitar incluir o template TS no bundle principal
        const mod = await import('@/templates/quiz21StepsComplete');
        const QUIZ_STYLE_21_STEPS_TEMPLATE = (mod as any).QUIZ_STYLE_21_STEPS_TEMPLATE;
        return this.convertLegacyTemplate(QUIZ_STYLE_21_STEPS_TEMPLATE, templateId);
      }

      // Caso 2: pedido diretamente por uma etapa específica (ex.: step-02)
      // Nessa situação, retornamos um FullTemplate sintético contendo apenas aquela etapa,
      // utilizando os blocos presentes no QUIZ_STYLE_21_STEPS_TEMPLATE.
      const stepMatch = templateId.match(/^step-(\d{1,2})$/i);
      if (stepMatch) {
        const stepNum = parseInt(stepMatch[1], 10);
        const normalized = `step-${String(stepNum).padStart(2, '0')}`;
        // Dynamic import para evitar incluir o template TS no bundle principal
        const mod = await import('@/templates/quiz21StepsComplete');
        const QUIZ_STYLE_21_STEPS_TEMPLATE = (mod as any).QUIZ_STYLE_21_STEPS_TEMPLATE;
        const blocks = QUIZ_STYLE_21_STEPS_TEMPLATE[normalized as keyof typeof QUIZ_STYLE_21_STEPS_TEMPLATE];

        if (Array.isArray(blocks) && blocks.length > 0) {
          const full: FullTemplate = {
            id: templateId,
            name: `Template ${templateId}`,
            description: 'Template gerado a partir do TS canônico por etapa',
            category: 'quiz',
            version: '1.0.0',
            stepCount: 1,
            tags: ['quiz', 'ts', 'by-step'],
            createdAt: new Date(),
            updatedAt: new Date(),
            isOfficial: true,
            usageCount: 0,
            steps: [
              {
                stepNumber: stepNum,
                blocks: blocks as unknown as Block[],
                metadata: { type: 'step' },
              },
            ],
            globalConfig: {
              theme: { primaryColor: '#007bff' },
              navigation: { allowBack: true },
              analytics: { enabled: true },
            },
          };
          return full;
        }
      }
      return null;
    } catch (error) {
      appLogger.warn('TypeScript load failed:', { data: [error] });
      return null;
    }
  }

  /**
   * 📋 LOAD FROM JSON
   */
  private async loadFromJSON(templateId: string): Promise<FullTemplate | null> {
    try {
      const base: string = (import.meta as any)?.env?.BASE_URL || '/';
      const baseTrimmed = base.replace(/\/$/, '');
      // Normalizar o templateId para o formato com padding (step-01, step-02, etc.)
      let normalizedId = templateId;
      const stepMatch = templateId.match(/^step-(\d+)$/);
      if (stepMatch) {
        const stepNum = stepMatch[1].padStart(2, '0');
        normalizedId = `step-${stepNum}`;
      }

      // Ordem de preferência:
      // 1) blocos v3.1 em /templates/blocks/step-XX.json
      let response = await fetch(`${baseTrimmed}/templates/blocks/${normalizedId}.json`, { cache: 'no-store' });
      if (response.ok) {
        const jsonData = await response.json();
        return this.convertJSONTemplate(jsonData, templateId);
      }

      // 2) v3 sections com sufixo -v3
      response = await fetch(`${baseTrimmed}/templates/${normalizedId}-v3.json`, { cache: 'no-store' });
      if (response.ok) {
        const jsonData = await response.json();
        return this.convertJSONTemplate(jsonData, templateId);
      }

      // Fallbacks: tentar sem o sufixo -v3, priorizando id normalizado (com padding)
      // 1) normalized (ex.: step-01.json)
      const fallbackNormalized = await fetch(`${baseTrimmed}/templates/${normalizedId}.json`, { cache: 'no-store' });
      if (fallbackNormalized.ok) {
        const jsonData = await fallbackNormalized.json();
        return this.convertJSONTemplate(jsonData, templateId);
      }
      // 2) original (ex.: step-1.json)
      const fallbackOriginal = await fetch(`${baseTrimmed}/templates/${templateId}.json`, { cache: 'no-store' });
      if (fallbackOriginal.ok) {
        const jsonData = await fallbackOriginal.json();
        return this.convertJSONTemplate(jsonData, templateId);
      }

      return null;
    } catch (error) {
      appLogger.warn('JSON load failed:', { data: [error] });
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
      description: 'Template gerado automaticamente',
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
          behavior: { autoAdvance: false },
        },
      }],
      globalConfig: {
        theme: { primaryColor: '#007bff' },
        navigation: { allowBack: true },
        analytics: { enabled: false },
      },
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
            properties: { text: 'Bem-vindo!' },
          },
          {
            id: 'name-input-1',
            type: 'form-input',
            content: baseContent,
            order: 1,
            properties: { placeholder: 'Seu nome' },
          },
          {
            id: 'start-btn-1',
            type: 'button',
            content: baseContent,
            order: 2,
            properties: { text: 'Começar' },
          },
        ];
      case 20:
        return [
          {
            id: 'result-header-20',
            type: 'text',
            content: baseContent,
            order: 0,
            properties: { text: 'Seu Resultado' },
          },
          {
            id: 'style-reveal-20',
            type: 'result-display',
            content: baseContent,
            order: 1,
            properties: {},
          },
          {
            id: 'offer-20',
            type: 'button',
            content: baseContent,
            order: 2,
            properties: {},
          },
        ];
      case 21:
        return [
          {
            id: 'sales-hero-21',
            type: 'text',
            content: baseContent,
            order: 0,
            properties: { text: 'Oferta Especial' },
          },
          {
            id: 'timer-21',
            type: 'countdown-inline',
            content: baseContent,
            order: 1,
            properties: {},
          },
          {
            id: 'cta-21',
            type: 'button',
            content: baseContent,
            order: 2,
            properties: { text: 'Garantir Agora' },
          },
        ];
      default:
        return [
          {
            id: `question-${stepNumber}`,
            type: 'text',
            content: baseContent,
            order: 0,
            properties: { text: `Pergunta ${stepNumber}` },
          },
          {
            id: `options-${stepNumber}`,
            type: 'options-grid',
            content: baseContent,
            order: 1,
            properties: {},
          },
          {
            id: `next-${stepNumber}`,
            type: 'button',
            content: baseContent,
            order: 2,
            properties: { text: 'Continuar' },
          },
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
        analytics: { enabled: false },
      },
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
          behavior: page.behavior,
        },
      })) || [],
      globalConfig: legacyTemplate.config || {
        theme: { primaryColor: '#007bff' },
        navigation: { allowBack: true },
        analytics: { enabled: true },
      },
    };
  }

  private convertJSONTemplate(jsonData: any, templateId: string): FullTemplate {
    // ✅ PROCESSA TEMPLATES DINÂMICOS (v3.2+)
    let processedData = jsonData;
    
    if (jsonData.templateVersion === '3.2' && jsonData.blocks) {
      appLogger.info(`🔄 Processando template dinâmico: ${templateId}`);
      
      const cached = this.processedCache.get(templateId);
      if (cached) {
        processedData = cached;
      } else {
        const result = processTemplate(jsonData as DynamicTemplate);
        
        if (result.success && result.template) {
          processedData = result.template;
          this.processedCache.set(templateId, processedData);
          appLogger.info(`✅ Template processado: ${result.stats?.variablesReplaced} variáveis substituídas`);
          
          if (result.warnings && result.warnings.length > 0) {
            appLogger.warn(`⚠️ Avisos ao processar ${templateId}:`, { warnings: result.warnings });
          }
        } else {
          appLogger.error(`❌ Erro ao processar template dinâmico ${templateId}:`, new Error(result.error || 'Erro desconhecido'));
        }
      }
    }
    
    const full: FullTemplate = {
      id: templateId,
      name: processedData.name || templateId,
      description: processedData.description || '',
      category: processedData.category || 'custom',
      version: processedData.version || '1.0.0',
      stepCount: processedData.steps?.length || 1,
      tags: processedData.tags || [],
      createdAt: new Date(processedData.createdAt) || new Date(),
      updatedAt: new Date(processedData.updatedAt) || new Date(),
      isOfficial: processedData.isOfficial || false,
      usageCount: processedData.usageCount || 0,
      steps: processedData.steps || [],
      globalConfig: processedData.globalConfig || {},
    };

    try {
      const types = new Set<string>();
      for (const s of full.steps) {
        for (const b of s.blocks || []) {
          if (b && typeof (b as any).type === 'string') types.add(String((b as any).type));
        }
      }
      const unknown = Array.from(types).filter(t => !blockRegistry.has(t));
      if (unknown.length > 0) {
        appLogger.warn('Tipos de bloco não registrados detectados', { data: [unknown] });
      } else {
        appLogger.info('Todos os tipos de bloco estão registrados', { data: [Array.from(types).slice(0, 20)] });
      }
    } catch {}

    return full;
  }

  /**
   * 🔍 UTILITY METHODS
   */
  private extractStepNumber(templateId: string): number {
    const match = templateId.match(/step-?(\d+)/i);
    return match ? parseInt(match[1], 10) : 1;
  }

  /**
   * 🔄 Normalizar ID de step (aceita 1, '1', 'step-1', 'step-01')
   * Retorna formato padded: 'step-01', 'step-02', etc.
   */
  private normalizeStepId(templateId: string): string {
    // Extrair número
    const match = templateId.match(/(\d{1,2})/);
    if (!match) return templateId;
    
    const num = parseInt(match[1], 10);
    return `step-${String(num).padStart(2, '0')}`;
  }

  /**
   * 📋 LOAD FROM JSON V3.2 - Prioridade 1: Templates individuais v3.2
   * Busca: /templates/step-XX-v3.json (com suporte a variáveis dinâmicas)
   */
  private async loadFromJSONV32(templateId: string): Promise<FullTemplate | null> {
    try {
      const base: string = (import.meta as any)?.env?.BASE_URL || '/';
      const baseTrimmed = base.replace(/\/$/, '');
      const stepId = this.normalizeStepId(templateId);

      // Tentar carregar JSON v3.2 individual com variáveis dinâmicas
      // Nota: Arquivos em /public/ são servidos na raiz pelo Vite
      const jsonPath = `${baseTrimmed}/templates/${stepId}-v3.json`;
      const response = await fetch(jsonPath, { cache: 'no-store' });
      
      if (response.ok) {
        const jsonData = await response.json();
        
        // Verificar se é v3.2+ e processar variáveis dinâmicas {{theme.*}}
        if (jsonData.templateVersion && 
            (jsonData.templateVersion === '3.2' || jsonData.templateVersion === '3.1')) {
          appLogger.info(`✨ Template v${jsonData.templateVersion} carregado: ${stepId}`);
          // TODO: Adicionar processamento de variáveis dinâmicas quando disponível
          // jsonData = await processTemplate(jsonData);
        }
        
        return this.convertJSONTemplate(jsonData, templateId);
      }

      return null;
    } catch (error) {
      appLogger.warn('JSON v3.2 load failed:', { data: [error] });
      return null;
    }
  }

  /**
   * 📋 LOAD FROM MASTER JSON - Prioridade 2: Fallback para master JSON v3.0
   * Busca: /templates/quiz21-complete.json (master file legado)
   */
  private async loadFromMasterJSON(templateId: string): Promise<FullTemplate | null> {
    try {
      const base: string = (import.meta as any)?.env?.BASE_URL || '/';
      const baseTrimmed = base.replace(/\/$/, '');
      const stepId = this.normalizeStepId(templateId);

      // Tentar carregar do master JSON v3.0 (fallback)
      const masterPath = `${baseTrimmed}/templates/quiz21-complete.json`;
      const response = await fetch(masterPath, { cache: 'no-store' });
      
      if (response.ok) {
        const masterData = await response.json();
        
        // Extrair step específico do master JSON
        const stepData = masterData.steps?.[stepId];
        if (stepData) {
          appLogger.info(`📦 Template carregado do master JSON: ${stepId}`);
          // Criar estrutura compatível com FullTemplate
          const template = {
            ...masterData,
            steps: masterData.steps ? Object.entries(masterData.steps).map(([id, step]: [string, any]) => ({
              ...step,
              stepId: id,
            })) : []
          };
          return this.convertJSONTemplate(template, templateId);
        }
      }

      return null;
    } catch (error) {
      appLogger.warn('Master JSON load failed:', { data: [error] });
      return null;
    }
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
      'step-1', 'step-2', 'step-12', 'step-20',
    ];

    appLogger.info('🚀 Preloading critical templates...');
    const startTime = performance.now();

    const preloadPromises = criticalTemplates.map(async (templateId) => {
      try {
        await this.getTemplate(templateId);
        appLogger.info(`✅ Preloaded: ${templateId}`);
      } catch (error) {
        appLogger.warn(`⚠️ Failed to preload ${templateId}:`, { data: [error] });
      }
    });

    await Promise.allSettled(preloadPromises);

    const duration = performance.now() - startTime;
    appLogger.info(`🎯 Preload completed in ${duration.toFixed(2)}ms`);
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
      memoryUsage: this.estimateMemoryUsage(),
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
