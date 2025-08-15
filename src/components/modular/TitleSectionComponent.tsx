'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TitleSectionComponentProps {
  title?: string;
  highlightedWordsBefore?: string[];
  highlightedWordsAfter?: string[];
  titleColor?: string;
  highlightColor?: string;
  fontSize?: 'sm' | 'md' | 'lg' | 'xl';
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  className?: string;
  isEditable?: boolean;
  onPropertyChange?: (key: string, value: any) => void;
}

/**
 * TitleSectionComponent - Componente modular para títulos com destaque
 * 
 * Características:
 * - Suporte a palavras destacadas configuráveis
 * - Fonte Playfair Display por padrão
 * - Cores da marca
 * - Totalmente editável
 */
const TitleSectionComponent: React.FC<TitleSectionComponentProps> = ({
  title = "Chega de um guarda-roupa lotado e da sensação de que nada combina com Você.",
  highlightedWordsBefore = ["Chega"],
  highlightedWordsAfter = ["Você"],
  titleColor = "#432818",
  highlightColor = "#B89B7A",
  fontSize = "lg",
  fontFamily = "Playfair Display",
  fontWeight = "400",
  textAlign = "center",
  className = "",
  isEditable = false,
  onPropertyChange: _onPropertyChange,
}) => {

  // Função para destacar palavras específicas
  const renderHighlightedText = (text: string) => {
    let highlightedText = text;
    
    // Destacar palavras "antes"
    highlightedWordsBefore.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      highlightedText = highlightedText.replace(
        regex, 
        `<span style="color: ${highlightColor}">${word}</span>`
      );
    });
    
    // Destacar palavras "depois"
    highlightedWordsAfter.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      highlightedText = highlightedText.replace(
        regex, 
        `<span style="color: ${highlightColor}">${word}</span>`
      );
    });
    
    return highlightedText;
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-xl sm:text-2xl md:text-3xl';
      case 'md': return 'text-2xl sm:text-3xl md:text-4xl';
      case 'lg': return 'text-2xl sm:text-3xl md:text-4xl';
      case 'xl': return 'text-3xl sm:text-4xl md:text-5xl';
      default: return 'text-2xl sm:text-3xl md:text-4xl';
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

  return (
    <div 
      className={cn(
        "w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mx-auto",
        isEditable && "border-2 border-dashed border-gray-300 hover:border-[#B89B7A] transition-colors p-2",
        className
      )}
      data-component="title-section"
    >
      {/* Título principal com fonte Playfair Display */}
      <h1
        className={cn(
          getFontSizeClass(),
          "font-bold leading-tight px-2",
          getTextAlignClass(),
          "playfair-display"
        )}
        style={{
          fontFamily: `"${fontFamily}", serif`,
          fontWeight: fontWeight,
          color: titleColor,
        }}
        dangerouslySetInnerHTML={{ 
          __html: renderHighlightedText(title) 
        }}
      />

      {/* Painel de edição (se editável) */}
      {isEditable && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
          <strong>Título:</strong> Editável via painel<br />
          <strong>Palavras destacadas:</strong> {[...highlightedWordsBefore, ...highlightedWordsAfter].join(', ')}
        </div>
      )}
    </div>
  );
};

export default TitleSectionComponent;