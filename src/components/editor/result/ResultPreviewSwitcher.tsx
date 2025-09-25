/**
 * 🎯 RESULT PREVIEW SWITCHER
 * 
 * Componente para alternar entre diferentes modos de preview
 * do Step 20 (resultado único, múltiplos, comparação)
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { useQuizResultEditor } from '@/hooks/useQuizResultEditor';
import { EditableStep20Result } from './EditableStep20Result';

interface ResultPreviewSwitcherProps {
  className?: string;
  isPreview?: boolean;
  enableEditing?: boolean;
}

export const ResultPreviewSwitcher: React.FC<ResultPreviewSwitcherProps> = ({
  className = '',
  isPreview = false,
  enableEditing = true
}) => {
  const {
    previewMode,
    currentResult,
    availableStyles,
    switchPrimaryStyle
  } = useQuizResultEditor();

  // Modo único (padrão)
  if (previewMode === 'single') {
    return (
      <EditableStep20Result
        className={className}
        isPreview={isPreview}
        enableEditing={enableEditing}
      />
    );
  }

  // Modo múltiplos (mostra vários estilos lado a lado)
  if (previewMode === 'multiple') {
    return (
      <div className={cn('min-h-screen bg-stone-50 p-6', className)}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Preview de Múltiplos Resultados
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {availableStyles.slice(0, 6).map((style) => (
              <Card key={style.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div 
                    className="h-96 overflow-y-auto cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => switchPrimaryStyle(style.id)}
                  >
                    <div className="scale-50 origin-top-left w-[200%] h-[200%]">
                      <EditableStep20Result
                        isPreview={true}
                        enableEditing={false}
                      />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: style.color }}
                      />
                      <span className="font-semibold">{style.style}</span>
                    </div>
                    <p className="text-sm text-stone-600 mb-2">
                      {style.percentage}% compatibilidade
                    </p>
                    <p className="text-xs text-stone-500 line-clamp-2">
                      {style.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Modo comparação (lado a lado)
  if (previewMode === 'comparison') {
    return (
      <div className={cn('min-h-screen bg-stone-50 p-6', className)}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Comparação de Resultados
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Resultado atual */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">
                Resultado Atual: {currentResult.primaryStyle.style}
              </h3>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="h-96 overflow-y-auto">
                  <div className="scale-75 origin-top-left w-[133%] h-[133%]">
                    <EditableStep20Result
                      isPreview={true}
                      enableEditing={false}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: currentResult.primaryStyle.color }}
                  />
                  <span className="font-semibold">{currentResult.primaryStyle.style}</span>
                  <span className="text-sm text-stone-600">
                    ({currentResult.primaryStyle.percentage}%)
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Características:</strong>
                    <ul className="ml-4 text-stone-600">
                      {currentResult.primaryStyle.characteristics.slice(0, 3).map((char, index) => (
                        <li key={index}>• {char}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <strong>Recomendações:</strong>
                    <ul className="ml-4 text-stone-600">
                      {currentResult.primaryStyle.recommendations.slice(0, 2).map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Segundo estilo para comparação */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">
                Para Comparação: {availableStyles[1].style}
              </h3>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="h-96 overflow-y-auto">
                  <div className="scale-75 origin-top-left w-[133%] h-[133%]">
                    <EditableStep20Result
                      isPreview={true}
                      enableEditing={false}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: availableStyles[1].color }}
                  />
                  <span className="font-semibold">{availableStyles[1].style}</span>
                  <span className="text-sm text-stone-600">
                    ({availableStyles[1].percentage}%)
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Características:</strong>
                    <ul className="ml-4 text-stone-600">
                      {availableStyles[1].characteristics.slice(0, 3).map((char, index) => (
                        <li key={index}>• {char}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <strong>Recomendações:</strong>
                    <ul className="ml-4 text-stone-600">
                      {availableStyles[1].recommendations.slice(0, 2).map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ResultPreviewSwitcher;