import type { BlockComponentProps } from "@/types/blocks";
import React from "react";
import QuizOptionsGridBlock from "./QuizOptionsGridBlock";

/**
 * Wrapper/Adaptador para o QuizOptionsGridBlock no contexto do Editor
 *
 * Resolve o desacoplamento de contrato onde:
 * - O Canvas envia `block` (via SortableBlockWrapper)
 * - Mas QuizOptionsGridBlock espera `propriedades`
 *
 * Este componente faz a adaptação necessária.
 */
export const EditorOptionsGridBlock: React.FC<BlockComponentProps> = ({
  block,
  onPropertyChange,
  ...otherProps
}) => {
  // Adaptação: extrair propriedades do block e repassar
  const handlePropertyChange = (property: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(property, value);
    }
  };

  // Garantir que as propriedades tenham pelo menos a estrutura mínima esperada
  const properties = {
    options: [], // fallback para evitar erro de prop obrigatória
    ...block.properties, // sobrescrever com as propriedades reais do block
  } as any; // Type assertion para evitar conflitos de TypeScript

  return (
    <QuizOptionsGridBlock
      id={block.id}
      type={block.type || "options-grid"}
      properties={properties}
      onPropertyChange={handlePropertyChange}
      {...otherProps}
    />
  );
};

export default EditorOptionsGridBlock;
