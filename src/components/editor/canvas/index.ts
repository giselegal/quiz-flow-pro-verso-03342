/**
 * 🎯 CANVAS COMPONENTS - Componentes de Renderização de Blocos
 * 
 * Exportações centralizadas dos componentes do canvas
 */

// Fase 1: StepCanvas - Container genérico
export { StepCanvas, type StepCanvasProps } from './StepCanvas';

// Fase 3: BlockBasedStepRenderer - Renderer baseado em blocos
export { BlockBasedStepRenderer, type BlockBasedStepRendererProps } from './BlockBasedStepRenderer';

// Modal de adicionar blocos
export { AddBlockModal } from './AddBlockModal';

// Componentes existentes (manter por compatibilidade)
export { default as OptimizedCanvasDropZone } from './OptimizedCanvasDropZone';
export { default as SortableBlockWrapper } from './SortableBlockWrapper';

// Utilitários de inicialização de blocos
export { 
  initializeStepBlocks,
  initializeAllStepBlocks 
} from '@/utils/initializeStepBlocks';
