import { getEnhancedComponent, getRegistryStats } from "@/config/enhancedBlockRegistry";
import { Block } from "@/types/editor";
import React from "react";

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
  // Debug logging
  console.log(`🎯 UniversalBlockRenderer: Renderizando ${block.type}`, {
    blockId: block.id,
    blockType: block.type,
    hasProperties: !!block.properties,
    propertiesCount: Object.keys(block.properties || {}).length,
    isSelected,
  });

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
    const registryStats = getRegistryStats();
    console.error(`❌ UniversalBlockRenderer: Componente não encontrado para tipo: ${block.type}`, {
      availableTypes: registryStats.components,
      blockId: block.id,
    });

    return (
      <div className="p-4 border-2 border-dashed border-red-300 rounded-lg bg-red-50">
        <div className="text-center">
          <div className="text-red-600 font-medium">⚠️ Componente não encontrado</div>
          <div className="text-sm mt-1">Tipo: {block.type}</div>
          <div className="text-xs text-stone-500 mt-2">ID: {block.id}</div>
          <div className="text-xs text-stone-400 mt-1">
            Props: {Object.keys(block.properties || {}).join(", ")}
          </div>
        </div>
      </div>
    );
  }

  console.log(
    `✅ UniversalBlockRenderer: Componente encontrado para ${block.type}, renderizando...`
  );

  try {
    return <Component {...blockProps} />;
  } catch (error) {
    console.error(`❌ UniversalBlockRenderer: Erro ao renderizar ${block.type}:`, error, {
      blockId: block.id,
      blockProps,
    });

    return (
      <div className="p-4 border-2 border-dashed border-orange-300 rounded-lg bg-orange-50">
        <div className="text-center">
          <div className="text-orange-600 font-medium">⚠️ Erro na renderização</div>
          <div className="text-sm mt-1">Tipo: {block.type}</div>
          <div className="text-xs text-stone-500 mt-2">ID: {block.id}</div>
          <div className="text-xs text-stone-400 mt-1">Erro: {String(error)}</div>
        </div>
      </div>
    );
  }
};
export default UniversalBlockRenderer;
export { UniversalBlockRenderer };
