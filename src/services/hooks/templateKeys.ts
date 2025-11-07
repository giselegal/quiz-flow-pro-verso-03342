/**
 * 🔑 TEMPLATE QUERY KEYS FACTORY
 * 
 * Factory para criar query keys consistentes para React Query
 * Garante cache consistency e invalidação correta
 * 
 * Padrão:
 * - All: ['templates']
 * - Template: ['templates', templateId]
 * - Step: ['templates', templateId, 'step', stepId]
 * 
 * @module templateKeys
 */

export const templateKeys = {
  /**
   * Key base para todos os templates
   */
  all: ['templates'] as const,

  /**
   * Keys para listas de templates
   */
  lists: () => [...templateKeys.all, 'list'] as const,

  /**
   * Key para lista com filtros
   */
  list: (filters?: Record<string, any>) => 
    [...templateKeys.lists(), filters] as const,

  /**
   * Keys para templates específicos
   */
  templates: () => [...templateKeys.all, 'template'] as const,

  /**
   * Key para um template específico
   */
  template: (templateId: string) => 
    [...templateKeys.templates(), templateId] as const,

  /**
   * Keys para steps de templates
   */
  steps: (templateId: string) => 
    [...templateKeys.template(templateId), 'steps'] as const,

  /**
   * Key para um step específico
   */
  step: (templateId: string, stepId: string) => 
    [...templateKeys.steps(templateId), stepId] as const,

  /**
   * Keys para metadata de templates
   */
  metadata: (templateId: string) => 
    [...templateKeys.template(templateId), 'metadata'] as const,

  /**
   * Keys para validação
   */
  validation: (templateId: string) => 
    [...templateKeys.template(templateId), 'validation'] as const,
} as const;

/**
 * Helper para criar stepKeys sem templateId (usa 'default')
 */
export const stepKeys = {
  /**
   * Key para step sem template específico
   */
  step: (stepId: string) => 
    templateKeys.step('default', stepId),
  
  /**
   * Key para múltiplos steps
   */
  steps: (stepIds: string[]) => 
    stepIds.map(id => stepKeys.step(id)),
} as const;
