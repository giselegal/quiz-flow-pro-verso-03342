/**
 * 🎯 STYLE SELECTOR COMPONENT
 * 
 * Seletor de estilos para preview de diferentes resultados
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { QuizStyleResult } from '@/hooks/useQuizResultEditor';

interface StyleSelectorProps {
  availableStyles: QuizStyleResult[];
  currentStyle: QuizStyleResult;
  onStyleChange: (styleId: string) => void;
  className?: string;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  availableStyles,
  currentStyle,
  onStyleChange,
  className = ''
}) => {
  return (
    <div className={cn('bg-white rounded-lg border border-stone-200 p-4', className)}>
      <div className="mb-3">
        <h3 className="font-semibold text-stone-800 mb-1">Preview de Estilos</h3>
        <p className="text-sm text-stone-600">Selecione um estilo para visualizar diferentes resultados</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {availableStyles.map((style) => {
          const isSelected = currentStyle.id === style.id;
          
          return (
            <button
              key={style.id}
              onClick={() => onStyleChange(style.id)}
              className={cn(
                'p-3 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md',
                isSelected 
                  ? 'border-primary bg-primary/10 ring-2 ring-primary/20' 
                  : 'border-stone-200 bg-white hover:border-stone-300'
              )}
            >
              {/* Cor do estilo */}
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-4 h-4 rounded-full border border-stone-300"
                  style={{ backgroundColor: style.color }}
                />
                <span className="font-medium text-sm text-stone-800">
                  {style.style}
                </span>
              </div>
              
              {/* Score */}
              <div className="text-xs text-stone-600">
                {style.percentage}% compatibilidade
              </div>
              
              {/* Características principais */}
              <div className="mt-2">
                {style.characteristics.slice(0, 2).map((char, index) => (
                  <div key={index} className="text-xs text-stone-500 truncate">
                    • {char}
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Informações do estilo selecionado */}
      <div className="mt-4 p-3 bg-stone-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: currentStyle.color }}
          />
          <span className="font-semibold text-stone-800">{currentStyle.style}</span>
          <span className="text-sm text-stone-600">
            ({currentStyle.percentage}% compatibilidade)
          </span>
        </div>
        
        <p className="text-sm text-stone-700 mb-3">
          {currentStyle.description}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="font-medium text-stone-800 mb-1">Características:</div>
            <ul className="text-stone-600 space-y-1">
              {currentStyle.characteristics.map((char, index) => (
                <li key={index}>• {char}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <div className="font-medium text-stone-800 mb-1">Recomendações:</div>
            <ul className="text-stone-600 space-y-1">
              {currentStyle.recommendations.slice(0, 3).map((rec, index) => (
                <li key={index}>• {rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleSelector;