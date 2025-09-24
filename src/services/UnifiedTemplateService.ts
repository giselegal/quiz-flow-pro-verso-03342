// @ts-nocheck
import { Block, BlockType } from '@/types/editor';
import { QUIZ_STYLE_21_STEPS_TEMPLATE, getPersonalizedStepTemplate } from '@/templates/quiz21StepsComplete';
import { stepTemplates, QuestionParams, StrategicParams } from '@/templates/stepTemplates';
import { StorageService } from '@/services/core/StorageService';

/**
 * 🎯 UNIFIED TEMPLATE SERVICE - CONSOLIDAÇÃO ARQUITETURAL
 * 
 * FASE 2: Unifica múltiplos sistemas de templates em um único serviço:
 * ✅ Consolida quiz21StepsComplete.ts + stepTemplates.ts + templateService.ts
 * ✅ Cache inteligente com invalidação automática
 * ✅ Sistema de prioridades: Published > JSON > TypeScript > Fallback
 * ✅ Lazy loading e preload otimizado
 * ✅ Performance melhorada para 21 etapas
 */

export interface TemplateSource {
  priority: number;
  name: string;
  loader: (stepId: string) => Promise<Block[] | null>;
}

export interface UnifiedTemplateConfig {
  enableCache: boolean;
  enablePreload: boolean;
  cacheTimeout: number; // ms
  maxRetries: number;
  retryDelay: number; // ms
}

class UnifiedTemplateService {
  private cache = new Map<string, { blocks: Block[]; timestamp: number; source: string }>();
  private loading = new Set<string>();
  private publishPrefix = 'quiz_published_blocks_';

  private config: UnifiedTemplateConfig = {
    enableCache: true,
    enablePreload: true,
    cacheTimeout: 5 * 60 * 1000, // 5 minutes
    maxRetries: 3,
    retryDelay: 150
  };

  private sources: TemplateSource[] = [
    {
      priority: 1,
      name: 'published',
      loader: this.loadPublishedBlocks.bind(this)
    },
    {
      priority: 2,
      name: 'json-templates',
      loader: this.loadJsonTemplate.bind(this)
    },
    {
      priority: 3,
      name: 'typescript-templates',
      loader: this.loadTypescriptTemplate.bind(this)
    },
    {
      priority: 4,
      name: 'canonical-template',
      loader: this.loadCanonicalTemplate.bind(this)
    },
    {
      priority: 5,
      name: 'fallback',
      loader: this.loadFallbackTemplate.bind(this)
    }
  ];

  /**
   * 🎯 MÉTODO PRINCIPAL - Carrega blocos com sistema unificado
   */
  async loadStepBlocks(stepId: string, funnelId?: string): Promise<Block[]> {
    // 🆔 CACHE KEY que inclui funnelId para personalização
    const cacheKey = funnelId ? `${stepId}:${funnelId}` : stepId;

    // Evitar carregamento duplicado
    if (this.loading.has(cacheKey)) {
      console.log(`⏳ [UnifiedTemplate] ${cacheKey} já carregando, aguardando...`);

      // Wait for loading to complete (max 5s)
      const startTime = Date.now();
      while (this.loading.has(cacheKey) && (Date.now() - startTime < 5000)) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Verificar cache válido
    if (this.config.enableCache && this.isCacheValid(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      console.log(`📦 [UnifiedTemplate] ${cacheKey} cache hit (${cached.source}) - ${cached.blocks.length} blocos`);
      return cached.blocks;
    }

    this.loading.add(cacheKey);

    try {
      console.log(`🔄 [UnifiedTemplate] Carregando ${stepId}${funnelId ? ` para funil ${funnelId}` : ''}...`);

      // 🎯 PRIORIDADE 1: Se há funnelId, tentar template personalizado primeiro
      if (funnelId) {
        try {
          const personalizedBlocks = getPersonalizedStepTemplate(stepId, funnelId);
          if (personalizedBlocks && personalizedBlocks.length > 0) {
            console.log(`✅ [UnifiedTemplate] ${stepId} personalizado para funil ${funnelId} (${personalizedBlocks.length} blocos)`);

            // Cache do resultado personalizado
            if (this.config.enableCache) {
              this.cache.set(cacheKey, {
                blocks: personalizedBlocks,
                timestamp: Date.now(),
                source: 'personalized'
              });
            }

            return personalizedBlocks;
          }
        } catch (error) {
          console.warn(`⚠️ [UnifiedTemplate] Falha na personalização para ${stepId}, funil ${funnelId}:`, error);
        }
      }

      // Tentar cada fonte por prioridade (fallback para templates padrão)
      for (const source of this.sources) {
        try {
          const blocks = await source.loader(stepId);

          if (blocks && blocks.length > 0) {
            console.log(`✅ [UnifiedTemplate] ${stepId} carregado via ${source.name} (${blocks.length} blocos)`);

            // Cache successful result
            if (this.config.enableCache) {
              this.cache.set(cacheKey, {
                blocks,
                timestamp: Date.now(),
                source: source.name
              });
            }

            return blocks;
          }
        } catch (error) {
          console.warn(`⚠️ [UnifiedTemplate] Falha em ${source.name} para ${stepId}:`, error);
          continue;
        }
      }

      // Se chegou aqui, todas as fontes falharam
      console.error(`❌ [UnifiedTemplate] Todas as fontes falharam para ${stepId}`);
      return [];

    } finally {
      this.loading.delete(cacheKey);
    }
  }

  /**
   * 🔄 Cache Management
   */
  private isCacheValid(cacheKey: string): boolean {
    if (!this.cache.has(cacheKey)) return false;

    const cached = this.cache.get(cacheKey)!;
    const age = Date.now() - cached.timestamp;

    return age < this.config.cacheTimeout;
  }

  invalidateCache(cacheKey?: string): void {
    if (cacheKey) {
      this.cache.delete(cacheKey);
      console.log(`🗑️ [UnifiedTemplate] Cache invalidado: ${cacheKey}`);
    } else {
      this.cache.clear();
      console.log(`🗑️ [UnifiedTemplate] Cache limpo completamente`);
    }
  }

  /**
   * 📦 SOURCE 1: Published Blocks (localStorage)
   */
  private async loadPublishedBlocks(stepId: string): Promise<Block[] | null> {
    try {
      const key = this.publishPrefix + stepId;
      const data = StorageService.safeGetJSON(key) as any;

      const blocks = Array.isArray(data) ? data : data?.blocks;

      if (Array.isArray(blocks) && blocks.length > 0) {
        return blocks as Block[];
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * 📦 SOURCE 2: JSON Templates (public/templates/)
   */
  private async loadJsonTemplate(stepId: string): Promise<Block[] | null> {
    try {
      const stepNumber = parseInt(stepId.replace('step-', ''));

      // Tentar carregar template JSON específico
      const templatePath = `/templates/${stepId}-template.json`;
      const response = await fetch(templatePath);

      if (response.ok) {
        const templateData = await response.json();

        if (templateData.blocks && Array.isArray(templateData.blocks)) {
          return this.normalizeBlocks(templateData.blocks);
        }
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * 📦 SOURCE 3: TypeScript Templates (stepTemplates.ts)
   */
  private async loadTypescriptTemplate(stepId: string): Promise<Block[] | null> {
    try {
      const stepNumber = parseInt(stepId.replace('step-', ''));

      // Mapear etapas para templates TypeScript
      if (stepNumber === 1) {
        return this.normalizeBlocks(stepTemplates.intro);
      }

      if (stepNumber >= 2 && stepNumber <= 11) {
        const questionParams: QuestionParams = {
          questionNumber: stepNumber - 1,
          title: `PERGUNTA ${stepNumber - 1}`,
          subtitle: 'Selecione as opções que mais combinam com você',
          multiSelect: 3,
          variant: 'image'
        };
        return this.normalizeBlocks(stepTemplates.question(questionParams));
      }

      if (stepNumber === 12) {
        return this.normalizeBlocks(stepTemplates.transition);
      }

      if (stepNumber >= 13 && stepNumber <= 18) {
        const strategicParams: StrategicParams = {
          questionNumber: stepNumber - 12,
          title: `QUESTÃO ESTRATÉGICA ${stepNumber - 12}`,
          subtitle: 'Esta informação nos ajuda a personalizar sua experiência'
        };
        return this.normalizeBlocks(stepTemplates.strategic(strategicParams));
      }

      if (stepNumber === 19) {
        return this.normalizeBlocks(stepTemplates.transition);
      }

      if (stepNumber === 20) {
        return this.normalizeBlocks(stepTemplates.result);
      }

      if (stepNumber === 21) {
        return this.normalizeBlocks(stepTemplates.offer);
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * 📦 SOURCE 4: Canonical Template (quiz21StepsComplete.ts)
   */
  private async loadCanonicalTemplate(stepId: string): Promise<Block[] | null> {
    try {
      const templateBlocks = (QUIZ_STYLE_21_STEPS_TEMPLATE as any)[stepId];

      if (templateBlocks && Array.isArray(templateBlocks) && templateBlocks.length > 0) {
        return this.normalizeBlocks(templateBlocks);
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * 📦 SOURCE 5: Fallback Template (guaranteed)
   */
  private async loadFallbackTemplate(stepId: string): Promise<Block[]> {
    const stepNumber = parseInt(stepId.replace('step-', ''));

    const fallbackBlocks: Block[] = [
      {
        id: `${stepId}-fallback-header`,
        type: 'quiz-intro-header' as BlockType,
        order: 0,
        properties: {
          logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          logoWidth: '96',
          logoHeight: '96',
          progressValue: Math.min((stepNumber / 21) * 100, 100),
          progressTotal: 100,
          showProgress: true,
          containerWidth: 'full',
          spacing: 'small'
        },
        content: {
          logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          progressValue: Math.min((stepNumber / 21) * 100, 100)
        }
      },
      {
        id: `${stepId}-fallback-title`,
        type: 'text-inline' as BlockType,
        order: 1,
        properties: {
          content: `ETAPA ${stepNumber}`,
          fontSize: 'text-2xl',
          fontWeight: 'font-bold',
          textAlign: 'text-center',
          color: '#432818',
          containerWidth: 'full',
          spacing: 'small'
        },
        content: {
          content: `ETAPA ${stepNumber}`,
          fontSize: 'text-2xl',
          fontWeight: 'font-bold',
          textAlign: 'text-center',
          color: '#432818'
        }
      }
    ];

    // Adicionar blocos específicos baseado na etapa
    if (stepNumber === 1) {
      fallbackBlocks.push({
        id: `${stepId}-fallback-input`,
        type: 'form-input' as BlockType,
        order: 2,
        properties: {
          inputType: 'text',
          placeholder: 'Digite seu nome',
          label: 'Seu Nome',
          required: true,
          containerWidth: 'full',
          spacing: 'small'
        },
        content: {
          inputType: 'text',
          placeholder: 'Digite seu nome',
          label: 'Seu Nome',
          required: true
        }
      });
    } else if (stepNumber >= 2 && stepNumber <= 18) {
      fallbackBlocks.push({
        id: `${stepId}-fallback-options`,
        type: 'options-grid' as BlockType,
        order: 2,
        properties: {
          options: [
            { id: 'opt1', text: 'Opção 1', value: 'option1' },
            { id: 'opt2', text: 'Opção 2', value: 'option2' },
            { id: 'opt3', text: 'Opção 3', value: 'option3' },
            { id: 'opt4', text: 'Opção 4', value: 'option4' }
          ],
          layout: 'grid',
          columns: 2,
          containerWidth: 'full',
          spacing: 'small'
        },
        content: {
          options: [
            { id: 'opt1', text: 'Opção 1', value: 'option1' },
            { id: 'opt2', text: 'Opção 2', value: 'option2' },
            { id: 'opt3', text: 'Opção 3', value: 'option3' },
            { id: 'opt4', text: 'Opção 4', value: 'option4' }
          ]
        }
      });
    } else if (stepNumber === 20) {
      fallbackBlocks.push({
        id: `${stepId}-fallback-result`,
        type: 'result-header-inline' as BlockType,
        order: 2,
        properties: {
          title: 'Seu Resultado',
          subtitle: 'Resultado baseado nas suas respostas',
          showIcon: true,
          showPercentage: true,
          containerWidth: 'full',
          spacing: 'small'
        },
        content: {
          title: 'Seu Resultado',
          subtitle: 'Resultado baseado nas suas respostas'
        }
      });
    }

    return fallbackBlocks;
  }

  /**
   * 🔧 UTILITY: Normaliza blocos para formato padrão
   */
  private normalizeBlocks(rawBlocks: any[]): Block[] {
    return rawBlocks.map((block, index) => {
      const normalized: any = {
        id: block.id || `block-${Date.now()}-${index}`,
        type: block.type as BlockType,
        order: block.order ?? index,
        properties: block.properties || {},
        content: block.content || block.properties || {},
      };

      // ✅ Preservar filhos definidos em templates TypeScript/JSON (ex.: form-container)
      if (Array.isArray(block.children) && block.children.length > 0) {
        normalized.children = block.children;
        // Também espelhar em properties para maior compatibilidade
        if (!normalized.properties.children) {
          normalized.properties.children = block.children;
        }
      }

      return normalized;
    });
  }

  /**
   * 🚀 PRELOAD: Carrega templates comuns em background
   */
  async preloadCommonSteps(): Promise<void> {
    if (!this.config.enablePreload) return;

    console.log('🚀 [UnifiedTemplate] Iniciando preload otimizado...');

    // Preload apenas etapas críticas (1, 2, 20, 21)
    const criticalSteps = ['step-1', 'step-2', 'step-20', 'step-21'];

    const promises = criticalSteps.map(async (stepId) => {
      try {
        await this.loadStepBlocks(stepId);
      } catch (error) {
        console.warn(`⚠️ [UnifiedTemplate] Preload falhou para ${stepId}:`, error);
      }
    });

    await Promise.allSettled(promises);

    console.log(`✅ [UnifiedTemplate] Preload concluído para ${criticalSteps.length} etapas críticas`);
  }

  /**
   * 🔄 PUBLISHING: Sistema de publicação local
   */
  publishStep(stepId: string, blocks: Block[]): void {
    try {
      const key = this.publishPrefix + stepId;
      const payload = { blocks, updatedAt: new Date().toISOString() };

      StorageService.safeSetJSON(key, payload);
      this.invalidateCache(stepId);

      // Atualizar cache imediatamente
      if (blocks.length > 0) {
        this.cache.set(stepId, {
          blocks,
          timestamp: Date.now(),
          source: 'published'
        });
      }

      // Notificar sistema
      try {
        window.dispatchEvent(new CustomEvent('quiz-template-updated', { detail: { stepId } }));
      } catch { }

      console.log(`💾 [UnifiedTemplate] ${stepId} publicado (${blocks.length} blocos)`);
    } catch (error) {
      console.error(`❌ [UnifiedTemplate] Falha ao publicar ${stepId}:`, error);
    }
  }

  unpublishStep(stepId: string): void {
    try {
      const key = this.publishPrefix + stepId;
      StorageService.safeRemove(key);
      this.invalidateCache(stepId);

      // Notificar sistema
      try {
        window.dispatchEvent(new CustomEvent('quiz-template-updated', { detail: { stepId } }));
      } catch { }

      console.log(`🗑️ [UnifiedTemplate] ${stepId} despublicado`);
    } catch (error) {
      console.error(`❌ [UnifiedTemplate] Falha ao despublicar ${stepId}:`, error);
    }
  }

  /**
   * 📊 STATUS: Info sobre cache e sources
   */
  getStatus() {
    return {
      cacheSize: this.cache.size,
      loading: Array.from(this.loading),
      sources: this.sources.map(s => ({ name: s.name, priority: s.priority })),
      config: this.config
    };
  }

  /**
   * ⚙️ CONFIGURATION: Atualizar configuração
   */
  updateConfig(newConfig: Partial<UnifiedTemplateConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ [UnifiedTemplate] Config atualizada:', this.config);
  }
}

// Singleton instance
export const unifiedTemplateService = new UnifiedTemplateService();

// Backward compatibility exports
export const templateManager = {
  loadStepBlocks: (stepId: string) => unifiedTemplateService.loadStepBlocks(stepId),
  publishStep: (stepId: string, blocks: Block[]) => unifiedTemplateService.publishStep(stepId, blocks),
  unpublishStep: (stepId: string) => unifiedTemplateService.unpublishStep(stepId),
  clearCache: () => unifiedTemplateService.invalidateCache(),
  preloadCommonTemplates: () => unifiedTemplateService.preloadCommonSteps(),
  reloadTemplate: (stepId: string) => {
    unifiedTemplateService.invalidateCache(stepId);
    return unifiedTemplateService.loadStepBlocks(stepId);
  },
  getAvailableTemplates: () => Array.from({ length: 21 }, (_, i) => `step-${i + 1}`),
  hasTemplate: (stepId: string) => {
    const stepNumber = parseInt(stepId.replace('step-', ''));
    return stepNumber >= 1 && stepNumber <= 21;
  }
};

export default unifiedTemplateService;