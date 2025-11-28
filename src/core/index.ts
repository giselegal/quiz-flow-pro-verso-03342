/**
 * 📦 CORE - Barrel Export Principal
 * 
 * Ponto de entrada único para todos os módulos core.
 * Exportações explícitas para evitar conflitos de tipos duplicados.
 * 
 * @example
 * ```typescript
 * import { useEditor, Block, persistenceService } from '@/core';
 * ```
 */

// ============================================================================
// CONTEXTS - Exportações seletivas
// ============================================================================
export {
    EditorStateProvider,
    EditorStateProvider as EditorProvider,
    useEditorState,
    useEditor,
    useEditorCompat,
    type EditorContextValue,
    type EditorCompatAPI,
} from './contexts/EditorContext';

export { FunnelContext, generateContextualId, extractContextFromId } from './contexts/FunnelContext';

// ============================================================================
// HOOKS
// ============================================================================
export * from './hooks';

// ============================================================================
// SCHEMAS - Use tipos do schema canonical
// ============================================================================
export {
    BlockSchema,
    BlockTypeSchema,
    BlockPropertiesSchema,
    BlockContentSchema,
    BlockMetadataSchema,
    BlocksArraySchema,
    validateBlock,
    validateBlocks,
    isBlock,
    createBlock,
    type Block,
    type BlockType,
} from './schemas/blockSchema';

// ============================================================================
// SERVICES
// ============================================================================
export * from './services';

// ============================================================================
// UTILS
// ============================================================================
export * from './utils';

// ============================================================================
// DOMAINS - Entidades de domínio (fonte única de verdade)
// ============================================================================
// Nota: Evitar conflito com Block do schema
export {
    Funnel,
    Page,
    Quiz,
    Question,
    Answer,
    ResultProfile,
} from './domains';

// Re-exportar tipos de domínio com namespaces para evitar conflitos
export type {
    FunnelMetadata,
    FunnelSettings,
    PageType,
    BlockContent,
    BlockStyles,
    BlockSettings,
} from './domains';
