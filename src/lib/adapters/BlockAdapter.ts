/**
 * 🔄 BLOCK ADAPTER - FASE 4
 * 
 * Adapter para converter entre diferentes formatos de Block no sistema:
 * - Block (types/editor.ts) - Interface canônica
 * - FunnelBlock (FunnelEditingFacade.ts) - Interface do facade
 * - Block (types/quizCore.ts) - Interface legada
 * 
 * OBJETIVO: Fornecer conversão type-safe entre formatos mantendo compatibilidade.
 * 
 * @version 1.0.0
 * @phase FASE 4 - Unificação de Interfaces
 */

import type { Block as EditorBlock, BlockType } from '@/types/editor';
import type { Block as QuizCoreBlock } from '@/types/quizCore';
import type { FunnelBlock } from '@/editor/facade/FunnelEditingFacade';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Interface canônica unificada (baseada em types/editor.ts)
 */
export interface CanonicalBlock {
  id: string;
  type: string;
  order: number;
  content: Record<string, any>;
  properties?: Record<string, any>;
}

/**
 * Tipo genérico para identificar fonte do bloco
 */
export type BlockSource = 'editor' | 'funnel' | 'quizCore' | 'canonical';

/**
 * Metadata de conversão
 */
export interface ConversionMetadata {
  source: BlockSource;
  timestamp: number;
  lossless: boolean;
  warnings?: string[];
}

/**
 * Resultado de conversão com metadata
 */
export interface ConversionResult<T> {
  block: T;
  metadata: ConversionMetadata;
}

/**
 * 🎯 BlockAdapter - Classe principal de conversão
 */
export class BlockAdapter {
  /**
   * Converter FunnelBlock → CanonicalBlock
   */
  static fromFunnelBlock(funnelBlock: FunnelBlock): ConversionResult<CanonicalBlock> {
    const warnings: string[] = [];

    // FunnelBlock não tem 'order', atribuir 0 como default
    if (!('order' in funnelBlock)) {
      warnings.push('FunnelBlock missing "order" field, defaulted to 0');
    }

    // FunnelBlock usa 'data' ao invés de 'content' e 'properties'
    const canonical: CanonicalBlock = {
      id: funnelBlock.id,
      type: funnelBlock.type,
      order: 0, // FunnelBlock não tem order explícito
      content: funnelBlock.data || {},
      properties: {},
    };

    return {
      block: canonical,
      metadata: {
        source: 'funnel',
        timestamp: Date.now(),
        lossless: warnings.length === 0,
        warnings: warnings.length > 0 ? warnings : undefined,
      },
    };
  }

  /**
   * Converter CanonicalBlock → FunnelBlock
   */
  static toFunnelBlock(canonicalBlock: CanonicalBlock): ConversionResult<FunnelBlock> {
    const warnings: string[] = [];

    // Merge content + properties em 'data'
    const data = {
      ...canonicalBlock.content,
      ...(canonicalBlock.properties || {}),
    };

    // FunnelBlock perde informação de 'order'
    if (canonicalBlock.order !== 0) {
      warnings.push(`Order ${canonicalBlock.order} will be lost in FunnelBlock format`);
    }

    const funnelBlock: FunnelBlock = {
      id: canonicalBlock.id,
      type: canonicalBlock.type,
      data,
    };

    return {
      block: funnelBlock,
      metadata: {
        source: 'canonical',
        timestamp: Date.now(),
        lossless: warnings.length === 0,
        warnings: warnings.length > 0 ? warnings : undefined,
      },
    };
  }

  /**
   * Converter QuizCoreBlock → CanonicalBlock
   */
  static fromQuizCoreBlock(quizBlock: QuizCoreBlock): ConversionResult<CanonicalBlock> {
    const warnings: string[] = [];

    // QuizCoreBlock já tem estrutura compatível
    const canonical: CanonicalBlock = {
      id: quizBlock.id,
      type: quizBlock.type,
      order: quizBlock.order,
      content: quizBlock.content || {},
      properties: quizBlock.properties || {},
    };

    return {
      block: canonical,
      metadata: {
        source: 'quizCore',
        timestamp: Date.now(),
        lossless: true, // QuizCore é compatível 100%
        warnings: undefined,
      },
    };
  }

  /**
   * Converter CanonicalBlock → QuizCoreBlock
   */
  static toQuizCoreBlock(canonicalBlock: CanonicalBlock): ConversionResult<QuizCoreBlock> {
    const quizBlock: QuizCoreBlock = {
      id: canonicalBlock.id,
      type: canonicalBlock.type as any, // QuizCoreBlock usa enum mais restrito
      order: canonicalBlock.order,
      content: canonicalBlock.content,
      properties: canonicalBlock.properties || {},
    };

    return {
      block: quizBlock,
      metadata: {
        source: 'canonical',
        timestamp: Date.now(),
        lossless: true,
        warnings: undefined,
      },
    };
  }

  /**
   * Converter array de FunnelBlock[] → CanonicalBlock[]
   */
  static fromFunnelBlocks(funnelBlocks: FunnelBlock[]): ConversionResult<CanonicalBlock[]> {
    const results = funnelBlocks.map((fb, index) => {
      const result = BlockAdapter.fromFunnelBlock(fb);
      // Atribuir order baseado no índice do array
      result.block.order = index;
      return result;
    });

    const allWarnings = results.flatMap(r => r.metadata.warnings || []);
    const lossless = results.every(r => r.metadata.lossless);

    return {
      block: results.map(r => r.block),
      metadata: {
        source: 'funnel',
        timestamp: Date.now(),
        lossless,
        warnings: allWarnings.length > 0 ? allWarnings : undefined,
      },
    };
  }

  /**
   * Converter array de CanonicalBlock[] → FunnelBlock[]
   */
  static toFunnelBlocks(canonicalBlocks: CanonicalBlock[]): ConversionResult<FunnelBlock[]> {
    const results = canonicalBlocks.map(cb => BlockAdapter.toFunnelBlock(cb));

    const allWarnings = results.flatMap(r => r.metadata.warnings || []);
    const lossless = results.every(r => r.metadata.lossless);

    return {
      block: results.map(r => r.block),
      metadata: {
        source: 'canonical',
        timestamp: Date.now(),
        lossless,
        warnings: allWarnings.length > 0 ? allWarnings : undefined,
      },
    };
  }

  /**
   * Validar se um objeto é um CanonicalBlock válido
   */
  static isValidCanonicalBlock(obj: any): obj is CanonicalBlock {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      typeof obj.id === 'string' &&
      typeof obj.type === 'string' &&
      typeof obj.order === 'number' &&
      typeof obj.content === 'object'
    );
  }

  /**
   * Validar se um objeto é um FunnelBlock válido
   */
  static isValidFunnelBlock(obj: any): obj is FunnelBlock {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      typeof obj.id === 'string' &&
      typeof obj.type === 'string' &&
      typeof obj.data === 'object'
    );
  }

  /**
   * Normalizar qualquer formato para CanonicalBlock
   * Detecta automaticamente o tipo de entrada
   */
  static normalize(input: FunnelBlock | QuizCoreBlock | CanonicalBlock): CanonicalBlock {
    // Verificar se já é CanonicalBlock
    if (BlockAdapter.isValidCanonicalBlock(input)) {
      return input;
    }

    // Verificar se é FunnelBlock
    if (BlockAdapter.isValidFunnelBlock(input)) {
      return BlockAdapter.fromFunnelBlock(input).block;
    }

    // Assumir QuizCoreBlock (tem content + properties)
    if ('content' in input && 'properties' in input) {
      return BlockAdapter.fromQuizCoreBlock(input as QuizCoreBlock).block;
    }

    // Fallback: tratar como CanonicalBlock mesmo que inválido
    appLogger.warn('⚠️ [BlockAdapter] Unable to detect block type, assuming canonical format');
    return input as CanonicalBlock;
  }

  /**
   * Normalizar array de blocos (auto-detect)
   */
  static normalizeArray(inputs: Array<FunnelBlock | QuizCoreBlock | CanonicalBlock>): CanonicalBlock[] {
    return inputs.map(input => BlockAdapter.normalize(input));
  }

  /**
   * 📊 Obter estatísticas de conversão
   */
  static getConversionStats(conversions: ConversionResult<any>[]): {
    total: number;
    lossless: number;
    withWarnings: number;
    sources: Record<BlockSource, number>;
  } {
    return {
      total: conversions.length,
      lossless: conversions.filter(c => c.metadata.lossless).length,
      withWarnings: conversions.filter(c => c.metadata.warnings && c.metadata.warnings.length > 0).length,
      sources: conversions.reduce((acc, c) => {
        acc[c.metadata.source] = (acc[c.metadata.source] || 0) + 1;
        return acc;
      }, {} as Record<BlockSource, number>),
    };
  }
}

/**
 * 🔧 Helper functions para uso direto
 */

/**
 * Converter FunnelBlock para formato canônico (apenas block, sem metadata)
 */
export function funnelBlockToCanonical(funnelBlock: FunnelBlock): CanonicalBlock {
  return BlockAdapter.fromFunnelBlock(funnelBlock).block;
}

/**
 * Converter CanonicalBlock para FunnelBlock (apenas block, sem metadata)
 */
export function canonicalToFunnelBlock(canonicalBlock: CanonicalBlock): FunnelBlock {
  return BlockAdapter.toFunnelBlock(canonicalBlock).block;
}

/**
 * Converter array de blocos para canonical
 */
export function toCanonicalBlocks(blocks: Array<FunnelBlock | QuizCoreBlock | CanonicalBlock>): CanonicalBlock[] {
  return BlockAdapter.normalizeArray(blocks);
}

/**
 * Type guard para CanonicalBlock
 */
export function isCanonicalBlock(obj: any): obj is CanonicalBlock {
  return BlockAdapter.isValidCanonicalBlock(obj);
}

/**
 * Type guard para FunnelBlock
 */
export function isFunnelBlock(obj: any): obj is FunnelBlock {
  return BlockAdapter.isValidFunnelBlock(obj);
}

// Export types
export type { CanonicalBlock };
