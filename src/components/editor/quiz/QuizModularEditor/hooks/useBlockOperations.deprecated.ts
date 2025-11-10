import { appLogger } from '@/lib/utils/appLogger';
/**
 * ⚠️ DEPRECATED: useBlockOperations
 * 
 * @deprecated Use useSuperUnified() from @/hooks/useSuperUnified instead
 * Este hook será removido em versão futura (FASE 3).
 * 
 * RAZÃO DA DEPRECAÇÃO:
 * - Duplica operações com SuperUnifiedProvider
 * - Causa re-renders desnecessários
 * - Lógica fragmentada
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ❌ ANTES
 * import { useBlockOperations } from './hooks/useBlockOperations';
 * const ops = useBlockOperations();
 * ops.addBlock(stepKey, block);
 * 
 * // ✅ DEPOIS
 * import { useSuperUnified } from '@/hooks/useSuperUnified';
 * const unified = useSuperUnified();
 * unified.addBlock(stepIndex, block);
 * ```
 * 
 * @version DEPRECATED
 * @deprecatedSince 2025-11-04
 */

// Re-export para compatibilidade temporária
export { useBlockOperations } from './useBlockOperations';

if (process.env.NODE_ENV === 'development') {
  appLogger.warn('⚠️ [DEPRECATED] useBlockOperations está deprecated.\n' +
        'Use useSuperUnified() ao invés.\n' +
        'Veja: src/components/editor/quiz/QuizModularEditor/hooks/useBlockOperations.deprecated.ts');
}
