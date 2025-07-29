import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { useInlineBlock } from '../../../../hooks/useInlineBlock';
import { InlineBlockProps } from '../../../../types/inlineBlocks';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Trophy, Star, TrendingUp, Award, Target, CheckCircle } from 'lucide-react';

interface QuizResultInlineBlockProps extends InlineBlockProps {
  // Propriedades específicas do componente de resultado
}

/**
 * Componente inline para resultados do quiz (Etapa 6)
 * Exibição de resultados preliminares com pontuação e categorização
 */
export const QuizResultInlineBlock: React.FC<QuizResultInlineBlockProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange,
  className
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  
  const {
    properties,
    handlePropertyChange,
    commonProps
  } = useInlineBlock({
    block,
    isSelected,
    onClick,
    onPropertyChange,
    className
  });

  const title = properties.title || 'Seus Resultados';
  const subtitle = properties.subtitle || 'Baseado nas suas respostas';
  const score = properties.score || 85;
  const maxScore = properties.maxScore || 100;
  const category = properties.category || 'Especialista';
  const categoryDescription = properties.categoryDescription || 'Você demonstra um conhecimento avançado na área!';
  const highlights = properties.highlights || [
    'Excelente compreensão dos conceitos',
    'Tomada de decisão estratégica',
    'Pensamento analítico desenvolvido'
  ];
  const showPercentage = properties.showPercentage || true;
  const showCategory = properties.showCategory || true;
  const showHighlights = properties.showHighlights || true;
  const resultType = properties.resultType || 'success'; // success, good, average, needs-improvement
  const iconType = properties.iconType || 'trophy'; // trophy, star, award, target
  const theme = properties.theme || 'blue';

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const getResultIcon = () => {
    const icons = {
      trophy: Trophy,
      star: Star,
      award: Award,
      target: Target
    };
    const IconComponent = icons[iconType as keyof typeof icons] || Trophy;
    return <IconComponent className="w-12 h-12" />;
  };

  const getResultTypeClasses = () => {
    const types = {
      success: {
        bg: 'from-green-50 to-emerald-50',
        border: 'border-green-200',
        accent: 'text-green-600',
        icon: 'text-green-500',
        badge: 'bg-green-100 text-green-800',
        progress: 'bg-green-500'
      },
      good: {
        bg: 'from-blue-50 to-indigo-50',
        border: 'border-blue-200',
        accent: 'text-blue-600',
        icon: 'text-blue-500',
        badge: 'bg-blue-100 text-blue-800',
        progress: 'bg-blue-500'
      },
      average: {
        bg: 'from-yellow-50 to-orange-50',
        border: 'border-yellow-200',
        accent: 'text-yellow-600',
        icon: 'text-yellow-500',
        badge: 'bg-yellow-100 text-yellow-800',
        progress: 'bg-yellow-500'
      },
      'needs-improvement': {
        bg: 'from-red-50 to-pink-50',
        border: 'border-red-200',
        accent: 'text-red-600',
        icon: 'text-red-500',
        badge: 'bg-red-100 text-red-800',
        progress: 'bg-red-500'
      }
    };
    return types[resultType as keyof typeof types] || types.good;
  };

  const resultClasses = getResultTypeClasses();
  const scorePercentage = (score / maxScore) * 100;

  return (
    <div
      {...commonProps}
      onClick={onClick}
      className={cn(
        'min-h-[500px] p-8',
        `bg-gradient-to-br ${resultClasses.bg}`,
        `border ${resultClasses.border} rounded-lg`,
        'transition-all duration-300',
        isSelected && `ring-2 ring-${theme}-500`,
        className
      )}
    >
      {/* Botão de Edição */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <Button
            size="sm"
            variant={isEditMode ? "default" : "outline"}
            onClick={(e) => {
              e.stopPropagation();
              toggleEditMode();
            }}
          >
            {isEditMode ? 'Salvar' : 'Editar'}
          </Button>
        </div>
      )}

      {/* Cabeçalho com Ícone */}
      <div className="text-center mb-8">
        {/* Ícone Principal */}
        <div className={cn(
          'mb-6 p-6 rounded-full bg-white/80 shadow-lg mx-auto w-fit',
          'animate-pulse',
          resultClasses.icon
        )}>
          {getResultIcon()}
        </div>

        {/* Título e Subtítulo */}
        {isEditMode ? (
          <div className="space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => handlePropertyChange('title', e.target.value)}
              placeholder="Título dos resultados"
              className="w-full text-2xl font-bold text-center p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={subtitle}
              onChange={(e) => handlePropertyChange('subtitle', e.target.value)}
              placeholder="Subtítulo"
              className="w-full text-center p-2 border border-gray-300 rounded"
            />
          </div>
        ) : (
          <div>
            <h1 className={cn('text-3xl font-bold mb-2', resultClasses.accent)}>
              {title}
            </h1>
            <p className="text-gray-600 text-lg">
              {subtitle}
            </p>
          </div>
        )}
      </div>

      {/* Pontuação Principal */}
      <div className="text-center mb-8">
        <div className={cn('text-6xl font-bold mb-2', resultClasses.accent)}>
          {score}
          {showPercentage && (
            <span className="text-2xl text-gray-500">/{maxScore}</span>
          )}
        </div>
        
        {showPercentage && (
          <div className="text-xl text-gray-600 mb-4">
            {scorePercentage.toFixed(0)}% de acerto
          </div>
        )}

        {/* Barra de Progresso da Pontuação */}
        <div className="max-w-xs mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={cn(
                'h-4 rounded-full transition-all duration-1000 ease-out',
                resultClasses.progress
              )}
              style={{ width: `${scorePercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Categoria do Resultado */}
      {showCategory && (
        <div className="text-center mb-8">
          {isEditMode ? (
            <div className="space-y-2">
              <input
                type="text"
                value={category}
                onChange={(e) => handlePropertyChange('category', e.target.value)}
                placeholder="Categoria do resultado"
                className="w-full text-xl font-semibold text-center p-2 border border-gray-300 rounded"
              />
              <textarea
                value={categoryDescription}
                onChange={(e) => handlePropertyChange('categoryDescription', e.target.value)}
                placeholder="Descrição da categoria"
                rows={2}
                className="w-full text-center p-2 border border-gray-300 rounded resize-none"
              />
            </div>
          ) : (
            <div>
              <Badge className={cn('text-lg px-4 py-2 mb-3', resultClasses.badge)}>
                {category}
              </Badge>
              <p className="text-gray-700 max-w-md mx-auto">
                {categoryDescription}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Destaques/Pontos Fortes */}
      {showHighlights && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Seus Pontos Fortes
          </h3>
          
          {isEditMode ? (
            <div className="space-y-2">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => {
                      const newHighlights = [...highlights];
                      newHighlights[index] = e.target.value;
                      handlePropertyChange('highlights', newHighlights);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder={`Destaque ${index + 1}`}
                  />
                  {highlights.length > 1 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newHighlights = highlights.filter((_, i) => i !== index);
                        handlePropertyChange('highlights', newHighlights);
                      }}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const newHighlights = [...highlights, 'Novo destaque...'];
                  handlePropertyChange('highlights', newHighlights);
                }}
                className="w-full border-dashed"
              >
                + Adicionar Destaque
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white/60 rounded-lg"
                >
                  <CheckCircle className={cn('w-5 h-5 flex-shrink-0', resultClasses.icon)} />
                  <span className="text-gray-700 text-sm font-medium">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Botão de Ação */}
      {!isEditMode && (
        <div className="text-center">
          <Button
            className={cn(
              'px-8 py-3 text-lg font-medium text-white rounded-lg',
              'transition-all duration-200 transform hover:scale-105',
              'shadow-lg hover:shadow-xl',
              resultClasses.progress
            )}
          >
            Ver Análise Detalhada
            <TrendingUp className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}

      {/* Controles de Edição */}
      {isEditMode && (
        <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
          {/* Pontuação */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pontuação
              </label>
              <input
                type="number"
                min="0"
                max={maxScore}
                value={score}
                onChange={(e) => handlePropertyChange('score', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pontuação Máxima
              </label>
              <input
                type="number"
                min="1"
                value={maxScore}
                onChange={(e) => handlePropertyChange('maxScore', parseInt(e.target.value) || 100)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Opções de Exibição */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={showPercentage ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showPercentage', !showPercentage)}
            >
              Mostrar %
            </Badge>
            
            <Badge
              variant={showCategory ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showCategory', !showCategory)}
            >
              Mostrar Categoria
            </Badge>

            <Badge
              variant={showHighlights ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showHighlights', !showHighlights)}
            >
              Mostrar Destaques
            </Badge>
          </div>

          {/* Tipo de Resultado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Resultado
            </label>
            <div className="flex gap-2">
              {['success', 'good', 'average', 'needs-improvement'].map((type) => (
                <Badge
                  key={type}
                  variant={resultType === type ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => handlePropertyChange('resultType', type)}
                >
                  {type.replace('-', ' ')}
                </Badge>
              ))}
            </div>
          </div>

          {/* Seletor de Ícone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ícone Principal
            </label>
            <div className="flex gap-2">
              {['trophy', 'star', 'award', 'target'].map((icon) => (
                <Badge
                  key={icon}
                  variant={iconType === icon ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => handlePropertyChange('iconType', icon)}
                >
                  {icon}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizResultInlineBlock;
