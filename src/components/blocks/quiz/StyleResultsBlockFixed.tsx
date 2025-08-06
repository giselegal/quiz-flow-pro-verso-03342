import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import type { BlockComponentProps } from "@/types/blocks";
import { cn } from "@/lib/utils";

interface StyleResultsProperties {
  styleType?: string;
  styleDescription?: string;
  styleImage?: string;
  primaryColor?: string;
  secondaryColor?: string;
  showPersonality?: boolean;
  personalityTraits?: string;
  showStyleTips?: boolean;
  styleTips?: string;
  showColorPalette?: boolean;
  colorPalette?: string;
  resultLayout?: 'simple' | 'detailed' | 'compact' | 'extended';
  showScore?: boolean;
  enableSharing?: boolean;
}

const StyleResultsBlock: React.FC<BlockComponentProps> = ({
  block,
  properties,
  isSelected,
  onClick,
  onPropertyChange,
}) => {
  const {
    styleType = "Seu Estilo Único",
    styleDescription = "Descrição do seu estilo personalizado...",
    styleImage,
    primaryColor = "#432818",
    secondaryColor = "#B89B7A",
    showPersonality = true,
    personalityTraits = "Elegante, Sofisticada, Confiante",
    showStyleTips = true,
    styleTips = "Invista em peças clássicas e atemporais...",
    showColorPalette = true,
    colorPalette = "Tons neutros, beges e marrons",
    resultLayout = "detailed",
    showScore = true,
    enableSharing = false,
  } = (properties || {}) as StyleResultsProperties;

  const handlePropertyUpdate = (key: string, value: any) => {
    onPropertyChange?.(key, value);
  };

  const renderSimpleLayout = () => (
    <div className="text-center">
      <h2 
        className="text-3xl font-bold mb-4"
        style={{ color: primaryColor }}
        contentEditable={isSelected}
        suppressContentEditableWarning
        onBlur={(e) => handlePropertyUpdate('styleType', e.target.textContent || '')}
      >
        {styleType}
      </h2>
      <p 
        className="text-lg text-gray-700"
        contentEditable={isSelected}
        suppressContentEditableWarning
        onBlur={(e) => handlePropertyUpdate('styleDescription', e.target.textContent || '')}
      >
        {styleDescription}
      </p>
    </div>
  );

  const renderDetailedLayout = () => (
    <div className="space-y-6">
      {/* Cabeçalho do Resultado */}
      <div className="text-center">
        <h2 
          className="text-4xl font-bold mb-4"
          style={{ color: primaryColor }}
          contentEditable={isSelected}
          suppressContentEditableWarning
          onBlur={(e) => handlePropertyUpdate('styleType', e.target.textContent || '')}
        >
          {styleType}
        </h2>
        
        {styleImage && (
          <div className="mb-6">
            <img
              src={styleImage}
              alt={styleType}
              className="mx-auto rounded-lg shadow-lg max-w-md w-full"
            />
          </div>
        )}

        <p 
          className="text-lg text-gray-700 max-w-2xl mx-auto"
          contentEditable={isSelected}
          suppressContentEditableWarning
          onBlur={(e) => handlePropertyUpdate('styleDescription', e.target.textContent || '')}
        >
          {styleDescription}
        </p>
      </div>

      {/* Traços de Personalidade */}
      {showPersonality && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3" style={{ color: primaryColor }}>
            Seus Traços de Personalidade
          </h3>
          <p 
            className="text-gray-700"
            contentEditable={isSelected}
            suppressContentEditableWarning
            onBlur={(e) => handlePropertyUpdate('personalityTraits', e.target.textContent || '')}
          >
            {personalityTraits}
          </p>
        </div>
      )}

      {/* Dicas de Estilo */}
      {showStyleTips && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3" style={{ color: primaryColor }}>
            Dicas para Seu Estilo
          </h3>
          <p 
            className="text-gray-700"
            contentEditable={isSelected}
            suppressContentEditableWarning
            onBlur={(e) => handlePropertyUpdate('styleTips', e.target.textContent || '')}
          >
            {styleTips}
          </p>
        </div>
      )}

      {/* Paleta de Cores */}
      {showColorPalette && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3" style={{ color: primaryColor }}>
            Sua Paleta de Cores
          </h3>
          <div className="flex items-center gap-4 mb-3">
            <div 
              className="w-12 h-12 rounded-full border-2 border-gray-300"
              style={{ backgroundColor: primaryColor }}
              title="Cor Primária"
            />
            <div 
              className="w-12 h-12 rounded-full border-2 border-gray-300"
              style={{ backgroundColor: secondaryColor }}
              title="Cor Secundária"
            />
          </div>
          <p 
            className="text-gray-700"
            contentEditable={isSelected}
            suppressContentEditableWarning
            onBlur={(e) => handlePropertyUpdate('colorPalette', e.target.textContent || '')}
          >
            {colorPalette}
          </p>
        </div>
      )}

      {/* Botões de Ação */}
      {enableSharing && (
        <div className="text-center">
          <Button 
            style={{ backgroundColor: secondaryColor, color: 'white' }}
            className="mr-4"
          >
            Compartilhar Resultado
          </Button>
          <Button variant="outline">
            Refazer Quiz
          </Button>
        </div>
      )}
    </div>
  );

  const renderLayout = () => {
    switch (resultLayout) {
      case 'simple':
        return renderSimpleLayout();
      case 'compact':
        return renderSimpleLayout();
      case 'extended':
        return renderDetailedLayout();
      case 'detailed':
      default:
        return renderDetailedLayout();
    }
  };

  return (
    <div 
      className={cn(
        "style-results-block w-full p-6 transition-all duration-200",
        isSelected && 'ring-2 ring-blue-500 ring-opacity-50 rounded-md'
      )}
      data-block-id={block.id}
      onClick={onClick}
    >
      {renderLayout()}
    </div>
  );
};

export default StyleResultsBlock;
