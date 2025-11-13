/**
 * 🔄 TEMPLATE TO FUNNEL ADAPTER
 * 
 * Converte templates (read-only) em funis editáveis (UnifiedFunnel)
 * Resolve GARGALO #1: Template → Editor Pipeline
 * 
 * FUNCIONALIDADE:
 * - Carrega todos os 21 steps de um template
 * - Converte estrutura Block[] para quizSteps (compatibilidade)
 * - Cria UnifiedFunnel editável pronto para SuperUnifiedProvider
 * 
 * @version 1.0.0
 * @status PRODUCTION-READY
 */

import type { UnifiedFunnel, UnifiedStage } from '@/services/UnifiedCRUDService';
import type { Block } from '@/types/editor';
import { templateService } from '@/services/canonical/TemplateService';
import { appLogger } from '@/lib/utils/logger';
import { generateFunnelId } from '@/lib/utils/idGenerator'; // ✅ W1

export interface TemplateConversionOptions {
  /** ID do template a converter */
  templateId: string;

  /** Nome customizado do funnel (opcional) */
  customName?: string;

  /** Se deve carregar todos os steps (21 steps completos) */
  loadAllSteps?: boolean;

  /** Steps específicos a carregar (se não loadAllSteps) */
  specificSteps?: string[];
}

export interface TemplateConversionResult {
  success: boolean;
  funnel?: UnifiedFunnel;
  error?: string;
  metadata: {
    stepsLoaded: number;
    totalBlocks: number;
    duration: number;
  };
}

/**
 * Converte template para funnel editável
 */
export class TemplateToFunnelAdapter {
  /**
   * Converte template completo (21 steps) em UnifiedFunnel
   */
  async convertTemplateToFunnel(
    options: TemplateConversionOptions
  ): Promise<TemplateConversionResult> {
    const startTime = performance.now();
    const { templateId, customName, loadAllSteps = true, specificSteps } = options;

    try {
      appLogger.info(`🔄 [TemplateToFunnelAdapter] Convertendo template: ${templateId}`);

      // Definir quais steps carregar
      const stepsToLoad = loadAllSteps
        ? this.generateAllStepIds()
        : specificSteps || [];

      // Carregar todos os steps em paralelo (otimização)
      const stepResults = await Promise.allSettled(
        stepsToLoad.map(stepId => this.loadStepBlocks(stepId))
      );

      // Processar resultados
      const stages: UnifiedStage[] = [];
      let totalBlocks = 0;

      stepResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          const stepId = stepsToLoad[index];
          const blocks = result.value;

          stages.push({
            id: stepId,
            name: this.generateStepName(stepId),
            description: `Etapa ${index + 1} do quiz`,
            blocks,
            order: index,
            isRequired: true,
            settings: {
              validation: {
                required: true,
                customRules: [],
              },
            },
            metadata: {
              blocksCount: blocks.length,
              isValid: true,
            },
          });

          totalBlocks += blocks.length;
        } else {
          appLogger.warn(`⚠️ Falha ao carregar step ${stepsToLoad[index]}:`, 
            result.status === 'rejected' ? result.reason : 'Unknown');
        }
      });

      // Criar UnifiedFunnel
      const funnel: UnifiedFunnel = {
        id: generateFunnelId(), // ✅ W1: UUID v4
        name: customName || `Funnel baseado em ${templateId}`,
        description: `Convertido do template ${templateId}`,
        stages,
        settings: {
          theme: 'default',
          branding: {
            colors: {
              primary: '#3b82f6',
              secondary: '#8b5cf6',
              accent: '#10b981',
            },
          },
        },
        status: 'draft',
        version: '1.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          totalBlocks,
          completedStages: 0,
          isValid: stages.length > 0,
          tags: ['template-conversion', templateId],
        },
      };

      const duration = performance.now() - startTime;

      appLogger.info(`✅ [TemplateToFunnelAdapter] Conversão concluída:`, {
        funnelId: funnel.id,
        stagesLoaded: stages.length,
        totalBlocks,
        duration: `${duration.toFixed(2)}ms`,
      });

      return {
        success: true,
        funnel,
        metadata: {
          stepsLoaded: stages.length,
          totalBlocks,
          duration,
        },
      };

    } catch (error) {
      const duration = performance.now() - startTime;
      const errorMsg = error instanceof Error ? error.message : String(error);

      appLogger.error(`❌ [TemplateToFunnelAdapter] Erro na conversão:`, error);

      return {
        success: false,
        error: errorMsg,
        metadata: {
          stepsLoaded: 0,
          totalBlocks: 0,
          duration,
        },
      };
    }
  }

  /**
   * Carrega blocos de um step específico
   */
  private async loadStepBlocks(stepId: string): Promise<Block[]> {
    const result = await templateService.getStep(stepId);

    if (!result.success || !result.data) {
      throw new Error(`Falha ao carregar step ${stepId}`);
    }

    return result.data;
  }

  /**
   * Gera IDs de todos os 21 steps
   */
  private generateAllStepIds(): string[] {
    return Array.from({ length: 21 }, (_, i) => 
      `step-${(i + 1).toString().padStart(2, '0')}`
    );
  }

  /**
   * Gera nome amigável para o step
   */
  private generateStepName(stepId: string): string {
    const stepNumber = parseInt(stepId.replace('step-', ''), 10);

    // Mapear números para nomes descritivos
    const stepNames: Record<number, string> = {
      1: 'Introdução',
      2: 'Pergunta 1',
      3: 'Pergunta 2',
      4: 'Pergunta 3',
      5: 'Pergunta 4',
      6: 'Pergunta 5',
      7: 'Pergunta 6',
      8: 'Pergunta 7',
      9: 'Pergunta 8',
      10: 'Pergunta 9',
      11: 'Pergunta 10',
      12: 'Pergunta 11',
      13: 'Pergunta 12',
      14: 'Pergunta 13',
      15: 'Pergunta 14',
      16: 'Pergunta 15',
      17: 'Análise',
      18: 'Resultado',
      19: 'Oferta',
      20: 'Confirmação',
      21: 'Finalização',
    };

    return stepNames[stepNumber] || `Etapa ${stepNumber}`;
  }

  /**
   * Converte apenas um step específico (modo light)
   */
  async convertSingleStep(stepId: string): Promise<TemplateConversionResult> {
    return this.convertTemplateToFunnel({
      templateId: stepId,
      loadAllSteps: false,
      specificSteps: [stepId],
    });
  }

  async *convertTemplateToFunnelStream(
    options: TemplateConversionOptions
  ): AsyncGenerator<{ stage: UnifiedStage; progress: number }, void, unknown> {
    const { loadAllSteps = true, specificSteps } = options;
    const steps = loadAllSteps ? this.generateAllStepIds() : (specificSteps || []);
    const total = steps.length;
    for (let i = 0; i < total; i++) {
      const stepId = steps[i];
      try {
        const blocks = await this.loadStepBlocks(stepId);
        const stage: UnifiedStage = {
          id: stepId,
          name: this.generateStepName(stepId),
          description: `Etapa ${i + 1}`,
          blocks,
          order: i,
          isRequired: true,
          settings: { validation: { required: true, customRules: [] } },
          metadata: { blocksCount: blocks.length, isValid: true },
        };
        const progress = (i + 1) / total;
        yield { stage, progress };
      } catch {}
    }
  }

  /**
   * Valida se um template pode ser convertido
   */
  async validateTemplate(templateId: string): Promise<{
    valid: boolean;
    availableSteps: string[];
    errors: string[];
  }> {
    const errors: string[] = [];
    const availableSteps: string[] = [];

    try {
      const stepIds = this.generateAllStepIds();

      const validationResults = await Promise.allSettled(
        stepIds.map(async stepId => {
          const result = await templateService.getStep(stepId);
          return { stepId, success: result.success };
        })
      );

      validationResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.success) {
          availableSteps.push(stepIds[index]);
        } else {
          errors.push(`Step ${stepIds[index]} não disponível`);
        }
      });

      return {
        valid: availableSteps.length >= 10, // Mínimo 10 steps para ser válido
        availableSteps,
        errors,
      };

    } catch (error) {
      return {
        valid: false,
        availableSteps: [],
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }
}

// Export singleton
export const templateToFunnelAdapter = new TemplateToFunnelAdapter();
