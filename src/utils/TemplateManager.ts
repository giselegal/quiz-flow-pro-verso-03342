// @ts-nocheck
// Importações
import { templateService } from '../services/templateService';
import type { Block } from '../types/editor';

/**
 * Template Manager - Gerencia carregamento de templates JSON
 */
export class TemplateManager {
  private static cache = new Map<string, Block[]>();

  /**
   * Carrega blocos de uma etapa usando o templateService
   */
  static async loadStepBlocks(stepId: string): Promise<Block[]> {
    try {
      // Verifica cache primeiro
      if (this.cache.has(stepId)) {
        console.log(`📦 Template ${stepId} carregado do cache`);
        return this.cache.get(stepId)!;
      }

      const stepNumber = parseInt(stepId.replace('step-', ''));
      console.log(`🔄 Carregando template para etapa ${stepNumber} via templateService`);

      // Carrega o template usando o templateService
      const template = await templateService.getTemplateByStep(stepNumber);

      if (!template) {
        console.warn(`⚠️ Template não encontrado para etapa ${stepNumber}`);
        return this.getFallbackBlocks(stepId);
      }

      // Converte os blocos do template para o formato Block
      const blocks = templateService.convertTemplateBlocksToEditorBlocks(template.blocks);

      // Armazena no cache
      this.cache.set(stepId, blocks);

      console.log(`✅ Template carregado: ${blocks.length} blocos`);
      return blocks;
    } catch (error) {
      console.error(`❌ Erro ao carregar template para ${stepId}:`, error);
      return this.getFallbackBlocks(stepId);
    }
  }

  /**
   * Retorna blocos de fallback
   */
  private static getFallbackBlocks(stepId: string): Block[] {
    const stepNumber = parseInt(stepId.replace('step-', ''));

    return [
      {
        id: `${stepId}-generic-title`,
        type: 'text-inline',
        order: 0,
        properties: {
          content: `Etapa ${stepNumber}`,
          fontSize: 'text-2xl',
          fontWeight: 'font-bold',
          textAlign: 'text-center',
          color: '#374151',
        },
        content: {
          content: `Etapa ${stepNumber}`,
          fontSize: 'text-2xl',
          fontWeight: 'font-bold',
          textAlign: 'text-center',
          color: '#374151',
        },
      },
      {
        id: `${stepId}-generic-description`,
        type: 'text-inline',
        order: 1,
        properties: {
          content: 'Template em desenvolvimento. Em breve!',
          fontSize: 'text-lg',
          textAlign: 'text-center',
          color: '#6b7280',
        },
        content: {
          content: 'Template em desenvolvimento. Em breve!',
          fontSize: 'text-lg',
          textAlign: 'text-center',
          color: '#6b7280',
        },
      },
    ];
  }

  /**
   * Pre-carrega templates mais usados
   */
  static async preloadCommonTemplates(): Promise<void> {
    const steps = Array.from({ length: 21 }, (_, i) => i + 1);

    console.log('🚀 Pre-carregando templates...');

    const promises = steps.map(async stepNumber => {
      const stepId = `step-${stepNumber}`;
      try {
        await this.loadStepBlocks(stepId);
      } catch (error) {
        console.warn(`⚠️ Falha ao pre-carregar ${stepId}:`, error);
      }
    });

    await Promise.allSettled(promises);
    console.log('✅ Pre-carregamento concluído');
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
