/**
 * 🎯 ATOMIC BLOCK PROPS - Interface padrão para componentes atômicos
 * 
 * Interface unificada para TODOS os componentes atômicos de blocos modulares.
 * Garante compatibilidade com UniversalBlockRenderer e EditorProvider.
 */

import { Block } from './editor';

/**
 * Interface padrão para TODOS os componentes atômicos de blocos
 * 
 * IMPORTANTE: Todos os blocos atômicos devem implementar esta interface
 * para garantir compatibilidade com UniversalBlockRenderer
 * 
 * @example
 * ```tsx
 * export default function TransitionTitleBlock({
 *   block,
 *   isSelected,
 *   onClick
 * }: AtomicBlockProps) {
 *   const title = block.content?.text || 'Default';
 *   return <h2 onClick={onClick}>{title}</h2>;
 * }
 * ```
 */
export interface AtomicBlockProps {
  /** Dados completos do bloco (id, type, properties, content) */
  block: Block;
  
  /** Se o bloco está selecionado no editor */
  isSelected?: boolean;
  
  /** Se o bloco está em modo editável (vs preview/production) */
  isEditable?: boolean;
  
  /** Callback para atualizar propriedades do bloco */
  onUpdate?: (updates: Partial<Block>) => void;
  
  /** Callback para deletar o bloco */
  onDelete?: () => void;
  
  /** Callback para clique no bloco (seleção) */
  onClick?: () => void;
}
