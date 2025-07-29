import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { useInlineBlock } from '../../../../hooks/useInlineBlock';
import { InlineBlockProps } from '../../../../types/inlineBlocks';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { ChevronRight, Sparkles, Zap, Heart, Star } from 'lucide-react';

interface QuizTransitionInlineBlockProps extends InlineBlockProps {
  // Propriedades específicas do componente de transição
}

/**
 * Componente inline para transições do quiz (Etapa 4)
 * Telas de transição entre seções com animações e motivação
 */
export const QuizTransitionInlineBlock: React.FC<QuizTransitionInlineBlockProps> = ({
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

  const title = properties.title || 'Muito bem!';
  const subtitle = properties.subtitle || 'Vamos para a próxima seção';
  const description = properties.description || 'Suas respostas estão nos ajudando a criar uma experiência personalizada para você.';
  const buttonText = properties.buttonText || 'Continuar';
  const showProgress = properties.showProgress || true;
  const progress = properties.progress || 45;
  const animationType = properties.animationType || 'sparkles'; // sparkles, zap, heart, star
  const theme = properties.theme || 'success'; // success, info, warning, purple
  const autoAdvance = properties.autoAdvance || false;
  const autoAdvanceDelay = properties.autoAdvanceDelay || 3;

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const getAnimationIcon = () => {
    const icons = {
      sparkles: Sparkles,
      zap: Zap,
      heart: Heart,
      star: Star
    };
    const IconComponent = icons[animationType as keyof typeof icons] || Sparkles;
    return <IconComponent className="w-8 h-8" />;
  };

  const getThemeClasses = () => {
    const themes = {
      success: {
        bg: 'from-green-50 to-emerald-50',
        border: 'border-green-200',
        accent: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700',
        icon: 'text-green-500'
      },
      info: {
        bg: 'from-blue-50 to-indigo-50',
        border: 'border-blue-200',
        accent: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700',
        icon: 'text-blue-500'
      },
      warning: {
        bg: 'from-orange-50 to-amber-50',
        border: 'border-orange-200',
        accent: 'text-orange-600',
        button: 'bg-orange-600 hover:bg-orange-700',
        icon: 'text-orange-500'
      },
      purple: {
        bg: 'from-purple-50 to-violet-50',
        border: 'border-purple-200',
        accent: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700',
        icon: 'text-purple-500'
      }
    };
    return themes[theme as keyof typeof themes] || themes.success;
  };

  const themeClasses = getThemeClasses();

  return (
    <div
      {...commonProps}
      onClick={onClick}
      className={cn(
        'min-h-[400px] p-8',
        `bg-gradient-to-br ${themeClasses.bg}`,
        `border ${themeClasses.border} rounded-lg`,
        'transition-all duration-300',
        'flex flex-col items-center justify-center text-center',
        isSelected && `ring-2 ring-${theme === 'success' ? 'green' : theme === 'info' ? 'blue' : theme === 'warning' ? 'orange' : 'purple'}-500`,
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

      {/* Ícone Animado */}
      <div className={cn(
        'mb-6 p-4 rounded-full bg-white/80 shadow-lg',
        'animate-bounce',
        themeClasses.icon
      )}>
        {getAnimationIcon()}
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-md mx-auto mb-8">
        {isEditMode ? (
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => handlePropertyChange('title', e.target.value)}
              placeholder="Título da transição"
              className="w-full text-2xl font-bold text-center p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={subtitle}
              onChange={(e) => handlePropertyChange('subtitle', e.target.value)}
              placeholder="Subtítulo"
              className="w-full text-lg text-center p-2 border border-gray-300 rounded"
            />
            <textarea
              value={description}
              onChange={(e) => handlePropertyChange('description', e.target.value)}
              placeholder="Descrição motivacional"
              rows={3}
              className="w-full text-center p-2 border border-gray-300 rounded resize-none"
            />
          </div>
        ) : (
          <div>
            <h1 className={cn('text-3xl font-bold mb-3', themeClasses.accent)}>
              {title}
            </h1>
            <h2 className="text-xl text-gray-700 mb-4 font-medium">
              {subtitle}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>
        )}
      </div>

      {/* Barra de Progresso */}
      {showProgress && (
        <div className="w-full max-w-xs mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progresso</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={cn(
                'h-2 rounded-full transition-all duration-1000 ease-out',
                themeClasses.button
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Botão de Ação */}
      {!isEditMode && (
        <Button
          className={cn(
            'px-8 py-3 text-lg font-medium text-white rounded-lg',
            'transition-all duration-200 transform hover:scale-105',
            'shadow-lg hover:shadow-xl',
            themeClasses.button
          )}
        >
          {buttonText}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      )}

      {/* Auto-advance indicator */}
      {autoAdvance && !isEditMode && (
        <div className="mt-6 text-sm text-gray-500">
          Avançando automaticamente em {autoAdvanceDelay}s...
        </div>
      )}

      {/* Controles de Edição */}
      {isEditMode && (
        <div className="mt-8 pt-6 border-t border-gray-200 w-full max-w-lg space-y-4">
          {/* Texto do Botão */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Texto do Botão
            </label>
            <input
              type="text"
              value={buttonText}
              onChange={(e) => handlePropertyChange('buttonText', e.target.value)}
              placeholder="Continuar"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          {/* Configurações de Progresso */}
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
                Auto-avanço (s)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={autoAdvanceDelay}
                onChange={(e) => handlePropertyChange('autoAdvanceDelay', parseInt(e.target.value) || 3)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                disabled={!autoAdvance}
              />
            </div>
          </div>

          {/* Opções de Exibição */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={showProgress ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showProgress', !showProgress)}
            >
              Mostrar Progresso
            </Badge>
            
            <Badge
              variant={autoAdvance ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('autoAdvance', !autoAdvance)}
            >
              Auto-avanço
            </Badge>
          </div>

          {/* Seletor de Animação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Animação
            </label>
            <div className="flex gap-2">
              {['sparkles', 'zap', 'heart', 'star'].map((animation) => (
                <Badge
                  key={animation}
                  variant={animationType === animation ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => handlePropertyChange('animationType', animation)}
                >
                  {animation}
                </Badge>
              ))}
            </div>
          </div>

          {/* Seletor de Tema */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema de Cores
            </label>
            <div className="flex gap-2">
              {['success', 'info', 'warning', 'purple'].map((colorTheme) => (
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

export default QuizTransitionInlineBlock;
