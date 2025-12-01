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
    metadata: component.metadata ? {
      editable: component.metadata.editable ?? true,
      reorderable: component.metadata.reorderable ?? true,
      reusable: component.metadata.reusable ?? true,
      deletable: component.metadata.deletable ?? true,
    } : undefined,
  };
}

// ============================================================================
// CONVERSORES ADICIONAIS PARA BRIDGE COM SISTEMA LEGADO
// ============================================================================

/**
 * Converte QuizBlock (Zod) para Block (Sistema Legado)
 * Usado pelo useBridgeSync para sincronizar com EditorStateProvider
 */
export function quizBlockToBlock(qb: QuizBlock): any {
  return {
    id: qb.id,
    type: qb.type,
    order: qb.order,
    content: qb.content || {},
    properties: qb.properties,
    parentId: qb.parentId ?? undefined,
    metadata: qb.metadata,
  };
}

/**
 * Converte Block (Sistema Legado) para BlockComponent
 * Usado para compatibilidade reversa
 */
export function blockToBlockComponent(b: any): BlockComponent {
  return {
    id: b.id,
    type: b.type,
    order: b.order,
    properties: b.properties,
    content: b.content,
    parentId: b.parentId ?? null,
    metadata: b.metadata,
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
