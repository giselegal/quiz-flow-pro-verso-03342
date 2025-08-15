'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface DescriptionTextComponentProps {
  description?: string;
  highlightedPhrases?: Array<{
    text: string;
    color?: string;
    fontWeight?: string;
  }>;
  textColor?: string;
  fontSize?: 'sm' | 'base' | 'lg';
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: 'tight' | 'normal' | 'relaxed';
  className?: string;
  isEditable?: boolean;
  onPropertyChange?: (key: string, value: any) => void;
}

/**
 * DescriptionTextComponent - Componente modular para texto descritivo
 * 
 * Características:
 * - Suporte a frases destacadas configuráveis
 * - Cores da marca
 * - Formatação flexível
 * - Totalmente editável
 */
const DescriptionTextComponent: React.FC<DescriptionTextComponentProps> = ({
  description = "Em poucos minutos, descubra seu Estilo Predominante — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.",
  highlightedPhrases = [
    { text: "Estilo Predominante", color: "#B89B7A", fontWeight: "600" },
    { text: "essência", color: "#432818", fontWeight: "600" },
    { text: "confiança", color: "#432818", fontWeight: "600" },
  ],
  textColor = "#6B7280",
  fontSize = "base",
  textAlign = "center",
  lineHeight = "relaxed",
  className = "",
  isEditable = false,
  onPropertyChange,
}) => {

  // Função para aplicar destaque a frases específicas
  const renderHighlightedText = (text: string) => {
    let highlightedText = text;
    
    highlightedPhrases.forEach(phrase => {
      const regex = new RegExp(`\\b${phrase.text}\\b`, 'gi');
      highlightedText = highlightedText.replace(
        regex, 
        `<span style="color: ${phrase.color}; font-weight: ${phrase.fontWeight || '400'}">${phrase.text}</span>`
      );
    });
    
    return highlightedText;
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-sm';
      case 'base': return 'text-sm sm:text-base';
      case 'lg': return 'text-base sm:text-lg';
      default: return 'text-sm sm:text-base';
    }
  };

  const getTextAlignClass = () => {
    switch (textAlign) {
      case 'left': return 'text-left';
      case 'right': return 'text-right';
      case 'center': 
      default: return 'text-center';
    }
  };

  const getLineHeightClass = () => {
    switch (lineHeight) {
      case 'tight': return 'leading-tight';
      case 'normal': return 'leading-normal';
      case 'relaxed': return 'leading-relaxed';
      default: return 'leading-relaxed';
    }
  };

  return (
    <div 
      className={cn(
        "w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mx-auto",
        isEditable && "border-2 border-dashed border-gray-300 hover:border-[#B89B7A] transition-colors p-2",
        className
      )}
      data-component="description-text"
    >
      {/* Texto descritivo */}
      <p
        className={cn(
          getFontSizeClass(),
          getTextAlignClass(),
          getLineHeightClass(),
          "px-2"
        )}
        style={{ color: textColor }}
        dangerouslySetInnerHTML={{ 
          __html: renderHighlightedText(description) 
        }}
      />

      {/* Painel de edição (se editável) */}
      {isEditable && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
          <strong>Texto Descritivo:</strong> Editável via painel<br />
          <strong>Frases destacadas:</strong> {highlightedPhrases.map(p => p.text).join(', ')}
        </div>
      )}
    </div>
  );
};

export default DescriptionTextComponent;