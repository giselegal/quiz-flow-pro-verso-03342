// Adaptadores entre o tipo legado do editor e o tipo canônico
// Evita duplicação de lógica de conversão espalhada pelo código.

import type { Block as CanonBlock } from './block.types';
import type { Block as EditorBlock } from './editor';

export function toCanonicalBlock(editorBlock: EditorBlock): CanonBlock {
  const { id, type, content, properties, children } = editorBlock as any;
  const props: Record<string, unknown> = {
    ...(properties || {}),
    ...(content || {}),
  };
  const canonChildren: CanonBlock[] | undefined = Array.isArray(children)
    ? (children as any[]).map(toCanonicalBlock)
    : undefined;
  return {
    id,
    type: String(type),
    props,
    children: canonChildren,
  };
}

export function toEditorBlock(block: CanonBlock): EditorBlock {
  // Atenção: como não temos todas as propriedades do tipo legado,
  // criamos um bloco mínimo compatível e deixamos campos opcionais vazios.
  const editorLike: any = {
    id: block.id,
    type: block.type,
    properties: block.props || {},
    content: {},
    order: 0,
  };
  if (Array.isArray(block.children)) {
    editorLike.children = block.children.map(toEditorBlock);
  }
  return editorLike as EditorBlock;
}
