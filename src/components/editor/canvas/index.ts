/**
 * 🎯 CANVAS COMPONENTS - Componentes de Renderização de Blocos
 * 
 * Exportações centralizadas dos componentes do canvas
 */

// Fase 1: StepCanvas - Container genérico
export { StepCanvas, type StepCanvasProps } from './StepCanvas';

// Fase 3: BlockBasedStepRenderer - Renderer baseado em blocos
export { BlockBasedStepRenderer, type BlockBasedStepRendererProps } from './BlockBasedStepRenderer';

// Componentes existentes (manter por compatibilidade)
export { default as OptimizedCanvasDropZone } from './OptimizedCanvasDropZone';
export { default as SortableBlockWrapper } from './SortableBlockWrapper';

// Re-export do simple wrapper se necessário
// export { default as SortableBlockWrapperSimple } from './SortableBlockWrapper.simple';
