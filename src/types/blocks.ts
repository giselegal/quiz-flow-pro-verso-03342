// Re-export canonical block interfaces from the consolidated core definitions.
// This file acts as a compatibility shim so older imports (`@/types/blocks`) keep working
// while the codebase migrates to the unified types in `src/types/core/BlockInterfaces.ts`

// Build a compatibility `Block` type that is based on the editor's canonical Block
// but widens the `type` field to accept unknown string values during migration.
import type React from 'react';
import type { Block as EditorBlock, BlockType as EditorBlockType } from '@/types/editor';
import type { UnifiedBlockComponentProps } from '@/types/core/BlockInterfaces';
import { asBlockComponent as _asBlockComponent, createBlockComponent as _createBlockComponent } from '@/types/core/BlockInterfaces';

// Export a compat `Block` that preserves the editor shape but allows `type` to be
// either the strict union or a plain string. This reduces many "string not assignable
// to BlockType" diagnostics during migration.
export type Block = Omit<EditorBlock, 'type'> & { type: EditorBlockType | string };

export interface CompatBlockComponentProps extends Omit<UnifiedBlockComponentProps, 'block' | 'type'> {
  block?: Block | undefined;
  type?: EditorBlockType | string | undefined;
}

export type BlockComponentProps = CompatBlockComponentProps;
export type BlockComponent = React.ComponentType<BlockComponentProps>;
export type TypedBlockComponentProps<T extends Block = Block> = CompatBlockComponentProps & { block: T };

export const asBlockComponent = _asBlockComponent as (component: any) => BlockComponent;
export const createBlockComponent = _createBlockComponent as <T extends BlockComponentProps = BlockComponentProps>(component: React.ComponentType<T>) => BlockComponent;

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
