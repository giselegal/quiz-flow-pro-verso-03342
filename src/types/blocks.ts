// Re-export canonical block interfaces from the consolidated core definitions.
// This file acts as a compatibility shim so older imports (`@/types/blocks`) keep working
// while the codebase migrates to the unified types in `src/types/core/BlockInterfaces.ts`

// Prefer the canonical `Block` definition used by the editor to avoid incompatibilities
export type { Block as Block } from '@/types/editor';
export type { UnifiedBlockComponentProps as BlockComponentProps, BlockComponent, TypedBlockComponentProps } from '@/types/core/BlockInterfaces';
export { asBlockComponent, createBlockComponent } from '@/types/core/BlockInterfaces';

// Re-export the canonical BlockType from the main editor types (large union)
export type { BlockType } from '@/types/editor';

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

// Preserve a default export for modules that import the default `Block`.
// Provide a permissive placeholder — this file's purpose is type compatibility only.
import type { BlockData } from '@/types/core/BlockInterfaces';
export default (undefined as unknown) as BlockData;
