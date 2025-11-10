/**
 * 🛡️ ERROR BOUNDARIES - Exports consolidados
 * 
 * Sistema de error boundaries granulares para isolamento de erros:
 * - StepErrorBoundary: Isola erros por step
 * - BlockErrorBoundary: Isola erros por bloco
 * - ColumnErrorBoundary: Isola erros por coluna do editor
 * 
 * Uso:
 * ```tsx
 * import { StepErrorBoundary, BlockErrorBoundary, ColumnErrorBoundary } from '@/components/error';
 * 
 * // Isolar step
 * <StepErrorBoundary stepKey="step-01" stepNumber={1} onSkip={handleNextStep}>
 *   <StepContent />
 * </StepErrorBoundary>
 * 
 * // Isolar bloco
 * <BlockErrorBoundary blockId={block.id} blockType={block.type} onRemove={handleRemove}>
 *   <BlockRenderer block={block} />
 * </BlockErrorBoundary>
 * 
 * // Isolar coluna
 * <ColumnErrorBoundary columnType="canvas">
 *   <CanvasColumn />
 * </ColumnErrorBoundary>
 * ```
 */

// Error Boundaries
export { StepErrorBoundary, useStepErrorBoundary } from './StepErrorBoundary';
export type { StepErrorFallbackProps } from './StepErrorBoundary';

export { BlockErrorBoundary } from './BlockErrorBoundary';
export type { BlockErrorFallbackProps } from './BlockErrorBoundary';

export { ColumnErrorBoundary, withColumnErrorBoundary } from './ColumnErrorBoundary';
export type { ColumnErrorFallbackProps } from './ColumnErrorBoundary';

// Re-export existing boundaries
export { GlobalErrorBoundary } from './GlobalErrorBoundary';
export { EditorErrorBoundary } from './EditorErrorBoundary';
