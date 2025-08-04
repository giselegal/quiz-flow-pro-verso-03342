import React from "react";
import { Block } from "@/types/editor";
import { getEnhancedComponent } from "@/config/enhancedBlockRegistry";

export interface BlockRendererProps {
  block: Block;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
}

interface UniversalBlockRendererProps {
  block: Block;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
}

const UniversalBlockRenderer: React.FC<UniversalBlockRendererProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  disabled = false,
}) => {
  const blockProps = {
    block,
    isSelected,
    onClick,
    onPropertyChange,
    disabled,
  };

  // Usar o Enhanced Block Registry validado
  const Component = getEnhancedComponent(block.type);

  if (!Component) {
    return (
      <div className="p-2 border border-red-300 bg-red-50 rounded-lg text-red-600">
        <div className="text-center">
          <div className="font-medium">⚠️ Componente não encontrado</div>
          <div className="text-sm mt-1">Tipo: {block.type}</div>
          <div className="text-xs text-stone-500 mt-2">ID: {block.id}</div>
        </div>
      </div>
    );
  }

  return <Component {...blockProps} />;
};
export default UniversalBlockRenderer;
export { UniversalBlockRenderer };
