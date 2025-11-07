/**
 * React Query hook for template preparation
 * 
 * Provides a mutation hook to prepare templates with:
 * - Automatic AbortSignal handling
 * - Loading and error states
 * - Success callbacks
 * - Retry logic
 * 
 * @module hooks/usePrepareTemplate
 */

import { useMutation, type UseMutationOptions, type UseMutationResult } from '@tanstack/react-query';
import { templateService } from '../canonical/TemplateService';
import type { ServiceResult } from '../canonical/types';

/**
 * Options for the usePrepareTemplate hook
 */
export interface UsePrepareTemplateOptions extends Omit<UseMutationOptions<ServiceResult<void>, Error, PrepareTemplateMutationVariables>, 'mutationFn'> {
  /**
   * Callback invoked on successful template preparation
   */
  onSuccess?: (data: ServiceResult<void>, variables: PrepareTemplateMutationVariables) => void;
  
  /**
   * Callback invoked on error
   */
  onError?: (error: Error, variables: PrepareTemplateMutationVariables) => void;
  
  /**
   * Number of retry attempts (default: 2)
   */
  retry?: number;
}

/**
 * Variables passed to the prepare template mutation
 */
export interface PrepareTemplateMutationVariables {
  /**
   * ID of the template to prepare
   */
  templateId: string;
  
  /**
   * Optional preparation options
   */
  options?: {
    /**
     * Whether to preload all steps
     */
    preloadAll?: boolean;
  };
}

/**
 * Hook to prepare a template for editing
 * 
 * Prepares a template by loading metadata and optionally preloading all steps.
 * Uses React Query mutation for automatic state management and AbortSignal support.
 * 
 * @example
 * ```tsx
 * const { mutate: prepareTemplate, isPending, isError, error } = usePrepareTemplate({
 *   onSuccess: (result) => {
 *     console.log('Template prepared successfully');
 *   },
 *   onError: (error) => {
 *     console.error('Failed to prepare template:', error);
 *   }
 * });
 * 
 * // Prepare template
 * prepareTemplate({
 *   templateId: 'quiz21StepsComplete',
 *   options: { preloadAll: true }
 * });
 * ```
 * 
 * @param options - Configuration options for the mutation
 * @returns Mutation result with mutate/mutateAsync functions and state
 */
export function usePrepareTemplate(
  options: UsePrepareTemplateOptions = {}
): UseMutationResult<ServiceResult<void>, Error, PrepareTemplateMutationVariables> {
  const { onSuccess, onError, retry = 2, ...mutationOptions } = options;

  return useMutation<ServiceResult<void>, Error, PrepareTemplateMutationVariables>({
    mutationFn: async ({ templateId, options: prepareOptions }) => {
      // Call templateService with options
      const result = await templateService.prepareTemplate(templateId, prepareOptions);
      
      // Throw error if preparation failed
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
 * Hook variant that returns a simple prepare function
 * 
 * Simplified version that returns just the prepare function,
 * hiding the mutation details.
 * 
 * @example
 * ```tsx
 * const prepareTemplate = usePrepareTemplateFn();
 * 
 * await prepareTemplate('quiz21StepsComplete', { preloadAll: true });
 * ```
 * 
 * @param options - Configuration options
 * @returns Function to prepare a template
 */
export function usePrepareTemplateFn(options: UsePrepareTemplateOptions = {}) {
  const { mutateAsync } = usePrepareTemplate(options);
  
  return async (templateId: string, prepareOptions?: { preloadAll?: boolean }) => {
    return mutateAsync({ templateId, options: prepareOptions });
  };
}
