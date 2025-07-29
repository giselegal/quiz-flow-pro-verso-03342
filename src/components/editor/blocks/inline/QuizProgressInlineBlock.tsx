import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { useInlineBlock } from '../../../../hooks/useInlineBlock';
import { InlineBlockProps } from '../../../../types/inlineBlocks';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { BarChart3, TrendingUp, Clock } from 'lucide-react';

interface QuizProgressInlineBlockProps extends InlineBlockProps {
  // Propriedades específicas do componente de progresso
}

/**
 * Componente inline para progresso do quiz (Etapa 3)
 * Visualização de progresso com animações e estatísticas
 */
export const QuizProgressInlineBlock: React.FC<QuizProgressInlineBlockProps> = ({
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

  const progress = properties.progress || 50;
  const currentStep = properties.currentStep || 1;
  const totalSteps = properties.totalSteps || 10;
  const showPercentage = properties.showPercentage || true;
  const showSteps = properties.showSteps || true;
  const showTimeEstimate = properties.showTimeEstimate || false;
  const timeEstimate = properties.timeEstimate || '2 min';
  const title = properties.title || 'Progresso do Quiz';
  const subtitle = properties.subtitle || 'Continue respondendo para ver seus resultados';
  const animated = properties.animated || true;
  const theme = properties.theme || 'blue'; // blue, green, purple, orange

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const getThemeClasses = () => {
    const themes = {
      blue: {
        bg: 'from-blue-50 to-indigo-50',
        border: 'border-blue-200',
        progress: 'bg-blue-500',
        text: 'text-blue-700',
        badge: 'bg-blue-100 text-blue-800'
      },
      green: {
        bg: 'from-green-50 to-emerald-50',
        border: 'border-green-200',
        progress: 'bg-green-500',
        text: 'text-green-700',
        badge: 'bg-green-100 text-green-800'
      },
      purple: {
        bg: 'from-purple-50 to-violet-50',
        border: 'border-purple-200',
        progress: 'bg-purple-500',
        text: 'text-purple-700',
        badge: 'bg-purple-100 text-purple-800'
      },
      orange: {
        bg: 'from-orange-50 to-red-50',
        border: 'border-orange-200',
        progress: 'bg-orange-500',
        text: 'text-orange-700',
        badge: 'bg-orange-100 text-orange-800'
      }
    };
    return themes[theme as keyof typeof themes] || themes.blue;
  };

  const themeClasses = getThemeClasses();

  return (
    <div
      {...commonProps}
      onClick={onClick}
      className={cn(
        'min-h-[200px] p-6',
        `bg-gradient-to-br ${themeClasses.bg}`,
        `border ${themeClasses.border} rounded-lg`,
        'transition-all duration-200',
        isSelected && `ring-2 ring-${theme}-500 border-${theme}-400`,
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

      {/* Cabeçalho */}
      <div className="mb-6">
        {isEditMode ? (
          <div className="space-y-2">
            <input
              type="text"
              value={title}
              onChange={(e) => handlePropertyChange('title', e.target.value)}
              placeholder="Título do progresso"
              className="w-full text-xl font-bold p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={subtitle}
              onChange={(e) => handlePropertyChange('subtitle', e.target.value)}
              placeholder="Subtítulo"
              className="w-full text-gray-600 p-2 border border-gray-300 rounded"
            />
          </div>
        ) : (
          <div>
            <h2 className={cn('text-xl font-bold mb-2', themeClasses.text)}>
              {title}
            </h2>
            <p className="text-gray-600 text-sm">
              {subtitle}
            </p>
          </div>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {showSteps && (
          <div className={cn('text-center p-3 rounded-lg', themeClasses.badge)}>
            <BarChart3 className={cn('w-5 h-5 mx-auto mb-1', themeClasses.text)} />
            <div className="text-sm font-medium">Etapa</div>
            <div className="text-lg font-bold">
              {currentStep}/{totalSteps}
            </div>
          </div>
        )}

        {showPercentage && (
          <div className={cn('text-center p-3 rounded-lg', themeClasses.badge)}>
            <TrendingUp className={cn('w-5 h-5 mx-auto mb-1', themeClasses.text)} />
            <div className="text-sm font-medium">Progresso</div>
            <div className="text-lg font-bold">{progress}%</div>
          </div>
        )}

        {showTimeEstimate && (
          <div className={cn('text-center p-3 rounded-lg', themeClasses.badge)}>
            <Clock className={cn('w-5 h-5 mx-auto mb-1', themeClasses.text)} />
            <div className="text-sm font-medium">Restante</div>
            <div className="text-lg font-bold">{timeEstimate}</div>
          </div>
        )}
      </div>

      {/* Barra de Progresso Principal */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span>Seu progresso</span>
          {showPercentage && <span>{progress}%</span>}
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={cn(
              'h-4 rounded-full transition-all duration-1000 ease-out',
              themeClasses.progress,
              animated && 'animate-pulse'
            )}
            style={{ 
              width: `${progress}%`,
              transition: animated ? 'width 1s ease-out' : 'none'
            }}
          />
        </div>

        {/* Indicadores de Etapas */}
        {showSteps && (
          <div className="flex justify-between mt-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={cn(
                  'w-2 h-2 rounded-full',
                  i < currentStep ? themeClasses.progress : 'bg-gray-300'
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Motivacional */}
      {!isEditMode && (
        <div className={cn('text-center p-4 rounded-lg bg-white/50')}>
          <p className="text-sm text-gray-700 font-medium">
            {progress < 25 && "Você está só começando! Continue assim! 🚀"}
            {progress >= 25 && progress < 50 && "Muito bem! Você está no caminho certo! 💪"}
            {progress >= 50 && progress < 75 && "Excelente progresso! Quase lá! 🎯"}
            {progress >= 75 && progress < 100 && "Incrível! Você está quase terminando! ⭐"}
            {progress >= 100 && "Parabéns! Você completou tudo! 🎉"}
          </p>
        </div>
      )}

      {/* Controles de Edição */}
      {isEditMode && (
        <div className="mt-6 pt-4 border-t border-gray-200 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Progresso (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => handlePropertyChange('progress', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Etapa Atual
              </label>
              <input
                type="number"
                min="1"
                max={totalSteps}
                value={currentStep}
                onChange={(e) => handlePropertyChange('currentStep', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total de Etapas
              </label>
              <input
                type="number"
                min="1"
                value={totalSteps}
                onChange={(e) => handlePropertyChange('totalSteps', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tempo Estimado
              </label>
              <input
                type="text"
                value={timeEstimate}
                onChange={(e) => handlePropertyChange('timeEstimate', e.target.value)}
                placeholder="ex: 2 min"
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
              variant={showSteps ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showSteps', !showSteps)}
            >
              Mostrar Etapas
            </Badge>

            <Badge
              variant={showTimeEstimate ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showTimeEstimate', !showTimeEstimate)}
            >
              Tempo Estimado
            </Badge>

            <Badge
              variant={animated ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('animated', !animated)}
            >
              Animação
            </Badge>
          </div>

          {/* Seletor de Tema */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema de Cores
            </label>
            <div className="flex gap-2">
              {['blue', 'green', 'purple', 'orange'].map((colorTheme) => (
                <Badge
                  key={colorTheme}
                  variant={theme === colorTheme ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => handlePropertyChange('theme', colorTheme)}
                >
                  {colorTheme}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizProgressInlineBlock;
