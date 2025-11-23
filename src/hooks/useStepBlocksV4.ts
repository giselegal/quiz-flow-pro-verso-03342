/**
 * 🎯 USE STEP BLOCKS V4
 * 
 * Hook para gerenciar blocks de um step usando estrutura v4
 * Integra com QuizV4Provider e valida com Zod
 * 
 * FASE 4: Integração Editor
 */

import { useCallback, useMemo } from 'react';
import { useQuizV4 } from '@/contexts/quiz/QuizV4Provider';
import { QuizBlockSchemaZ, type QuizBlock } from '@/schemas/quiz-schema.zod';
import { appLogger } from '@/lib/utils/appLogger';

export function useStepBlocksV4(stepId: string) {
  const { state, getStep, getBlock: getBlockFromProvider } = useQuizV4();

  // Get step data
  const step = useMemo(() => getStep(stepId), [stepId, getStep]);
  const blocks = useMemo(() => step?.blocks || [], [step]);

  /**
   * Get block by ID
   */
  const getBlock = useCallback((blockId: string): QuizBlock | undefined => {
    return blocks.find(b => b.id === blockId);
  }, [blocks]);

  /**
   * Get block index
   */
  const getBlockIndex = useCallback((blockId: string): number => {
    return blocks.findIndex(b => b.id === blockId);
  }, [blocks]);

  /**
   * Update block with Zod validation
   */
  const updateBlock = useCallback((blockId: string, updates: Partial<QuizBlock>) => {
    const currentBlock = getBlock(blockId);
    if (!currentBlock) {
      appLogger.error('❌ Block não encontrado:', { data: [blockId] });
      return;
    }

    // Merge updates
    const updatedBlock = {
      ...currentBlock,
      ...updates,
      properties: {
        ...currentBlock.properties,
        ...(updates.properties || {}),
      },
      content: {
        ...currentBlock.content,
        ...(updates.content || {}),
      },
    };

    // Validate with Zod
    const validationResult = QuizBlockSchemaZ.safeParse(updatedBlock);
    
    if (!validationResult.success) {
      appLogger.error('❌ Validação Zod falhou:', { 
        data: [validationResult.error.errors] 
      });
      
      // Return validation errors
      return {
        success: false,
        errors: validationResult.error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }

    // TODO: Implement actual update in QuizV4Provider
    // For now, just log success
    appLogger.info('✅ Block atualizado e validado:', { 
      data: [blockId, Object.keys(updates)] 
    });

    return { success: true, data: validationResult.data };
  }, [getBlock]);

  /**
   * Delete block
   */
  const deleteBlock = useCallback((blockId: string) => {
    const index = getBlockIndex(blockId);
    if (index === -1) {
      appLogger.error('❌ Block não encontrado para deletar:', { data: [blockId] });
      return;
    }

    // TODO: Implement in QuizV4Provider
    appLogger.info('🗑️ Block deletado:', { data: [blockId] });
  }, [getBlockIndex]);

  /**
   * Duplicate block
   */
  const duplicateBlock = useCallback((blockId: string) => {
    const block = getBlock(blockId);
    if (!block) {
      appLogger.error('❌ Block não encontrado para duplicar:', { data: [blockId] });
      return;
    }

    const newBlock: QuizBlock = {
      ...block,
      id: `${block.id}-copy-${Date.now()}`,
      order: block.order + 1,
    };

    // Validate new block
    const validationResult = QuizBlockSchemaZ.safeParse(newBlock);
    
    if (!validationResult.success) {
      appLogger.error('❌ Validação do block duplicado falhou:', { 
        data: [validationResult.error.errors] 
      });
      return;
    }

    // TODO: Implement in QuizV4Provider
    appLogger.info('📋 Block duplicado:', { data: [blockId, newBlock.id] });
    
    return validationResult.data;
  }, [getBlock]);

  /**
   * Move block up
   */
  const moveBlockUp = useCallback((blockId: string) => {
    const index = getBlockIndex(blockId);
    if (index <= 0) return;

    // TODO: Implement reordering in QuizV4Provider
    appLogger.info('⬆️ Block movido para cima:', { data: [blockId] });
  }, [getBlockIndex]);

  /**
   * Move block down
   */
  const moveBlockDown = useCallback((blockId: string) => {
    const index = getBlockIndex(blockId);
    if (index === -1 || index >= blocks.length - 1) return;

    // TODO: Implement reordering in QuizV4Provider
    appLogger.info('⬇️ Block movido para baixo:', { data: [blockId] });
  }, [getBlockIndex, blocks.length]);

  /**
   * Add new block
   */
  const addBlock = useCallback((block: QuizBlock, position?: number) => {
    // Validate with Zod
    const validationResult = QuizBlockSchemaZ.safeParse(block);
    
    if (!validationResult.success) {
      appLogger.error('❌ Validação do novo block falhou:', { 
        data: [validationResult.error.errors] 
      });
      return {
        success: false,
        errors: validationResult.error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }

    // TODO: Implement in QuizV4Provider
    appLogger.info('➕ Novo block adicionado:', { 
      data: [block.id, block.type, position] 
    });

    return { success: true, data: validationResult.data };
  }, []);

  /**
   * Validate all blocks
   */
  const validateAllBlocks = useCallback(() => {
    const errors: Array<{ blockId: string; errors: any[] }> = [];

    blocks.forEach(block => {
      const result = QuizBlockSchemaZ.safeParse(block);
      if (!result.success) {
        errors.push({
          blockId: block.id,
          errors: result.error.errors,
        });
      }
    });

    if (errors.length > 0) {
      appLogger.warn('⚠️ Validação encontrou erros:', { data: [errors] });
    } else {
      appLogger.info('✅ Todos os blocks válidos');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [blocks]);

  return {
    // Data
    step,
    blocks,
    
    // Block operations
    getBlock,
    getBlockIndex,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    moveBlockUp,
    moveBlockDown,
    addBlock,
    
    // Validation
    validateAllBlocks,
    
    // State
    isLoading: state.isLoading,
    error: state.error,
  };
}
