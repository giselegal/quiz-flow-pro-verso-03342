import { getBlockComponent } from "@/config/enhancedBlockRegistry";
import { useContainerProperties } from "@/hooks/useContainerProperties";
import { cn } from "@/lib/utils";
import { Block } from "@/types/editor";
import React from "react";

export interface UniversalBlockRendererProps {
  block: Block;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
}

/**
 * UNIVERSAL BLOCK RENDERER - VERSÃO COM SUPORTE A CONTAINER PROPERTIES
 * ✅ Usa o novo ENHANCED_BLOCK_REGISTRY
 * ✅ Compatível com DynamicStepTemplate
 * ✅ Processa propriedades de container usando useContainerProperties hook
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

  // Processar propriedades de container usando o hook
  const { containerClasses, inlineStyles, processedProperties } = useContainerProperties(
    block.properties
  );

  // Log para debug das propriedades de container (apenas em desenvolvimento)
  if (
    process.env.NODE_ENV === "development" &&
    (block.properties?.containerWidth || block.properties?.containerPosition)
  ) {
    console.log(`🎯 Container properties for ${block.id}:`, {
      blockType: block.type,
      originalProperties: block.properties,
      processedProperties,
      generatedClasses: containerClasses,
    });
  }

  if (!Component) {
    // Fallback para tipo desconhecido
    return (
      <div
        className={cn(
          "p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500",
          containerClasses
        )}
        onClick={onClick}
        style={inlineStyles}
      >
        <p>Componente não encontrado: {block.type}</p>
        <p className="text-xs mt-1">Verifique se o tipo está registrado</p>
      </div>
    );
  }

  try {
    return (
      <div
        className={cn(
          "block-wrapper transition-all duration-200",
          containerClasses,
          isSelected && "ring-2 ring-[#B89B7A] ring-offset-2"
        )}
        onClick={onClick}
        style={inlineStyles}
      >
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
