/**
 * 🎯 DATA INDEX - ESTRUTURA CONSOLIDADA
 * 
 * Estrutura organizada após Sprint 4:
 * 
 * src/data/
 * ├── templates/          # Templates de quiz e funnels
 * │   ├── quiz21StepsComplete.ts
 * │   └── index.ts
 * ├── registry/           # Definições e mapeamentos
 * │   ├── blockTypes.ts
 * │   └── index.ts
 * ├── defaults/           # Valores padrão
 * │   └── index.ts
 * └── index.ts (este arquivo)
 * 
 * SPRINT 4 - Consolidação de dados
 */

// ============================================================================
// TEMPLATES
// ============================================================================

export * from './templates';

// ============================================================================
// REGISTRY
// ============================================================================

export * from './registry';

// ============================================================================
// DEFAULTS
// ============================================================================

export * from './defaults';

// ============================================================================
// OUTROS (manter temporariamente para compatibilidade)
// ============================================================================

export * from './imageBank';
// export * from './generateQuizPages';

// ============================================================================
// DEPRECATED (manter por compatibilidade, remover em próxima iteração)
// ============================================================================

// @deprecated Use QUIZ_21_STEPS_COMPLETE from templates/
export * from './quizSteps';

// @deprecated Use BLOCK_TYPES_REGISTRY from registry/
export * from './componentDefinitions';
