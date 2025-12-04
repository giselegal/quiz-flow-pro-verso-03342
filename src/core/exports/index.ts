/**
 * 🎯 CENTRAL EXPORTS - Ponto único de exportação
 * 
 * Este arquivo consolida todos os exports principais do sistema
 * para evitar duplicações e conflitos de importação.
 * 
 * Organização:
 * - Hooks do Editor
 * - Stores
 * - Serviços
 * - Contextos
 * - Utilities
 */

// ============================================================================
// HOOKS DO EDITOR
// ============================================================================

/**
 * Hook principal do editor - CANÔNICO (FASE 2)
 * Retorna contexto unificado do editor
 */
export { useEditorContext } from '@/core/hooks/useEditorContext';

/**
 * Hook do editor (alias para compatibilidade)
 * Usa implementação legada que redireciona para @core
 */
export { useEditor } from '@/hooks/useEditor';

/**
 * Adapter para gerenciamento de blocos
 * Localização canônica: @/core/editor/hooks/useEditorAdapter
 */
export { useEditorAdapter } from '@/core/editor/hooks/useEditorAdapter';

// ============================================================================
// STORES (ZUSTAND)
// ============================================================================

/**
 * Store principal do ModernQuizEditor
 */
export { useQuizStore } from '@/components/editor/ModernQuizEditor/store/quizStore';

/**
 * Store de estado do editor
 */
export { useEditorStore } from '@/components/editor/ModernQuizEditor/store/editorStore';

// ============================================================================
// CONTEXTOS
// ============================================================================

/**
 * Provider unificado do editor
 */
export { EditorProvider } from '@/contexts/editor/EditorContext';

/**
 * Providers de runtime
 */
export { EditorRuntimeProviders } from '@/contexts/editor/EditorRuntimeProviders';

// ============================================================================
// SERVIÇOS
// ============================================================================

/**
 * Serviço de funnel unificado (Canônico)
 * @see /src/services/canonical/FunnelService.ts
 */
export { funnelService } from '@/services';

/**
 * Serviço de template
 */
export { templateService } from '@/services';

/**
 * Serviço de storage
 */
export { default as storageService } from '@/core/services/StorageService';

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Logger da aplicação
 */
export { appLogger } from '@/lib/utils/appLogger';

/**
 * Event Emitter
 */
export { default as EventEmitter } from '@/lib/utils/EventEmitter';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

/**
 * Tipos do editor - Schema Zod
 */
export type {
  QuizStep,
  QuizBlock,
  BlockType
} from '@/schemas/quiz-schema.zod';

/**
 * Tipos do core - Editor State e Actions
 */
export type { EditorState } from '@/types/editorTypes';
export type { EditorActions } from '@/types/editorActions';
