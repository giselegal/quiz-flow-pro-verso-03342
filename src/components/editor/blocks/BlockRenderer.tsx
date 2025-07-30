/**
 * BlockRenderer - Wrapper para UniversalBlockRenderer
 * 
 * Este arquivo atua como um wrapper limpo para o UniversalBlockRenderer,
 * mantendo compatibilidade com importações existentes.
 * 
 * LIMPEZA: Janeiro 2025 - Removida duplicação de código de SchemaDrivenEditorLayoutV2
 */

export { 
  UniversalBlockRenderer as BlockRenderer,
  type BlockRendererProps 
} from './UniversalBlockRenderer';

// Re-export padrão para compatibilidade
export { UniversalBlockRenderer as default } from './UniversalBlockRenderer';
