import React from 'react';
import { useEditorQuizContext } from '../../../contexts/EditorQuizContext';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Crown, TrendingUp, User } from 'lucide-react';

interface QuizResultCalculatedBlockProps {
  blockId: string;
  showUserName?: boolean;
  showPercentages?: boolean;
  showSecondaryStyles?: boolean;
  maxSecondaryStyles?: number;
  className?: string;
  block?: any;
  isSelected?: boolean;
  onPropertyChange?: (key: string, value: any) => void;
}

/**
 * Componente de resultado que usa a LÓGICA REAL de cálculo
 * Conectado com useQuizLogic através do EditorQuizContext
 */
export const QuizResultCalculatedBlock: React.FC<QuizResultCalculatedBlockProps> = ({
  blockId,
  showUserName = true,
  showPercentages = true,
  showSecondaryStyles = true,
  maxSecondaryStyles = 3,
  className,
  block,
  isSelected = false,
  onPropertyChange
}) => {
  // Tentar usar context do editor
  const editorQuizContext = (() => {
    try {
      return useEditorQuizContext();
    } catch {
      return null; // Editor em modo preview
    }
  })();

  // Se não há context, mostrar preview
  if (!editorQuizContext || !editorQuizContext.currentResults) {
    return (
      <div
        className={`
          w-full py-8 px-4 bg-gradient-to-br from-[#FAF9F7] to-[#F5F4F2] 
          border-2 border-dashed border-gray-300 rounded-lg text-center
          ${isSelected ? 'ring-2 ring-blue-500' : ''}
          ${className}
        `}
      >
        <div className="flex flex-col items-center gap-4">
          <TrendingUp className="w-12 h-12 text-gray-400" />
          <div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Resultado do Quiz
            </h3>
            <p className="text-sm text-gray-500">
              Complete as questões para ver o resultado calculado em tempo real
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { currentResults, isCalculating } = editorQuizContext;
  
  // Usar dados de compatibilidade do QuizResult
  const primaryStyle = currentResults.styleScores?.[0];
  const secondaryStyles = currentResults.styleScores?.slice(1) || [];
  const totalSelections = currentResults.styleScores?.reduce((total, style) => total + style.points, 0) || 0;
  const userName = currentResults.participantName || 'Usuário';

  if (isCalculating) {
    return (
      <div className={`w-full py-8 px-4 text-center ${className}`}>
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        w-full py-8 px-4 transition-all duration-200
        ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
        ${className}
      `}
    >
      <Card className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-white to-[#FAF9F7]">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-[#B89B7A] mr-2" />
            <h2 className="text-2xl font-bold text-[#432818]">
              Seu Estilo Predominante
            </h2>
          </div>
          
          {showUserName && userName && (
            <div className="flex items-center justify-center mb-2">
              <User className="w-4 h-4 text-gray-500 mr-1" />
              <span className="text-gray-600">{userName}</span>
            </div>
          )}
        </div>

        {/* Estilo Primário */}
        {primaryStyle && (
          <div className="text-center mb-6">
            <div className="mb-4">
              <h3 className="text-3xl font-bold text-[#B89B7A] mb-2">
                {primaryStyle.style}
              </h3>
              {showPercentages && (
                <Badge variant="secondary" className="bg-[#B89B7A] text-white text-lg px-4 py-1">
                  {primaryStyle.percentage}%
                </Badge>
              )}
            </div>
            
            <p className="text-gray-600 mb-2">
              {primaryStyle.points} de {totalSelections} seleções
            </p>
          </div>
        )}

        {/* Estilos Secundários */}
        {showSecondaryStyles && secondaryStyles && secondaryStyles.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-lg font-semibold text-[#432818] mb-3 text-center">
              Estilos Complementares
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {secondaryStyles.slice(0, maxSecondaryStyles).map((style, index) => (
                <div 
                  key={style.style} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-[#432818]">
                    {style.style}
                  </span>
                  <div className="flex items-center gap-2">
                    {showPercentages && (
                      <Badge variant="outline" className="text-xs">
                        {style.percentage}%
                      </Badge>
                    )}
                    <span className="text-sm text-gray-500">
                      {style.points} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer com informações técnicas */}
        <div className="mt-6 pt-4 border-t text-center">
          <p className="text-xs text-gray-400">
            ✅ Resultado calculado em tempo real • {totalSelections} seleções processadas
          </p>
        </div>
      </Card>
    </div>
  );
};

export default QuizResultCalculatedBlock;
