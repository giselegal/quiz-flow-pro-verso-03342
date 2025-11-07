/**
 * React Query hook for template preloading
 * 
 * Provides a mutation hook to preload templates with:
 * - Automatic AbortSignal handling
 * - Loading and error states
 * - Success callbacks
 * - Retry logic
 * 
 * @module hooks/usePreloadTemplate
 */

import { useMutation, type UseMutationOptions, type UseMutationResult } from '@tanstack/react-query';
import { templateService } from '../canonical/TemplateService';
import type { ServiceResult } from '../canonical/types';

/**
 * Options for the usePreloadTemplate hook
 */
export interface UsePreloadTemplateOptions extends Omit<UseMutationOptions<ServiceResult<void>, Error, PreloadTemplateMutationVariables>, 'mutationFn'> {
  /**
   * Callback invoked on successful template preload
   */
  onSuccess?: (data: ServiceResult<void>, variables: PreloadTemplateMutationVariables) => void;
  
  /**
   * Callback invoked on error
   */
  onError?: (error: Error, variables: PreloadTemplateMutationVariables) => void;
  
  /**
   * Number of retry attempts (default: 2)
   */
  retry?: number;
}

/**
 * Variables passed to the preload template mutation
 */
export interface PreloadTemplateMutationVariables {
  /**
   * ID of the template to preload
   */
  templateId: string;
  
  /**
   * Optional preload options (currently unused, reserved for future)
   */
  options?: Record<string, never>;
}

/**
 * Hook to preload a template in the background
 * 
 * Preloads all steps of a template into cache for faster subsequent access.
 * Uses React Query mutation for automatic state management and AbortSignal support.
 * 
 * @example
 * ```tsx
 * const { mutate: preloadTemplate, isPending, isError, error } = usePreloadTemplate({
 *   onSuccess: (result) => {
 *     console.log('Template preloaded successfully');
 *   },
 *   onError: (error) => {
 *     console.error('Failed to preload template:', error);
 *   }
 * });
 * 
 * // Preload template
 * preloadTemplate({
 *   templateId: 'quiz21StepsComplete'
 * });
 * ```
 * 
 * @param options - Configuration options for the mutation
 * @returns Mutation result with mutate/mutateAsync functions and state
 */
export function usePreloadTemplate(
  options: UsePreloadTemplateOptions = {}
): UseMutationResult<ServiceResult<void>, Error, PreloadTemplateMutationVariables> {
  const { onSuccess, onError, retry = 2, ...mutationOptions } = options;

  return useMutation<ServiceResult<void>, Error, PreloadTemplateMutationVariables>({
    mutationFn: async ({ templateId, options: preloadOptions }) => {
      // Call templateService with options
      const result = await templateService.preloadTemplate(templateId, preloadOptions);
      
      // Throw error if preload failed
      if (!result.success) {
        throw result.error;
      }
      
      return result;
    },
    
    onSuccess: (data, variables, context) => {
      onSuccess?.(data, variables);
    },
    
    onError: (error, variables, context) => {
      onError?.(error, variables);
    },
    
    retry,
    ...mutationOptions,
  });
}

/**
 * Hook variant that returns a simple preload function
 * 
 * Simplified version that returns just the preload function,
 * hiding the mutation details.
 * 
 * @example
 * ```tsx
 * const preloadTemplate = usePreloadTemplateFn();
 * 
 * await preloadTemplate('quiz21StepsComplete');
 * ```
 * 
 * @param options - Configuration options
 * @returns Function to preload a template
 */
export function usePreloadTemplateFn(options: UsePreloadTemplateOptions = {}) {
  const { mutateAsync } = usePreloadTemplate(options);
  
  return async (templateId: string, preloadOptions?: Record<string, never>) => {
    return mutateAsync({ templateId, options: preloadOptions });
  };
}
