// Compatibility shim: re-export canonical block types and helpers so older imports
// (`@/types/blocks`) keep working while the codebase migrates to the unified
// types defined in `src/types/core/BlockInterfaces.ts` and `src/types/editor.ts`.

// Re-export canonical types from the unified modules so all imports resolve
// to the exact same type identity (prevents prop-type / validator mismatches).
export type { BlockData, BlockDefinition, UnifiedBlockComponentProps, BlockComponentProps, BlockComponent, TypedBlockComponentProps, EditableBlockComponentProps, QuizBlockComponentProps } from '@/types/core/BlockInterfaces';
// Re-export from blockProps.ts for unified access
export type { AtomicBlockProps, UnifiedBlockProps } from '@/types/blockProps';
// Re-export InlineBlockProps - interface canônica para componentes inline
export type { InlineBlockProps, InlineBlockComponentProps } from '@/types/InlineBlockProps';
// Preserve the historical `Block` name (many files / propTypes expect `Block`)
export type { Block } from '@/types/block.types';
export type { BlockType } from '@/types/editor';

// Re-export helpers / factory functions from the canonical definitions
export { asBlockComponent, createBlockComponent } from '@/types/core/BlockInterfaces';

// Convenience helper preserved for code that used createDefaultBlock
import { generateSemanticId } from '@/lib/utils/semanticIdGenerator';
import type { BlockData as CanonBlock } from '@/types/core/BlockInterfaces';
import type { BlockType as CanonBlockType } from '@/types/editor';

export const createDefaultBlock = (type: CanonBlockType | string, stageId?: string | null): CanonBlock => ({
  id: generateSemanticId({ context: stageId ?? 'default', type: 'block', identifier: String(type), index: 1 }),
  type: String(type),
  properties: {},
  content: {},
  order: 1,
});

// Preserve a permissive default export for modules that previously relied on it.
import type { BlockData } from '@/types/core/BlockInterfaces';
export default (undefined as unknown) as BlockData;
