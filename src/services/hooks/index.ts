/**
 * Template service React Query hooks
 * 
 * Provides React Query hooks for interacting with the template service:
 * - useTemplateStep - Query hook for loading individual steps
 * - useTemplateSteps - Query hook for loading multiple steps
 * - usePrefetchTemplateStep - Hook for background step prefetching
 * - usePrepareTemplate - Mutation hook for template preparation
 * - usePreloadTemplate - Mutation hook for template preloading
 * - templateKeys - Query key factory for cache consistency
 * 
 * @module services/hooks
 */

// Query key factories
export { templateKeys, stepKeys } from './templateKeys';

// Template step hooks
export {
  useTemplateStep,
  useTemplateSteps,
  usePrefetchTemplateStep,
  type UseTemplateStepOptions,
  type UseTemplateStepsOptions,
} from './useTemplateStep';

// Template preparation hooks
export {
  usePrepareTemplate,
  usePrepareTemplateFn,
  type UsePrepareTemplateOptions,
  type PrepareTemplateMutationVariables,
} from './usePrepareTemplate';

// Template preload hooks
export {
  usePreloadTemplate,
  usePreloadTemplateFn,
  type UsePreloadTemplateOptions,
  type PreloadTemplateMutationVariables,
} from './usePreloadTemplate';
