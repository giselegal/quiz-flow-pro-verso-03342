/**
 * 🔄 UNIFIED QUIZ STEP ADAPTER - Schema Unificado
 * 
 * Adaptador bidirecional entre os 3 formatos:
 * 1. QuizStep (runtime de produção)
 * 2. Block[] (editor visual)
 * 3. JSONv3Template (arquivos de template)
 * 
 * FASE 2: Solução arquitetural para eliminar fragmentação
 */

import type { QuizStep } from '@/data/quizSteps';
import type { Block } from '@/types/editor';
import type { JSONv3Template } from '@/templates/types/jsonv3Types';
import { QuizStepAdapter } from './QuizStepAdapter';
import { BlocksToJSONv3Adapter } from './BlocksToJSONv3Adapter';

/**
 * 🎯 SCHEMA UNIFICADO
 * Formato intermediário que contém todas as informações dos 3 formatos
 */
export interface UnifiedQuizStep {
  // Identificação
  id: string;
  stepNumber: number;
  type: QuizStep['type'];
  
  // Conteúdo estruturado (compatível com todos os formatos)
  sections: Array<{
    type: string;
    content: Record<string, any>;
    style?: Record<string, any>;
  }>;
  
  // Metadados
  metadata: {
    version: string;
    createdAt?: string;
    updatedAt?: string;
    source: 'quizstep' | 'blocks' | 'json';
  };
  
  // Dados específicos para cada formato (preservação total)
  raw: {
    quizStep?: QuizStep;
    blocks?: Block[];
    json?: JSONv3Template;
  };
}

/**
 * 🔄 CONVERSÕES BIDIRECIONAIS
 */
export class UnifiedQuizStepAdapter {
  /**
   * QuizStep → UnifiedQuizStep
   */
  static fromQuizStep(quizStep: QuizStep, stepId: string): UnifiedQuizStep {
    // Usar QuizStepAdapter para converter QuizStep → Blocks
    const blocks = QuizStepAdapter.toBlocks(quizStep);
    
    // Extrair sections dos blocks
    const sections = blocks.map(block => ({
      type: block.type,
      content: block.content || block.properties || {},
      style: (block.content as any)?.style || (block.properties as any)?.style
    }));
    
    return {
      id: stepId,
      stepNumber: this.extractStepNumber(stepId),
      type: quizStep.type,
      sections,
      metadata: {
        version: '1.0',
        source: 'quizstep' as const
      },
      raw: {
        quizStep,
        blocks
      }
    };
  }
  
  /**
   * Block[] → UnifiedQuizStep
   */
  static fromBlocks(blocks: Block[], stepId: string): UnifiedQuizStep {
    const sections = blocks.map(block => ({
      type: block.type,
      content: block.content || block.properties || {},
      style: (block.content as any)?.style || (block.properties as any)?.style
    }));
    
    // Inferir type do step baseado nos blocks
    const type = this.inferStepType(blocks);
    
    return {
      id: stepId,
      stepNumber: this.extractStepNumber(stepId),
      type,
      sections,
      metadata: {
        version: '1.0',
        source: 'blocks' as const
      },
      raw: {
        blocks
      }
    };
  }
  
  /**
   * JSONv3Template → UnifiedQuizStep
   */
  static fromJSON(json: JSONv3Template): UnifiedQuizStep {
    // Converter JSON → Blocks usando BlocksToJSONv3Adapter
    const blocks = BlocksToJSONv3Adapter.jsonv3ToBlocks(json);
    
    const sections = json.sections.map(section => ({
      type: section.type,
      content: section.content,
      style: section.style
    }));
    
    return {
      id: json.metadata.id,
      stepNumber: this.extractStepNumber(json.metadata.id),
      type: json.metadata.stepType as QuizStep['type'],
      sections,
      metadata: {
        version: json.templateVersion,
        source: 'json' as const,
        ...json.metadata
      },
      raw: {
        json,
        blocks
      }
    };
  }
  
  /**
   * UnifiedQuizStep → QuizStep
   */
  static toQuizStep(unified: UnifiedQuizStep): QuizStep {
    // Se já temos o QuizStep original, usar ele
    if (unified.raw.quizStep) {
      return unified.raw.quizStep;
    }
    
    // Caso contrário, usar blocks para reconstruir
    const blocks = unified.raw.blocks || this.sectionsToBlocks(unified.sections);
    return QuizStepAdapter.fromBlocks(blocks, unified.id);
  }
  
  /**
   * UnifiedQuizStep → Block[]
   */
  static toBlocks(unified: UnifiedQuizStep): Block[] {
    // Se já temos os blocks originais, usar eles
    if (unified.raw.blocks) {
      return unified.raw.blocks;
    }
    
    // Caso contrário, converter sections → blocks
    return this.sectionsToBlocks(unified.sections);
  }
  
  /**
   * UnifiedQuizStep → JSONv3Template
   */
  static toJSON(unified: UnifiedQuizStep): JSONv3Template {
    // Se já temos o JSON original, usar ele
    if (unified.raw.json) {
      return unified.raw.json;
    }
    
    // Caso contrário, construir do zero
    const blocks = this.toBlocks(unified);
    return BlocksToJSONv3Adapter.blocksToJSONv3(blocks, unified.id);
  }
  
  /**
   * 🔧 UTILITÁRIOS
   */
  private static extractStepNumber(stepId: string): number {
    const match = stepId.match(/step-?(\d+)/i);
    return match ? parseInt(match[1], 10) : 1;
  }
  
  private static inferStepType(blocks: Block[]): QuizStep['type'] {
    // Lógica de inferência baseada nos tipos de blocks
    const hasFormInput = blocks.some(b => (b.type as string).includes('form'));
    const hasOptions = blocks.some(b => (b.type as string).includes('option'));
    const hasResult = blocks.some(b => (b.type as string).includes('result'));
    
    if (hasResult) return 'result';
    if (hasOptions) return 'question';
    if (hasFormInput) return 'intro';
    
    return 'intro';
  }
  
  private static sectionsToBlocks(sections: UnifiedQuizStep['sections']): Block[] {
    return sections.map((section, index) => ({
      id: `block-${index + 1}`,
      type: section.type as any,
      order: index,
      content: section.content,
      properties: section.content
    }));
  }
}
