/**
 * 🚀 VIRTUALIZATION EXPORTS - Fase 5 Gargalos
 * 
 * Barrel export para componentes de virtualização e lazy loading.
 * 
 * @version 1.0.0
 */

// Components
export { VirtualizedStepNavigator } from '../navigation/VirtualizedStepNavigator';
export { LazyBlockWrapper, BatchLazyBlocks } from '../blocks/LazyBlockWrapper';
export { VirtualizedList, MemoizedVirtualizedList } from '@/components/ui/virtualized/VirtualizedList';

// Hooks
export { useLazyBlockRendering } from '@/hooks/useLazyBlockRendering';

// Constants
export * from '../performance/constants';

// Types
export type { StepInfo } from '../navigation/VirtualizedStepNavigator';
