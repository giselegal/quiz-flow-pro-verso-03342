/**
 * 🎯 INLINE BLOCK PROPS - Interface Unificada para Componentes Inline
 * 
 * Esta interface resolve os conflitos de tipo entre múltiplas definições de BlockComponentProps.
 * Serve como interface canônica para TODOS os componentes inline de blocos.
 * 
 * ✅ Garante que todos os componentes inline tenham acesso às propriedades essenciais:
 * - isSelected, onClick, onPropertyChange (para o Painel de Propriedades)
 * - className, onValidate, contextData (para funcionalidades avançadas)
 * 
 * @version 1.0.0
 * @phase CORREÇÃO CRÍTICA - Painel de Propriedades
 */

import type { Block } from '@/types/editor';
import type { UnifiedBlockComponentProps } from '@/types/core/BlockInterfaces';

/**
 * 🎯 INLINE BLOCK PROPS
 * 
 * Interface explícita que estende UnifiedBlockComponentProps com garantias de tipo.
 * Todos os componentes em src/components/blocks/inline/ devem usar esta interface.
 * 
 * @example
 * ```tsx
 * import { InlineBlockProps } from '@/types/InlineBlockProps';
 * 
 * interface ButtonInlineFixedProps extends InlineBlockProps {
 *   disabled?: boolean;
 * }
 * 
 * const ButtonInlineFixed: React.FC<ButtonInlineFixedProps> = ({
 *   block,
 *   isSelected,      // ✅ Funciona
 *   onClick,         // ✅ Funciona
 *   onPropertyChange // ✅ Funciona
 * }) => { ... }
 * ```
 */
export interface InlineBlockProps extends UnifiedBlockComponentProps {
  // ===== CORE PROPS (GARANTIDAS) =====
  
  /**
   * Dados completos do bloco
   * @required
   */
  block: Block;
  
  /**
   * Se o bloco está selecionado no editor
   * Usado para aplicar estilos de seleção (ring, border, etc)
   * @default false
   */
  isSelected?: boolean;
  
  /**
   * Callback para seleção do bloco
   * Dispara quando usuário clica no bloco no canvas
   * @example onClick={() => setSelectedBlockId(block.id)}
   */
  onClick?: () => void;
  
  /**
   * Callback para mudança de propriedade específica
   * Usado pelo Painel de Propriedades para edição inline
   * @param key - Nome da propriedade (ex: 'fontSize', 'color')
   * @param value - Novo valor da propriedade
   * @example onPropertyChange('fontSize', '4xl')
   */
  onPropertyChange?: (key: string, value: any) => void;
  
  /**
   * Callback para validação do bloco
   * Retorna true se o bloco está válido, false caso contrário
   * Usado em formulários e campos obrigatórios
   * @returns true se válido, false se inválido
   */
  onValidate?: (isValid: boolean) => void;
  
  /**
   * Classes CSS adicionais para customização
   * @example className="my-custom-style animate-fade-in"
   */
  className?: string;
  
  /**
   * Se o bloco está em modo editável (editor) vs preview/produção
   * @default false
   */
  isEditable?: boolean;
  
  /**
   * Se está em modo preview (não editor)
   * @default false
   */
  isPreviewMode?: boolean;
  
  /**
   * Callback para atualizar o bloco completo
   * @param updates - Objeto parcial com campos a atualizar
   */
  onUpdate?: (updates: Partial<Block>) => void;
  
  /**
   * Callback para deletar o bloco
   */
  onDelete?: () => void;
  
  /**
   * Dados de contexto (sessionId, user, quiz state, etc)
   */
  contextData?: Record<string, any>;
  
  // ===== QUIZ-SPECIFIC PROPS =====
  
  /**
   * Callback para avançar para próximo step
   */
  onNext?: () => void;
  
  /**
   * Callback para voltar para step anterior
   */
  onPrevious?: () => void;
  
  /**
   * Se o usuário pode avançar (validação passou)
   */
  canProceed?: boolean;
  
  /**
   * ID da sessão ativa do quiz
   */
  sessionId?: string;
}

/**
 * 🔄 COMPATIBILITY ALIAS
 * Para componentes que ainda usam o nome antigo
 */
export type InlineBlockComponentProps = InlineBlockProps;

/**
 * 🎯 TYPE GUARD
 * Verifica se um objeto é um InlineBlockProps válido
 */
export function isInlineBlockProps(obj: any): obj is InlineBlockProps {
  return obj && typeof obj === 'object' && 'block' in obj && obj.block?.id && obj.block?.type;
}

/**
 * 🛠️ HELPER: Extrai props do bloco
 * Útil para passar props para componentes filhos
 */
export function extractBlockProps(props: InlineBlockProps): Pick<InlineBlockProps, 'isSelected' | 'onClick' | 'onPropertyChange' | 'className'> {
  return {
    isSelected: props.isSelected,
    onClick: props.onClick,
    onPropertyChange: props.onPropertyChange,
    className: props.className,
  };
}
