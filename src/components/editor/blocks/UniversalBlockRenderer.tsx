import { getBlockComponent } from "@/config/enhancedBlockRegistry";
import { Block } from "@/types/editor";
import React from "react";

export interface UniversalBlockRendererProps {
  block: Block;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
}

/**
 * UNIVERSAL BLOCK RENDERER - VERSÃO SIMPLIFICADA
 * ✅ Usa o novo ENHANCED_BLOCK_REGISTRY
 * ✅ Compatível com DynamicStepTemplate
 * ✅ Sem dependências quebradas
 */
const UniversalBlockRenderer: React.FC<UniversalBlockRendererProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
}) => {
  // Buscar componente no registry
  const Component = getBlockComponent(block.type);

  if (!Component) {
    // Fallback para tipo desconhecido
    return (
      <div
        className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500"
        onClick={onClick}
      >
        <p>Componente não encontrado: {block.type}</p>
        <p className="text-xs mt-1">Verifique se o tipo está registrado</p>
      </div>
    );
  }

  try {
    return (
      <div className={`block-wrapper ${isSelected ? "selected" : ""}`} onClick={onClick}>
        <Component
          block={block}
          isSelected={isSelected}
          onClick={onClick}
          onPropertyChange={onPropertyChange}
        />
      </div>
    );
  } catch (error) {
    console.error(`Erro ao renderizar bloco ${block.type}:`, error);

    return (
      <div
        className="p-4 border-2 border-red-300 rounded-lg text-center text-red-500"
        onClick={onClick}
      >
        <p>Erro ao renderizar: {block.type}</p>
        <p className="text-xs mt-1">
          {error instanceof Error ? error.message : "Erro desconhecido"}
        </p>
      </div>
    );
  }
};

export default UniversalBlockRenderer;
