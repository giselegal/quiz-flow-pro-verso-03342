import type { BlockComponentProps } from "@/types/blocks";
import React from "react";
import QuizOptionsGridBlock from "./QuizOptionsGridBlock";

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
  console.log("🔍 EditorOptionsGridBlock - props recebidas:", {
    blockId: block.id,
    blockType: block.type,
    properties: block.properties,
    hasOptions: !!block.properties?.options,
    optionsLength: Array.isArray(block.properties?.options) ? block.properties.options.length : 0,
  });

  // Adaptação: extrair propriedades do block e repassar
  const handlePropertyChange = (property: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(property, value);
    }
  };

  // Garantir que as propriedades tenham a estrutura correta
  const properties = {
    options: block.properties?.options || [],
    ...block.properties,
  } as any; // Type assertion para contornar TypeScript restritivo

  // Passar as propriedades diretamente sem modificação
  return (
    <QuizOptionsGridBlock
      id={block.id}
      type={block.type || "options-grid"}
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
