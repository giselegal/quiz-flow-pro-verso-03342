/**
 * 🎯 ATOMIC BLOCK PROPS - Interface padrão para componentes atômicos
 * 
 * Interface unificada para TODOS os componentes atômicos de blocos modulares.
 * Garante compatibilidade com UniversalBlockRenderer e EditorProvider.
 */

import { Block } from './editor';

/**
 * 🎯 ATOMIC BLOCK PROPS - Interface padrão para componentes atômicos
 * 
 * Interface unificada para TODOS os componentes atômicos de blocos modulares.
 * Garante compatibilidade com UniversalBlockRenderer e EditorProvider.
 * 
 * @example
 * ```tsx
 * // ✅ EXEMPLO 1: Componente atômico simples (read-only)
 * export default function TransitionTitleBlock({
 *   block,
 *   isSelected,
 *   onClick
 * }: AtomicBlockProps) {
 *   const title = block.content?.text || 'Preparando...';
 *   const fontSize = block.properties?.fontSize || '3xl';
 *   
 *   return (
 *     <h2 
 *       className={`text-${fontSize} font-bold`}
 *       onClick={onClick}
 *     >
 *       {title}
 *     </h2>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // ✅ EXEMPLO 2: Componente atômico com edição inline
 * export default function EditableTextBlock({
 *   block,
 *   isSelected,
 *   isEditable,
 *   onUpdate,
 *   onClick
 * }: AtomicBlockProps) {
 *   const text = block.content?.text || '';
 *   
 *   const handleChange = (newText: string) => {
 *     if (onUpdate) {
 *       // ✅ Passar apenas os campos que mudaram
 *       onUpdate({ content: { ...block.content, text: newText } });
 *     }
 *   };
 *   
 *   return isEditable ? (
 *     <input 
 *       value={text} 
 *       onChange={(e) => handleChange(e.target.value)}
 *       className={isSelected ? 'ring-2 ring-blue-500' : ''}
 *     />
 *   ) : (
 *     <span onClick={onClick}>{text}</span>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // ✅ EXEMPLO 3: Componente com delete button
 * export default function DeletableBlock({
 *   block,
 *   isSelected,
 *   onDelete,
 *   onClick
 * }: AtomicBlockProps) {
 *   return (
 *     <div onClick={onClick} className="relative group">
 *       <p>{block.content?.text}</p>
 *       {onDelete && (
 *         <button 
 *           onClick={(e) => { e.stopPropagation(); onDelete(); }}
 *           className="absolute top-0 right-0 opacity-0 group-hover:opacity-100"
 *         >
 *           🗑️
 *         </button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export interface AtomicBlockProps {
  /** 
   * Dados completos do bloco (id, type, properties, content)
   * @example { id: 'block-1', type: 'transition-title', properties: { fontSize: '3xl' }, content: { text: 'Hello' } }
   */
  block: Block;
  
  /** 
   * Se o bloco está selecionado no editor 
   * @default false
   */
  isSelected?: boolean;
  
  /** 
   * Se o bloco está em modo editável (editor) vs preview/production
   * @default false
   */
  isEditable?: boolean;
  
  /** 
   * Callback para atualizar propriedades do bloco
   * 
   * ⚠️ IMPORTANTE: Passar apenas os campos que mudaram (merge parcial)
   * 
   * @param updates - Objeto parcial com campos a atualizar
   * @example 
   * // ✅ Correto: atualizar apenas content.text
   * onUpdate({ content: { text: 'Novo texto' } })
   * 
   * // ✅ Correto: atualizar apenas properties.fontSize
   * onUpdate({ properties: { fontSize: '4xl' } })
   * 
   * // ❌ Incorreto: passar block inteiro (pode sobrescrever outros campos)
   * onUpdate(block)
   */
  onUpdate?: (updates: Partial<Block>) => void;
  
  /** 
   * Callback para deletar o bloco
   * @example <button onClick={onDelete}>Delete</button>
   */
  onDelete?: () => void;
  
  /** 
   * Callback para clique no bloco (seleção no editor)
   * @example <div onClick={onClick}>...</div>
   */
  onClick?: () => void;
}
