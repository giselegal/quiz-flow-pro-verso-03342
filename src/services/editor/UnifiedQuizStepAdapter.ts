/**
 * 🎯 UNIFIED QUIZ STEP ADAPTER - FASE 4
 * 
 * Adaptador unificado para conversões bidirecionais entre:
 * - EditableQuizStep (Editor) ↔ RuntimeStepOverride (Preview/Runtime)
 * 
 * Garante ZERO perda de dados nas conversões
 */

import { EditableQuizStep, BlockComponent } from '@/components/editor/quiz/types';
import { RuntimeStepOverride } from '@/runtime/quiz/QuizRuntimeRegistry';
import { getBlockConfig } from '@/utils/blockConfigMerger';

/**
 * Extended runtime block with full properties for editor sync
 */
interface ExtendedRuntimeBlock {
  id: string;
  type: string;
  order?: number;
  parentId?: string | null;
  config: Record<string, any>;
  properties?: Record<string, any>;
  content?: Record<string, any>;
  metadata?: Record<string, any>;
}

/**
 * Extended runtime step with editor metadata
 */
interface ExtendedRuntimeStepOverride extends RuntimeStepOverride {
  order?: number;
  settings?: Record<string, any>;
  metadata?: Record<string, any>;
  blocks?: ExtendedRuntimeBlock[];
}

/**
 * Adaptador unificado para conversões entre formatos
 */
export class UnifiedQuizStepAdapter {
  /**
   * 🎯 Editor → Runtime (usado no preview)
   * Preserva TODAS as propriedades dos blocos
   */
  static toRuntime(step: EditableQuizStep): ExtendedRuntimeStepOverride {
    const questionNumber = this.extractQuestionNumber(step.blocks);
    
    return {
      id: step.id,
      type: step.type,
      order: step.order,
      nextStep: step.nextStep,
      
      // 🎯 PRESERVAR blocos completos
      blocks: step.blocks.map(block => ({
        id: block.id,
        type: block.type,
        order: block.order,
        parentId: block.parentId,
        // 🎯 MERGE COMPLETO de todas as propriedades
        config: getBlockConfig(block),
        properties: block.properties || {},
        content: block.content || {},
        metadata: {},
      })),
      
      // 🎯 CAMPOS ESPECÍFICOS (derivados dos blocos quando ausentes)
      questionText: step.title || this.extractQuestionText(step.blocks),
      questionNumber: questionNumber !== undefined ? String(questionNumber) : undefined,
      options: this.extractOptions(step.blocks),
      
      // 🎯 METADADOS completos
      title: step.title,
      settings: step.settings,
      metadata: step.metadata,
      offerMap: (step as any).offerMap,
    };
  }

  /**
   * 🎯 Runtime → Editor (usado ao carregar)
   * Restaura TODAS as propriedades dos blocos
   */
  static toEditor(runtime: ExtendedRuntimeStepOverride): EditableQuizStep {
    const extendedRuntime = runtime as ExtendedRuntimeStepOverride;
    
    return {
      id: runtime.id,
      type: runtime.type as any,
      order: extendedRuntime.order || 0,
      nextStep: runtime.nextStep,
      
      // 🎯 RESTAURAR blocos completos com TODAS as props
      blocks: (extendedRuntime.blocks || []).map((block: ExtendedRuntimeBlock) => ({
        id: block.id,
        type: block.type,
        order: block.order || 0,
        parentId: block.parentId || null,
        // 🎯 RESTAURAR estrutura: properties tem prioridade, config como fallback
        properties: block.properties || block.config || {},
        content: block.content || {},
      })),
      
      // 🎯 METADADOS completos
      title: runtime.title,
      settings: extendedRuntime.settings,
      metadata: extendedRuntime.metadata,
      offerMap: (runtime as any).offerMap,
    };
  }

  // ==================== HELPERS DE EXTRAÇÃO ====================

  /**
   * Extrai texto da pergunta dos blocos
   */
  private static extractQuestionText(blocks: BlockComponent[]): string | undefined {
    const questionBlock = blocks.find(b => 
      b.type === 'quiz-options' || 
      b.type === 'options-grid' ||
      b.type === 'quiz-question-inline' ||
      b.type === 'heading' ||
      b.type === 'text'
    );
    
    if (!questionBlock) return undefined;
    
    const config = getBlockConfig(questionBlock);
    return config.question || 
           config.questionText || 
           config.text || 
           config.content ||
           questionBlock.content?.text;
  }

  /**
   * Extrai número da pergunta dos blocos
   */
  private static extractQuestionNumber(blocks: BlockComponent[]): string | number | undefined {
    const questionBlock = blocks.find(b => 
      b.type === 'quiz-options' || 
      b.type === 'options-grid'
    );
    
    if (!questionBlock) return undefined;
    
    const config = getBlockConfig(questionBlock);
    return config.questionNumber;
  }

  /**
   * Extrai opções dos blocos de quiz
   */
  private static extractOptions(blocks: BlockComponent[]): Array<{
    id: string; 
    text: string; 
    image?: string;
    imageUrl?: string;
    score?: number;
    points?: number;
    category?: string;
  }> | undefined {
    const questionBlock = blocks.find(b => 
      b.type === 'quiz-options' || 
      b.type === 'options-grid'
    );
    
    if (!questionBlock) return undefined;
    
    const config = getBlockConfig(questionBlock);
    const options = config.options || questionBlock.content?.options;
    
    if (!Array.isArray(options)) return undefined;
    
    // Normalizar formato das opções
    return options.map((opt: any) => ({
      id: opt.id || opt.value || String(Math.random()),
      text: opt.text || opt.label || '',
      image: opt.image || opt.imageUrl,
      imageUrl: opt.imageUrl || opt.image,
      score: opt.score || opt.points,
      points: opt.points || opt.score,
      category: opt.category,
    }));
  }

  /**
   * 🎯 Converte array de steps em batch
   */
  static toRuntimeBatch(steps: EditableQuizStep[]): Record<string, ExtendedRuntimeStepOverride> {
    const map: Record<string, ExtendedRuntimeStepOverride> = {};
    
    steps.forEach(step => {
      if (step.id) {
        map[step.id] = this.toRuntime(step);
      }
    });
    
    return map;
  }

  /**
   * 🎯 Converte record de runtime steps para array de editor steps
   */
  static toEditorBatch(runtimeMap: Record<string, ExtendedRuntimeStepOverride>): EditableQuizStep[] {
    return Object.values(runtimeMap)
      .map(runtime => this.toEditor(runtime))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  /**
   * 🎯 Valida integridade da conversão
   */
  static validateConversion(original: EditableQuizStep, converted: ExtendedRuntimeStepOverride): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (original.id !== converted.id) {
      errors.push(`ID mismatch: ${original.id} !== ${converted.id}`);
    }

    if (original.blocks.length !== (converted.blocks?.length || 0)) {
      errors.push(`Blocks count mismatch: ${original.blocks.length} !== ${converted.blocks?.length || 0}`);
    }

    // Validar que todas as propriedades dos blocos foram preservadas
    original.blocks.forEach((block, idx) => {
      const convertedBlock = converted.blocks?.[idx] as ExtendedRuntimeBlock | undefined;
      if (!convertedBlock) {
        errors.push(`Block ${idx} missing in converted`);
        return;
      }

      if (block.type !== convertedBlock.type) {
        errors.push(`Block ${idx} type mismatch: ${block.type} !== ${convertedBlock.type}`);
      }

      // Verificar preservação de properties
      const originalProps = block.properties || {};
      const convertedProps = convertedBlock.properties || {};
      
      Object.keys(originalProps).forEach(key => {
        if (originalProps[key] !== convertedProps[key]) {
          errors.push(`Block ${idx} property "${key}" lost in conversion`);
        }
      });
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Export singleton helpers
export const unifiedQuizStepAdapter = UnifiedQuizStepAdapter;
