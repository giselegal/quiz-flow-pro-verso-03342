/**
 * 🎯 CORE QUIZ - UNIFIED EXPORTS
 * 
 * Ponto de entrada unificado para o sistema oficial de Quiz/Funil.
 * Exporta todos os módulos das Waves 1 e 2.
 * 
 * @version 1.0.0
 * @waves 1, 2
 */

// ===== WAVE 1: TYPES & REGISTRY =====

// Template/Funnel Types
export type {
  TemplateVersion,
  TemplateCategoryEnum,
  StepTypeEnum,
  FunnelMetadata,
  FunnelSettings,
  FunnelStep,
  FunnelTemplate,
  FunnelResult,
  TemplateValidationResult,
} from './templates/types';

// Block Types
export type {
  BlockCategoryEnum,
  PropertyTypeEnum,
  BlockPropertyDefinition,
  BlockDefinition,
  BlockInstance,
  BlockRenderConfig,
  BlockValidationResult,
  BlockTypeAlias,
} from './blocks/types';

// Block Registry
export { BlockRegistry, default as BlockRegistryDefault } from './blocks/registry';

// ===== WAVE 2: ADAPTERS, VALIDATION, LOADING =====

// Block Adapters
export {
  adaptLegacyBlock,
  adaptLegacyBlocks,
  adaptLegacyStep,
  isValidBlockInstance,
  normalizeBlockInstance,
  cloneBlockInstance,
} from './blocks/adapters';

// Block Schemas & Validation
export {
  PropertyTypeSchema,
  BlockCategorySchema,
  BlockPropertyDefinitionSchema,
  BlockDefinitionSchema,
  BlockInstanceSchema,
  BlockRenderConfigSchema,
  BlockValidationResultSchema,
  validateBlockDefinition,
  validateBlockInstance,
  validateBlockProperties,
  isBlockDefinition,
  isBlockInstance,
} from './blocks/schemas';

// Template Schemas & Validation
export {
  TemplateVersionSchema,
  TemplateCategorySchema,
  StepTypeSchema,
  FunnelMetadataSchema,
  FunnelSettingsSchema,
  FunnelStepSchema,
  FunnelTemplateSchema,
  FunnelResultSchema,
  TemplateValidationResultSchema,
  validateFunnelTemplate,
  validateFunnelStep,
  validateFunnelMetadata,
  validateTemplateIntegrity,
  isFunnelTemplate,
  isFunnelStep,
  isFunnelMetadata,
} from './templates/schemas';

// Template Loader
export {
  TemplateLoader,
  default as TemplateLoaderDefault,
} from './templates/loader';
export type {
  TemplateSource,
  LoadOptions,
  LoadResult,
} from './templates/loader';

// React Hooks
export {
  useBlockDefinition,
  useBlocksByCategory,
  useAllBlockTypes,
  useResolveBlockType,
  useHasBlockType,
} from './hooks/useBlockDefinition';

export {
  useBlockValidation,
  useBlockPropertiesValidation,
} from './hooks/useBlockValidation';
export type { BlockValidationHookResult } from './hooks/useBlockValidation';

// Quiz Hooks (migrated from /src/hooks)
export * from './hooks';

// ===== RE-EXPORTS FOR CONVENIENCE =====

/**
 * Principais exports que todo mundo precisa
 */
export { BlockRegistry as Registry } from './blocks/registry';
export { TemplateLoader as Loader } from './templates/loader';
