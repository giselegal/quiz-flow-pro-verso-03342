/**
 * BlockRenderer - Wrapper para UniversalBlockRenderer
 *
 * Este arquivo atua como um wrapper limpo para o UniversalBlockRenderer,
 * mantendo compatibilidade com importações existentes.
 *
 * LIMPEZA: Janeiro 2025 - Removida duplicação de código de SchemaDrivenEditorLayoutV2
 */

import UniversalBlockRenderer from './UniversalBlockRenderer';
import type { BlockRendererProps } from './UniversalBlockRenderer';

export { UniversalBlockRenderer as BlockRenderer, type BlockRendererProps };

// Re-export padrão para compatibilidade
export { default } from './UniversalBlockRenderer';
