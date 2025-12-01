/**
 * 🎯 TIPOS UNIFICADOS PARA EDITOR DE QUIZ
 * 
 * Este arquivo resolve a desconexão entre ModernQuizEditor e sistema legado,
 * exportando tipos baseados nos schemas Zod existentes.
 * 
 * Resolve: 73 erros de build relacionados a tipos ausentes
 */

import type { 
  QuizStep, 
  BlockType, 
  QuizBlock,
  QuizSchema,
  QuizMetadata,
  QuizTheme,
  QuizSettings,
  NavigationConfig,
  ValidationSchema,
  ResultsConfig,
  BlockLibrary
} from '@/schemas/quiz-schema.zod';

// ============================================================================
// ALIASES PARA COMPATIBILIDADE COM SISTEMA LEGADO
// ============================================================================

/**
 * Alias para QuizStep - usado em componentes legados
 * EditModeRenderer, PreviewModeRenderer, UnifiedStepContent, etc.
 */
export type EditableQuizStep = QuizStep;

/**
 * Alias para BlockType - usado em StepDataAdapter
 */
export type StepType = BlockType;

// ============================================================================
// INTERFACE BLOCKCOMPONENT (LEGADO)
// ============================================================================

/**
 * Interface do sistema legado para blocos individuais
 * Usado em: stepDataMigration, templateConverter, UnifiedQuizStepAdapter
 * 
 * Mantida para compatibilidade, mas mapeia para QuizBlock internamente
 */
export interface BlockComponent {
  /** ID único do bloco */
  id: string;
  
  /** Tipo do bloco (text, heading, image, etc) */
  type: string;
  
  /** Ordem de exibição do bloco */
  order: number;
  
  /** Propriedades específicas do bloco */
  properties: Record<string, any>;
  
  /** Conteúdo do bloco (opcional, usado em alguns tipos) */
  content?: Record<string, any>;
  
  /** ID do bloco pai (para blocos aninhados) */
  parentId?: string | null;
  
  /** Metadados de controle do editor */
  metadata?: {
    editable?: boolean;
    reorderable?: boolean;
    reusable?: boolean;
    deletable?: boolean;
  };
}

// ============================================================================
// CONVERSORES ENTRE SISTEMAS
// ============================================================================

/**
 * Converte QuizBlock (Zod) para BlockComponent (legado)
 */
export function quizBlockToBlockComponent(block: QuizBlock): BlockComponent {
  return {
    id: block.id,
    type: block.type,
    order: block.order,
    properties: block.properties || {},
    content: block.content,
    parentId: block.parentId || null,
    metadata: {
      editable: block.metadata?.editable ?? true,
      reorderable: block.metadata?.reorderable ?? true,
      reusable: block.metadata?.reusable ?? true,
      deletable: block.metadata?.deletable ?? true,
    },
  };
}

/**
 * Converte BlockComponent (legado) para QuizBlock (Zod)
 */
export function blockComponentToQuizBlock(component: BlockComponent): QuizBlock {
  return {
    id: component.id,
    type: component.type as BlockType,
    order: component.order,
    properties: component.properties,
    content: component.content,
    parentId: component.parentId || undefined,
    metadata: component.metadata,
  };
}

// ============================================================================
// RE-EXPORTS PARA CONVENIÊNCIA
// ============================================================================

export type {
  QuizStep,
  QuizBlock,
  BlockType,
  QuizSchema,
  QuizMetadata,
  QuizTheme,
  QuizSettings,
  NavigationConfig,
  ValidationSchema,
  ResultsConfig,
  BlockLibrary,
};
