/**
 * 🎯 ATOMIC BLOCK PROPS - INTERFACE UNIFICADA
 * 
 * Interface padrão para todos os blocos atômicos modulares
 * Garante compatibilidade entre UniversalBlockRenderer e componentes
 */

import { Block } from './editor';

export interface AtomicBlockProps {
  /** Bloco completo com todas as propriedades */
  block: Block;
  
  /** Se o bloco está selecionado no editor */
  isSelected?: boolean;
  
  /** Se o bloco é editável (modo editor vs preview) */
  isEditable?: boolean;
  
  /** Callback para atualizar propriedades do bloco */
  onUpdate?: (updates: Partial<Block>) => void;
  
  /** Callback para deletar o bloco */
  onDelete?: () => void;
  
  /** Callback ao clicar no bloco */
  onClick?: () => void;
}

export default AtomicBlockProps;
