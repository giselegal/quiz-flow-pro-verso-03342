import type { BlockComponentProps } from '@/types/blocks';
import QuizOptionsGridBlock from './QuizOptionsGridBlock';

/**
 * Wrapper/Adaptador para o QuizOptionsGridBlock no contexto do Editor
 *
 * Resolve o desacoplamento de contrato onde:
 * - O Canvas envia `block` (via SortableBlockWrapper)
 * - Mas QuizOptionsGridBlock espera `properties` + outros props
 *
 * Este componente faz a adaptação necessária.
 */
export const EditorOptionsGridBlock: React.FC<BlockComponentProps> = ({
  block,
  onPropertyChange,
  isSelected,
  onClick,
  className,
  ...otherProps
}) => {
  // 🔍 DEBUG: Log das propriedades recebidas
  console.log('🔍 EditorOptionsGridBlock - props recebidas:', {
    blockId: block.id,
    blockType: block.type,
    properties: block.properties,
    content: (block as any).content, // Verificar se há content também
    hasOptions: !!block.properties?.options,
    hasContentOptions: !!(block as any).content?.options,
    optionsLength: Array.isArray(block.properties?.options) ? block.properties.options.length : 0,
    contentOptionsLength: Array.isArray((block as any).content?.options)
      ? (block as any).content.options.length
      : 0,
  });

  // Adaptação: extrair propriedades do block e repassar
  const handlePropertyChange = (property: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(property, value);
    }
  };

  // ✅ FIX: Verificar se as opções estão em content ao invés de properties
  let finalProperties = block.properties || {};

  // Se não há opções em properties, mas há em content, usar content
  if (
    (!finalProperties.options || finalProperties.options.length === 0) &&
    (block as any).content?.options
  ) {
    console.log('🔧 EditorOptionsGridBlock: Usando content.options ao invés de properties.options');
    finalProperties = {
      ...finalProperties,
      ...(block as any).content,
    };
  }

  // Garantir que as propriedades tenham a estrutura correta
  const properties = {
    options: finalProperties?.options || [],
    ...finalProperties,
  } as any;

  // Passar as propriedades diretamente sem modificação
  return (
    <QuizOptionsGridBlock
      id={block.id}
      type={block.type || 'options-grid'}
      properties={properties}
      onPropertyChange={handlePropertyChange}
      isSelected={isSelected}
      onClick={onClick}
      className={className}
      {...otherProps}
    />
  );
};

export default EditorOptionsGridBlock;
