// @ts-nocheck
// Importações
import { localPublishStore } from '@/services/localPublishStore';
import { templateService } from '../services/templateService';
import type { Block } from '../types/editor';

/**
 * Template Manager - Gerencia carregamento de templates JSON
 */
export class TemplateManager {
  private static cache = new Map<string, Block[]>();

  /**
   * Carrega blocos de uma etapa usando o templateService INTEGRADO com JSON Step01
   */
  static async loadStepBlocks(stepId: string): Promise<Block[]> {
    try {
      // 0) Preferir versão PUBLICADA local (se existir)
      try {
        const published = localPublishStore.getBlocks(stepId);
        if (published && published.length > 0) {
          console.log(`📣 Using PUBLISHED blocks for ${stepId} (${published.length})`);
          this.cache.set(stepId, published);
          return published;
        }
      } catch (e) {
        console.warn('TemplateManager: published read failed, will fallback.', e);
      }

      // Verifica cache primeiro - APENAS se tiver blocos válidos
      if (this.cache.has(stepId)) {
        const cachedBlocks = this.cache.get(stepId)!;
        if (cachedBlocks.length > 0) {
          console.log(`📦 Template ${stepId} carregado do cache (${cachedBlocks.length} blocos)`);
          return cachedBlocks;
        }
        // Se cache tem array vazio, remove do cache
        console.warn(`🗑️ Removendo cache vazio para ${stepId}`);
        this.cache.delete(stepId);
      }

      const stepNumber = parseInt(stepId.replace('step-', ''));
      console.log(`🔄 Carregando template para etapa ${stepNumber}`);

      // ===== SISTEMA INTEGRADO: JSON + TYPESCRIPT =====

      if (stepNumber === 1) {
        console.log('🎯 Step01: Sistema JSON integrado ativo');
      } else {
        console.log(`🔧 Step${stepNumber}: Sistema TypeScript tradicional`);
      }

      // Usar o templateService que já integra JSON para Step01
      let template = null;
      const maxRetries = 3;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          template = await templateService.getTemplateByStep(stepNumber);

          // Se template válido com blocos, break
          if (template && template.blocks && template.blocks.length > 0) {
            console.log(
              `✅ Template carregado na tentativa ${attempt}: ${template.blocks.length} blocos`
            );
            console.log(`🎯 Sistema usado: ${stepNumber === 1 ? 'JSON Step01' : 'TypeScript'}`);
            break;
          }

          // Se template está carregando ou vazio, retry
          if (
            template &&
            (template.__loading || !template.blocks || template.blocks.length === 0)
          ) {
            console.log(
              `🔄 Template etapa ${stepNumber} ainda carregando, tentativa ${attempt}/${maxRetries}`
            );
            if (attempt < maxRetries) {
              // Backoff: 150ms, 300ms, 450ms
              await new Promise(resolve => setTimeout(resolve, 150 * attempt));
              continue;
            }
          }

          // Se chegou aqui, template não carregou
          template = null;
          break;
        } catch (error) {
          console.warn(
            `⚠️ Erro na tentativa ${attempt}/${maxRetries} para etapa ${stepNumber}:`,
            error
          );
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 150 * attempt));
            continue;
          }
          template = null;
        }
      }

      // Se template não carregou após retries, usar fallback robusto
      if (!template || !template.blocks || template.blocks.length === 0) {
        console.warn(
          `⚠️ Template falhou após ${maxRetries} tentativas, usando fallback robusto para etapa ${stepNumber}`
        );
        const fallbackBlocks = await this.getEnhancedFallbackBlocks(stepId);

        // NUNCA cachear array vazio - só cachear se tiver blocos
        if (fallbackBlocks.length > 0) {
          this.cache.set(stepId, fallbackBlocks);
          console.log(`🛡️ Fallback aplicado com ${fallbackBlocks.length} blocos (fonte: fallback)`);
        }

        return fallbackBlocks;
      }

      // Converte os blocos do template para o formato Block
      const blocks = templateService.convertTemplateBlocksToEditorBlocks(template.blocks);

      // APENAS cachear se tiver blocos válidos
      if (blocks.length > 0) {
        this.cache.set(stepId, blocks);
        console.log(
          `✅ Template carregado com sucesso: ${blocks.length} blocos (fonte: public JSON)`
        );
      } else {
        console.warn(`⚠️ Template convertido resultou em array vazio, não será cacheado`);
      }

      return blocks.length > 0 ? blocks : await this.getEnhancedFallbackBlocks(stepId);
    } catch (error) {
      console.error(`❌ Erro crítico ao carregar template para ${stepId}:`, error);
      return await this.getEnhancedFallbackBlocks(stepId);
    }
  }

  /**
   * Retorna blocos de fallback robustos usando FixedTemplateService se disponível
   */
  private static async getEnhancedFallbackBlocks(stepId: string): Promise<Block[]> {
    const stepNumber = parseInt(stepId.replace('step-', ''));

    try {
      // Tentar usar FixedTemplateService se disponível
      const { default: stepTemplateService } = await import('../services/stepTemplateService');

      if (stepTemplateService && typeof stepTemplateService.getStepTemplate === 'function') {
        console.log(`🛡️ Usando stepTemplateService para fallback da etapa ${stepNumber}`);
        const fixedTemplate = stepTemplateService.getStepTemplate(stepNumber);

        if (fixedTemplate && fixedTemplate.length > 0) {
          // Converter EditorBlock[] para Block[]
          const convertedBlocks: Block[] = fixedTemplate.map((block, index) => ({
            id: block.id,
            type: block.type as any,
            content: block.properties || {},
            order: index,
          }));

          console.log(
            `✅ Fallback robusto aplicado: ${convertedBlocks.length} blocos (fonte: FixedTemplateService)`
          );
          return convertedBlocks;
        }
      }
    } catch (error) {
      console.warn(`⚠️ FixedTemplateService não disponível, usando fallback básico:`, error);
    }

    // Fallback básico se FixedTemplateService não funcionar
    return this.getBasicFallbackBlocks(stepId);
  }

  /**
   * Fallback básico garantido
   */
  private static getBasicFallbackBlocks(stepId: string): Block[] {
    const stepNumber = parseInt(stepId.replace('step-', ''));

    const fallbackBlocks: Block[] = [
      {
        id: `${stepId}-fallback-header`,
        type: 'quiz-intro-header',
        order: 0,
        properties: {
          logoUrl:
            'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          logoWidth: 96,
          logoHeight: 96,
          progressValue: Math.min((stepNumber / 21) * 100, 100),
          progressTotal: 100,
          showProgress: true,
          containerWidth: 'full',
          spacing: 'small',
        },
        content: {
          logoUrl:
            'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          progressValue: Math.min((stepNumber / 21) * 100, 100),
        },
      },
      {
        id: `${stepId}-fallback-title`,
        type: 'text-inline',
        order: 1,
        properties: {
          content: stepNumber === 1 ? 'QUIZ DE ESTILO PESSOAL' : `ETAPA ${stepNumber}`,
          fontSize: 'text-2xl',
          fontWeight: 'font-bold',
          textAlign: 'text-center',
          color: '#432818',
          containerWidth: 'full',
          spacing: 'small',
        },
        content: {
          content: stepNumber === 1 ? 'QUIZ DE ESTILO PESSOAL' : `ETAPA ${stepNumber}`,
          fontSize: 'text-2xl',
          fontWeight: 'font-bold',
          textAlign: 'text-center',
          color: '#432818',
        },
      },
      {
        id: `${stepId}-fallback-description`,
        type: 'text-inline',
        order: 2,
        properties: {
          content:
            stepNumber === 1
              ? 'Sistema carregando template...'
              : `Template da etapa ${stepNumber} carregando...`,
          fontSize: 'text-base',
          textAlign: 'text-center',
          color: '#6b7280',
          containerWidth: 'full',
          spacing: 'small',
        },
        content: {
          content:
            stepNumber === 1
              ? 'Sistema carregando template...'
              : `Template da etapa ${stepNumber} carregando...`,
        },
      },
    ];

    // Para etapa 1, adicionar input básico
    if (stepNumber === 1) {
      fallbackBlocks.push({
        id: `${stepId}-fallback-input`,
        type: 'form-input',
        order: 3,
        properties: {
          inputType: 'text',
          placeholder: 'Digite seu nome aqui',
          label: 'Seu Nome',
          required: true,
          containerWidth: 'full',
          spacing: 'small',
        },
        content: {
          inputType: 'text',
          placeholder: 'Digite seu nome aqui',
          label: 'Seu Nome',
          required: true,
        },
      });
    }

    console.log(
      `🛡️ Fallback básico gerado: ${fallbackBlocks.length} blocos (fonte: básico garantido)`
    );
    return fallbackBlocks;
  }

  /**
   * Pre-carrega templates mais usados - NUNCA cacheia arrays vazios
   */
  static async preloadCommonTemplates(): Promise<void> {
    const steps = Array.from({ length: 21 }, (_, i) => i + 1);

    console.log('🚀 Pre-carregando templates (ignorando arrays vazios)...');

    const promises = steps.map(async stepNumber => {
      const stepId = `step-${stepNumber}`;
      try {
        const blocks = await this.loadStepBlocks(stepId);

        // Só considerar sucesso se tiver blocos válidos
        if (blocks.length > 0) {
          console.log(`✅ Template ${stepId} pre-carregado: ${blocks.length} blocos`);
        } else {
          console.warn(`⚠️ Template ${stepId} resultou em array vazio - não cacheado`);
        }
      } catch (error) {
        console.warn(`⚠️ Falha ao pre-carregar ${stepId}:`, error);
      }
    });

    await Promise.allSettled(promises);

    const loadedCount = this.cache.size;
    console.log(`✅ Pre-carregamento concluído: ${loadedCount}/21 templates válidos em cache`);
  }

  /**
   * Recarrega um template
   */
  static async reloadTemplate(stepId: string): Promise<Block[]> {
    this.cache.delete(stepId);
    return this.loadStepBlocks(stepId);
  }

  /**
   * Lista todos os templates disponíveis
   */
  static getAvailableTemplates(): string[] {
    return Array.from({ length: 21 }, (_, i) => `step-${i + 1}`);
  }

  /**
   * Verifica se um template está disponível
   */
  static hasTemplate(stepId: string): boolean {
    const stepNumber = parseInt(stepId.replace('step-', ''));
    return stepNumber >= 1 && stepNumber <= 21;
  }

  /**
   * Limpa todo o cache
   */
  static clearCache(): void {
    this.cache.clear();
  }
}
